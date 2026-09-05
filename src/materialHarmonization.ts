import { DatabaseMaterial } from '../context/AppContext';

export interface HarmonizationResult {
  source: DatabaseMaterial;
  target: DatabaseMaterial;

  similarityScore: number;

  matchedFields: string[];
  differences: string[];

  recommendation:
    | 'LIKELY_MATCH'
    | 'REVIEW'
    | 'NO_MATCH';
}

function normalizeText(value: string | null): string {
  return (value || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getWords(value: string): Set<string> {
  return new Set(
    normalizeText(value)
      .split(' ')
      .filter(word => word.length >= 3)
  );
}

function wordSimilarity(a: string, b: string): number {
  const wordsA = getWords(a);
  const wordsB = getWords(b);

  if (wordsA.size === 0 || wordsB.size === 0) {
    return 0;
  }

  let common = 0;

  wordsA.forEach(word => {
    if (wordsB.has(word)) {
      common++;
    }
  });

  const totalUnique =
    new Set([...wordsA, ...wordsB]).size;

  return totalUnique === 0
    ? 0
    : common / totalUnique;
}

function fieldMatches(
  a: string | null,
  b: string | null
): boolean {
  if (!a || !b) {
    return false;
  }

  return normalizeText(a) === normalizeText(b);
}

export function harmonizeMaterial(
  source: DatabaseMaterial,
  target: DatabaseMaterial
): HarmonizationResult {

  const matchedFields: string[] = [];
  const differences: string[] = [];

  /* DESCRIPTION */

  const descriptionSimilarity =
    wordSimilarity(
      source.description || '',
      target.description || ''
    );

  if (descriptionSimilarity >= 0.5) {
    matchedFields.push('Description');
  } else {
    differences.push('Description differs');
  }


  /* SPECIFICATIONS */

  const specificationSimilarity =
    wordSimilarity(
      source.specifications || '',
      target.specifications || ''
    );

  if (specificationSimilarity >= 0.5) {
    matchedFields.push('Specifications');
  } else {
    differences.push('Specifications differ');
  }


  /* CATEGORY */

  if (
    fieldMatches(
      source.category,
      target.category
    )
  ) {
    matchedFields.push('Category');
  } else {
    differences.push('Category differs');
  }


  /*
   * Weighted similarity.
   */

  const similarity =
    (
      descriptionSimilarity * 0.45 +
      specificationSimilarity * 0.45 +
      (fieldMatches(
        source.category,
        target.category
      )
        ? 1
        : 0) * 0.10
    ) * 100;

  const similarityScore =
    Number(similarity.toFixed(1));


  /*
   * Recommendation.
   *
   * IMPORTANT:
   * This is a rule-based harmonization engine,
   * not a trained AI model.
   */

  let recommendation:
    | 'LIKELY_MATCH'
    | 'REVIEW'
    | 'NO_MATCH';

  if (
    similarityScore >= 85 &&
    matchedFields.length >= 2
  ) {
    recommendation = 'LIKELY_MATCH';
  } else if (
    similarityScore >= 50
  ) {
    recommendation = 'REVIEW';
  } else {
    recommendation = 'NO_MATCH';
  }


  return {
    source,
    target,
    similarityScore,
    matchedFields,
    differences,
    recommendation
  };
}


/*
 * Compare one material against all materials
 * belonging to other companies.
 */

export function findHarmonizationCandidates(
  source: DatabaseMaterial,
  materials: DatabaseMaterial[]
): HarmonizationResult[] {

  return materials
    .filter(
      material =>
        material.id !== source.id &&
        material.company !== source.company
    )
    .map(material =>
      harmonizeMaterial(
        source,
        material
      )
    )
    .filter(
      result =>
        result.recommendation !== 'NO_MATCH'
    )
    .sort(
      (a, b) =>
        b.similarityScore -
        a.similarityScore
    );
}