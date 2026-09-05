import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API health endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    service: "Bharat Material Grid Intelligence API",
    version: "2.4.1"
  });
});

// Gemini AI Contextual Assistant endpoint
app.post("/api/ai-assistant", async (req, res) => {
  const { prompt, context, page, entityData } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    // Generate high-fidelity deterministic domain-specific answer
    const simulatedAnswer = generateFallbackAnswer(prompt, page, entityData);
    return res.json({
      reply: simulatedAnswer,
      source: "BMG Domain Knowledge Engine (Offline Mode)",
      model: "BMG-Embed-FastText-v2.4"
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const systemInstruction = `You are Bharat AI, the official intelligent assistant for the Bharat Material Grid (BMG) - Government Enterprise AI Platform.
You assist Central Public Sector Enterprises (CPSEs like IOCL, ONGC, BPCL, NTPC, SAIL, GAIL, BHEL, Coal India, CPCL, HPCL) with material master harmonization, engineering specification validation, AI candidate match analysis, deduplication, and national aggregated procurement intelligence.

Key Principles to adhere to:
1. AI discovers candidates; Engineering specifications validate them; Human experts govern ambiguous decisions; Approved records create a trusted common identity (BMG-XXX-XXXXXXXXX).
2. Never advocate blindly trusting semantic similarity if physical or engineering parameters (dimensions, grade, pressure rating, UOM) differ.
3. Be professional, concise, authoritative, and helpful with precise material engineering context.
4. Current Page Context: ${page || 'Dashboard'}.
${entityData ? `Entity Context: ${JSON.stringify(entityData)}` : ''}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: `${systemInstruction}\n\nUser Question: ${prompt}` }]
        }
      ]
    });

    const reply = response.text || "No response generated from AI.";
    res.json({
      reply,
      source: "Gemini 2.5 Flash / BMG Governance Orchestrator",
      model: "gemini-2.5-flash"
    });
  } catch (error: any) {
    console.error("Gemini API error:", error);
    const simulatedAnswer = generateFallbackAnswer(prompt, page, entityData);
    res.json({
      reply: simulatedAnswer,
      source: "BMG Domain Fallback Reasoning Engine",
      model: "BMG-Embed-FastText-v2.4",
      notice: "Live API fallback used due to network or quota conditions."
    });
  }
});

function generateFallbackAnswer(prompt: string, page?: string, entity?: any): string {
  const p = (prompt || "").toLowerCase().trim();

  // 1. GREETINGS & CAPABILITIES
  if (p === "hi" || p === "hello" || p === "namaste" || p === "help" || p.includes("who are you") || p.includes("what can you do")) {
    return `Namaste! I am Bharat AI, the official sovereign intelligence assistant for the Bharat Material Grid (BMG).

I can answer any question regarding:
• Platform Architecture & Purpose (Atmanirbhar Bharat, SIH Problem 25055)
• AI Spec Matching & Deduplication Algorithms (FastText, Regex extraction, Cosine similarity)
• False-Merge Prevention & Engineering Guardrails (Candidate pair #8499, dimensional & metallurgy mismatches)
• Bulk Procurement & Demand Aggregation (Savings simulator, GeM rate contracts)
• CPSE Catalog Health & Quality Index (IOCL, ONGC, SAIL, NTPC, GAIL, BHEL, Coal India)
• Review Queue & Nodal Officer Governance (4-Eye Principle, audit logs)
• Dataset Ingestion & SAP/Excel Schema Mapping
• National Standards Compliance (BIS/IS, ISO, ASTM, ASME, API)

Try asking: "Why was this material standardized?", "How does AI detect duplicate materials?", or "Which CPSE has the highest demand?"`;
  }

  // 2. PLATFORM OVERVIEW & PROBLEM STATEMENT 25055
  if (p.includes("what is bmg") || p.includes("what is bharat material grid") || p.includes("about") || p.includes("purpose") || p.includes("problem") || p.includes("25055") || p.includes("sih")) {
    return `🏛️ Bharat Material Grid (BMG) Overview:
Bharat Material Grid is India's sovereign national material intelligence and deduplication platform built for Central Public Sector Enterprises (CPSEs), answering SIH Problem Statement 25055 under the Ministry of Heavy Industries & Department of Public Enterprises.

Core Mission:
• Solves catalog fragmentation across Indian PSUs where identical engineering items are listed under divergent internal part numbers.
• Eliminates duplicate vendor onboarding and prevents multi-crore capital lockup in redundant inventory.
• Assigns an authoritative Sovereign Common Identifier (e.g., BMG-MEC-VLV-000004921) recognized across all CPSE ERP systems.
• Unlocks massive bulk procurement savings via joint rate contracts on GeM (Government e-Marketplace).`;
  }

  // 3. AI MATCHING ALGORITHM & DEDUPLICATION
  if (p.includes("how does ai match") || p.includes("algorithm") || p.includes("deduplication") || p.includes("how it works") || p.includes("cosine") || p.includes("embedding") || p.includes("ai model")) {
    return `🔬 AI Spec Matching & Deduplication Pipeline:
BMG employs a 6-tier multi-stage intelligence pipeline combining semantic discovery with deterministic engineering physics guardrails:

1. Text Normalization: Strips noisy vendor codes, standardizes engineering abbreviations (e.g., "SST" → "Stainless Steel", "HEX HD" → "Hexagonal Head").
2. Regex Attribute Extraction: Deterministically isolates physical properties (Length, Diameter, Material Grade, Pressure Class, Flange Face, Thread Pitch).
3. Dense Semantic Vectorization: Utilizes domain-fine-tuned FastText / Transformer embeddings to calculate Cosine Similarity across millions of catalog descriptions.
4. Engineering Physics Guardrails: Even if semantic similarity is 99%, if physical dimensions or material grades differ, the match is hard-blocked.
5. Tri-Band Confidence Scoring:
   • ≥ 90% + 100% attribute match: Recommended Auto-Standardization.
   • 70% - 89% or ambiguous specs: Routed to Nodal Officer Human-in-the-Loop Review Queue.
   • < 70%: Flagged as distinct non-matches.
6. Continuous Feedback Loop: Approved decisions retrain classification embeddings.`;
  }

  // 4. FALSE-MERGE RISKS & UNSAFE CANDIDATES (CANDIDATE #8499)
  if (p.includes("unsafe") || p.includes("false-positive") || p.includes("false merge") || p.includes("8499") || p.includes("mismatch") || p.includes("risk") || p.includes("danger") || p.includes("why candidate")) {
    return `⚠️ Critical Safety Analysis - Why Candidate Pair #8499 is Hard-Blocked:
Candidate Pair #8499 pairs "SS BOLT M10×50 SS304" (IOCL) with "SS BOLT M10×60 SS304" (ONGC).

Why Conventional AI Fails (Semantic False Positive):
• Conventional NLP algorithms report 94.8% text similarity due to identical tokens: "SS", "BOLT", "M10", "SS304".

Why Bharat Material Grid Prevents Auto-Merge:
1. Dimensional Hazard: 50mm vs 60mm length difference. An extra 10mm causes bolts to bottom out in blind-tapped holes, preventing proper gasket compression.
2. Catastrophic Industrial Consequence: In high-pressure hydrocracker and offshore gas lines, incorrect bolt lengths lead to flange joint blowouts, toxic leaks, and refinery fires.
3. BMG Rule: Fastener length is defined as a non-negotiable critical attribute with zero tolerance for variance.`;
  }

  // 5. WHY WAS THIS MATERIAL STANDARDIZED (BMG-FST-000001284)
  if (p.includes("why was this material standardized") || p.includes("standardized") || p.includes("1284") || p.includes("fastener")) {
    return `✅ Standardization Rationale for BMG-FST-000001284:
This material was successfully standardized because 4 distinct CPSEs (ONGC, IOCL, BPCL, CPCL) maintained identical physical inventory under 4 completely divergent legacy part codes:
• ONGC: BOLT-HEX-SS304-10-50
• IOCL: FST-BLT-M10X50-304
• BPCL: 1050-HEX-BOLT-STAINLESS
• CPCL: M10-50MM-SS304-FAST

Specification Equivalence Check:
• Metric Size: M10 (10mm nominal thread diameter)
• Length: 50mm (Full thread)
• Metallurgy: SS304 Austenitic Stainless Steel (ASTM A193 / A2-70)
• Standard: ISO 4014 / DIN 931 Hex Head Bolt
Result: 100% engineering interchangeability confirmed. A single national master record was created, saving ₹3.8 Crores across CPSE annual stocking orders.`;
  }

  // 6. CPSE DEMAND & PARTICIPATION
  if (p.includes("highest demand") || p.includes("which cpse") || p.includes("demand") || p.includes("iocl") || p.includes("ongc") || p.includes("sail") || p.includes("ntpc")) {
    return `📊 CPSE Participation & Demand Distribution:
10 Major Central Public Sector Enterprises actively participate in the Bharat Material Grid:

• Indian Oil Corporation Ltd (IOCL): 64,210 records | Highest demand share (34.2% of valves & fasteners) | Quality Score: 92.4%
• ONGC (Oil & Natural Gas Corp): 58,400 records | 28.6% demand share | Benchmark Quality Score: 95.1%
• NTPC Limited: 42,150 records | 18.1% power equipment demand | Quality Score: 84.8%
• BPCL: 38,900 records | 11.4% refinery equipment demand | Quality Score: 89.6%
• SAIL (Steel Authority): 31,400 records | Quality Score: 78.5% (Review required for missing grades)
• GAIL, BHEL, Coal India, HPCL, and CPCL make up the remaining 28,000+ records.

Aggregating demand across these 10 giants enables volume procurement discounts of 14.5% to 22.8%.`;
  }

  // 7. SPECIFICATION COMPLETENESS & DATA QUALITY
  if (p.includes("completeness") || p.includes("worst") || p.includes("quality") || p.includes("audit") || p.includes("lowest specification")) {
    return `📋 CPSE Data Quality Index & Specification Completeness:
Validation audits reveal significant variance in legacy CPSE catalogs:

1. Highest Quality: ONGC leads at 94.1% Completeness and 95.1% Quality Score. All offshore equipment records adhere strictly to API 6D and NACE MR0175 standards.
2. Average Tier: IOCL (88.0% completeness), BPCL (85.2%), and NTPC (76.0%).
3. Lowest Quality: SAIL currently scores 62.4% completeness (Quality: 78.5%). Legacy blast furnace records frequently omit ASME pressure ratings and precise stainless steel grades (e.g., recorded merely as "STEEL VALVE" without alloy grade).
4. Corrective Action: BMG Automated Enrichment rules automatically suggest missing fields based on supplier part numbers and historical drawing matches.`;
  }

  // 8. PROCUREMENT SAVINGS & RATE CONTRACT OPPORTUNITIES
  if (p.includes("opportunity") || p.includes("procurement") || p.includes("save") || p.includes("savings") || p.includes("bulk") || p.includes("rate contract") || p.includes("1042")) {
    return `💰 National Aggregated Procurement & Bulk Savings:
BMG pools purchasing demand across all 10 CPSEs to unlock massive sovereign economies of scale:

Top Consolidation Opportunity (OPP-1042):
• Item: Industrial Valves - 4-inch Class 150 Flanged Gate Valves (API 600 / ASME B16.34)
• Participating CPSEs: 6 CPSEs (IOCL, ONGC, BPCL, HPCL, GAIL, CPCL)
• Aggregated Volume: 18,450 units annually across 11 disparate vendors
• Financial Impact:
  - Total Spend without BMG: ₹64.5 Crores
  - Projected Spend with Unified Rate Contract: ₹53.2 Crores
  - Direct Savings: ₹11.3 Crores (17.5% price reduction)
  - Tender Administrative Savings: 40% reduction in procurement cycle time.`;
  }

  // 9. REVIEW QUEUE & HUMAN-IN-THE-LOOP GOVERNANCE
  if (p.includes("review") || p.includes("nodal") || p.includes("human") || p.includes("approve") || p.includes("reject") || p.includes("four-eye") || p.includes("workflow")) {
    return `🛡️ Human-in-the-Loop Governance & Nodal Officer Workflow:
BMG strictly enforces that AI never executes safety-critical changes without authorized human oversight:

1. Ambiguity Trigger: Matches with 70-89% similarity or conflicting secondary attributes are routed to the Review Queue.
2. Four-Eye Principle: Critical hydrocarbon and high-pressure assets require verification by two independent Chief Materials Managers.
3. Available Actions:
   • Approve: Confirms equivalence, issues a canonical BMG Code, and updates CPSE ERP links.
   • Reject: Classifies items as physically distinct, penalizing the algorithm's erroneous feature weighting.
   • Request More Data: Issues an electronic RFI to the originating CPSE store for Mill Test Reports (MTR) or CAD drawings.
   • Defer: Postpones pending scheduled plant maintenance audits.
4. Audit Trail: Every approval is immutably logged with timestamp, officer digital ID, and engineering rationale.`;
  }

  // 10. HOW TO UPLOAD & DATA INGESTION
  if (p.includes("upload") || p.includes("dataset") || p.includes("csv") || p.includes("excel") || p.includes("sap") || p.includes("import") || p.includes("file format")) {
    return `📤 CPSE Dataset Upload & Ingestion Instructions:
CPSE Materials Officers can upload catalogs directly via the 'Upload Dataset' tab:

Supported File Formats:
• CSV (.csv) with UTF-8 encoding
• Microsoft Excel (.xlsx / .xls)
• Direct SAP ERP / Oracle SCM XML export dumps

Required Header Fields:
1. Item Code / Material Number (Unique CPSE identifier)
2. Material Description (Raw legacy catalog text)
3. Unit of Measure (UOM - e.g., NOS, MTR, KGS, SET)
4. Category / Sector (e.g., Fasteners, Valves, Piping, Electrical)
5. Current Stock Quantity & Unit Purchase Price (₹)

Automated Processing: Upon upload, BMG validates schemas, flags missing critical attributes, normalizes abbreviations, and runs AI duplicate candidate matching in under 3 seconds.`;
  }

  // 11. STANDARDS COMPLIANCE (BIS, ISO, ASTM, ASME, API)
  if (p.includes("standard") || p.includes("bis") || p.includes("iso") || p.includes("astm") || p.includes("asme") || p.includes("api") || p.includes("din")) {
    return `📐 Engineering Standards Supported by BMG:
The platform contains built-in domain dictionaries mapped to premier sovereign and global engineering standards:

• Bureau of Indian Standards (BIS / IS): IS 1363 / IS 1367 (Hex Bolts), IS 1239 / IS 3589 (Steel Tubes), IS 778 (Bronze Valves)
• ASME: B16.5 (Pipe Flanges), B16.34 (Valves Flanged/Threaded/Welded), B31.3 (Process Piping)
• ASTM: A193 / A194 (Alloy & Stainless Bolting), A106 (Seamless Carbon Steel Pipe), A216 WCB (Carbon Steel Castings)
• API: API 6D (Pipeline Valves), API 600 (Steel Gate Valves), API 598 (Valve Inspection & Testing)
• ISO: ISO 4014 / 4017 (Metric Fasteners), ISO 10434 (Petroleum Valves)

Materials are checked for cross-standard equivalence (e.g., verifying DIN 931 vs ISO 4014 compatibility).`;
  }

  // 12. CROSS-CPSE SURPLUS & DEAD STOCK
  if (p.includes("dead stock") || p.includes("surplus") || p.includes("inventory sharing") || p.includes("transfer") || p.includes("idle")) {
    return `🔄 Cross-CPSE Surplus Inventory Sharing & Dead Stock Liquidation:
A major feature of Bharat Material Grid is visibility into inactive inventory across all PSUs:

• Idle Stock Prevention: If ONGC Mumbai High holds surplus Class 300 Ball Valves that have not moved in 24 months, BMG flags them to IOCL Panipat when IOCL raises a new tender requisition.
• Inter-CPSE Transfer: Enables direct inter-governmental stock transfer at book value, saving 100% of the procurement lead time and avoiding fresh market expenditure.
• Estimated Impact: Over ₹185 Crores of dead capital across CPSE stores has been earmarked for inter-CPSE redeployment.`;
  }

  // 13. PORTAL NAVIGATION GUIDANCE
  if (p.includes("how to navigate") || p.includes("how to use") || p.includes("features") || p.includes("tabs") || p.includes("menu")) {
    return `🗺️ Bharat Material Grid Portal Navigation Guide:
• 🏛️ Home: Sovereign overview, national KPIs, interactive demo launcher, and participating CPSE directory.
• ⚡ Command Center: Real-time national intelligence metrics, demand concentration graphs, and category analytics.
• 📦 Material Catalog: Searchable repository of all standardized BMG records with complete 360° specification sheets.
• 🔬 AI Spec Matcher: Interactive tool to inspect candidate pairs, compare side-by-side attributes, and test semantic similarity.
• 📋 Review Queue: Nodal Officer cockpit for reviewing ambiguous matches with 1-click approvals and safety warnings.
• 📈 Bulk Savings & Deals: Aggregated demand pooling simulator showing projected volume discount rate contracts.
• 🏢 CPSE Directory: Performance scorecards, catalog completeness rates, and designated nodal officer contacts.
• 📤 Upload Dataset: Secure catalog ingestion portal with automatic column mapping and validation.
• 🛡️ Audit & Transparency: Forensic log of all deduplications, officer approvals, and system events.`;
  }

  // 14. HINDI & ROMANIZED HINDI SUPPORT
  if (p.includes("kya hai") || p.includes("kaise") || p.includes("bachat") || p.includes("madad") || p.includes("hindi") || p.includes("jaankari")) {
    return `🇮🇳 भारत मटेरियल ग्रिड (BMG) - मुख्य विवरण:
यह भारत सरकार के भारी उद्योग मंत्रालय और केंद्रीय लोक उद्यम विभाग (DPE) के अंतर्गत सीपीएसई (जैसे IOCL, ONGC, SAIL, NTPC, GAIL) के लिए बनाया गया राष्ट्रीय सामग्री मानकीकरण एवं एआई डुप्लिकेशन रोकथाम पोर्टल है।

मुख्य विशेषताएं:
1. एआई आधारित मिलान: विभिन्न सरकारी उपक्रमों की समान सामग्रियों को खोजकर एक राष्ट्रीय बीएमजी कोड प्रदान करता है।
2. सुरक्षा नियम (Safety Guardrails): केवल शब्दों के मिलान पर भरोसा नहीं करता; लंबाई (50mm vs 60mm) या प्रेशर रेटिंग (Class 150 vs 300) का अंतर होने पर स्वतः विलय को रोकता है।
3. थोक खरीद से भारी बचत: सभी उपक्रमों की मांग को GeM पर एकत्रित कर 15-22% तक की मूल्य बचत सुनिश्चित करता है।
4. नोडल अधिकारी समीक्षा: संवेदनशील वस्तुओं का अंतिम निर्णय संबंधित उपक्रम के सामग्री प्रबंधक द्वारा किया जाता है।`;
  }

  // 15. DEFAULT CONTEXT-AWARE FALLBACK
  return `🏛️ Bharat AI Sovereign Intelligence Response:
Context: ${page ? page.toUpperCase() : 'NATIONAL MATERIAL GRID'}
Query: "${prompt}"

• Engineering Governance: All material records across our 10 CPSEs are governed under BIS, ISO, ASME, and API engineering specifications.
• Deduplication Principle: While dense vector embeddings discover candidate duplicates, strict attribute matching (Metallurgy, Dimensions, Pressure Class, Thread Pitch) determines interchangeability.
• Economic Impact: Over 18,430 common identities generated, reducing duplicate vendor onboarding by 42% and generating ₹420+ Crores in aggregated procurement savings.
• Recommended Action: You can inspect candidate matches in the 'AI Spec Matcher' tab or review pending decisions in the 'Review Queue'.`;
}

// Vite middleware for dev / static for prod
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Bharat Material Grid Enterprise Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
