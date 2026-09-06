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
  RefreshCw,
  Trophy,
  Target,
  SlidersHorizontal,
} from 'lucide-react';

import { useApp } from '../../context/AppContext';

type MaterialRecord = {
  id: number;
  company?: string | null;
  material_number?: string | null;
  description?: string | null;
  specifications?: string | null;
  category?: string | null;
};

type MatchResult = {
  material: MaterialRecord;
  score: number;
  matchedTerms: string[];
  numericMatches: string[];
  reason: string;
};

const MATCH_THRESHOLD = 35;

const STOP_WORDS = new Set([
  'the',
  'and',
  'for',
  'with',
  'from',
  'type',
  'part',
  'item',
  'material',
  'no',
  'number',
  'of',
  'a',
  'an',
  'to',
  'in',
  'on',
  'as',
]);

function normalizeText(value: unknown): string {
  return String(value ?? '')
    .toLowerCase()
    .replace(/[^\w./%+-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(value: string): string[] {
  return Array.from(
    new Set(
      normalizeText(value)
        .split(/\s+/)
        .map((token) => token.trim())
        .filter((token) => token.length >= 2 && !STOP_WORDS.has(token))
    )
  );
}

function extractNumbers(value: string): string[] {
  const matches =
    normalizeText(value).match(
      /\b\d+(?:\.\d+)?(?:\s?[-/x]\s?\d+(?:\.\d+)?)?(?:[a-z]+)?\b/g
    ) || [];

  return Array.from(new Set(matches));
}

function calculateSimilarity(
  query: string,
  material: MaterialRecord
): MatchResult {
  const queryText = normalizeText(query);

  const materialText = normalizeText(
    [
      material.material_number,
      material.description,
      material.specifications,
      material.category,
    ]
      .filter(Boolean)
      .join(' ')
  );

  const queryTokens = tokenize(queryText);
  const materialTokens = new Set(tokenize(materialText));

  const matchedTerms = queryTokens.filter((token) =>
    materialTokens.has(token)
  );

  const queryNumbers = extractNumbers(queryText);
  const materialNumbers = extractNumbers(materialText);

  const numericMatches = queryNumbers.filter((number) =>
    materialNumbers.includes(number)
  );

  const tokenScore =
    queryTokens.length > 0
      ? (matchedTerms.length / queryTokens.length) * 70
      : 0;

  const numericScore =
    queryNumbers.length > 0
      ? (numericMatches.length / queryNumbers.length) * 30
      : 0;

  let score = tokenScore + numericScore;

  const description = normalizeText(material.description);
  const specification = normalizeText(material.specifications);
  const category = normalizeText(material.category);
  const materialNumber = normalizeText(material.material_number);

  const fullQuery = queryText;

  if (description && fullQuery.includes(description)) {
    score += 10;
  }

  if (specification && fullQuery.includes(specification)) {
    score += 10;
  }

  if (category && fullQuery.includes(category)) {
    score += 5;
  }

  if (
    materialNumber &&
    fullQuery.includes(materialNumber) &&
    materialNumber.length >= 4
  ) {
    score += 15;
  }

  score = Math.min(Math.round(score), 100);

  let reason = 'Weak similarity';

  if (score >= 80) {
    reason = 'Very strong match';
  } else if (score >= 65) {
    reason = 'Strong match';
  } else if (score >= MATCH_THRESHOLD) {
    reason = 'Potential match';
  }

  return {
    material,
    score,
    matchedTerms,
    numericMatches,
    reason,
  };
}

function getCompanyKey(company?: string | null): string {
  const value = String(company ?? '').trim().toUpperCase();
  return value || 'UNKNOWN';
}

export default function AIMatchCenterView() {
  const { materials, materialsLoading } = useApp();

  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<string>('ALL');
  const [minScore, setMinScore] = useState(MATCH_THRESHOLD);

  const companyCounts = useMemo(() => {
    const counts: Record<string, number> = {};

    materials.forEach((material) => {
      const company = getCompanyKey(material.company);

      if (!counts[company]) {
        counts[company] = 0;
      }

      counts[company]++;
    });

    return counts;
  }, [materials]);

  const companies = useMemo(() => {
    return Object.keys(companyCounts)
      .filter((company) => company !== 'UNKNOWN')
      .sort();
  }, [companyCounts]);

  const allMatches = useMemo(() => {
    if (!submittedQuery.trim()) {
      return [];
    }

    return materials
      .map((material) => calculateSimilarity(submittedQuery, material))
      .filter((result) => result.score >= minScore)
      .sort((a, b) => b.score - a.score);
  }, [materials, submittedQuery, minScore]);

  const bestPerCompany = useMemo(() => {
    const grouped = new Map<string, MatchResult>();

    allMatches.forEach((result) => {
      const company = getCompanyKey(result.material.company);

      if (
        selectedCompany !== 'ALL' &&
        company !== selectedCompany
      ) {
        return;
      }

      const existing = grouped.get(company);

      if (!existing || result.score > existing.score) {
        grouped.set(company, result);
      }
    });

    return Array.from(grouped.entries())
      .map(([company, result]) => ({
        company,
        ...result,
      }))
      .sort((a, b) => b.score - a.score);
  }, [allMatches, selectedCompany]);

  const overallBest = bestPerCompany[0] || null;

  const handleSearch = () => {
    setSubmittedQuery(query.trim());
  };

  const clearSearch = () => {
    setQuery('');
    setSubmittedQuery('');
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
      <div>
        <div className="mb-2 flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-indigo-600" />

          <span className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
            AI Material Match Center
          </span>
        </div>

        <h1 className="text-2xl font-bold text-slate-900">
          Cross-Company Material Comparison
        </h1>

        <p className="mt-1 max-w-4xl text-sm leading-6 text-slate-600">
          Enter a part name and its specifications. The system searches the
          complete material database and returns at most one strong candidate
          from each company.
        </p>
      </div>

      {/* DATABASE SUMMARY */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <SummaryCard
          icon={<Database className="h-5 w-5" />}
          label="Total Materials"
          value={materials.length}
        />

        <SummaryCard
          icon={<Building2 className="h-5 w-5" />}
          label="Companies"
          value={companies.length}
        />

        <SummaryCard
          icon={<Target className="h-5 w-5" />}
          label="Minimum Match"
          value={`${minScore}%`}
        />

        <SummaryCard
          icon={<Trophy className="h-5 w-5" />}
          label="Companies Matched"
          value={bestPerCompany.length}
        />
      </div>

      {/* SEARCH BOX */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-start gap-3">
          <div className="rounded-lg bg-indigo-100 p-2">
            <Search className="h-5 w-5 text-indigo-600" />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">
              Search Part + Specification
            </h2>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Example: enter the material description together with ratings,
              sizes, voltage, pressure, current, model, or other technical
              information.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  handleSearch();
                }
              }}
              placeholder="Example: fuse 32 amps 500V HRC"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-400 focus:bg-white"
            />
          </div>

          <button
            type="button"
            onClick={handleSearch}
            disabled={!query.trim()}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Search className="h-4 w-4" />
            Find Matches
          </button>

          {submittedQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Clear
            </button>
          )}
        </div>

        {/* FILTERS */}
        <div className="mt-5 grid gap-4 border-t border-slate-100 pt-5 md:grid-cols-2">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-slate-400" />

              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Company Filter
              </label>
            </div>

            <select
              value={selectedCompany}
              onChange={(event) => setSelectedCompany(event.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
            >
              <option value="ALL">All Companies</option>

              {companies.map((company) => (
                <option key={company} value={company}>
                  {company} ({companyCounts[company]})
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-slate-400" />

                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Minimum Match Score
                </label>
              </div>

              <span className="text-sm font-bold text-slate-800">
                {minScore}%
              </span>
            </div>

            <input
              type="range"
              min="20"
              max="80"
              value={minScore}
              onChange={(event) => setMinScore(Number(event.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* NO SEARCH YET */}
      {!submittedQuery && (
        <>
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <Sparkles className="mx-auto mb-4 h-10 w-10 text-slate-300" />

            <h2 className="font-semibold text-slate-800">
              Enter a material to compare
            </h2>

            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Type the part description and as many technical specifications
              as you know. The system will search the entire database and
              select the best available result from each company.
            </p>
          </div>

          {/* COMPANY DATA */}
          <div>
            <div className="mb-4">
              <h2 className="text-xl font-bold text-slate-900">
                Available Company Data
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Material records currently loaded from Supabase.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {companies.map((company) => (
                <CompanyDataCard
                  key={company}
                  company={company}
                  count={companyCounts[company]}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {/* SEARCHED RESULTS */}
      {submittedQuery && (
        <>
          {/* QUERY SUMMARY */}
          <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                  Search Query
                </p>

                <p className="mt-1 text-lg font-bold text-slate-900">
                  {submittedQuery}
                </p>

                <p className="mt-1 text-sm text-slate-600">
                  Showing one best candidate per company with a score of{' '}
                  <strong>{minScore}%</strong> or higher.
                </p>
              </div>

              <div className="rounded-lg border border-indigo-200 bg-white px-4 py-3 text-center">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Matching Companies
                </p>

                <p className="text-2xl font-bold text-indigo-700">
                  {bestPerCompany.length}
                </p>
              </div>
            </div>
          </div>

          {/* OVERALL BEST */}
          {overallBest && (
            <div className="rounded-xl border-2 border-green-200 bg-green-50 p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-green-100 p-2">
                    <Trophy className="h-6 w-6 text-green-700" />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-green-700">
                      Overall Closest Match
                    </p>

                    <h2 className="mt-1 text-xl font-bold text-slate-900">
                      {overallBest.company}
                    </h2>

                    <p className="mt-1 text-sm text-slate-600">
                      {overallBest.material.description ||
                        'No description available'}
                    </p>
                  </div>
                </div>

                <div className="text-left lg:text-right">
                  <p className="text-4xl font-bold text-green-700">
                    {overallBest.score}%
                  </p>

                  <p className="text-xs font-medium text-slate-500">
                    highest available similarity
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* NO MATCH */}
          {bestPerCompany.length === 0 && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-8 text-center">
              <AlertCircle className="mx-auto mb-3 h-8 w-8 text-amber-500" />

              <h2 className="font-semibold text-slate-800">
                No sufficiently close material found
              </h2>

              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600">
                The database contains records, but none reached the current
                minimum score of {minScore}%. Try adding more specifications
                or lowering the minimum score.
              </p>
            </div>
          )}

          {/* COMPANY RESULTS */}
          {bestPerCompany.length > 0 && (
            <div>
              <div className="mb-4">
                <h2 className="text-xl font-bold text-slate-900">
                  Best Match From Each Company
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Only the single highest-scoring material from each company is
                  displayed.
                </p>
              </div>

              <div className="grid gap-5 lg:grid-cols-2">
                {bestPerCompany.map((result, index) => (
                  <MatchCard
                    key={`${result.company}-${result.material.id}`}
                    rank={index + 1}
                    result={result}
                    overallBest={
                      overallBest?.material.id === result.material.id
                    }
                  />
                ))}
              </div>
            </div>
          )}

          {/* MATCHING LOGIC */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex gap-3">
              <Target className="mt-0.5 h-5 w-5 shrink-0 text-slate-600" />

              <div>
                <h3 className="font-semibold text-slate-800">
                  How the current matching works
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-600">
                  The matcher compares the entered query against material
                  number, description, specifications and category. Technical
                  numbers such as voltage, current, pressure and dimensions
                  receive additional weight when they match exactly. Weak
                  results below the selected threshold are excluded.
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  This result is decision support. It does not claim that two
                  materials are technically interchangeable without engineering
                  verification.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* SUMMARY CARD                                                               */
/* -------------------------------------------------------------------------- */

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="rounded-lg bg-slate-100 p-2 text-slate-500">
          {icon}
        </div>
      </div>

      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold text-slate-900">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* COMPANY DATA CARD                                                          */
/* -------------------------------------------------------------------------- */

function CompanyDataCard({
  company,
  count,
}: {
  company: string;
  count: number;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <Building2 className="h-5 w-5 text-slate-500" />

        <span className="rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
          Available
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

/* -------------------------------------------------------------------------- */
/* MATCH CARD                                                                 */
/* -------------------------------------------------------------------------- */

function MatchCard({
  rank,
  result,
  overallBest,
}: {
  rank: number;
  result: MatchResult & { company: string };
  overallBest: boolean;
}) {
  const scoreClass =
    result.score >= 80
      ? 'text-green-700'
      : result.score >= 60
      ? 'text-amber-700'
      : 'text-slate-700';

  const barClass =
    result.score >= 80
      ? 'bg-green-500'
      : result.score >= 60
      ? 'bg-amber-500'
      : 'bg-slate-400';

  return (
    <div
      className={`overflow-hidden rounded-xl border bg-white shadow-sm ${
        overallBest
          ? 'border-green-300 ring-1 ring-green-100'
          : 'border-slate-200'
      }`}
    >
      <div className="border-b border-slate-200 p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              {overallBest ? (
                <Trophy className="h-5 w-5 text-green-600" />
              ) : (
                <Building2 className="h-5 w-5 text-slate-500" />
              )}

              <h3 className="text-lg font-bold text-slate-900">
                {result.company}
              </h3>
            </div>

            <p className="mt-1 text-xs text-slate-500">
              Company Rank #{rank}
            </p>
          </div>

          <div className="text-right">
            <p className={`text-3xl font-bold ${scoreClass}`}>
              {result.score}%
            </p>

            <p className="text-xs text-slate-400">match score</p>
          </div>
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full transition-all ${barClass}`}
            style={{
              width: `${Math.min(result.score, 100)}%`,
            }}
          />
        </div>
      </div>

      <div className="space-y-4 p-4">
        <DetailRow
          icon={<Tag className="h-4 w-4" />}
          label="Material Number"
          value={result.material.material_number || 'N/A'}
        />

        <DetailRow
          icon={<FileText className="h-4 w-4" />}
          label="Description"
          value={result.material.description || 'N/A'}
        />

        <DetailRow
          icon={<SlidersHorizontal className="h-4 w-4" />}
          label="Specifications"
          value={result.material.specifications || 'N/A'}
        />

        <DetailRow
          icon={<Tag className="h-4 w-4" />}
          label="Category"
          value={result.material.category || 'N/A'}
        />

        {/* MATCHED TERMS */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Matched Terms
          </p>

          {result.matchedTerms.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {result.matchedTerms.map((term) => (
                <span
                  key={term}
                  className="rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700"
                >
                  {term}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500">
              No exact text terms matched.
            </p>
          )}
        </div>

        {/* NUMERIC MATCHES */}
        {result.numericMatches.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Matching Technical Values
            </p>

            <div className="flex flex-wrap gap-2">
              {result.numericMatches.map((value) => (
                <span
                  key={value}
                  className="rounded-md bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-700"
                >
                  {value}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* RESULT STATUS */}
        <div
          className={`rounded-lg border p-3 ${
            overallBest
              ? 'border-green-200 bg-green-50'
              : result.score >= 65
              ? 'border-amber-200 bg-amber-50'
              : 'border-slate-200 bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-2">
            {overallBest ? (
              <Trophy className="h-4 w-4 text-green-600" />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-slate-500" />
            )}

            <p className="text-sm font-semibold text-slate-800">
              {overallBest ? 'Overall Closest Match' : result.reason}
            </p>
          </div>

          <p className="mt-1 text-xs text-slate-500">
            One result is shown for this company because it has the highest
            qualifying score.
          </p>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* DETAIL ROW                                                                 */
/* -------------------------------------------------------------------------- */

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center gap-2 text-slate-400">
        {icon}

        <p className="text-xs font-semibold uppercase tracking-wide">
          {label}
        </p>
      </div>

      <p className="break-words text-sm leading-6 text-slate-700">
        {value}
      </p>
    </div>
  );
}