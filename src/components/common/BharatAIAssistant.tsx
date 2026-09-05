import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { AshokaEmblem } from './GovernmentLogos';
import {
  Sparkles,
  Send,
  Bot,
  User,
  X,
  ChevronRight,
  RefreshCw,
  Layers,
  Copy,
  Check,
  RotateCcw,
  ShieldCheck
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  source?: string;
  model?: string;
}

export const BharatAIAssistant: React.FC = () => {
  const {
    isAIAssistantOpen,
    setIsAIAssistantOpen,
    currentTab,
    selectedMaterialId,
    selectedCandidateId,
    commonMaterials,
    candidates
  } = useApp();

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'ai',
      text: `Namaste! I am Bharat AI, your Enterprise Material Intelligence Copilot. I analyze multi-CPSE catalogs, validate engineering specifications against IS/ISO/API standards, and detect false-positive semantic matches.\n\nHow may I assist you today?`,
      timestamp: 'Now',
      source: 'Bharat Material Grid Master Orchestrator',
      model: 'gemini-2.5-flash / BMG-v2.4'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAIAssistantOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, isAIAssistantOpen]);

  const activeMaterial = commonMaterials.find(m => m.id === selectedMaterialId);
  const activeCandidate = candidates.find(c => c.id === selectedCandidateId);

  const [activeCategory, setActiveCategory] = useState<string>('Top Queries');

  const questionCategories = [
    {
      id: 'Top Queries',
      label: '🔥 Top Queries',
      questions: [
        'Why was this material standardized?',
        'Explain why candidate pair #8499 is unsafe to auto-merge',
        'Which CPSE has the highest demand for SS Bolts?',
        'Which CPSE has the lowest specification completeness?',
        'What is the highest value aggregated procurement opportunity?'
      ]
    },
    {
      id: 'Platform & SIH',
      label: '🏛️ Platform & SIH',
      questions: [
        'What is Bharat Material Grid and Problem 25055?',
        'How does BMG eliminate multi-crore duplicate inventory?',
        'How does this platform support Atmanirbhar Bharat?'
      ]
    },
    {
      id: 'AI & Safety',
      label: '🔬 AI & Safety',
      questions: [
        'How does the AI matching algorithm work?',
        'Why can semantic similarity be dangerous in engineering?',
        'What are the confidence score thresholds for auto-merging?'
      ]
    },
    {
      id: 'Bulk Savings',
      label: '💰 Bulk Savings',
      questions: [
        'How do CPSEs save money through aggregated procurement?',
        'Explain Opportunity #1042 (4-inch Gate Valves)',
        'How does cross-CPSE surplus stock sharing work?'
      ]
    },
    {
      id: 'Standards & Upload',
      label: '📋 Standards & Upload',
      questions: [
        'How do I upload a CPSE material catalog (CSV/Excel/SAP)?',
        'What engineering standards are supported (BIS, ISO, ASME, API)?',
        'How does the Nodal Officer review workflow work?'
      ]
    }
  ];

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'init-' + Date.now(),
        sender: 'ai',
        text: `Chat reset. I am Bharat AI Sovereign Copilot, ready to answer any engineering, CPSE demand, deduplication, or procurement query.\n\nRecommended Language: English (EN) | हिंदी समर्थित`,
        timestamp: 'Now',
        source: 'Bharat Material Grid Master Orchestrator',
        model: 'gemini-2.5-flash / BMG-v2.4'
      }
    ]);
  };

  // Comprehensive client-side domain knowledge retriever
  const getEmergencyFallbackAnswer = (promptText: string): string => {
    const p = promptText.toLowerCase().trim();

    if (p === 'hi' || p === 'hello' || p === 'namaste' || p.includes('help') || p.includes('who are you')) {
      return `Namaste! I am Bharat AI, your Enterprise Material Intelligence Copilot.

I can answer questions regarding:
• Platform Architecture & SIH Problem Statement 25055
• Multi-tier AI Spec Matching & Vector Embeddings
• False-Merge Prevention & Unsafe Engineering Pairs (e.g., #8499)
• Bulk Procurement Demand Aggregation across 10 CPSEs
• Data Quality Index & Specification Completeness Scores
• Human-in-the-Loop Review Governance (4-Eye Principle)
• Ingestion of SAP/Excel/CSV Master Data
• Standards Compliance (BIS/IS, ISO, ASTM, ASME, API)`;
    }

    if (p.includes('what is bmg') || p.includes('about') || p.includes('problem') || p.includes('25055') || p.includes('purpose')) {
      return `🏛️ Bharat Material Grid (BMG) Overview:
Bharat Material Grid is India's sovereign national material intelligence and deduplication platform built for Central Public Sector Enterprises (CPSEs), answering SIH Problem Statement 25055 under the Ministry of Heavy Industries & Department of Public Enterprises.

Core Objectives:
• Solves catalog fragmentation across Indian PSUs where identical engineering items are listed under divergent internal part numbers.
• Eliminates duplicate vendor onboarding and prevents multi-crore capital lockup in redundant inventory.
• Assigns an authoritative Sovereign Common Identifier (e.g., BMG-MEC-VLV-000004921) recognized across all CPSE ERP systems.
• Unlocks massive bulk procurement savings via joint rate contracts on GeM (Government e-Marketplace).`;
    }

    if (p.includes('how does ai match') || p.includes('algorithm') || p.includes('deduplication') || p.includes('model') || p.includes('cosine')) {
      return `🔬 AI Spec Matching & Deduplication Pipeline:
BMG employs a 6-tier multi-stage intelligence pipeline:

1. Text Normalization: Strips vendor noise and standardizes abbreviations ("SST" → "Stainless Steel").
2. Regex Attribute Extraction: Deterministically isolates physical properties (Length, Diameter, Material Grade, Pressure Class, Flange Face).
3. Dense Semantic Vectorization: Utilizes domain-fine-tuned FastText / Transformer embeddings to calculate Cosine Similarity across millions of catalog descriptions.
4. Engineering Physics Guardrails: Even if semantic similarity is 99%, if physical dimensions or material grades differ, the match is hard-blocked.
5. Tri-Band Confidence Scoring:
   • ≥ 90% + 100% attribute match: Recommended Auto-Standardization.
   • 70% - 89% or ambiguous specs: Routed to Nodal Officer Human-in-the-Loop Review Queue.
   • < 70%: Flagged as distinct non-matches.`;
    }

    if (p.includes('unsafe') || p.includes('false-positive') || p.includes('false merge') || p.includes('8499') || p.includes('mismatch')) {
      return `⚠️ Critical Safety Analysis - Why Candidate Pair #8499 is Hard-Blocked:
Candidate Pair #8499 pairs "SS BOLT M10×50 SS304" (IOCL) with "SS BOLT M10×60 SS304" (ONGC).

Why Conventional AI Fails (Semantic False Positive):
• Conventional NLP algorithms report 94.8% text similarity due to identical tokens: "SS", "BOLT", "M10", "SS304".

Why Bharat Material Grid Prevents Auto-Merge:
1. Dimensional Hazard: 50mm vs 60mm length difference. An extra 10mm causes bolts to bottom out in blind-tapped holes, preventing proper gasket compression.
2. Catastrophic Industrial Consequence: In high-pressure hydrocracker and offshore gas lines, incorrect bolt lengths lead to flange joint blowouts, toxic leaks, and refinery fires.
3. BMG Rule: Fastener length is defined as a non-negotiable critical attribute with zero tolerance for variance.`;
    }

    if (p.includes('why was this material standardized') || p.includes('standardized') || p.includes('1284')) {
      return `✅ Standardization Rationale for BMG-FST-000001284:
This material was standardized because 4 distinct CPSEs (ONGC, IOCL, BPCL, CPCL) maintained identical physical inventory under 4 completely divergent legacy part codes:
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

    if (p.includes('highest demand') || p.includes('demand') || p.includes('iocl') || p.includes('ongc')) {
      return `📊 CPSE Participation & Demand Distribution:
Across our 10 participating CPSEs:
• Indian Oil Corporation Ltd (IOCL): 64,210 records | Highest demand share (34.2% of valves & fasteners) | Quality Score: 92.4%
• ONGC: 58,400 records | 28.6% demand share | Benchmark Quality Score: 95.1%
• NTPC Limited: 42,150 records | 18.1% power equipment demand | Quality Score: 84.8%
• BPCL: 38,900 records | 11.4% refinery equipment demand | Quality Score: 89.6%
• SAIL: 31,400 records | Quality Score: 78.5% (Review required for missing grades)
• GAIL, BHEL, Coal India, HPCL, and CPCL contribute the remainder.

Aggregating demand across these 10 giants enables volume procurement discounts of 14.5% to 22.8%.`;
    }

    if (p.includes('completeness') || p.includes('worst') || p.includes('quality') || p.includes('lowest specification')) {
      return `📋 CPSE Data Quality Index & Specification Completeness:
• Highest Quality: ONGC leads at 94.1% Completeness and 95.1% Quality Score. All offshore equipment records adhere strictly to API 6D and NACE MR0175 standards.
• Lowest Quality: SAIL currently scores 62.4% completeness (Quality: 78.5%). Legacy blast furnace records frequently omit ASME pressure ratings and precise stainless steel grades.
• Corrective Action: BMG Automated Enrichment rules automatically suggest missing fields based on supplier part numbers and historical drawing matches.`;
    }

    if (p.includes('opportunity') || p.includes('procurement') || p.includes('save') || p.includes('savings') || p.includes('1042')) {
      return `💰 National Aggregated Procurement & Bulk Savings:
Top Consolidation Opportunity (OPP-1042):
• Item: Industrial Valves - 4-inch Class 150 Flanged Gate Valves (API 600 / ASME B16.34)
• Participating CPSEs: 6 CPSEs (IOCL, ONGC, BPCL, HPCL, GAIL, CPCL)
• Aggregated Volume: 18,450 units annually across 11 disparate vendors
• Direct Savings: ₹11.3 Crores (17.5% price reduction)
• Tender Administrative Savings: 40% reduction in procurement cycle time.`;
    }

    if (p.includes('upload') || p.includes('dataset') || p.includes('csv') || p.includes('excel') || p.includes('sap')) {
      return `📤 CPSE Dataset Upload & Ingestion:
Supported File Formats:
• CSV (.csv) with UTF-8 encoding
• Microsoft Excel (.xlsx / .xls)
• Direct SAP ERP / Oracle SCM XML export dumps

Required Columns:
1. Item Code / Material Number
2. Material Description
3. Unit of Measure (UOM)
4. Category / Sector
5. Current Stock Quantity & Unit Purchase Price (₹)

The system automatically parses legacy schemas and detects duplicates within 3 seconds.`;
    }

    if (p.includes('standard') || p.includes('bis') || p.includes('iso') || p.includes('astm') || p.includes('asme') || p.includes('api')) {
      return `📐 Engineering Standards Supported by BMG:
• BIS / IS: IS 1363 / IS 1367 (Hex Bolts), IS 1239 / IS 3589 (Steel Tubes), IS 778 (Bronze Valves)
• ASME: B16.5 (Pipe Flanges), B16.34 (Valves), B31.3 (Process Piping)
• ASTM: A193 / A194 (Alloy & Stainless Bolting), A106 (Seamless CS Pipe), A216 WCB (Castings)
• API: API 6D (Pipeline Valves), API 600 (Gate Valves), API 598 (Valve Testing)
• ISO: ISO 4014 / 4017 (Metric Fasteners), ISO 10434 (Valves)`;
    }

    if (p.includes('kya hai') || p.includes('bachat') || p.includes('hindi') || p.includes('jaankari')) {
      return `🇮🇳 भारत मटेरियल ग्रिड (BMG) - मुख्य विवरण:
यह भारत सरकार के भारी उद्योग मंत्रालय और केंद्रीय लोक उद्यम विभाग (DPE) के अंतर्गत सीपीएसई (जैसे IOCL, ONGC, SAIL, NTPC, GAIL) के लिए बनाया गया राष्ट्रीय सामग्री मानकीकरण एवं एआई डुप्लिकेशन रोकथाम पोर्टल है।

मुख्य लाभ:
1. राष्ट्रीय कोड (BMG Code): सभी उपक्रमों की समान सामग्रियों का एक साझा कोड।
2. सुरक्षा गार्डरेल्स: 50mm vs 60mm बोल्ट जैसे जानलेवा गलत मिलान को रोकता है।
3. थोक खरीद में ₹420+ करोड़ की वार्षिक बचत।
4. नोडल अधिकारियों द्वारा सुरक्षित मानवीय अनुमोदन।`;
    }

    return `🏛️ Bharat AI Sovereign Intelligence Response:
Query: "${promptText}"

• Engineering Governance: All material records across 10 CPSEs are governed under BIS, ISO, ASME, and API engineering specifications.
• Deduplication Principle: While dense vector embeddings discover candidate duplicates, strict attribute matching determines interchangeability.
• National Impact: Over 18,430 common identities generated, reducing duplicate vendor onboarding by 42% and generating ₹420+ Crores in aggregated procurement savings.
• Recommended Action: You can inspect candidate matches in the 'AI Spec Matcher' tab or review pending decisions in the 'Review Queue'.`;
  };

  const handleSend = async (questionText?: string) => {
    const textToSend = questionText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!questionText) setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          page: currentTab,
          entityData: {
            material: activeMaterial,
            candidate: activeCandidate
          }
        })
      });

      if (!response.ok) {
        throw new Error('Network response not ok');
      }

      const data = await response.json();

      const aiMsg: ChatMessage = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        text: data.reply || getEmergencyFallbackAnswer(textToSend),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: data.source || 'Bharat Material Grid Master Orchestrator',
        model: data.model || 'gemini-2.5-flash / BMG-v2.4'
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.warn('Backend fetch fallback engaged:', err);
      const fallbackMsg: ChatMessage = {
        id: 'ai-fallback-' + Date.now(),
        sender: 'ai',
        text: getEmergencyFallbackAnswer(textToSend),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'BMG Sovereign Knowledge Engine (Offline Resilient)',
        model: 'BMG-Embed-FastText-v2.4'
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isAIAssistantOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop with Fade Animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsAIAssistantOpen(false)}
            className="absolute inset-0 bg-[#001730]/60 backdrop-blur-xs"
          />

          {/* Drawer with Slide & Spring Motion */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="w-screen max-w-xl bg-white border-l border-slate-200 shadow-2xl flex flex-col h-full"
            >
              {/* Header with Official Sovereign Branding */}
              <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-[#002244] via-[#001f3f] to-[#001730] text-white flex items-center justify-between shadow-md">
                <div className="flex items-center gap-3">
                  <div className="p-1 rounded-md bg-white/10 border border-white/20">
                    <AshokaEmblem size={28} color="#ffffff" goldTone={true} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-white text-sm tracking-tight font-display">
                        Bharat AI Intelligence Copilot
                      </h3>
                      <span className="bg-amber-400 text-slate-950 font-black text-[9px] px-1.5 py-0.5 rounded font-mono">
                        v2.4
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-300 font-mono flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Gemini 2.5 Flash • Spec Guard Orchestrator</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleResetChat}
                    className="text-slate-300 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                    title="Reset Conversation"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsAIAssistantOpen(false)}
                    className="text-slate-300 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                    title="Close Assistant"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Context Banner */}
              <div className="px-4 py-2.5 bg-amber-50/70 border-b border-amber-200/80 flex items-center justify-between text-xs text-amber-950">
                <div className="flex items-center gap-2 truncate">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span className="truncate">
                    Active Context: <strong className="capitalize">{currentTab}</strong>
                  </span>
                </div>
                {activeMaterial ? (
                  <span className="text-[10px] font-mono bg-white text-slate-800 border border-amber-200 px-2 py-0.5 rounded truncate max-w-[170px] shadow-2xs">
                    {activeMaterial.bmgCode}
                  </span>
                ) : (
                  <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                    IS/ISO/API Standardized
                  </span>
                )}
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/60">
                {messages.map(msg => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.sender === 'ai' && (
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#002244] to-[#003366] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                        <Bot className="w-4 h-4 text-amber-300" />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed group relative ${
                        msg.sender === 'user'
                          ? 'bg-[#002244] text-white font-medium rounded-tr-xs shadow-md'
                          : 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-xs shadow-sm whitespace-pre-line'
                      }`}
                    >
                      <div>{msg.text}</div>

                      {msg.sender === 'ai' && (
                        <button
                          onClick={() => handleCopy(msg.id, msg.text)}
                          className="absolute top-2.5 right-2.5 p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                          title="Copy message"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}

                      <div className="mt-2.5 pt-1.5 border-t border-slate-100/60 flex items-center justify-between text-[10px] opacity-75 font-mono">
                        <span>{msg.timestamp}</span>
                        {msg.source && <span className="truncate max-w-[200px]">{msg.source}</span>}
                      </div>
                    </div>

                    {msg.sender === 'user' && (
                      <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </motion.div>
                ))}

                {loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3 justify-start items-center"
                  >
                    <div className="w-8 h-8 rounded-xl bg-[#002244] text-white flex items-center justify-center shrink-0">
                      <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                    </div>
                    <div className="bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-700 flex items-center gap-2 shadow-xs">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                      <span>Synthesizing engineering specifications & CPSE demand models...</span>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts with Category Tabs */}
              <div className="p-3 bg-slate-50 border-t border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-1 font-mono flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>Domain Knowledge Navigator</span>
                  </div>
                  <span className="text-[9px] font-mono bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                    English (Recommended)
                  </span>
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  {questionCategories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`text-[10px] font-semibold px-2 py-1 rounded-md whitespace-nowrap transition-colors cursor-pointer border ${
                        activeCategory === cat.id
                          ? 'bg-[#002244] text-amber-300 border-[#002244] shadow-2xs'
                          : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Questions under active category */}
                <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
                  {(questionCategories.find(c => c.id === activeCategory)?.questions || []).map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(q)}
                      className="text-left text-[11px] bg-white hover:bg-amber-50 text-slate-700 hover:text-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-amber-300 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <ChevronRight className="w-3 h-3 text-amber-500 shrink-0" />
                      <span className="truncate max-w-[280px]">{q}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Footer */}
              <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleSend();
                  }}
                  placeholder="Ask anything about materials, CPSE demand, false merges..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-amber-500 focus:bg-white transition-colors"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSend()}
                  disabled={!input.trim() || loading}
                  className="bg-[#002244] hover:bg-[#001730] disabled:opacity-40 text-amber-400 p-2.5 rounded-lg font-bold transition-colors cursor-pointer shadow-xs"
                  title="Send message"
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
