import React, { useMemo, useState } from 'react';
import * as XLSX from 'xlsx';
import { motion } from 'motion/react';
import { supabase } from '../../../lib/supabase';
import { useApp } from '../../context/AppContext';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Database,
  Sparkles,
  Building,
  RefreshCw,
  Cpu,
  ShieldCheck,
  XCircle,
} from 'lucide-react';

/* =========================================================
   TYPES
========================================================= */

interface SourceRow {
  [key: string]: string;
}

interface Mapping {
  sourceColumn: string;
  targetColumn:
    | 'material_number'
    | 'description'
    | 'specifications'
    | 'category'
    | 'unmapped';
  confidence: number;
  reason: string;
}

interface StandardizedRow {
  company: string;
  material_number: string | null;
  description: string | null;
  specifications: string | null;
  category: string | null;
}

interface NormalizationInputRow {
  sourceIndex: number;
  material_number: string | null;
  description: string | null;
  specifications: string | null;
  category: string | null;
}

/* =========================================================
   CONSTANTS
========================================================= */

const STANDARD_FIELDS = [
  'material_number',
  'description',
  'specifications',
  'category',
] as const;

const NORMALIZATION_BATCH_SIZE = 20;

/* =========================================================
   COMPONENT
========================================================= */

export const UploadWorkflowView: React.FC = () => {
  const {
    cpses,
    addToast,
    setCurrentTab,
  } = useApp();

  /* =======================================================
     WIZARD
  ======================================================= */

  const [step, setStep] = useState(1);

  const [selectedCPSE, setSelectedCPSE] =
    useState('IOCL');

  /* =======================================================
     FILE
  ======================================================= */

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [fileName, setFileName] =
    useState('');

  const [isDragging, setIsDragging] =
    useState(false);

  /* =======================================================
     RAW DATA
  ======================================================= */

  const [sourceHeaders, setSourceHeaders] =
    useState<string[]>([]);

  const [sourceRows, setSourceRows] =
    useState<SourceRow[]>([]);

  /* =======================================================
     AI MAPPING
  ======================================================= */

  const [mappings, setMappings] =
    useState<Mapping[]>([]);

  /* =======================================================
     STANDARDIZED DATA
  ======================================================= */

  const [standardizedRows, setStandardizedRows] =
    useState<StandardizedRow[]>([]);

  /* =======================================================
     PROCESSING
  ======================================================= */

  const [isAnalyzing, setIsAnalyzing] =
    useState(false);

  const [isNormalizing, setIsNormalizing] =
    useState(false);

  const [normalizationProgress, setNormalizationProgress] =
    useState(0);

  const [isImporting, setIsImporting] =
    useState(false);

  /* =======================================================
     VALIDATION
  ======================================================= */

  const [validationErrors, setValidationErrors] =
    useState<string[]>([]);

  const [validationWarnings, setValidationWarnings] =
    useState<string[]>([]);

  /* =======================================================
     IMPORT RESULT
  ======================================================= */

  const [insertedCount, setInsertedCount] =
    useState(0);

  /* =========================================================
     COMPANY COUNTS
  ========================================================= */

  const companyRecords = useMemo(() => {
    return cpses.map((cpse) => ({
      ...cpse,
      recordsUploaded:
        cpse.recordsUploaded || 0,
    }));
  }, [cpses]);

  /* =========================================================
     CSV PARSER
  ========================================================= */

  const parseCSV = (
    text: string
  ): SourceRow[] => {
    const rows: string[][] = [];

    let currentRow: string[] = [];
    let currentValue = '';
    let insideQuotes = false;

    for (
      let i = 0;
      i < text.length;
      i++
    ) {
      const char = text[i];
      const next = text[i + 1];

      if (
        char === '"' &&
        insideQuotes &&
        next === '"'
      ) {
        currentValue += '"';
        i++;
        continue;
      }

      if (char === '"') {
        insideQuotes = !insideQuotes;
        continue;
      }

      if (
        char === ',' &&
        !insideQuotes
      ) {
        currentRow.push(
          currentValue.trim()
        );

        currentValue = '';
        continue;
      }

      if (
        (char === '\n' ||
          char === '\r') &&
        !insideQuotes
      ) {
        if (
          currentValue.length > 0 ||
          currentRow.length > 0
        ) {
          currentRow.push(
            currentValue.trim()
          );

          rows.push(currentRow);

          currentRow = [];
          currentValue = '';
        }

        if (
          char === '\r' &&
          next === '\n'
        ) {
          i++;
        }

        continue;
      }

      currentValue += char;
    }

    if (
      currentValue.length > 0 ||
      currentRow.length > 0
    ) {
      currentRow.push(
        currentValue.trim()
      );

      rows.push(currentRow);
    }

    if (rows.length === 0) {
      setSourceHeaders([]);
      return [];
    }

    const headers = rows[0].map(
      (header, index) => {
        const cleaned =
          header.trim();

        return (
          cleaned ||
          `Unnamed Column ${index + 1}`
        );
      }
    );

    setSourceHeaders(headers);

    return rows
      .slice(1)
      .filter((row) =>
        row.some(
          (value) =>
            value.trim() !== ''
        )
      )
      .map((row) => {
        const objectRow: SourceRow = {};

        headers.forEach(
          (header, index) => {
            objectRow[header] =
              row[index] || '';
          }
        );

        return objectRow;
      });
  };

  /* =========================================================
     EXCEL HEADER SCORING
  ========================================================= */

  const scoreHeaderRow = (
    row: unknown[]
  ): number => {
    const keywords = [
      'material',
      'material code',
      'material no',
      'material number',
      'material description',
      'material desc',
      'item',
      'item no',
      'item number',
      'item code',
      'item description',
      'description',
      'short text',
      'long text',
      'specification',
      'specifications',
      'technical specification',
      'category',
      'material group',
      'group',
      'uom',
      'unit',
      'part',
      'part number',
      'part no',
      'code',
      'sap',
    ];

    const cells = row.map((cell) =>
      String(cell ?? '')
        .trim()
        .toLowerCase()
    );

    let score = 0;

    const nonEmptyCells =
      cells.filter(
        (cell) => cell !== ''
      ).length;

    if (
      nonEmptyCells >= 2
    ) {
      score += Math.min(
        nonEmptyCells,
        8
      );
    }

    cells.forEach((cell) => {
      if (!cell) return;

      const exact =
        keywords.some(
          (keyword) =>
            cell === keyword
        );

      const contains =
        keywords.some(
          (keyword) =>
            cell.includes(keyword)
        );

      if (exact) {
        score += 5;
      } else if (contains) {
        score += 2;
      }
    });

    if (
      cells.length === 1 &&
      cells[0].length > 20
    ) {
      score -= 5;
    }

    return score;
  };

  /* =========================================================
     EXCEL PARSER
  ========================================================= */

  const parseExcel = async (
    file: File
  ): Promise<SourceRow[]> => {
    const arrayBuffer =
      await file.arrayBuffer();

    const workbook =
      XLSX.read(arrayBuffer, {
        type: 'array',
        cellDates: false,
        raw: false,
      });

    const firstSheetName =
      workbook.SheetNames[0];

    if (!firstSheetName) {
      throw new Error(
        'The Excel workbook does not contain any worksheets.'
      );
    }

    const worksheet =
      workbook.Sheets[
        firstSheetName
      ];

    const rawRows =
      XLSX.utils.sheet_to_json<
        unknown[]
      >(worksheet, {
        header: 1,
        defval: '',
        raw: false,
      });

    if (
      !rawRows ||
      rawRows.length === 0
    ) {
      setSourceHeaders([]);
      return [];
    }

    /* =====================================================
       FIND REAL HEADER ROW
    ===================================================== */

    let bestHeaderIndex = 0;
    let bestScore = -Infinity;

    const searchLimit = Math.min(
      rawRows.length,
      30
    );

    for (
      let rowIndex = 0;
      rowIndex < searchLimit;
      rowIndex++
    ) {
      const score =
        scoreHeaderRow(
          rawRows[rowIndex]
        );

      if (score > bestScore) {
        bestScore = score;
        bestHeaderIndex =
          rowIndex;
      }
    }

    const headerRow =
      rawRows[bestHeaderIndex];

    /* =====================================================
       BUILD CLEAN UNIQUE HEADERS
    ===================================================== */

    const headers: string[] = [];
    const usedHeaders =
      new Set<string>();

    headerRow.forEach(
      (cell, index) => {
        let header =
          String(cell ?? '')
            .trim();

        if (!header) {
          header =
            `Unnamed Column ${
              index + 1
            }`;
        }

        let uniqueHeader =
          header;

        let counter = 2;

        while (
          usedHeaders.has(
            uniqueHeader
          )
        ) {
          uniqueHeader =
            `${header}_${counter}`;

          counter++;
        }

        usedHeaders.add(
          uniqueHeader
        );

        headers.push(
          uniqueHeader
        );
      }
    );

    setSourceHeaders(headers);

    /* =====================================================
       CONVERT DATA ROWS
    ===================================================== */

    const dataRows =
      rawRows
        .slice(
          bestHeaderIndex + 1
        )
        .filter((row) =>
          row.some(
            (value) =>
              String(
                value ?? ''
              ).trim() !== ''
          )
        )
        .map((row) => {
          const objectRow: SourceRow = {};

          headers.forEach(
            (header, columnIndex) => {
              objectRow[header] =
                String(
                  row[
                    columnIndex
                  ] ?? ''
                ).trim();
            }
          );

          return objectRow;
        });

    return dataRows;
  };

  /* =========================================================
     HANDLE FILE
  ========================================================= */

  const handleFile = async (
    file: File
  ) => {
    const extension =
      file.name
        .toLowerCase()
        .split('.')
        .pop() || '';

    const supportedExtensions = [
      'csv',
      'xlsx',
      'xls',
    ];

    if (
      !supportedExtensions.includes(
        extension
      )
    ) {
      addToast({
        title:
          'Unsupported File',
        message:
          'Please upload an Excel (.xlsx/.xls) or CSV file.',
        type: 'error',
      });

      return;
    }

    setSelectedFile(file);
    setFileName(file.name);

    try {
      let rows: SourceRow[] = [];

      if (
        extension === 'csv'
      ) {
        const text =
          await file.text();

        rows =
          parseCSV(text);
      } else {
        rows =
          await parseExcel(
            file
          );
      }

      if (rows.length === 0) {
        throw new Error(
          'No usable data rows were found in the uploaded file.'
        );
      }

      setSourceRows(rows);

      setMappings([]);

      setStandardizedRows(
        []
      );

      setValidationErrors(
        []
      );

      setValidationWarnings(
        []
      );

      setInsertedCount(0);

      setNormalizationProgress(
        0
      );

      addToast({
        title:
          'Dataset Loaded',
        message: `${rows.length.toLocaleString()} rows detected from ${file.name}`,
        type: 'success',
      });
    } catch (error) {
      console.error(
        'File parsing error:',
        error
      );

      setSelectedFile(null);
      setFileName('');
      setSourceRows([]);
      setSourceHeaders([]);

      addToast({
        title:
          'File Read Failed',
        message:
          error instanceof Error
            ? error.message
            : 'The uploaded file could not be read.',
        type: 'error',
      });
    }
  };

  /* =========================================================
     AI SCHEMA MAPPING
  ========================================================= */

  const analyzeSchema =
    async (): Promise<boolean> => {
      if (
        !selectedFile ||
        sourceRows.length === 0
      ) {
        addToast({
          title: 'No Data',
          message:
            'Upload a CSV or Excel file containing material records first.',
          type: 'warning',
        });

        return false;
      }

      setIsAnalyzing(true);

      try {
        const sampleRows =
          sourceRows.slice(
            0,
            8
          );

        const response =
          await fetch(
            '/api/analyze-csv',
            {
              method: 'POST',

              headers: {
                'Content-Type':
                  'application/json',
              },

              body: JSON.stringify({
                company:
                  selectedCPSE,

                headers:
                  sourceHeaders,

                sampleRows,
              }),
            }
          );

        if (!response.ok) {
          throw new Error(
            `AI schema analysis failed (${response.status})`
          );
        }

        const result =
          await response.json();

        const aiMappings =
          Array.isArray(
            result.mappings
          )
            ? result.mappings
            : [];

        if (
          aiMappings.length ===
          0
        ) {
          throw new Error(
            'The AI endpoint returned no mappings.'
          );
        }

        setMappings(
          aiMappings
        );

        setStep(3);

        addToast({
          title:
            'AI Schema Analysis Complete',

          message: `${aiMappings.length} source columns analyzed.`,

          type: 'success',
        });

        return true;
      } catch (error) {
        console.error(
          'AI schema mapping error:',
          error
        );

        const fallback =
          createFallbackMappings(
            sourceHeaders
          );

        setMappings(
          fallback
        );

        setStep(3);

        addToast({
          title:
            'Fallback Mapping Used',

          message:
            'The AI schema service was unavailable, so local schema detection was used.',

          type: 'warning',
        });

        return true;
      } finally {
        setIsAnalyzing(false);
      }
    };

  /* =========================================================
     BUILD BASIC MAPPED ROWS
  ========================================================= */

  const buildMappedRows =
    (): StandardizedRow[] => {
      const mappingLookup: Record<
        string,
        string
      > = {};

      mappings.forEach(
        (mapping) => {
          if (
            mapping.targetColumn &&
            mapping.targetColumn !==
              'unmapped'
          ) {
            mappingLookup[
              mapping.sourceColumn
            ] =
              mapping.targetColumn;
          }
        }
      );

      return sourceRows.map(
        (row) => {
          const standardized: StandardizedRow =
            {
              company:
                selectedCPSE,

              material_number:
                null,

              description:
                null,

              specifications:
                null,

              category:
                null,
            };

          Object.entries(
            row
          ).forEach(
            ([
              sourceColumn,
              value,
            ]) => {
              const target =
                mappingLookup[
                  sourceColumn
                ];

              if (!target) {
                return;
              }

              const cleaned =
                value.trim();

              if (
                target ===
                'material_number'
              ) {
                standardized.material_number =
                  cleaned ||
                  null;
              }

              if (
                target ===
                'description'
              ) {
                standardized.description =
                  cleaned ||
                  null;
              }

              if (
                target ===
                'specifications'
              ) {
                standardized.specifications =
                  cleaned ||
                  null;
              }

              if (
                target ===
                'category'
              ) {
                standardized.category =
                  cleaned ||
                  null;
              }
            }
          );

          return standardized;
        }
      );
    };

  /* =========================================================
     AI NORMALIZATION
  ========================================================= */

  const normalizeDataWithAI =
    async (
      rows: StandardizedRow[]
    ): Promise<
      StandardizedRow[]
    > => {
      if (
        rows.length === 0
      ) {
        return [];
      }

      setIsNormalizing(true);
      setNormalizationProgress(
        0
      );

      const normalizedRows: StandardizedRow[] =
        new Array(
          rows.length
        );

      const totalBatches =
        Math.ceil(
          rows.length /
            NORMALIZATION_BATCH_SIZE
        );

      try {
        for (
          let batchStart = 0,
          batchNumber = 1;
          batchStart <
          rows.length;
          batchStart +=
            NORMALIZATION_BATCH_SIZE,
          batchNumber++
        ) {
          const batch =
            rows.slice(
              batchStart,
              batchStart +
                NORMALIZATION_BATCH_SIZE
            );

          const payloadRows: NormalizationInputRow[] =
            batch.map(
              (
                row,
                localIndex
              ) => ({
                sourceIndex:
                  batchStart +
                  localIndex,

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

          const response =
            await fetch(
              '/api/normalize-materials',
              {
                method: 'POST',

                headers: {
                  'Content-Type':
                    'application/json',
                },

                body: JSON.stringify({
                  company:
                    selectedCPSE,

                  rows:
                    payloadRows,
                }),
              }
            );

          if (!response.ok) {
            let message =
              `AI normalization failed (${response.status})`;

            try {
              const errorBody =
                await response.json();

              if (
                errorBody?.error
              ) {
                message =
                  errorBody.error;
              }
            } catch {
              /* Ignore JSON parsing failure */
            }

            throw new Error(
              message
            );
          }

          const result =
            await response.json();

          if (
            !Array.isArray(
              result.rows
            )
          ) {
            throw new Error(
              'AI normalization returned an invalid rows array.'
            );
          }

          if (
            result.rows.length !==
            batch.length
          ) {
            throw new Error(
              `AI normalized ${result.rows.length} rows instead of ${batch.length}.`
            );
          }

          result.rows.forEach(
            (
              normalized:
                StandardizedRow &
                  {
                    sourceIndex?: number;
                  },
              localIndex: number
            ) => {
              const sourceIndex =
                Number.isFinite(
                  Number(
                    normalized.sourceIndex
                  )
                )
                  ? Number(
                      normalized.sourceIndex
                    )
                  : batchStart +
                    localIndex;

              /*
               * Never allow the AI to change
               * the selected company.
               */
              normalizedRows[
                sourceIndex
              ] = {
                company:
                  selectedCPSE,

                material_number:
                  nullableClean(
                    normalized.material_number
                  ),

                description:
                  nullableClean(
                    normalized.description
                  ),

                specifications:
                  nullableClean(
                    normalized.specifications
                  ),

                category:
                  nullableClean(
                    normalized.category
                  ),
              };
            }
          );

          const progress =
            Math.round(
              (batchNumber /
                totalBatches) *
                100
            );

          setNormalizationProgress(
            progress
          );
        }

        /*
         * Safety check:
         * no row may be silently lost.
         */
        for (
          let i = 0;
          i < normalizedRows.length;
          i++
        ) {
          if (
            !normalizedRows[i]
          ) {
            throw new Error(
              `AI normalization did not return a result for row ${i + 1}.`
            );
          }
        }

        setNormalizationProgress(
          100
        );

        return normalizedRows;
      } finally {
        setIsNormalizing(false);
      }
    };

  /* =========================================================
     NORMALIZE + VALIDATE
  ========================================================= */

  const normalizeAndValidate =
    async () => {
      if (
        mappings.length ===
        0
      ) {
        addToast({
          title:
            'No Mapping Available',
          message:
            'Run AI schema mapping before normalization.',
          type: 'warning',
        });

        return;
      }

      try {
        /*
         * First create a basic structure
         * from the source-to-target mapping.
         */
        const mappedRows =
          buildMappedRows();

        /*
         * Then send actual records to Gemini
         * in batches.
         */
        addToast({
          title:
            'AI Normalization Started',

          message: `Processing ${mappedRows.length.toLocaleString()} material records in batches of ${NORMALIZATION_BATCH_SIZE}.`,

          type: 'info',
        });

        const normalized =
          await normalizeDataWithAI(
            mappedRows
          );

        setStandardizedRows(
          normalized
        );

        /*
         * Validate the AI-normalized result.
         */
        runValidation(
          normalized
        );
      } catch (error) {
        console.error(
          'AI normalization error:',
          error
        );

        setValidationErrors(
          []
        );

        setValidationWarnings(
          []
        );

        addToast({
          title:
            'AI Normalization Failed',

          message:
            error instanceof Error
              ? error.message
              : 'The material data could not be normalized.',

          type: 'error',
        });
      }
    };

  /* =========================================================
     VALIDATION
  ========================================================= */

  const runValidation = (
    rows: StandardizedRow[]
  ) => {
    const errors: string[] =
      [];

    const warnings: string[] =
      [];

    const materialNumbers =
      new Map<
        string,
        number[]
      >();

    rows.forEach(
      (row, index) => {
        const rowNumber =
          index + 2;

        /*
         * Completely unusable record
         */
        if (
          !row.material_number &&
          !row.description &&
          !row.specifications
        ) {
          errors.push(
            `Row ${rowNumber}: Material number, description and specifications are all empty.`
          );
        }

        /*
         * Missing material number
         */
        if (
          !row.material_number
        ) {
          warnings.push(
            `Row ${rowNumber}: Material number is missing.`
          );
        }

        /*
         * Missing description
         */
        if (!row.description) {
          warnings.push(
            `Row ${rowNumber}: Description is missing.`
          );
        }

        /*
         * Missing specifications
         *
         * This is a warning, not an error.
         * Some company datasets simply don't
         * provide separate technical specs.
         */
        if (
          !row.specifications
        ) {
          warnings.push(
            `Row ${rowNumber}: Specifications are missing.`
          );
        }

        /*
         * Missing category
         */
        if (!row.category) {
          warnings.push(
            `Row ${rowNumber}: Category is missing.`
          );
        }

        /*
         * Duplicate material number tracking
         */
        if (
          row.material_number
        ) {
          const key =
            row.material_number
              .trim()
              .toLowerCase();

          const existing =
            materialNumbers.get(
              key
            ) || [];

          existing.push(
            rowNumber
          );

          materialNumbers.set(
            key,
            existing
          );
        }
      }
    );

    /*
     * Report duplicates as warnings
     * instead of blocking the entire file.
     */
    materialNumbers.forEach(
      (
        rowNumbers,
        materialNumber
      ) => {
        if (
          rowNumbers.length > 1
        ) {
          warnings.push(
            `Duplicate material number "${materialNumber}" found in rows ${rowNumbers.join(
              ', '
            )}.`
          );
        }
      }
    );

    setValidationErrors(
      errors
    );

    setValidationWarnings(
      warnings
    );

    setStep(4);

    if (errors.length === 0) {
      addToast({
        title:
          'AI Validation Complete',

        message:
          warnings.length > 0
            ? `${warnings.length} warning(s) found.`
            : 'Dataset passed validation without blocking errors.',

        type:
          warnings.length > 0
            ? 'warning'
            : 'success',
      });
    } else {
      addToast({
        title:
          'Validation Issues Found',

        message: `${errors.length} blocking error(s) found.`,

        type: 'error',
      });
    }
  };

  /* =========================================================
     IMPORT INTO SUPABASE
  ========================================================= */

  const importToSupabase =
    async () => {
      if (
        standardizedRows.length ===
        0
      ) {
        addToast({
          title:
            'Nothing to Import',

          message:
            'There are no standardized records ready for import.',

          type: 'warning',
        });

        return;
      }

      if (
        validationErrors.length >
        0
      ) {
        addToast({
          title:
            'Validation Failed',

          message:
            'Fix the validation errors before importing.',

          type: 'error',
        });

        return;
      }

      setIsImporting(true);

      try {
        const chunkSize =
          500;

        let inserted = 0;

        for (
          let start = 0;
          start <
          standardizedRows.length;
          start +=
            chunkSize
        ) {
          const chunk =
            standardizedRows.slice(
              start,
              start +
                chunkSize
            );

          const { error } =
            await supabase
              .from('materials')
              .insert(
                chunk
              );

          if (error) {
            throw error;
          }

          inserted +=
            chunk.length;
        }

        setInsertedCount(
          inserted
        );

        setStep(6);

        addToast({
          title:
            'Database Updated',

          message: `${inserted.toLocaleString()} material records added to Supabase.`,

          type: 'success',
        });
      } catch (error) {
        console.error(
          'Supabase import error:',
          error
        );

        addToast({
          title:
            'Database Import Failed',

          message:
            error instanceof Error
              ? error.message
              : 'Could not insert the standardized records.',

          type: 'error',
        });
      } finally {
        setIsImporting(false);
      }
    };

  /* =========================================================
     RESET
  ========================================================= */

  const resetWizard = () => {
    setStep(1);

    setSelectedCPSE(
      'IOCL'
    );

    setSelectedFile(
      null
    );

    setFileName('');

    setIsDragging(
      false
    );

    setSourceHeaders(
      []
    );

    setSourceRows(
      []
    );

    setMappings(
      []
    );

    setStandardizedRows(
      []
    );

    setIsAnalyzing(
      false
    );

    setIsNormalizing(
      false
    );

    setNormalizationProgress(
      0
    );

    setIsImporting(
      false
    );

    setValidationErrors(
      []
    );

    setValidationWarnings(
      []
    );

    setInsertedCount(
      0
    );
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1400px] mx-auto">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

          <div>

            <div className="flex items-center gap-2">

              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
                AI DATA INGESTION
              </span>

              <span className="text-xs text-slate-400 font-mono">
                Step {step} of 6
              </span>

            </div>

            <h1 className="text-xl font-bold text-white tracking-tight mt-1">
              AI-Powered Material Data Ingestion
            </h1>

            <p className="text-xs text-slate-300 mt-1 max-w-3xl">
              Upload messy CPSE material spreadsheets,
              identify their schema, normalize material data
              with AI, validate the result, and publish it
              into the Supabase material database.
            </p>

          </div>

          <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">

            <Database className="w-4 h-4" />

            Supabase Connected

          </div>

        </div>

      </div>

      {/* =====================================================
          STEPPER
      ===================================================== */}

      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">

        <div className="flex items-center justify-between overflow-x-auto gap-2 text-xs">

          {[
            'Source',
            'Upload',
            'AI Mapping',
            'Validation',
            'Preview',
            'Database',
          ].map(
            (
              label,
              index
            ) => {

              const number =
                index + 1;

              return (
                <div
                  key={label}
                  className={`flex items-center gap-2 whitespace-nowrap ${
                    step === number
                      ? 'text-emerald-700 font-bold'
                      : step > number
                      ? 'text-emerald-600 font-semibold'
                      : 'text-slate-400'
                  }`}
                >

                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                      step === number
                        ? 'bg-emerald-600 text-white'
                        : step > number
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {step >
                    number
                      ? '✓'
                      : number}
                  </div>

                  {label}

                </div>
              );
            }
          )}

        </div>

      </div>

      {/* =====================================================
          STEP 1
      ===================================================== */}

      {step === 1 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">

          <div>

            <h2 className="text-base font-bold text-slate-900">
              Select Source Company
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Choose the company whose material file is being uploaded.
            </p>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">

            {companyRecords.map(
              (company) => (
                <button
                  key={
                    company.id
                  }
                  type="button"
                  onClick={() =>
                    setSelectedCPSE(
                      company.code
                    )
                  }
                  className={`p-4 rounded-xl border text-left transition-all ${
                    selectedCPSE ===
                    company.code
                      ? 'border-emerald-600 bg-emerald-50'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >

                  <div className="flex items-center justify-between">

                    <span className="font-bold text-sm text-slate-900">
                      {company.code}
                    </span>

                    <Building className="w-4 h-4 text-slate-400" />

                  </div>

                  <p className="text-xs text-slate-600 mt-1">
                    {company.name}
                  </p>

                  <p className="text-[11px] text-slate-400 font-mono mt-3">
                    {
                      company.recordsUploaded.toLocaleString()
                    }{' '}
                    records currently loaded
                  </p>

                </button>
              )
            )}

          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">

            <div className="flex items-start gap-3">

              <ShieldCheck className="w-5 h-5 text-amber-600 mt-0.5" />

              <div>

                <p className="text-sm font-bold text-amber-900">
                  Data safety
                </p>

                <p className="text-xs text-amber-800 mt-1">
                  Data is analyzed and normalized before
                  it can be imported into Supabase.
                </p>

              </div>

            </div>

          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">

            <button
              type="button"
              onClick={() =>
                setStep(2)
              }
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2"
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </button>

          </div>

        </div>
      )}

      {/* =====================================================
          STEP 2
      ===================================================== */}

      {step === 2 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">

          <div>

            <h2 className="text-base font-bold text-slate-900">
              Upload {selectedCPSE} Material Dataset
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Upload a messy CSV or Excel material master.
            </p>

          </div>

          <label
            onDragOver={(event) => {
              event.preventDefault();

              setIsDragging(
                true
              );
            }}
            onDragLeave={() =>
              setIsDragging(
                false
              )
            }
            onDrop={(
              event
            ) => {
              event.preventDefault();

              setIsDragging(
                false
              );

              const file =
                event.dataTransfer
                  .files?.[0];

              if (file) {
                void handleFile(
                  file
                );
              }
            }}
            className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all block ${
              isDragging
                ? 'border-emerald-500 bg-emerald-50'
                : 'border-slate-300 bg-slate-50/50 hover:border-emerald-500'
            }`}
          >

            <input
              type="file"
              accept=".csv,.xlsx,.xls,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
              className="hidden"
              onChange={(
                event
              ) => {
                const file =
                  event.target
                    .files?.[0];

                if (file) {
                  void handleFile(
                    file
                  );
                }

                event.currentTarget.value =
                  '';
              }}
            />

            <UploadCloud className="w-12 h-12 mx-auto text-slate-400 mb-4" />

            <p className="text-sm font-bold text-slate-900">
              Drop Excel or CSV file here
            </p>

            <p className="text-xs text-slate-500 mt-1">
              or click to browse
            </p>

            <p className="text-[11px] text-slate-400 mt-2">
              Supported: .xlsx, .xls, .csv
            </p>

            {fileName && (
              <div className="mt-5 inline-flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono">

                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />

                <span className="max-w-[400px] truncate">
                  {fileName}
                </span>

                <CheckCircle2 className="w-4 h-4 text-emerald-600" />

              </div>
            )}

          </label>

          {sourceRows.length >
            0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                <StatCard
                  title="Rows Detected"
                  value={
                    sourceRows.length
                  }
                />

                <StatCard
                  title="Columns Detected"
                  value={
                    sourceHeaders.length
                  }
                />

                <StatCard
                  title="Selected Company"
                  value={
                    selectedCPSE
                  }
                  text
                />

              </div>

              <div className="rounded-xl border border-slate-200 overflow-hidden">

                <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">

                  <p className="text-xs font-bold text-slate-700">
                    Raw Data Preview
                  </p>

                  <p className="text-[11px] text-slate-500 mt-1">
                    First 10 records detected from the uploaded file.
                  </p>

                </div>

                <div className="overflow-auto max-h-[420px]">

                  <table className="w-full text-left text-xs">

                    <thead className="bg-white border-b border-slate-200 sticky top-0">

                      <tr>

                        {sourceHeaders
                          .slice(
                            0,
                            10
                          )
                          .map(
                            (
                              header
                            ) => (
                              <th
                                key={
                                  header
                                }
                                className="p-3 font-bold text-slate-700 whitespace-nowrap"
                              >
                                {
                                  header
                                }
                              </th>
                            )
                          )}

                      </tr>

                    </thead>

                    <tbody className="divide-y divide-slate-100">

                      {sourceRows
                        .slice(
                          0,
                          10
                        )
                        .map(
                          (
                            row,
                            rowIndex
                          ) => (
                            <tr
                              key={
                                rowIndex
                              }
                            >

                              {sourceHeaders
                                .slice(
                                  0,
                                  10
                                )
                                .map(
                                  (
                                    header
                                  ) => (
                                    <td
                                      key={
                                        header
                                      }
                                      className="p-3 text-slate-600 align-top min-w-[160px] max-w-[350px]"
                                    >
                                      <div className="whitespace-pre-wrap break-words line-clamp-4">
                                        {row[
                                          header
                                        ] ||
                                          '—'}
                                      </div>
                                    </td>
                                  )
                                )}

                            </tr>
                          )
                        )}

                    </tbody>

                  </table>

                </div>

              </div>
            </>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">

            <button
              type="button"
              onClick={() =>
                setStep(1)
              }
              className="text-xs font-semibold text-slate-600 flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>

            <button
              type="button"
              disabled={
                !selectedFile ||
                sourceRows.length ===
                  0 ||
                isAnalyzing
              }
              onClick={() =>
                void analyzeSchema()
              }
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2"
            >

              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  AI Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Analyze with AI
                </>
              )}

            </button>

          </div>

        </div>
      )}

      {/* =====================================================
          STEP 3
      ===================================================== */}

      {step === 3 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">

          <div className="flex items-center justify-between gap-4">

            <div>

              <h2 className="text-base font-bold text-slate-900">
                AI Schema Mapping
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                The AI has identified how the uploaded
                company's fields map to the standard structure.
              </p>

            </div>

            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-indigo-600" />
            </div>

          </div>

          <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4">

            <p className="text-xs text-indigo-900">
              Source company:
              <span className="font-bold ml-1">
                {selectedCPSE}
              </span>
            </p>

            <p className="text-[11px] text-indigo-700 mt-1">
              {sourceRows.length.toLocaleString()}{' '}
              material records will be normalized after mapping.
            </p>

          </div>

          <div className="overflow-auto border border-slate-200 rounded-xl">

            <table className="w-full text-left text-xs">

              <thead className="bg-slate-50 border-b border-slate-200">

                <tr>

                  <th className="p-3">
                    Source Column
                  </th>

                  <th className="p-3">
                    Standard Field
                  </th>

                  <th className="p-3">
                    Confidence
                  </th>

                  <th className="p-3">
                    Reason
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-100">

                {mappings.map(
                  (mapping) => (
                    <tr
                      key={
                        mapping.sourceColumn
                      }
                    >

                      <td className="p-3 font-mono font-bold text-slate-800">
                        {
                          mapping.sourceColumn
                        }
                      </td>

                      <td className="p-3">

                        <span
                          className={`px-2 py-1 rounded text-[10px] font-mono ${
                            mapping.targetColumn ===
                            'unmapped'
                              ? 'bg-slate-100 text-slate-500'
                              : 'bg-emerald-50 text-emerald-700'
                          }`}
                        >
                          {
                            mapping.targetColumn
                          }
                        </span>

                      </td>

                      <td className="p-3 font-mono font-bold">
                        {
                          mapping.confidence
                        }
                        %
                      </td>

                      <td className="p-3 text-slate-500 max-w-[450px]">
                        {
                          mapping.reason
                        }
                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
              Standard fields
            </p>

            <div className="flex flex-wrap gap-2 mt-2">

              {STANDARD_FIELDS.map(
                (field) => (
                  <span
                    key={
                      field
                    }
                    className="bg-white border border-slate-200 text-slate-700 px-2 py-1 rounded text-[10px] font-mono"
                  >
                    {field}
                  </span>
                )
              )}

            </div>

          </div>

          {isNormalizing && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-2">

                  <RefreshCw className="w-4 h-4 text-emerald-600 animate-spin" />

                  <p className="text-sm font-bold text-emerald-900">
                    AI Normalizing Material Data
                  </p>

                </div>

                <span className="text-xs font-mono font-bold text-emerald-700">
                  {normalizationProgress}%
                </span>

              </div>

              <div className="mt-3 h-2 bg-emerald-100 rounded-full overflow-hidden">

                <div
                  className="h-full bg-emerald-600 transition-all duration-300"
                  style={{
                    width: `${normalizationProgress}%`,
                  }}
                />

              </div>

              <p className="text-[11px] text-emerald-800 mt-2">
                The dataset is being processed in batches
                to extract useful material attributes without
                inventing unsupported technical information.
              </p>

            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">

            <button
              type="button"
              disabled={isNormalizing}
              onClick={() =>
                setStep(2)
              }
              className="text-xs font-semibold text-slate-600 disabled:opacity-50 flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>

            <button
              type="button"
              disabled={
                mappings.length ===
                  0 ||
                isNormalizing
              }
              onClick={() =>
                void normalizeAndValidate()
              }
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2"
            >

              {isNormalizing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Normalizing {normalizationProgress}%
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Normalize & Validate
                </>
              )}

            </button>

          </div>

        </div>
      )}

      {/* =====================================================
          STEP 4
      ===================================================== */}

      {step === 4 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">

          <div>

            <h2 className="text-base font-bold text-slate-900">
              AI Data Validation
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              The AI-normalized records are checked before
              they can enter the database.
            </p>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            <StatCard
              title="Rows"
              value={
                standardizedRows.length
              }
            />

            <StatCard
              title="Errors"
              value={
                validationErrors.length
              }
              danger={
                validationErrors.length >
                0
              }
            />

            <StatCard
              title="Warnings"
              value={
                validationWarnings.length
              }
              warning={
                validationWarnings.length >
                0
              }
            />

          </div>

          {validationErrors.length ===
            0 && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">

              <div className="flex items-center gap-2">

                <CheckCircle2 className="w-5 h-5 text-emerald-600" />

                <div>

                  <p className="text-sm font-bold text-emerald-900">
                    No blocking validation errors
                  </p>

                  <p className="text-xs text-emerald-800 mt-1">
                    The AI-normalized dataset can proceed
                    to the review preview.
                  </p>

                </div>

              </div>

            </div>
          )}

          {validationErrors.length >
            0 && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">

              <div className="flex items-center gap-2 font-bold text-rose-800 text-sm">

                <XCircle className="w-4 h-4" />

                Validation Errors

              </div>

              <div className="mt-2 space-y-1 max-h-52 overflow-y-auto">

                {validationErrors
                  .slice(
                    0,
                    50
                  )
                  .map(
                    (error) => (
                      <p
                        key={
                          error
                        }
                        className="text-xs text-rose-700"
                      >
                        {error}
                      </p>
                    )
                  )}

              </div>

            </div>
          )}

          {validationWarnings.length >
            0 && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">

              <div className="flex items-center gap-2 font-bold text-amber-800 text-sm">

                <AlertTriangle className="w-4 h-4" />

                Validation Warnings

              </div>

              <div className="mt-2 space-y-1 max-h-52 overflow-y-auto">

                {validationWarnings
                  .slice(
                    0,
                    50
                  )
                  .map(
                    (warning) => (
                      <p
                        key={
                          warning
                        }
                        className="text-xs text-amber-700"
                      >
                        {warning}
                      </p>
                    )
                  )}

              </div>

            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">

            <button
              type="button"
              onClick={() =>
                setStep(3)
              }
              className="text-xs font-semibold text-slate-600 flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>

            <button
              type="button"
              disabled={
                validationErrors.length >
                0
              }
              onClick={() =>
                setStep(5)
              }
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2"
            >

              Preview Standardization

              <ChevronRight className="w-4 h-4" />

            </button>

          </div>

        </div>
      )}

      {/* =====================================================
          STEP 5
      ===================================================== */}

      {step === 5 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">

          <div>

            <h2 className="text-base font-bold text-slate-900">
              AI-Standardized Data Preview
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Review the AI-normalized records before they
              are inserted into Supabase.
            </p>

          </div>

          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">

            <div className="flex items-start gap-3">

              <Sparkles className="w-5 h-5 text-blue-600 mt-0.5" />

              <div>

                <p className="text-sm font-bold text-blue-900">
                  AI normalization complete
                </p>

                <p className="text-xs text-blue-800 mt-1">
                  Company:
                  <span className="font-bold ml-1">
                    {selectedCPSE}
                  </span>
                </p>

                <p className="text-xs text-blue-800">
                  Records:
                  <span className="font-bold ml-1">
                    {
                      standardizedRows.length
                    }
                  </span>
                </p>

              </div>

            </div>

          </div>

          <div className="overflow-auto border border-slate-200 rounded-xl max-h-[550px]">

            <table className="w-full text-left text-xs">

              <thead className="bg-slate-50 border-b border-slate-200 sticky top-0">

                <tr>

                  <th className="p-3">
                    Company
                  </th>

                  <th className="p-3">
                    Material Number
                  </th>

                  <th className="p-3">
                    Description
                  </th>

                  <th className="p-3">
                    Specifications
                  </th>

                  <th className="p-3">
                    Category
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-100">

                {standardizedRows
                  .slice(
                    0,
                    50
                  )
                  .map(
                    (
                      row,
                      index
                    ) => (
                      <tr
                        key={
                          index
                        }
                      >

                        <td className="p-3 font-bold text-slate-800">
                          {
                            row.company
                          }
                        </td>

                        <td className="p-3 font-mono text-slate-700">
                          {
                            row.material_number ||
                            'N/A'
                          }
                        </td>

                        <td className="p-3 text-slate-600 min-w-[220px] max-w-[350px]">
                          <div className="whitespace-pre-wrap break-words">
                            {
                              row.description ||
                              'N/A'
                            }
                          </div>
                        </td>

                        <td className="p-3 text-slate-600 min-w-[300px] max-w-[500px]">
                          <div className="whitespace-pre-wrap break-words">
                            {
                              row.specifications ||
                              'N/A'
                            }
                          </div>
                        </td>

                        <td className="p-3 text-slate-600">
                          {
                            row.category ||
                            'N/A'
                          }
                        </td>

                      </tr>
                    )
                  )}

              </tbody>

            </table>

          </div>

          <p className="text-[11px] text-slate-400">
            Showing the first{' '}
            {
              Math.min(
                50,
                standardizedRows.length
              )
            }{' '}
            records of{' '}
            {
              standardizedRows.length
            }{' '}
            total records.
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">

            <button
              type="button"
              onClick={() =>
                setStep(4)
              }
              className="text-xs font-semibold text-slate-600 flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>

            <button
              type="button"
              onClick={() =>
                void importToSupabase()
              }
              disabled={
                isImporting ||
                standardizedRows.length ===
                  0
              }
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2"
            >

              {isImporting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Database className="w-4 h-4" />
                  Import Into Supabase
                </>
              )}

            </button>

          </div>

        </div>
      )}

      {/* =====================================================
          STEP 6
      ===================================================== */}

      {step === 6 && (
        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6"
        >

          <div className="text-center">

            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">

              <CheckCircle2 className="w-8 h-8 text-emerald-600" />

            </div>

            <h2 className="text-xl font-bold text-slate-900 mt-4">
              Database Update Successful
            </h2>

            <p className="text-sm text-slate-500 mt-2">
              The AI-standardized{' '}
              {selectedCPSE}{' '}
              material data has been inserted into
              Supabase.
            </p>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">

            <StatCard
              title="Rows Imported"
              value={
                insertedCount
              }
            />

            <StatCard
              title="Company"
              value={
                selectedCPSE
              }
              text
            />

            <StatCard
              title="Database"
              value="Supabase"
              text
            />

          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 max-w-3xl mx-auto">

            <div className="flex items-start gap-3">

              <ShieldCheck className="w-5 h-5 text-emerald-600 mt-0.5" />

              <div>

                <p className="text-sm font-bold text-emerald-900">
                  Live database ingestion complete
                </p>

                <p className="text-xs text-emerald-800 mt-1">
                  These records are now part of the Supabase
                  material dataset and can be used by the
                  Material Catalog and harmonization system.
                </p>

              </div>

            </div>

          </div>

          <div className="flex justify-center gap-3 pt-4 border-t border-slate-100">

            <button
              type="button"
              onClick={() =>
                setCurrentTab(
                  'common-master'
                )
              }
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2"
            >
              Open Material Catalog
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={
                resetWizard
              }
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-4 py-2.5 rounded-xl text-xs"
            >
              Upload Another Dataset
            </button>

          </div>

        </motion.div>
      )}

    </div>
  );
};

/* =========================================================
   FALLBACK MAPPING
========================================================= */

function createFallbackMappings(
  headers: string[]
): Mapping[] {
  return headers.map(
    (header) => {
      const value =
        header
          .toLowerCase()
          .replace(
            /[^a-z0-9]/g,
            ''
          );

      /* MATERIAL NUMBER */

      if (
        value.includes(
          'materialnumber'
        ) ||
        value.includes(
          'materialno'
        ) ||
        value.includes(
          'materialcode'
        ) ||
        value.includes(
          'matnumber'
        ) ||
        value.includes(
          'matno'
        ) ||
        value.includes(
          'matcode'
        ) ||
        value.includes(
          'sapcode'
        ) ||
        value.includes(
          'sapno'
        ) ||
        value.includes(
          'itemcode'
        ) ||
        value.includes(
          'itemno'
        ) ||
        value.includes(
          'itemnumber'
        ) ||
        value.includes(
          'partnumber'
        ) ||
        value.includes(
          'partno'
        ) ||
        value ===
          'code' ||
        value.endsWith(
          'code'
        )
      ) {
        return {
          sourceColumn:
            header,

          targetColumn:
            'material_number',

          confidence: 80,

          reason:
            'Column name resembles a material, SAP, item, part or code field.',
        };
      }

      /* DESCRIPTION */

      if (
        value.includes(
          'description'
        ) ||
        value.includes(
          'desc'
        ) ||
        value.includes(
          'shorttext'
        ) ||
        value.includes(
          'longtext'
        ) ||
        value.includes(
          'itemdescription'
        ) ||
        value.includes(
          'materialdescription'
        ) ||
        value.includes(
          'materialdesc'
        ) ||
        value.includes(
          'itemdesc'
        ) ||
        value ===
          'name'
      ) {
        return {
          sourceColumn:
            header,

          targetColumn:
            'description',

          confidence: 80,

          reason:
            'Column name resembles a material description or item text field.',
        };
      }

      /* SPECIFICATIONS */

      if (
        value.includes(
          'specification'
        ) ||
        value.includes(
          'specifications'
        ) ||
        value.includes(
          'technical'
        ) ||
        value.includes(
          'technicalspec'
        ) ||
        value.includes(
          'longdescription'
        ) ||
        value.includes(
          'details'
        ) ||
        value.includes(
          'detail'
        )
      ) {
        return {
          sourceColumn:
            header,

          targetColumn:
            'specifications',

          confidence: 80,

          reason:
            'Column name resembles a technical specification or detailed field.',
        };
      }

      /* CATEGORY */

      if (
        value.includes(
          'category'
        ) ||
        value.includes(
          'materialgroup'
        ) ||
        value.includes(
          'materialtype'
        ) ||
        value.includes(
          'classification'
        ) ||
        value.includes(
          'class'
        ) ||
        value ===
          'group'
      ) {
        return {
          sourceColumn:
            header,

          targetColumn:
            'category',

          confidence: 80,

          reason:
            'Column name resembles a material category, group or classification field.',
        };
      }

      /* UNMAPPED */

      return {
        sourceColumn:
          header,

        targetColumn:
          'unmapped',

        confidence: 0,

        reason:
          'No reliable standard field was identified from the column name.',
      };
    }
  );
}

/* =========================================================
   NULLABLE CLEANER
========================================================= */

function nullableClean(
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
        ' '
      )
      .trim();

  if (
    !text ||
    text.toLowerCase() ===
      'null' ||
    text.toLowerCase() ===
      'n/a' ||
    text.toLowerCase() ===
      'na' ||
    text.toLowerCase() ===
      'none'
  ) {
    return null;
  }

  return text;
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  title,
  value,
  danger,
  warning,
  text,
}: {
  title: string;
  value: number | string;
  danger?: boolean;
  warning?: boolean;
  text?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 text-center ${
        danger
          ? 'bg-rose-50 border-rose-200'
          : warning
          ? 'bg-amber-50 border-amber-200'
          : 'bg-slate-50 border-slate-200'
      }`}
    >

      <p className="text-[10px] uppercase font-mono text-slate-500">
        {title}
      </p>

      <p
        className={`mt-1 font-bold ${
          text
            ? 'text-lg'
            : 'text-2xl'
        } ${
          danger
            ? 'text-rose-700'
            : warning
            ? 'text-amber-700'
            : 'text-slate-900'
        }`}
      >
        {typeof value ===
        'number'
          ? value.toLocaleString()
          : value}
      </p>

    </div>
  );
}