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
  Loader2,
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

type CompanyMatch = {
  company: string;
  material: MaterialRecord | null;
  score: number;
  reason: string;
  matchedFields: string[];
  matchedSpecifications: string[];
};

const DEFAULT_MIN_SCORE = 50;

function getCompanyKey(company?: string | null): string {
  const value = String(company ?? '').trim().toUpperCase();
  return value || 'UNKNOWN';
}

export default function AIMatchCenterView() {
  const { materials, materialsLoading } = useApp();

  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<string>('ALL');
  const [minScore, setMinScore] = useState(DEFAULT_MIN_SCORE);

  const [sourceCompany, setSourceCompany] =
    useState<string>('');

  const [matches, setMatches] = useState<CompanyMatch[]>([]);
  const [overallBest, setOverallBest] =
    useState<CompanyMatch | null>(null);

  const [isMatching, setIsMatching] =
    useState(false);

  const [matchError, setMatchError] =
    useState('');

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

  const displayedMatches = useMemo(() => {
    return matches
      .filter((match) => {
        if (selectedCompany === 'ALL') {
          return true;
        }

        return (
          getCompanyKey(match.company) ===
          selectedCompany
        );
      })
      .filter(
        (match) =>
          match.material !== null &&
          match.score >= minScore
      )
      .sort(
        (a, b) =>
          b.score - a.score
      );
  }, [
    matches,
    selectedCompany,
    minScore,
  ]);

  const handleSearch = async () => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      return;
    }

    setSubmittedQuery(trimmedQuery);
    setIsMatching(true);
    setMatchError('');
    setMatches([]);
    setOverallBest(null);

    try {
      const response = await fetch(
        '/api/match-materials',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            query: trimmedQuery,
            sourceCompany:
              sourceCompany || null,
            materials,
          }),
        }
      );

      const data = await response.json();

      if (
        !response.ok ||
        !data?.success
      ) {
        throw new Error(
          data?.error ||
            'Material matching failed.'
        );
      }

      const apiMatches: CompanyMatch[] =
        Array.isArray(data.matches)
          ? data.matches
          : [];

      const safeMatches =
        apiMatches.filter(
          (match) =>
            match &&
            typeof match.company ===
              'string'
        );

      setMatches(
        safeMatches
      );

      if (
        data.overallBest &&
        typeof data.overallBest ===
          'object'
      ) {
        setOverallBest(
          data.overallBest
        );
      } else {
        setOverallBest(null);
      }
    } catch (error) {
      console.error(
        'Material matching error:',
        error
      );

      setMatchError(
        error instanceof Error
          ? error.message
          : 'Unable to find material matches.'
      );
    } finally {
      setIsMatching(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSubmittedQuery('');
    setMatches([]);
    setOverallBest(null);
    setMatchError('');
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
          Enter a part name and its specifications.
          The AI searches the available material records
          and returns at most one strong candidate from
          each company.
        </p>
      </div>

      {/* DATABASE SUMMARY */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <SummaryCard
          icon={
            <Database className="h-5 w-5" />
          }
          label="Total Materials"
          value={materials.length}
        />

        <SummaryCard
          icon={
            <Building2 className="h-5 w-5" />
          }
          label="Companies"
          value={companies.length}
        />

        <SummaryCard
          icon={
            <Target className="h-5 w-5" />
          }
          label="Minimum Match"
          value={`${minScore}%`}
        />

        <SummaryCard
          icon={
            <Trophy className="h-5 w-5" />
          }
          label="Companies Matched"
          value={
            displayedMatches.length
          }
        />
      </div>

      {/* SEARCH */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-start gap-3">
          <div className="rounded-lg bg-indigo-100 p-2">
            <Sparkles className="h-5 w-5 text-indigo-600" />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">
              AI Material Search
            </h2>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Describe the part and include as many technical
              specifications as you know.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={query}
              onChange={(event) =>
                setQuery(event.target.value)
              }
              onKeyDown={(event) => {
                if (
                  event.key ===
                  'Enter'
                ) {
                  void handleSearch();
                }
              }}
              placeholder="Example: fuse 32 amps 500V HRC"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-400 focus:bg-white"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              void handleSearch();
            }}
            disabled={
              !query.trim() ||
              isMatching
            }
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isMatching ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                AI Matching...
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                Find Matches
              </>
            )}
          </button>

          {submittedQuery && (
            <button
              type="button"
              onClick={clearSearch}
              disabled={isMatching}
              className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Clear
            </button>
          )}
        </div>

        {/* FILTERS */}
        <div className="mt-5 grid gap-4 border-t border-slate-100 pt-5 md:grid-cols-3">
          {/* SOURCE COMPANY */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-slate-400" />

              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Source Company
              </label>
            </div>

            <select
              value={sourceCompany}
              onChange={(event) =>
                setSourceCompany(
                  event.target.value
                )
              }
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
            >
              <option value="">
                No source company
              </option>

              {companies.map(
                (company) => (
                  <option
                    key={company}
                    value={company}
                  >
                    {company}
                  </option>
                )
              )}
            </select>

            <p className="mt-1 text-xs text-slate-400">
              Selected source company will be
              excluded from matching.
            </p>
          </div>

          {/* RESULT COMPANY FILTER */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-slate-400" />

              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Results From
              </label>
            </div>

            <select
              value={selectedCompany}
              onChange={(event) =>
                setSelectedCompany(
                  event.target.value
                )
              }
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
            >
              <option value="ALL">
                All Companies
              </option>

              {companies.map(
                (company) => (
                  <option
                    key={company}
                    value={company}
                  >
                    {company} (
                    {
                      companyCounts[
                        company
                      ]
                    }
                    )
                  </option>
                )
              )}
            </select>
          </div>

          {/* SCORE */}
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
              max="90"
              value={minScore}
              onChange={(event) =>
                setMinScore(
                  Number(
                    event.target.value
                  )
                )
              }
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* MATCHING ERROR */}
      {matchError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

            <div>
              <h2 className="font-semibold text-red-800">
                AI matching failed
              </h2>

              <p className="mt-1 text-sm text-red-700">
                {matchError}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* NO SEARCH */}
      {!submittedQuery && (
        <>
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <Sparkles className="mx-auto mb-4 h-10 w-10 text-slate-300" />

            <h2 className="font-semibold text-slate-800">
              Enter a material to compare
            </h2>

            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Example:
              <br />
              <span className="font-medium text-slate-700">
                fuse 32 amps 500V HRC
              </span>
            </p>
          </div>

          <div>
            <div className="mb-4">
              <h2 className="text-xl font-bold text-slate-900">
                Available Company Data
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Material records currently loaded from
                Supabase.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {companies.map(
                (company) => (
                  <CompanyDataCard
                    key={company}
                    company={company}
                    count={
                      companyCounts[
                        company
                      ]
                    }
                  />
                )
              )}
            </div>
          </div>
        </>
      )}

      {/* SEARCH RESULTS */}
      {submittedQuery && !isMatching && (
        <>
          <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                  AI Search Query
                </p>

                <p className="mt-1 text-lg font-bold text-slate-900">
                  {submittedQuery}
                </p>

                <p className="mt-1 text-sm text-slate-600">
                  Showing at most one qualifying result from
                  each company.
                  {sourceCompany && (
                    <>
                      {' '}
                      {sourceCompany} is excluded as the
                      source company.
                    </>
                  )}
                </p>
              </div>

              <div className="rounded-lg border border-indigo-200 bg-white px-4 py-3 text-center">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Qualifying Companies
                </p>

                <p className="text-2xl font-bold text-indigo-700">
                  {
                    displayedMatches.length
                  }
                </p>
              </div>
            </div>
          </div>

          {/* OVERALL BEST */}
          {overallBest &&
            overallBest.material &&
            overallBest.score >=
              minScore && (
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
                        {
                          overallBest.company
                        }
                      </h2>

                      <p className="mt-1 text-sm text-slate-600">
                        {overallBest
                          .material
                          .description ||
                          'No description available'}
                      </p>

                      {overallBest
                        .material
                        .material_number && (
                        <p className="mt-1 font-mono text-xs text-slate-500">
                          {
                            overallBest
                              .material
                              .material_number
                          }
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-left lg:text-right">
                    <p className="text-4xl font-bold text-green-700">
                      {
                        overallBest.score
                      }
                      %
                    </p>

                    <p className="text-xs font-medium text-slate-500">
                      highest AI similarity
                    </p>
                  </div>
                </div>
              </div>
            )}

          {/* NO QUALIFYING RESULT */}
          {displayedMatches.length ===
            0 && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-8 text-center">
              <AlertCircle className="mx-auto mb-3 h-8 w-8 text-amber-500" />

              <h2 className="font-semibold text-slate-800">
                No sufficiently close material found
              </h2>

              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600">
                No company result reached the current
                minimum score of {minScore}%.
                Try adding more technical specifications or
                lowering the threshold.
              </p>
            </div>
          )}

          {/* COMPANY RESULTS */}
          {displayedMatches.length >
            0 && (
            <div>
              <div className="mb-4">
                <h2 className="text-xl font-bold text-slate-900">
                  Best Match From Each Company
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Only the highest-scoring qualifying material
                  from each company is shown.
                </p>
              </div>

              <div className="grid gap-5 lg:grid-cols-2">
                {displayedMatches.map(
                  (result, index) => (
                    <MatchCard
                      key={`${result.company}-${result.material?.id ?? index}`}
                      rank={index + 1}
                      result={result}
                      overallBest={
                        overallBest?.material?.id ===
                        result.material?.id
                      }
                    />
                  )
                )}
              </div>
            </div>
          )}

          {/* GOVERNANCE */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex gap-3">
              <ShieldIcon />

              <div>
                <h3 className="font-semibold text-slate-800">
                  AI Matching Governance
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-600">
                  AI similarity is decision support. A high score does not
                  prove that two materials are technically interchangeable.
                  Engineering review is required before using a match for
                  procurement or substitution.
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
        {typeof value === 'number'
          ? value.toLocaleString()
          : value}
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

      <p className="text-sm font-semibold text-slate-900">
        {company}
      </p>

      <p className="mt-1 text-2xl font-bold text-slate-900">
        {count.toLocaleString()}
      </p>

      <p className="text-xs text-slate-500">
        material records
      </p>
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
  result: CompanyMatch;
  overallBest: boolean;
}) {
  if (!result.material) {
    return null;
  }

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

            <p className="text-xs text-slate-400">
              AI similarity
            </p>
          </div>
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full transition-all ${barClass}`}
            style={{
              width: `${Math.min(
                result.score,
                100
              )}%`,
            }}
          />
        </div>
      </div>

      <div className="space-y-4 p-4">
        <DetailRow
          icon={
            <Tag className="h-4 w-4" />
          }
          label="Material Number"
          value={
            result.material
              .material_number ||
            'N/A'
          }
        />

        <DetailRow
          icon={
            <FileText className="h-4 w-4" />
          }
          label="Description"
          value={
            result.material
              .description ||
            'N/A'
          }
        />

        <DetailRow
          icon={
            <SlidersHorizontal className="h-4 w-4" />
          }
          label="Specifications"
          value={
            result.material
              .specifications ||
            'N/A'
          }
        />

        <DetailRow
          icon={
            <Tag className="h-4 w-4" />
          }
          label="Category"
          value={
            result.material
              .category ||
            'N/A'
          }
        />

        {/* MATCHED FIELDS */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Matched Fields
          </p>

          {result.matchedFields.length >
          0 ? (
            <div className="flex flex-wrap gap-2">
              {result.matchedFields.map(
                (field) => (
                  <span
                    key={field}
                    className="rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700"
                  >
                    {field}
                  </span>
                )
              )}
            </div>
          ) : (
            <p className="text-xs text-slate-500">
              No strong field matches returned.
            </p>
          )}
        </div>

        {/* TECHNICAL MATCHES */}
        {result.matchedSpecifications
          .length > 0 && (
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Matching Technical Values
            </p>

            <div className="flex flex-wrap gap-2">
              {result.matchedSpecifications.map(
                (value) => (
                  <span
                    key={value}
                    className="rounded-md bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-700"
                  >
                    {value}
                  </span>
                )
              )}
            </div>
          </div>
        )}

        {/* REASON */}
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
              {overallBest
                ? 'Overall Closest Match'
                : 'Qualifying AI Match'}
            </p>
          </div>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            {result.reason}
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

/* -------------------------------------------------------------------------- */
/* SHIELD ICON                                                                */
/* -------------------------------------------------------------------------- */

function ShieldIcon() {
  return (
    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-600">
      ✓
    </div>
  );
}