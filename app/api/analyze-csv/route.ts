import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

interface AnalyzeRequest {
  company?: string;
  headers?: string[];
  sampleRows?: Record<string, string>[];
}

const ALLOWED_TARGETS = [
  "material_number",
  "description",
  "specifications",
  "category",
  "unmapped",
] as const;

type TargetField = (typeof ALLOWED_TARGETS)[number];

interface Mapping {
  sourceColumn: string;
  targetColumn: TargetField;
  confidence: number;
  reason: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AnalyzeRequest;

    console.log("=== AI SCHEMA REQUEST ===");
    console.log("Company:", body.company);
    console.log("Headers:", body.headers);
    console.log(
      "Sample rows:",
      Array.isArray(body.sampleRows)
        ? body.sampleRows.length
        : 0
    );

    const company =
      typeof body.company === "string" &&
      body.company.trim()
        ? body.company.trim()
        : "Unknown Company";

    const headers = Array.isArray(body.headers)
      ? body.headers
          .map((header) => String(header).trim())
          .filter(Boolean)
      : [];

    const sampleRows = Array.isArray(body.sampleRows)
      ? body.sampleRows
      : [];

    /*
     * IMPORTANT:
     * These are the only inputs that should cause
     * a 400 error.
     */
    if (headers.length === 0) {
      console.error(
        "AI schema request rejected: headers are empty."
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "No source columns were received. Please upload the Excel/CSV file again.",
        },
        { status: 400 }
      );
    }

    if (sampleRows.length === 0) {
      console.error(
        "AI schema request rejected: sample rows are empty."
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "No sample data rows were received. Please upload a file containing material records.",
        },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error(
        "GEMINI_API_KEY is missing."
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "GEMINI_API_KEY is missing from .env.local.",
        },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({
      apiKey,
    });

    const prompt = `
You are the schema-mapping engine for Bharat Material Grid.

A company has uploaded a messy material spreadsheet.

COMPANY:
${company}

SOURCE COLUMNS:
${JSON.stringify(headers, null, 2)}

SAMPLE ROWS:
${JSON.stringify(sampleRows, null, 2)}

Map every source column to exactly ONE of these standard fields:

1. material_number
2. description
3. specifications
4. category
5. unmapped

RULES:

- Material number, material code, SAP code, item code,
  part number, stock number -> material_number

- Material description, item description, material description,
  short text, item name -> description

- Technical specifications, dimensions, pressure, temperature,
  ratings, material grade, standards, long text,
  detailed engineering information -> specifications

- Material category, material group, classification,
  item group -> category

- If the source column does not belong to any standard field,
  use unmapped.

IMPORTANT:

- Use BOTH the column name AND sample values.
- Do not rely only on the column name.
- Preserve the source column name EXACTLY.
- Do not invent information.
- Confidence must be an integer from 0 to 100.
- Every source column must appear exactly once.
- Return ONLY valid JSON.
- Do not return markdown.
- Do not return code fences.

RETURN:

{
  "mappings": [
    {
      "sourceColumn": "Original Column",
      "targetColumn": "material_number",
      "confidence": 95,
      "reason": "Why this column maps here"
    }
  ]
}
`;

    console.log(
      "Calling Gemini for schema analysis..."
    );

    const result =
      await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          temperature: 0.1,
          responseMimeType:
            "application/json",
        },
      });

    const text =
      result.text?.trim();

    console.log(
      "Gemini response received:",
      text
    );

    if (!text) {
      throw new Error(
        "Gemini returned an empty response."
      );
    }

    let parsed: any;

    try {
      parsed = JSON.parse(text);
    } catch {
      const cleaned = text
        .replace(
          /^```json\s*/i,
          ""
        )
        .replace(
          /^```\s*/i,
          ""
        )
        .replace(
          /\s*```$/i,
          ""
        )
        .trim();

      parsed = JSON.parse(cleaned);
    }

    if (
      !parsed ||
      !Array.isArray(
        parsed.mappings
      )
    ) {
      throw new Error(
        "Gemini returned an invalid mappings array."
      );
    }

    const mappings: Mapping[] =
      parsed.mappings
        .map((item: any) => {
          const sourceColumn =
            String(
              item?.sourceColumn ??
                ""
            ).trim();

          const requestedTarget =
            String(
              item?.targetColumn ??
                "unmapped"
            ).trim();

          const targetColumn: TargetField =
            ALLOWED_TARGETS.includes(
              requestedTarget as TargetField
            )
              ? (requestedTarget as TargetField)
              : "unmapped";

          let confidence = Number(
            item?.confidence
          );

          if (
            !Number.isFinite(
              confidence
            )
          ) {
            confidence = 0;
          }

          confidence = Math.max(
            0,
            Math.min(
              100,
              Math.round(
                confidence
              )
            )
          );

          const reason =
            String(
              item?.reason ??
                "AI-derived mapping."
            ).trim();

          return {
            sourceColumn,
            targetColumn,
            confidence,
            reason,
          };
        })
        .filter(
          (mapping: Mapping) =>
            mapping.sourceColumn
              .length > 0
        );

    /*
     * Make sure every original column
     * is represented.
     */
    const mappingMap =
      new Map<string, Mapping>();

    mappings.forEach(
      (mapping) => {
        mappingMap.set(
          mapping.sourceColumn,
          mapping
        );
      }
    );

    const completeMappings =
      headers.map(
        (header) => {
          const existing =
            mappingMap.get(
              header
            );

          if (existing) {
            return existing;
          }

          return {
            sourceColumn:
              header,
            targetColumn:
              "unmapped" as TargetField,
            confidence: 0,
            reason:
              "No mapping was returned by the AI.",
          };
        }
      );

    console.log(
      "Final mappings:",
      completeMappings
    );

    return NextResponse.json(
      {
        success: true,
        company,
        mappings:
          completeMappings,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "=== AI SCHEMA API ERROR ==="
    );

    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "AI schema analysis failed.",
      },
      { status: 500 }
    );
  }
}