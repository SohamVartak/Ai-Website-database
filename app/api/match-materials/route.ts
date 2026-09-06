import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

interface MaterialRecord {
  id: number;
  company?: string | null;
  material_number?: string | null;
  description?: string | null;
  specifications?: string | null;
  category?: string | null;
}

interface MatchRequest {
  query?: string;
  sourceCompany?: string | null;
  materials?: MaterialRecord[];
}

interface CandidateScore {
  material: MaterialRecord;
  score: number;
}

interface CompanyMatch {
  company: string;
  material: MaterialRecord | null;
  score: number;
  reason: string;
  matchedFields: string[];
  matchedSpecifications: string[];
}

/* =========================================================
   CONFIG
========================================================= */

const MAX_MATERIALS = 10000;
const MAX_QUERY_LENGTH = 1000;

/*
 * Only a few candidates from each company are sent
 * to Gemini.
 */
const CANDIDATES_PER_COMPANY = 5;

/*
 * Absolute maximum number of records sent to Gemini.
 */
const MAX_AI_CANDIDATES = 40;

/*
 * Gemini models to try.
 */
const MODELS_TO_TRY = [
  "gemini-3.8-flash",
  "gemini-3.5-flash",
];

const MAX_RETRIES_PER_MODEL = 3;

/* =========================================================
   POST
========================================================= */

export async function POST(request: Request) {
  try {
    const body =
      (await request.json()) as MatchRequest;

    const query =
      typeof body.query === "string"
        ? body.query.trim()
        : "";

    const sourceCompany =
      typeof body.sourceCompany === "string"
        ? body.sourceCompany.trim()
        : "";

    const materials =
      Array.isArray(body.materials)
        ? body.materials
        : [];

    /* =====================================================
       VALIDATION
    ===================================================== */

    if (!query) {
      return NextResponse.json(
        {
          success: false,
          error:
            "A material search query is required.",
        },
        { status: 400 }
      );
    }

    if (
      query.length >
      MAX_QUERY_LENGTH
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            `Search query cannot exceed ${MAX_QUERY_LENGTH} characters.`,
        },
        { status: 400 }
      );
    }

    if (materials.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error:
            "No material records were provided.",
        },
        { status: 400 }
      );
    }

    if (
      materials.length >
      MAX_MATERIALS
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            `Maximum ${MAX_MATERIALS} material records are allowed.`,
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
      return NextResponse.json(
        {
          success: false,
          error:
            "GEMINI_API_KEY is missing.",
        },
        { status: 500 }
      );
    }

    /* =====================================================
       SOURCE COMPANY EXCLUSION
    ===================================================== */

    const sourceCompanyNormalized =
      sourceCompany
        .trim()
        .toUpperCase();

    const candidateMaterials =
      materials.filter(
        (material) => {
          const company =
            getCompanyKey(
              material.company
            );

          if (
            sourceCompanyNormalized &&
            company ===
              sourceCompanyNormalized
          ) {
            return false;
          }

          return true;
        }
      );

    /* =====================================================
       NO CANDIDATES
    ===================================================== */

    if (
      candidateMaterials.length ===
      0
    ) {
      return NextResponse.json(
        {
          success: true,
          query,
          sourceCompany:
            sourceCompany || null,
          candidateCount: 0,
          matches: [],
          overallBest: null,
        },
        { status: 200 }
      );
    }

    /* =====================================================
       LOCAL CANDIDATE SEARCH

       IMPORTANT:
       Gemini never receives the full database.
    ===================================================== */

    const topCandidates =
      findTopCandidatesPerCompany(
        query,
        candidateMaterials
      );

    const aiCandidates =
      topCandidates.slice(
        0,
        MAX_AI_CANDIDATES
      );

    console.log(
      "================================================"
    );

    console.log(
      "MATERIAL MATCHING REQUEST"
    );

    console.log(
      "Query:",
      query
    );

    console.log(
      "Source company:",
      sourceCompany ||
        "None"
    );

    console.log(
      "Total database records:",
      materials.length
    );

    console.log(
      "Candidate records after source exclusion:",
      candidateMaterials.length
    );

    console.log(
      "Candidates sent to Gemini:",
      aiCandidates.length
    );

    console.log(
      "================================================"
    );

    if (
      aiCandidates.length ===
      0
    ) {
      return NextResponse.json(
        {
          success: true,
          query,
          sourceCompany:
            sourceCompany || null,
          candidateCount: 0,
          matches: [],
          overallBest: null,
        },
        { status: 200 }
      );
    }

    /* =====================================================
       GEMINI CLIENT
    ===================================================== */

    const ai =
      new GoogleGenAI({
        apiKey,
      });

    /* =====================================================
       COMPACT CANDIDATE DATA
    ===================================================== */

    const compactMaterials =
      aiCandidates.map(
        (item) => ({
          id:
            item.material.id,

          company:
            item.material.company ??
            null,

          material_number:
            item.material
              .material_number ??
            null,

          description:
            item.material
              .description ??
            null,

          specifications:
            item.material
              .specifications ??
            null,

          category:
            item.material.category ??
            null,
        })
      );

    /* =====================================================
       PROMPT
    ===================================================== */

    const prompt = `
You are the semantic material-matching engine
for Bharat Material Grid.

USER SEARCH:
${query}

SOURCE COMPANY:
${sourceCompany || "Not specified"}

CANDIDATE MATERIAL RECORDS:
${JSON.stringify(
  compactMaterials,
  null,
  2
)}

========================================================
OBJECTIVE
========================================================

Find the closest matching material for EACH COMPANY
represented in the candidate records.

Return AT MOST ONE result per company.

The records have already been filtered locally.
Carefully evaluate the remaining candidates.

========================================================
MATCHING PRIORITY
========================================================

Use this priority:

1. Material type / part type
2. Technical specifications
3. Ratings and engineering values
4. Description meaning
5. Category
6. Material number only when it is explicitly relevant

Technical specifications are extremely important.

Examples:

32 A
500 V
1250 V
15 NB
62 barg
482 degC
ASTM A105
ASTM A217 WC6
SS316
Class 800
PQ-72
20A/60mV

========================================================
STRICT RULES
========================================================

1. Return AT MOST ONE material per company.

2. NEVER compare a source company against itself.

3. Never invent information.

4. Never invent technical specifications.

5. Never invent a material number.

6. Never invent dimensions.

7. Never invent pressure ratings.

8. Never invent temperature ratings.

9. Never invent manufacturers.

10. Never invent standards.

11. Never invent model numbers.

12. Never invent engineering values.

13. Only use information explicitly present in:
    - the user's query
    - the supplied candidate records

14. The returned material object must be copied
    exactly from the supplied candidate record.

15. Exact technical matches should strongly increase
    the score.

16. Conflicting technical values should strongly
    decrease the score.

17. Missing technical information should reduce confidence.

18. Do not consider materials equivalent simply because
    their generic names are similar.

Example:

FUSE 32A 500V

must NOT receive a very high score against:

FUSE 2A 250V

19. Clearly equivalent abbreviations may be considered.

Examples:

VM = Voltmeter
AMP = Ammeter
MPCB = Motor Protection Circuit Breaker

20. Do not assume abbreviations that are uncertain.

21. Consider semantic meaning, not just exact wording.

22. Return a score from 0 to 100.

23. Scores below approximately 50 should normally be
    considered insufficient.

24. For an insufficient company result:

material = null
score = 0
reason = "No sufficiently close match"

25. matchedFields may contain ONLY:

"Material Number"
"Description"
"Specifications"
"Category"

26. matchedSpecifications must contain ONLY technical
    values explicitly present in BOTH:
    - the user's query
    - the selected material

27. Do not return multiple results from the same company.

28. Do not include explanations outside the JSON.

========================================================
REQUIRED JSON FORMAT
========================================================

{
  "matches": [
    {
      "company": "BHEL",
      "material": {
        "id": 123,
        "company": "BHEL",
        "material_number": "ABC123",
        "description": "FUSE HRC 32A 500V",
        "specifications": "HRC; 32A; 500V",
        "category": "Fuse"
      },
      "score": 92,
      "reason": "Strong material-type and technical similarity",
      "matchedFields": [
        "Description",
        "Specifications",
        "Category"
      ],
      "matchedSpecifications": [
        "32A",
        "500V"
      ]
    },
    {
      "company": "IOCL",
      "material": null,
      "score": 0,
      "reason": "No sufficiently close match",
      "matchedFields": [],
      "matchedSpecifications": []
    }
  ]
}

Return ONLY valid JSON.
`;

    /* =====================================================
       CALL GEMINI WITH RETRIES
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
        "Gemini returned an empty matching response."
      );
    }

    console.log(
      "Gemini matching response received successfully."
    );

    /* =====================================================
       PARSE JSON
    ===================================================== */

    const parsed =
      parseJsonResponse(text);

    if (
      !parsed ||
      !Array.isArray(
        parsed.matches
      )
    ) {
      throw new Error(
        "Gemini returned an invalid matches array."
      );
    }

    /* =====================================================
       NORMALIZE AI RESULTS
    ===================================================== */

    const normalizedMatches:
      CompanyMatch[] =
      parsed.matches.map(
        (match: any) => {
          const material =
            match?.material &&
            typeof match.material ===
              "object"
              ? match.material
              : null;

          const score =
            Number(
              match?.score
            );

          return {
            company:
              typeof match?.company ===
                "string"
                ? match.company.trim()
                : material?.company
                ? String(
                    material.company
                  ).trim()
                : "UNKNOWN",

            material:
              material
                ? {
                    id:
                      Number(
                        material.id
                      ),

                    company:
                      material.company ??
                      null,

                    material_number:
                      material.material_number ??
                      null,

                    description:
                      material.description ??
                      null,

                    specifications:
                      material.specifications ??
                      null,

                    category:
                      material.category ??
                      null,
                  }
                : null,

            score:
              Number.isFinite(score)
                ? Math.max(
                    0,
                    Math.min(
                      Math.round(
                        score
                      ),
                      100
                    )
                  )
                : 0,

            reason:
              typeof match?.reason ===
                "string"
                ? match.reason
                : material
                ? "Semantic match identified"
                : "No sufficiently close match",

            matchedFields:
              Array.isArray(
                match?.matchedFields
              )
                ? match.matchedFields.filter(
                    (field: unknown) =>
                      typeof field ===
                      "string"
                  )
                : [],

            matchedSpecifications:
              Array.isArray(
                match?.matchedSpecifications
              )
                ? match.matchedSpecifications.filter(
                    (value: unknown) =>
                      typeof value ===
                      "string"
                  )
                : [],
          };
        }
      );

    /* =====================================================
       SAFETY CHECK
    ===================================================== */

    const safeMatches =
      normalizedMatches.filter(
        (match) => {
          if (
            !sourceCompany
          ) {
            return true;
          }

          return (
            getCompanyKey(
              match.company
            ) !==
            sourceCompanyNormalized
          );
        }
      );

    /* =====================================================
       VERIFY THAT AI MATERIALS
       ACTUALLY EXIST IN THE
       SUPPLIED DATABASE
    ===================================================== */

    const databaseIds =
      new Set(
        candidateMaterials.map(
          (material) =>
            Number(
              material.id
            )
        )
      );

    const verifiedMatches =
      safeMatches.map(
        (match) => {
          if (
            !match.material
          ) {
            return match;
          }

          const materialId =
            Number(
              match.material.id
            );

          if (
            !databaseIds.has(
              materialId
            )
          ) {
            return {
              ...match,
              material: null,
              score: 0,
              reason:
                "AI returned a material that was not present in the supplied database candidates.",
              matchedFields: [],
              matchedSpecifications: [],
            };
          }

          const original =
            candidateMaterials.find(
              (material) =>
                Number(
                  material.id
                ) ===
                materialId
            );

          if (!original) {
            return {
              ...match,
              material: null,
              score: 0,
              reason:
                "Selected material could not be verified.",
              matchedFields: [],
              matchedSpecifications: [],
            };
          }

          /*
           * IMPORTANT:
           * Use the original database row,
           * not AI-generated field values.
           */
          return {
            ...match,
            material: {
              id:
                original.id,

              company:
                original.company ??
                null,

              material_number:
                original.material_number ??
                null,

              description:
                original.description ??
                null,

              specifications:
                original.specifications ??
                null,

              category:
                original.category ??
                null,
            },
          };
        }
      );

    /* =====================================================
       ONE RESULT PER COMPANY
    ===================================================== */

    const bestByCompany =
      new Map<
        string,
        CompanyMatch
      >();

    for (
      const match of verifiedMatches
    ) {
      const company =
        getCompanyKey(
          match.company
        );

      if (
        company ===
        "UNKNOWN"
      ) {
        continue;
      }

      const existing =
        bestByCompany.get(
          company
        );

      if (
        !existing ||
        match.score >
          existing.score
      ) {
        bestByCompany.set(
          company,
          match
        );
      }
    }

    const finalMatches =
      Array.from(
        bestByCompany.values()
      ).sort(
        (a, b) =>
          b.score -
          a.score
      );

    /* =====================================================
       OVERALL BEST
    ===================================================== */

    const overallBest =
      finalMatches.find(
        (match) =>
          match.material !==
            null &&
          match.score >= 50
      ) || null;

    /* =====================================================
       RESPONSE
    ===================================================== */

    return NextResponse.json(
      {
        success: true,

        query,

        sourceCompany:
          sourceCompany ||
          null,

        candidateCount:
          aiCandidates.length,

        matches:
          finalMatches,

        overallBest,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "================================================"
    );

    console.error(
      "MATERIAL MATCHING API ERROR"
    );

    console.error(
      error
    );

    console.error(
      "================================================"
    );

    return NextResponse.json(
      {
        success: false,

        error:
          getUserFriendlyError(
            error
          ),
      },
      { status: 500 }
    );
  }
}

/* =========================================================
   LOCAL CANDIDATE SEARCH
========================================================= */

function findTopCandidatesPerCompany(
  query: string,
  materials: MaterialRecord[]
): CandidateScore[] {
  const grouped =
    new Map<
      string,
      CandidateScore[]
    >();

  for (
    const material of materials
  ) {
    const company =
      getCompanyKey(
        material.company
      );

    if (
      !grouped.has(
        company
      )
    ) {
      grouped.set(
        company,
        []
      );
    }

    const score =
      calculateLocalCandidateScore(
        query,
        material
      );

    grouped
      .get(company)!
      .push({
        material,
        score,
      });
  }

  const finalCandidates:
    CandidateScore[] = [];

  for (
    const candidates of grouped.values()
  ) {
    candidates.sort(
      (a, b) =>
        b.score -
        a.score
    );

    finalCandidates.push(
      ...candidates.slice(
        0,
        CANDIDATES_PER_COMPANY
      )
    );
  }

  finalCandidates.sort(
    (a, b) =>
      b.score -
      a.score
  );

  return finalCandidates;
}

/* =========================================================
   LOCAL CANDIDATE SCORE

   Used ONLY for pre-filtering.
   It is NOT the final AI score.
========================================================= */

function calculateLocalCandidateScore(
  query: string,
  material: MaterialRecord
): number {
  const queryText =
    normalizeText(
      query
    );

  const materialNumber =
    normalizeText(
      material.material_number
    );

  const description =
    normalizeText(
      material.description
    );

  const specifications =
    normalizeText(
      material.specifications
    );

  const category =
    normalizeText(
      material.category
    );

  const combined =
    [
      materialNumber,
      description,
      specifications,
      category,
    ]
      .filter(Boolean)
      .join(" ");

  const queryTokens =
    tokenize(
      queryText
    );

  if (
    queryTokens.length ===
    0
  ) {
    return 0;
  }

  const materialTokens =
    new Set(
      tokenize(
        combined
      )
    );

  let tokenMatches = 0;

  for (
    const token of queryTokens
  ) {
    if (
      materialTokens.has(
        token
      )
    ) {
      tokenMatches++;
      continue;
    }

    /*
     * Partial match support.
     */
    if (
      token.length >= 4 &&
      combined.includes(
        token
      )
    ) {
      tokenMatches +=
        0.75;
    }
  }

  const tokenScore =
    (tokenMatches /
      queryTokens.length) *
    60;

  const queryNumbers =
    extractNumbers(
      queryText
    );

  const materialNumbers =
    extractNumbers(
      combined
    );

  let numericScore = 0;

  if (
    queryNumbers.length >
    0
  ) {
    let numericMatches = 0;

    for (
      const value of queryNumbers
    ) {
      if (
        materialNumbers.includes(
          value
        )
      ) {
        numericMatches++;
      }
    }

    numericScore =
      (numericMatches /
        queryNumbers.length) *
      35;
  }

  let fieldBonus = 0;

  if (
    description &&
    queryText.includes(
      description
    )
  ) {
    fieldBonus += 5;
  }

  if (
    category &&
    queryText.includes(
      category
    )
  ) {
    fieldBonus += 5;
  }

  if (
    materialNumber &&
    materialNumber.length >=
      4 &&
    queryText.includes(
      materialNumber
    )
  ) {
    fieldBonus += 10;
  }

  return Math.min(
    Math.round(
      tokenScore +
        numericScore +
        fieldBonus
    ),
    100
  );
}

/* =========================================================
   GEMINI RETRY + FALLBACK
========================================================= */

async function generateWithRetry(
  ai: GoogleGenAI,
  prompt: string
) {
  let lastError:
    unknown = null;

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
      } catch (
        error: any
      ) {
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
         * Do not retry permanent
         * client/configuration errors.
         */
        if (
          !isRetryableError(
            error
          )
        ) {
          throw error;
        }

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
      `Model ${model} failed after ${MAX_RETRIES_PER_MODEL} attempts. Trying fallback model...`
    );
  }

  throw (
    lastError ||
    new Error(
      "All configured Gemini models are currently unavailable."
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
    ) ||
    message.includes(
      "quota exceeded"
    )
  ) {
    return true;
  }

  return false;
}

/* =========================================================
   ERROR STATUS
========================================================= */

function getErrorStatus(
  error: any
): number | null {
  const candidates = [
    error?.status,
    error?.code,
    error?.error?.status,
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
   ERROR MESSAGE
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
   USER-FRIENDLY ERROR
========================================================= */

function getUserFriendlyError(
  error: unknown
): string {
  const message =
    getErrorMessage(
      error
    ).toLowerCase();

  const status =
    getErrorStatus(
      error
    );

  if (
    status === 429 ||
    message.includes(
      "quota exceeded"
    ) ||
    message.includes(
      "resource exhausted"
    )
  ) {
    return (
      "The AI matching service has temporarily reached its usage limit. Please wait a little and try again."
    );
  }

  if (
    status === 503 ||
    message.includes(
      "high demand"
    ) ||
    message.includes(
      "temporarily unavailable"
    )
  ) {
    return (
      "The AI matching service is temporarily busy. Please try again shortly."
    );
  }

  return (
    "Unable to complete AI material matching right now. Please try again."
  );
}

/* =========================================================
   BACKOFF
========================================================= */

function calculateBackoff(
  attempt: number
): number {
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
   TEXT NORMALIZATION
========================================================= */

function normalizeText(
  value: unknown
): string {
  return String(
    value ?? ""
  )
    .toLowerCase()
    .replace(
      /[^\w./%+-]+/g,
      " "
    )
    .replace(
      /\s+/g,
      " "
    )
    .trim();
}

/* =========================================================
   TOKENIZATION
========================================================= */

function tokenize(
  value: string
): string[] {
  const stopWords =
    new Set([
      "the",
      "and",
      "for",
      "with",
      "from",
      "type",
      "part",
      "item",
      "material",
      "number",
      "no",
      "of",
      "a",
      "an",
      "to",
      "in",
      "on",
      "as",
      "is",
      "are",
      "used",
      "use",
    ]);

  return Array.from(
    new Set(
      normalizeText(
        value
      )
        .split(/\s+/)
        .map(
          (token) =>
            token.trim()
        )
        .filter(
          (token) =>
            token.length >=
              2 &&
            !stopWords.has(
              token
            )
        )
    )
  );
}

/* =========================================================
   TECHNICAL VALUE EXTRACTION
========================================================= */

function extractNumbers(
  value: string
): string[] {
  const matches =
    normalizeText(
      value
    ).match(
      /\b\d+(?:\.\d+)?(?:\s?[-/x]\s?\d+(?:\.\d+)?)?(?:[a-z]+)?\b/g
    ) || [];

  return Array.from(
    new Set(
      matches
    )
  );
}

/* =========================================================
   COMPANY NORMALIZATION
========================================================= */

function getCompanyKey(
  company?: string | null
): string {
  const value =
    String(
      company ?? ""
    )
      .trim()
      .toUpperCase();

  return (
    value ||
    "UNKNOWN"
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