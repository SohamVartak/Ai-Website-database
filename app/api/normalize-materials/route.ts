import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

/* =========================================================
   TYPES
========================================================= */

interface MaterialRow {
  sourceIndex: number;
  material_number: string | null;
  description: string | null;
  specifications: string | null;
  category: string | null;
}

interface NormalizeRequest {
  company?: string;
  rows?: MaterialRow[];
}

interface NormalizedRow {
  sourceIndex: number;
  material_number: string | null;
  description: string | null;
  specifications: string | null;
  category: string | null;
}

/* =========================================================
   CONFIG
========================================================= */

const MAX_ROWS_PER_REQUEST = 20;

const MODELS_TO_TRY = [
  "gemini-3.8-flash",
  "gemini-3.5-flash",
];

/*
 * Retry count per model.
 *
 * Example:
 * attempt 1 -> immediate
 * attempt 2 -> wait ~1.5 sec
 * attempt 3 -> wait ~3 sec
 * attempt 4 -> wait ~6 sec
 */
const MAX_RETRIES_PER_MODEL = 3;

/* =========================================================
   POST
========================================================= */

export async function POST(
  request: Request
) {
  try {
    const body =
      (await request.json()) as NormalizeRequest;

    const company =
      typeof body.company === "string" &&
      body.company.trim()
        ? body.company.trim()
        : "Unknown Company";

    const rows =
      Array.isArray(body.rows)
        ? body.rows
        : [];

    console.log(
      "================================================"
    );

    console.log(
      "NORMALIZE-MATERIALS REQUEST"
    );

    console.log(
      "Company:",
      company
    );

    console.log(
      "Rows received:",
      rows.length
    );

    console.log(
      "================================================"
    );

    /* =====================================================
       VALIDATE INPUT
    ===================================================== */

    if (rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error:
            "No material rows were provided.",
        },
        { status: 400 }
      );
    }

    if (
      rows.length >
      MAX_ROWS_PER_REQUEST
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            `Maximum ${MAX_ROWS_PER_REQUEST} rows are allowed per normalization request.`,
        },
        { status: 400 }
      );
    }

    /* =====================================================
       API KEY
    ===================================================== */

    const apiKey =
      process.env.GEMINI_API_KEY;

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

    const ai =
      new GoogleGenAI({
        apiKey,
      });

    /* =====================================================
       PROMPT
    ===================================================== */

    const prompt = `
You are the AI material-data normalization engine
for Bharat Material Grid.

COMPANY:
${company}

INPUT MATERIAL RECORDS:
${JSON.stringify(rows, null, 2)}

Your task is to clean and standardize every material record.

STANDARD OUTPUT FIELDS:

1. material_number
2. description
3. specifications
4. category

=========================================================
STRICT RULES
=========================================================

1. NEVER invent information.

2. NEVER invent a material number.

3. NEVER invent technical specifications.

4. NEVER invent dimensions, pressure, temperature,
   material grades, standards, manufacturers, model numbers,
   ratings or engineering values.

5. Only extract information that is actually present
   in the supplied input record.

6. If a field cannot be determined from the input,
   return null.

7. Preserve material numbers exactly.

8. Clean unnecessary whitespace.

9. Correct obvious text-formatting problems only when doing
   so does not change the engineering meaning.

10. Keep important engineering values exactly as supplied.

Examples of values that must be preserved:

15 NB
40 NB
500 VAC
1250 V
ASTM A105
ASTM A217 WC6
SS316
Class 800
62 barg
482 degC
HY-33.F

11. Information contained inside a description can be moved
    into specifications ONLY if it is explicitly present
    in the source text.

12. Category can be inferred only when the material type
    is reasonably obvious from the source.

Examples:

JOURNAL SHAFT -> Shaft
UPPER JOURNAL HOUSING -> Housing
FUSE BASE -> Fuse
DIODE GP -> Diode
STEAM TRAP -> Steam Trap
GASKET -> Gasket
SEAL -> Seal
BEARING -> Bearing
VALVE -> Valve

13. If the category is uncertain, return null.

14. Do not remove useful abbreviations.

15. Do not convert a part number into a description.

16. Do not merge separate input records.

17. Return EXACTLY one output record for every input record.

18. Preserve sourceIndex exactly.

19. Return ONLY valid JSON.

20. Do not return markdown.

21. Do not return code fences.

=========================================================
REQUIRED JSON FORMAT
=========================================================

{
  "rows": [
    {
      "sourceIndex": 0,
      "material_number": "ABC123",
      "description": "Clean material description",
      "specifications": "15 NB; ASTM A105; Class 800",
      "category": "Valve"
    }
  ]
}

Return one object for every input row.
`;

    /* =====================================================
       CALL GEMINI
    ===================================================== */

    const result =
      await generateWithRetry(
        ai,
        prompt
      );

    /* =====================================================
       READ RESPONSE
    ===================================================== */

    const text =
      result.text?.trim();

    if (!text) {
      throw new Error(
        "Gemini returned an empty response."
      );
    }

    console.log(
      "Gemini response received successfully."
    );

    /* =====================================================
       PARSE JSON
    ===================================================== */

    const parsed =
      parseJsonResponse(
        text
      );

    if (
      !parsed ||
      !Array.isArray(
        parsed.rows
      )
    ) {
      throw new Error(
        "Gemini returned an invalid rows array."
      );
    }

    /* =====================================================
       NORMALIZE AI OUTPUT
    ===================================================== */

    const normalizedRows: NormalizedRow[] =
      parsed.rows.map(
        (row: any) => ({
          sourceIndex:
            Number(
              row?.sourceIndex
            ),

          material_number:
            cleanNullable(
              row?.material_number
            ),

          description:
            cleanNullable(
              row?.description
            ),

          specifications:
            cleanNullable(
              row?.specifications
            ),

          category:
            cleanNullable(
              row?.category
            ),
        })
      );

    /* =====================================================
       CHECK ROW COUNT
    ===================================================== */

    if (
      normalizedRows.length !==
      rows.length
    ) {
      throw new Error(
        `Gemini returned ${normalizedRows.length} rows, but ${rows.length} rows were submitted.`
      );
    }

    /* =====================================================
       CHECK SOURCE INDEXES
    ===================================================== */

    const expectedIndexes =
      rows.map(
        (row) =>
          row.sourceIndex
      );

    const returnedIndexes =
      normalizedRows.map(
        (row) =>
          row.sourceIndex
      );

    const expectedSet =
      new Set(
        expectedIndexes
      );

    const returnedSet =
      new Set(
        returnedIndexes
      );

    if (
      expectedSet.size !==
      returnedSet.size
    ) {
      throw new Error(
        "Gemini returned duplicate source indexes."
      );
    }

    for (
      const index of expectedSet
    ) {
      if (
        !returnedSet.has(
          index
        )
      ) {
        throw new Error(
          `Gemini did not return sourceIndex ${index}.`
        );
      }
    }

    /* =====================================================
       RESTORE ORIGINAL ORDER
    ===================================================== */

    normalizedRows.sort(
      (
        a,
        b
      ) =>
        a.sourceIndex -
        b.sourceIndex
    );

    /* =====================================================
       FINAL SAFETY
    ===================================================== */

    const finalRows =
      normalizedRows.map(
        (row) => ({
          sourceIndex:
            row.sourceIndex,

          material_number:
            row.material_number,

          description:
            row.description,

          specifications:
            row.specifications,

          category:
            row.category,
        })
      );

    console.log(
      `Successfully normalized ${finalRows.length} rows.`
    );

    return NextResponse.json(
      {
        success: true,

        company,

        rows: finalRows,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "================================================"
    );

    console.error(
      "NORMALIZATION API ERROR"
    );

    console.error(error);

    console.error(
      "================================================"
    );

    return NextResponse.json(
      {
        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Material normalization failed.",
      },
      { status: 500 }
    );
  }
}

/* =========================================================
   GEMINI CALL WITH RETRIES + FALLBACK MODELS
========================================================= */

async function generateWithRetry(
  ai: GoogleGenAI,
  prompt: string
) {
  let lastError: unknown =
    null;

  for (
    const model of MODELS_TO_TRY
  ) {
    for (
      let attempt = 1;
      attempt <=
      MAX_RETRIES_PER_MODEL;
      attempt++
    ) {
      try {
        console.log(
          `Gemini model=${model}, attempt=${attempt}/${MAX_RETRIES_PER_MODEL}`
        );

        const result =
          await ai.models.generateContent(
            {
              model,

              contents:
                prompt,

              config: {
                temperature:
                  0.1,

                responseMimeType:
                  "application/json",
              },
            }
          );

        console.log(
          `Gemini succeeded using ${model}.`
        );

        return result;
      } catch (error: any) {
        lastError =
          error;

        const status =
          getErrorStatus(
            error
          );

        const message =
          getErrorMessage(
            error
          );

        console.error(
          `Gemini ${model} failed on attempt ${attempt}:`,
          status,
          message
        );

        /*
         * Non-transient errors should
         * not be retried.
         */
        if (
          !isRetryableError(
            error
          )
        ) {
          throw error;
        }

        /*
         * If another retry is available,
         * wait using exponential backoff.
         */
        if (
          attempt <
          MAX_RETRIES_PER_MODEL
        ) {
          const delay =
            calculateBackoff(
              attempt
            );

          console.log(
            `Waiting ${delay}ms before retry...`
          );

          await sleep(
            delay
          );
        }
      }
    }

    console.warn(
      `Model ${model} was unavailable after ${MAX_RETRIES_PER_MODEL} attempts. Trying next model...`
    );
  }

  throw (
    lastError ||
    new Error(
      "All Gemini models are currently unavailable."
    )
  );
}

/* =========================================================
   RETRYABLE ERROR CHECK
========================================================= */

function isRetryableError(
  error: any
): boolean {
  const status =
    getErrorStatus(
      error
    );

  const message =
    getErrorMessage(
      error
    ).toLowerCase();

  /*
   * Temporary server-side problems
   */
  if (
    status === 408 ||
    status === 429 ||
    status === 500 ||
    status === 502 ||
    status === 503 ||
    status === 504
  ) {
    return true;
  }

  /*
   * Some SDK errors expose the
   * useful information only in text.
   */
  if (
    message.includes(
      "temporarily unavailable"
    ) ||
    message.includes(
      "service unavailable"
    ) ||
    message.includes(
      "high demand"
    ) ||
    message.includes(
      "resource exhausted"
    ) ||
    message.includes(
      "too many requests"
    ) ||
    message.includes(
      "overloaded"
    )
  ) {
    return true;
  }

  return false;
}

/* =========================================================
   GET ERROR STATUS
========================================================= */

function getErrorStatus(
  error: any
): number | null {
  const candidates = [
    error?.status,
    error?.code,
    error?.error?.code,
    error?.response?.status,
  ];

  for (
    const candidate of candidates
  ) {
    const number =
      Number(
        candidate
      );

    if (
      Number.isFinite(
        number
      )
    ) {
      return number;
    }
  }

  return null;
}

/* =========================================================
   GET ERROR MESSAGE
========================================================= */

function getErrorMessage(
  error: any
): string {
  if (
    typeof error ===
    "string"
  ) {
    return error;
  }

  if (
    typeof error?.message ===
    "string"
  ) {
    return error.message;
  }

  try {
    return JSON.stringify(
      error
    );
  } catch {
    return String(
      error
    );
  }
}

/* =========================================================
   BACKOFF
========================================================= */

function calculateBackoff(
  attempt: number
): number {
  /*
   * 1.5 sec
   * 3 sec
   * 6 sec
   *
   * plus a little random jitter.
   */
  const base =
    1500 *
    Math.pow(
      2,
      attempt - 1
    );

  const jitter =
    Math.floor(
      Math.random() *
        750
    );

  return (
    base +
    jitter
  );
}

/* =========================================================
   SLEEP
========================================================= */

function sleep(
  milliseconds: number
): Promise<void> {
  return new Promise(
    (resolve) =>
      setTimeout(
        resolve,
        milliseconds
      )
  );
}

/* =========================================================
   JSON PARSER
========================================================= */

function parseJsonResponse(
  text: string
): any {
  try {
    return JSON.parse(
      text
    );
  } catch {
    /*
     * Remove accidental markdown
     * fences if the model added them.
     */
    const cleaned =
      text
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

    return JSON.parse(
      cleaned
    );
  }
}

/* =========================================================
   CLEAN NULLABLE VALUE
========================================================= */

function cleanNullable(
  value: unknown
): string | null {
  if (
    value === null ||
    value === undefined
  ) {
    return null;
  }

  const text =
    String(value)
      .replace(
        /\s+/g,
        " "
      )
      .trim();

  if (
    text === "" ||
    text.toLowerCase() ===
      "null" ||
    text.toLowerCase() ===
      "n/a" ||
    text.toLowerCase() ===
      "na" ||
    text.toLowerCase() ===
      "none" ||
    text.toLowerCase() ===
      "unknown"
  ) {
    return null;
  }

  return text;
}