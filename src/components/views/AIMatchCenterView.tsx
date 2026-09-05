import React, { useMemo, useState } from 'react';
import {
  Search,
  Database,
  Building2,
  FileText,
  Tag,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

import { useApp } from '../../context/AppContext';
import {
  findThreeCompanyHarmonization,
  HarmonizationResult,
} from '../../../lib/materialHarmonization';

export default function AIMatchCenterView() {
  const { materials, materialsLoading } = useApp();

  const [search, setSearch] = useState('');
  const [selectedMaterialId, setSelectedMaterialId] = useState<number | null>(
    null
  );

  const companyCounts = useMemo(() => {
    const counts = {
      BPCL: 0,
      HPCL: 0,
      IOCL: 0,
      BHEL: 0,
    };

    materials.forEach((material) => {
      const company = material.company?.trim().toUpperCase();

      if (company === 'BPCL') counts.BPCL++;
      if (company === 'HPCL') counts.HPCL++;
      if (company === 'IOCL') counts.IOCL++;
      if (company === 'BHEL') counts.BHEL++;
    });

    return counts;
  }, [materials]);

  const filteredMaterials = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return materials.slice(0, 100);
    }

    return materials
      .filter((material) => {
        const company = material.company?.toLowerCase() || '';
        const materialNumber = material.material_number?.toLowerCase() || '';
        const description = material.description?.toLowerCase() || '';
        const specifications = material.specifications?.toLowerCase() || '';
        const category = material.category?.toLowerCase() || '';

        return (
          company.includes(query) ||
          materialNumber.includes(query) ||
          description.includes(query) ||
          specifications.includes(query) ||
          category.includes(query)
        );
      })
      .slice(0, 100);
  }, [materials, search]);

  const selectedMaterial = useMemo(() => {
    if (selectedMaterialId === null) return null;

    return (
      materials.find((material) => material.id === selectedMaterialId) || null
    );
  }, [materials, selectedMaterialId]);

  const harmonization = useMemo(() => {
    if (!selectedMaterial) return null;

    return findThreeCompanyHarmonization(selectedMaterial, materials);
  }, [selectedMaterial, materials]);

  const getRecommendationLabel = (
    result: HarmonizationResult | null
  ): string => {
    if (!result) return 'No Match';

    if (result.recommendation === 'LIKELY_MATCH') {
      return 'Likely Match';
    }

    if (result.recommendation === 'REVIEW') {
      return 'Needs Review';
    }

    return 'No Match';
  };

  const getRecommendationClass = (
    result: HarmonizationResult | null
  ): string => {
    if (!result) {
      return 'bg-slate-100 text-slate-600 border-slate-200';
    }

    if (result.recommendation === 'LIKELY_MATCH') {
      return 'bg-green-50 text-green-700 border-green-200';
    }

    if (result.recommendation === 'REVIEW') {
      return 'bg-amber-50 text-amber-700 border-amber-200';
    }

    return 'bg-red-50 text-red-700 border-red-200';
  };

  const getScoreBarClass = (score: number): string => {
    if (score >= 80) {
      return 'bg-green-500';
    }

    if (score >= 45) {
      return 'bg-amber-500';
    }

    return 'bg-red-500';
  };

  const selectFirstBPCLMaterial = () => {
    const bpclMaterial = materials.find(
      (material) => material.company?.trim().toUpperCase() === 'BPCL'
    );

    if (bpclMaterial) {
      setSelectedMaterialId(bpclMaterial.id);
    }
  };

  if (materialsLoading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="text-center">
          <RefreshCw className="mx-auto mb-3 h-8 w-8 animate-spin text-slate-500" />
          <p className="text-sm text-slate-600">
            Loading material data from Supabase...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-indigo-600" />
            <span className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
              AI Harmonization
            </span>
          </div>

          <h1 className="text-2xl font-bold text-slate-900">
            Material Harmonization Center
          </h1>

          <p className="mt-1 max-w-3xl text-sm text-slate-600">
            Compare real material records across BPCL, HPCL and IOCL using
            description, specification and category similarity.
          </p>
        </div>

        <button
          type="button"
          onClick={selectFirstBPCLMaterial}
          disabled={materials.length === 0}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Sparkles className="h-4 w-4" />
          Test BPCL Material
        </button>
      </div>

      {/* COMPANY COUNTS */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <CompanyCard
          company="BPCL"
          count={companyCounts.BPCL}
          active={selectedMaterial?.company?.toUpperCase() === 'BPCL'}
        />

        <CompanyCard
          company="HPCL"
          count={companyCounts.HPCL}
          active={harmonization?.hpcl !== null && harmonization?.hpcl !== undefined}
        />

        <CompanyCard
          company="IOCL"
          count={companyCounts.IOCL}
          active={harmonization?.iocl !== null && harmonization?.iocl !== undefined}
        />

        <CompanyCard
          company="BHEL"
          count={companyCounts.BHEL}
          active={false}
        />
      </div>

      {/* SEARCH */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-slate-900">
              Select Source Material
            </h2>
            <p className="text-xs text-slate-500">
              Select a real BPCL record to compare against HPCL and IOCL.
            </p>
          </div>

          <Database className="h-5 w-5 text-slate-400" />
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search material number, description, category or company..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-400 focus:bg-white"
          />
        </div>
      </div>

      {/* MATERIAL LIST */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-4 py-3">
          <h2 className="font-semibold text-slate-900">
            Material Records
          </h2>
          <p className="text-xs text-slate-500">
            Showing up to 100 matching records.
          </p>
        </div>

        {filteredMaterials.length === 0 ? (
          <div className="p-10 text-center">
            <Database className="mx-auto mb-3 h-8 w-8 text-slate-300" />
            <p className="font-medium text-slate-700">
              No material records found
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Try a different search term.
            </p>
          </div>
        ) : (
          <div className="max-h-[420px] overflow-y-auto">
            {filteredMaterials.map((material) => {
              const isSelected = material.id === selectedMaterialId;

              return (
                <button
                  key={material.id}
                  type="button"
                  onClick={() => setSelectedMaterialId(material.id)}
                  className={`block w-full border-b border-slate-100 px-4 py-4 text-left transition last:border-b-0 ${
                    isSelected
                      ? 'bg-indigo-50'
                      : 'bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                          {material.company}
                        </span>

                        <span className="font-mono text-xs text-slate-500">
                          {material.material_number || 'No material number'}
                        </span>
                      </div>

                      <p className="truncate text-sm font-semibold text-slate-900">
                        {material.description || 'No description available'}
                      </p>

                      <p className="mt-1 truncate text-xs text-slate-500">
                        {material.category || 'No category'}
                      </p>
                    </div>

                    {isSelected && (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-indigo-600" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* SELECTED MATERIAL */}
      {selectedMaterial && harmonization && (
        <>
          <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-5">
            <div className="mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-600" />
              <h2 className="font-semibold text-slate-900">
                Selected Source Material
              </h2>
            </div>

            <div className="grid gap-4 lg:grid-cols-4">
              <InfoBox
                label="Company"
                value={selectedMaterial.company}
                icon={<Building2 className="h-4 w-4" />}
              />

              <InfoBox
                label="Material Number"
                value={selectedMaterial.material_number || 'N/A'}
                icon={<Tag className="h-4 w-4" />}
              />

              <InfoBox
                label="Description"
                value={selectedMaterial.description || 'N/A'}
                icon={<FileText className="h-4 w-4" />}
              />

              <InfoBox
                label="Category"
                value={selectedMaterial.category || 'N/A'}
                icon={<Tag className="h-4 w-4" />}
              />
            </div>

            {selectedMaterial.specifications && (
              <div className="mt-4 rounded-lg border border-indigo-100 bg-white p-4">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Specifications
                </p>
                <p className="text-sm text-slate-700">
                  {selectedMaterial.specifications}
                </p>
              </div>
            )}
          </div>

          {/* THREE COMPANY COMPARISON */}
          <div>
            <div className="mb-4">
              <h2 className="text-xl font-bold text-slate-900">
                3-Company Harmonization
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                BPCL source material compared with the closest HPCL and IOCL
                records available in Supabase.
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {/* BPCL */}
              <MaterialCompanyCard
                title="BPCL"
                subtitle="Source Material"
                material={harmonization.source}
                source
              />

              {/* HPCL */}
              <MaterialCompanyCard
                title="HPCL"
                subtitle="Closest Match"
                material={harmonization.hpcl?.target || null}
                result={harmonization.hpcl}
              />

              {/* IOCL */}
              <MaterialCompanyCard
                title="IOCL"
                subtitle="Closest Match"
                material={harmonization.iocl?.target || null}
                result={harmonization.iocl}
              />
            </div>
          </div>

          {/* ANALYSIS */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-start gap-3">
              <div className="rounded-lg bg-indigo-100 p-2">
                <Sparkles className="h-5 w-5 text-indigo-600" />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Harmonization Analysis
                </h2>
                <p className="text-sm text-slate-500">
                  Similarity calculated from the actual material fields.
                </p>
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <AnalysisCard
                company="HPCL"
                result={harmonization.hpcl}
                scoreBarClass={
                  harmonization.hpcl
                    ? getScoreBarClass(harmonization.hpcl.similarityScore)
                    : 'bg-slate-300'
                }
                recommendationLabel={getRecommendationLabel(
                  harmonization.hpcl
                )}
                recommendationClass={getRecommendationClass(
                  harmonization.hpcl
                )}
              />

              <AnalysisCard
                company="IOCL"
                result={harmonization.iocl}
                scoreBarClass={
                  harmonization.iocl
                    ? getScoreBarClass(harmonization.iocl.similarityScore)
                    : 'bg-slate-300'
                }
                recommendationLabel={getRecommendationLabel(
                  harmonization.iocl
                )}
                recommendationClass={getRecommendationClass(
                  harmonization.iocl
                )}
              />
            </div>
          </div>

          {/* FIELD COMPARISON */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5">
              <h2 className="font-semibold text-slate-900">
                Field-Level Comparison
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                The comparison uses description, specifications and category.
              </p>
            </div>

            <div className="space-y-6">
              <ComparisonSection
                title="BPCL → HPCL"
                result={harmonization.hpcl}
              />

              <ComparisonSection
                title="BPCL → IOCL"
                result={harmonization.iocl}
              />
            </div>
          </div>

          {/* GOVERNANCE */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-slate-600" />

              <div>
                <h3 className="font-semibold text-slate-800">
                  Harmonization Governance
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-600">
                  This analysis is generated from the actual Supabase material
                  records. The similarity percentage is a rule-based
                  comparison score and should be treated as decision support,
                  not as proof that two materials are technically identical.
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* NO MATERIAL SELECTED */}
      {!selectedMaterial && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <Sparkles className="mx-auto mb-4 h-10 w-10 text-slate-300" />

          <h2 className="font-semibold text-slate-800">
            Select a BPCL material to begin
          </h2>

          <p className="mx-auto mt-2 max-w-lg text-sm text-slate-500">
            The system will automatically find the closest HPCL and IOCL
            records and calculate their harmonization scores.
          </p>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* COMPONENTS                                                                  */
/* -------------------------------------------------------------------------- */

function CompanyCard({
  company,
  count,
  active,
}: {
  company: string;
  count: number;
  active: boolean;
}) {
  return (
    <div
      className={`rounded-xl border bg-white p-4 shadow-sm ${
        active ? 'border-indigo-300 ring-1 ring-indigo-100' : 'border-slate-200'
      }`}
    >
      <div className="mb-2 flex items-center justify-between">
        <Building2 className="h-5 w-5 text-slate-500" />

        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${
            count > 0
              ? 'bg-green-50 text-green-700'
              : 'bg-slate-100 text-slate-500'
          }`}
        >
          {count > 0 ? 'Data available' : '0 records'}
        </span>
      </div>

      <p className="text-sm font-semibold text-slate-900">{company}</p>

      <p className="mt-1 text-2xl font-bold text-slate-900">
        {count.toLocaleString()}
      </p>

      <p className="text-xs text-slate-500">material records</p>
    </div>
  );
}

function InfoBox({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <div className="mb-2 flex items-center gap-2 text-slate-400">
        {icon}
        <span className="text-xs font-semibold uppercase tracking-wide">
          {label}
        </span>
      </div>

      <p className="break-words text-sm font-medium text-slate-800">{value}</p>
    </div>
  );
}

function MaterialCompanyCard({
  title,
  subtitle,
  material,
  result,
  source = false,
}: {
  title: string;
  subtitle: string;
  material: any;
  result?: HarmonizationResult | null;
  source?: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-slate-500" />
              <h3 className="font-bold text-slate-900">{title}</h3>
            </div>

            <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
          </div>

          {result && (
            <div className="text-right">
              <p className="text-2xl font-bold text-slate-900">
                {result.similarityScore}%
              </p>

              <p className="text-xs text-slate-500">similarity</p>
            </div>
          )}
        </div>
      </div>

      {material ? (
        <div className="space-y-4 p-4">
          <DetailRow
            label="Material Number"
            value={material.material_number || 'N/A'}
          />

          <DetailRow
            label="Description"
            value={material.description || 'N/A'}
          />

          <DetailRow
            label="Specifications"
            value={material.specifications || 'N/A'}
          />

          <DetailRow
            label="Category"
            value={material.category || 'N/A'}
          />

          {!source && result && (
            <div
              className={`rounded-lg border p-3 ${
                result.recommendation === 'LIKELY_MATCH'
                  ? 'border-green-200 bg-green-50'
                  : result.recommendation === 'REVIEW'
                  ? 'border-amber-200 bg-amber-50'
                  : 'border-red-200 bg-red-50'
              }`}
            >
              <p className="text-xs font-semibold uppercase tracking-wide">
                {result.recommendation === 'LIKELY_MATCH'
                  ? 'Likely Match'
                  : result.recommendation === 'REVIEW'
                  ? 'Needs Review'
                  : 'No Match'}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="p-8 text-center">
          <AlertCircle className="mx-auto mb-2 h-7 w-7 text-slate-300" />

          <p className="text-sm font-medium text-slate-600">
            No matching record found
          </p>

          <p className="mt-1 text-xs text-slate-400">
            No comparable record was available in this company.
          </p>
        </div>
      )}
    </div>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="break-words text-sm text-slate-700">{value}</p>
    </div>
  );
}

function AnalysisCard({
  company,
  result,
  scoreBarClass,
  recommendationLabel,
  recommendationClass,
}: {
  company: string;
  result: HarmonizationResult | null;
  scoreBarClass: string;
  recommendationLabel: string;
  recommendationClass: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900">{company}</p>
          <p className="text-xs text-slate-500">Compared with BPCL</p>
        </div>

        <span
          className={`rounded-full border px-3 py-1 text-xs font-semibold ${recommendationClass}`}
        >
          {recommendationLabel}
        </span>
      </div>

      {result ? (
        <>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-slate-600">Similarity Score</span>

            <span className="text-lg font-bold text-slate-900">
              {result.similarityScore}%
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full transition-all ${scoreBarClass}`}
              style={{
                width: `${Math.min(result.similarityScore, 100)}%`,
              }}
            />
          </div>

          <div className="mt-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Matched Fields
            </p>

            {result.matchedFields.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {result.matchedFields.map((field) => (
                  <span
                    key={field}
                    className="rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700"
                  >
                    {field}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">No strong field matches.</p>
            )}
          </div>

          {result.differences.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Differences
              </p>

              <div className="space-y-1">
                {result.differences.map((difference) => (
                  <div
                    key={difference}
                    className="flex items-center gap-2 text-xs text-slate-600"
                  >
                    <ArrowRight className="h-3 w-3 shrink-0 text-slate-400" />
                    {difference}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="rounded-lg bg-slate-50 p-4 text-center">
          <p className="text-sm text-slate-500">
            No comparison result available.
          </p>
        </div>
      )}
    </div>
  );
}

function ComparisonSection({
  title,
  result,
}: {
  title: string;
  result: HarmonizationResult | null;
}) {
  if (!result) {
    return (
      <div className="rounded-lg border border-slate-200 p-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-slate-400" />
          <p className="text-sm font-semibold text-slate-700">{title}</p>
        </div>

        <p className="mt-2 text-sm text-slate-500">
          No comparable material found.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-slate-500" />
          <p className="text-sm font-semibold text-slate-800">{title}</p>
        </div>

        <span className="text-sm font-bold text-slate-900">
          {result.similarityScore}%
        </span>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <FieldResult
          name="Description"
          matched={result.matchedFields.includes('Description')}
        />

        <FieldResult
          name="Specifications"
          matched={result.matchedFields.includes('Specifications')}
        />

        <FieldResult
          name="Category"
          matched={result.matchedFields.includes('Category')}
        />
      </div>
    </div>
  );
}

function FieldResult({
  name,
  matched,
}: {
  name: string;
  matched: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-3 ${
        matched
          ? 'border-green-200 bg-green-50'
          : 'border-slate-200 bg-slate-50'
      }`}
    >
      <div className="flex items-center gap-2">
        {matched ? (
          <CheckCircle2 className="h-4 w-4 text-green-600" />
        ) : (
          <AlertCircle className="h-4 w-4 text-slate-400" />
        )}

        <span
          className={`text-sm font-medium ${
            matched ? 'text-green-700' : 'text-slate-600'
          }`}
        >
          {name}
        </span>
      </div>

      <p className="mt-1 text-xs text-slate-500">
        {matched ? 'Strong similarity detected' : 'Difference detected'}
      </p>
    </div>
  );
}