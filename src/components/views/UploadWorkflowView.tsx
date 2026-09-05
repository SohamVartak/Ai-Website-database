import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { ProgressBar } from '../ui/ProgressBar';
import { AnimatedButton } from '../ui/AnimatedButton';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Database,
  Layers,
  Sparkles,
  Building,
  RefreshCw,
  FileText,
  Check,
  Cpu,
  ShieldCheck
} from 'lucide-react';

export const UploadWorkflowView: React.FC = () => {
  const { cpses, addToast, setCurrentTab } = useApp();

  const [step, setStep] = useState<number>(1);
  const [selectedCPSE, setSelectedCPSE] = useState<string>('IOCL');
  const [ingestionType, setIngestionType] = useState<'File' | 'API' | 'ERP'>('File');
  const [fileName, setFileName] = useState<string>('IOCL_Refinery_Stores_August2026.xlsx');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStage, setProcessingStage] = useState<number>(0);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const processingStages = [
    { title: 'Parsing Raw Input Rows', desc: 'Validating SAP/Oracle syntax & encodings' },
    { title: 'Attribute Extraction', desc: 'Running NER for dimensions, metallurgy & standards' },
    { title: 'Spec Normalization', desc: 'Expanding abbreviations & unifying metric UOMs' },
    { title: 'Candidate Generation', desc: 'Dual-encoder embeddings & Spec-Guard indexing' }
  ];

  const handleRunIngestion = () => {
    setIsProcessing(true);
    setProcessingStage(0);
    setUploadProgress(15);

    setTimeout(() => {
      setProcessingStage(1);
      setUploadProgress(45);
    }, 700);

    setTimeout(() => {
      setProcessingStage(2);
      setUploadProgress(75);
    }, 1500);

    setTimeout(() => {
      setProcessingStage(3);
      setUploadProgress(95);
    }, 2200);

    setTimeout(() => {
      setUploadProgress(100);
      setIsProcessing(false);
      setStep(6);
      addToast({
        title: 'Batch Ingestion Completed',
        message: '12,450 records ingested and normalized from ' + selectedCPSE,
        type: 'success'
      });
    }, 2800);
  };

  const schemaMapping = [
    { sourceCol: 'MAT_CODE_LOCAL', mappedTo: 'local_material_code', confidence: 100, status: 'Mapped' },
    { sourceCol: 'ITEM_DESCRIPTION_RAW', mappedTo: 'raw_description', confidence: 99, status: 'Mapped' },
    { sourceCol: 'BASE_UOM', mappedTo: 'uom', confidence: 98, status: 'Mapped' },
    { sourceCol: 'MAT_GROUP', mappedTo: 'category', confidence: 94, status: 'Mapped' },
    { sourceCol: 'ANNUAL_CONSUMPTION', mappedTo: 'annual_demand', confidence: 96, status: 'Mapped' },
    { sourceCol: 'LAST_PURCHASE_PRICE', mappedTo: 'unit_price', confidence: 95, status: 'Mapped' },
    { sourceCol: 'SPEC_TEXT_LONG', mappedTo: 'technical_specifications', confidence: 91, status: 'Mapped' }
  ];

  const sampleRows = [
    {
      code: 'BOLT-7821',
      raw: 'HEX BOLT STAINLESS STEEL 10MM X 50MM 304',
      norm: 'Stainless Steel Hex Bolt M10 × 50 mm SS304 (ISO 4014)',
      spec: 'SS304 | M10 | 50mm | ISO 4014',
      uom: 'NOS',
      status: 'Valid'
    },
    {
      code: 'VLV-GT-04-150',
      raw: 'VALVE GATE 4INCH 150# FLGD WCB OS&Y API600',
      norm: 'Gate Valve, Flanged Class 150 (4" DN100 WCB API 600)',
      spec: 'ASTM A216 WCB | 4" (DN100) | Class 150 | API 600',
      uom: 'NOS',
      status: 'Valid'
    },
    {
      code: 'GSK-SW-4IN',
      raw: 'GASKET TEFLON 2INCH [UOM: PKT]',
      norm: 'PTFE Flat Gasket 2 Inch',
      spec: 'PTFE | 2 Inch | Non-Standard UOM PKT Flagged',
      uom: 'PKT',
      status: 'Warning: Invalid UOM'
    }
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1400px] mx-auto">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
              Data Ingestion Wizard
            </span>
            <span className="text-xs text-slate-400 font-mono">Step {step} of 6</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight mt-1">
            Multi-CPSE Catalog Ingestion & Normalization
          </h1>
          <p className="text-xs text-slate-300">
            Ingest heterogeneous ERP material masters, map attributes, and standardize nomenclature.
          </p>
        </div>
      </div>

      {/* Stepper Progress Indicator */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
        <div className="flex items-center justify-between overflow-x-auto gap-2 text-xs">
          {[
            { num: 1, label: 'Source' },
            { num: 2, label: 'Upload' },
            { num: 3, label: 'Schema Mapping' },
            { num: 4, label: 'Validation' },
            { num: 5, label: 'Normalization' },
            { num: 6, label: 'Pipeline Execution' }
          ].map(s => (
            <div
              key={s.num}
              onClick={() => s.num < step && setStep(s.num)}
              className={`flex items-center gap-2 cursor-pointer transition-all ${
                step === s.num
                  ? 'text-emerald-700 font-bold'
                  : step > s.num
                  ? 'text-emerald-600 font-semibold'
                  : 'text-slate-400'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all ${
                  step === s.num
                    ? 'bg-emerald-600 text-white shadow-xs scale-110'
                    : step > s.num
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {step > s.num ? '✓' : s.num}
              </div>
              <span className="whitespace-nowrap">{s.label}</span>
              {s.num < 6 && <ChevronRight className="w-3.5 h-3.5 text-slate-300 ml-1 hidden sm:inline" />}
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1: Select Source CPSE */}
      {step === 1 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div>
            <h2 className="text-base font-bold text-slate-900">Select Target CPSE & Ingestion Method</h2>
            <p className="text-xs text-slate-500">Choose the public sector enterprise contributing this dataset batch.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {cpses.map(c => (
              <div
                key={c.id}
                onClick={() => setSelectedCPSE(c.code)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedCPSE === c.code
                    ? 'border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{c.code}</span>
                  <span className="text-[10px] font-mono text-slate-500">{c.sector}</span>
                </div>
                <div className="text-xs text-slate-600 mt-1 truncate">{c.name}</div>
                <div className="mt-3 text-[11px] text-slate-400 font-mono">
                  {c.recordsUploaded.toLocaleString()} records uploaded
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => setStep(2)}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Continue to File Upload</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Upload File / Drag and Drop */}
      {step === 2 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div>
            <h2 className="text-base font-bold text-slate-900">Upload Dataset for {selectedCPSE}</h2>
            <p className="text-xs text-slate-500">Supports CSV, XLSX, XML, and SAP IDoc master dumps.</p>
          </div>

          <label
            onDragOver={e => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={e => {
              e.preventDefault();
              setIsDragging(false);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                setFileName(e.dataTransfer.files[0].name);
                addToast({
                  type: 'info',
                  title: 'File Attached',
                  message: `Loaded ${e.dataTransfer.files[0].name}`
                });
              }
            }}
            className={`border-2 border-dashed rounded-2xl p-10 text-center space-y-3 transition-all cursor-pointer block ${
              isDragging
                ? 'border-emerald-500 bg-emerald-50/70 scale-[1.01] shadow-xs'
                : 'border-slate-300 hover:border-emerald-600 bg-slate-50/50 hover:bg-emerald-50/20'
            }`}
          >
            <input
              type="file"
              className="hidden"
              accept=".csv,.xlsx,.xls,.xml"
              onChange={e => {
                if (e.target.files && e.target.files[0]) {
                  setFileName(e.target.files[0].name);
                  addToast({
                    type: 'info',
                    title: 'File Selected',
                    message: `Loaded ${e.target.files[0].name}`
                  });
                }
              }}
            />
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto transition-colors ${
              isDragging ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
            }`}>
              <UploadCloud className="w-7 h-7" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">
                Drag & drop your CPSE master spreadsheet here
              </div>
              <div className="text-xs text-slate-500 mt-1">or click anywhere to browse local filesystem</div>
            </div>
            <div className="inline-block bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-700 shadow-2xs">
              Selected: <strong>{fileName}</strong> (4.8 MB)
            </div>
          </label>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setStep(1)}
              className="text-xs text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Auto-Map Schema</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Schema Mapping */}
      {step === 3 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Automated Schema Mapping</h2>
              <p className="text-xs text-slate-500">AI identified 7 columns and mapped to Bharat Material Schema.</p>
            </div>
            <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg border border-emerald-200">
              100% Columns Mapped
            </span>
          </div>

          <div className="overflow-hidden border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[10px] font-mono text-slate-500 uppercase border-b border-slate-200">
                <tr>
                  <th className="p-3 font-semibold">Source CPSE Column</th>
                  <th className="p-3 font-semibold">Target BMG Standard Attribute</th>
                  <th className="p-3 font-semibold">Match Confidence</th>
                  <th className="p-3 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {schemaMapping.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-slate-800">{item.sourceCol}</td>
                    <td className="p-3 font-mono text-slate-900">
                      <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                        {item.mappedTo}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-semibold text-emerald-600">
                      {item.confidence}%
                    </td>
                    <td className="p-3 text-right">
                      <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setStep(2)}
              className="text-xs text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={() => setStep(4)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Validate Dataset</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Validation Engine */}
      {step === 4 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div>
            <h2 className="text-base font-bold text-slate-900">Data Quality & Validation Audit</h2>
            <p className="text-xs text-slate-500">Checking for missing grades, invalid UOMs, and abbreviations.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-center">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
              <div className="text-2xl font-bold text-emerald-700">12,000</div>
              <div className="text-xs text-emerald-800 mt-1">Valid Records (96.4%)</div>
            </div>
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <div className="text-2xl font-bold text-amber-700">450</div>
              <div className="text-xs text-amber-800 mt-1">Non-Standard UOM (PKT)</div>
            </div>
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl">
              <div className="text-2xl font-bold text-rose-700">0</div>
              <div className="text-xs text-rose-800 mt-1">Fatal Errors</div>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
            <div className="font-bold text-slate-900">Automated Normalization Prepared:</div>
            <div>• 450 PKT units will be converted to discrete NOS units.</div>
            <div>• Abbreviation "SS" will expand to "Stainless Steel".</div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setStep(3)}
              className="text-xs text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={() => setStep(5)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Preview Normalization</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Normalization Preview & Processing Stages */}
      {step === 5 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div>
            <h2 className="text-base font-bold text-slate-900">Specification Normalization Preview</h2>
            <p className="text-xs text-slate-500">Live preview of standardized engineering strings before database commit.</p>
          </div>

          {/* Processing Stages Animated Drawer / Progress Bar */}
          {isProcessing ? (
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-emerald-600 animate-spin" />
                    Executing Ingestion & AI Normalization Mesh...
                  </span>
                  <span className="font-mono font-bold text-emerald-700">{uploadProgress}%</span>
                </div>
                <ProgressBar
                  value={uploadProgress}
                  max={100}
                  variant="emerald"
                  size="md"
                />
              </div>

              {/* Stage Indicators */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
                {processingStages.map((st, idx) => {
                  const isCompleted = processingStage > idx;
                  const isCurrent = processingStage === idx;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0.6 }}
                      animate={{
                        opacity: isCompleted || isCurrent ? 1 : 0.4,
                        scale: isCurrent ? 1.02 : 1
                      }}
                      className={`p-3 rounded-xl border text-xs transition-all ${
                        isCompleted
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                          : isCurrent
                          ? 'bg-white border-emerald-500 shadow-sm ring-1 ring-emerald-500 text-slate-900'
                          : 'bg-slate-100/60 border-slate-200 text-slate-500'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-bold mb-1">
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : isCurrent ? (
                          <RefreshCw className="w-4 h-4 text-emerald-600 animate-spin shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[10px] text-slate-400 font-mono">
                            {idx + 1}
                          </div>
                        )}
                        <span className="truncate">{st.title}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-tight">{st.desc}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {sampleRows.map((row, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-slate-900">{row.code}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      row.status.includes('Warning')
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {row.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="bg-white p-2 rounded border border-slate-200">
                      <span className="text-slate-400 text-[10px] block font-mono">Raw Input Description</span>
                      <span className="font-mono text-slate-800">{row.raw}</span>
                    </div>
                    <div className="bg-emerald-50/60 p-2 rounded border border-emerald-200">
                      <span className="text-emerald-700 text-[10px] block font-mono">Standardized Canonical Name</span>
                      <span className="font-bold text-slate-900">{row.norm}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setStep(4)}
              disabled={isProcessing}
              className="text-xs text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <AnimatedButton
              onClick={handleRunIngestion}
              disabled={isProcessing}
              isLoading={isProcessing}
              variant="success"
              className="px-6 py-2.5 font-bold text-xs"
              icon={<Database className="w-4 h-4" />}
            >
              {isProcessing ? 'Executing Pipeline...' : 'Execute Ingestion Pipeline'}
            </AnimatedButton>
          </div>
        </div>
      )}

      {/* STEP 6: Complete with Smooth Fade-in Summary */}
      {step === 6 && (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs space-y-6"
        >
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-2xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Batch Ingestion Successful!</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              12,450 records from {selectedCPSE} have been ingested, parsed, and indexed for national canonical matching.
            </p>
          </div>

          {/* Success Summary KPI Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-2">
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-center">
              <span className="text-[10px] uppercase font-mono font-bold text-slate-500 block">
                Total Ingested
              </span>
              <span className="text-2xl font-bold text-slate-900 font-mono mt-1 block">
                12,450
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold">100% Processed</span>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-center">
              <span className="text-[10px] uppercase font-mono font-bold text-emerald-700 block">
                Safe Matches
              </span>
              <span className="text-2xl font-bold text-emerald-900 font-mono mt-1 block">
                9,240
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold">74.2% Auto-Concordant</span>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-center">
              <span className="text-[10px] uppercase font-mono font-bold text-amber-700 block">
                Ambiguous Queued
              </span>
              <span className="text-2xl font-bold text-amber-900 font-mono mt-1 block">
                1,180
              </span>
              <span className="text-[10px] text-amber-700 font-semibold">9.5% Sent to Review</span>
            </div>

            <div className="bg-slate-100 border border-slate-200 p-4 rounded-xl text-center">
              <span className="text-[10px] uppercase font-mono font-bold text-slate-600 block">
                Duplicates Prevented
              </span>
              <span className="text-2xl font-bold text-slate-900 font-mono mt-1 block">
                2,030
              </span>
              <span className="text-[10px] text-slate-600 font-semibold">16.3% Cleaned</span>
            </div>
          </div>

          <div className="flex justify-center gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentTab('ai-match')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
            >
              <span>View Generated AI Candidates</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setStep(1);
                setUploadProgress(0);
              }}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-4 py-2.5 rounded-xl text-xs cursor-pointer transition-colors"
            >
              Ingest Another Batch
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
