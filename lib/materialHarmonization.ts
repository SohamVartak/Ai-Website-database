import { DatabaseMaterial } from '../src/context/AppContext';

export interface HarmonizationResult {
  source: DatabaseMaterial;
  target: DatabaseMaterial;
  similarityScore: number;
  matchedFields: string[];
  differences: string[];
  recommendation: 'LIKELY_MATCH' | 'REVIEW' | 'NO_MATCH';
}

function normalize(value: string | null | undefined): string {
  return (value || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function words(value: string | null | undefined): Set<string> {
  const stopWords = new Set([
    'the', 'and', 'for', 'with', 'of', 'in', 'to',
    'type', 'size', 'item', 'material', 'as', 'a'
  ]);

  return new Set(
    normalize(value)
      .split(' ')
      .filter(word => word.length >= 3 && !stopWords.has(word))
  );
}

function similarity(
  a: string | null | undefined,
  b: string | null | undefined
): number {
  const aWords = words(a);
  const bWords = words(b);

  if (aWords.size === 0 || bWords.size === 0) return 0;

  let common = 0;

  for (const word of aWords) {
    if (bWords.has(word)) common++;
  }

  const union = new Set([...aWords, ...bWords]).size;

  return union === 0 ? 0 : (common / union) * 100;
}

export function harmonizeMaterial(
  source: DatabaseMaterial,
  target: DatabaseMaterial
): HarmonizationResult {

  const descriptionScore = similarity(
    source.description,
    target.description
  );

  const specificationScore = similarity(
    source.specifications,
    target.specifications
  );

  const categoryScore =
    source.category &&
    target.category &&
    normalize(source.category) === normalize(target.category)
      ? 100
      : 0;

  const similarityScore = Math.round(
    descriptionScore * 0.45 +
    specificationScore * 0.45 +
    categoryScore * 0.10
  );

  const matchedFields: string[] = [];
  const differences: string[] = [];

  if (descriptionScore >= 50) {
    matchedFields.push('Description');
  } else {
    differences.push('Description differs');
  }

  if (specificationScore >= 50) {
    matchedFields.push('Specifications');
  } else {
    differences.push('Specifications differ');
  }

  if (categoryScore === 100) {
    matchedFields.push('Category');
  } else if (source.category && target.category) {
    differences.push('Category differs');
  }

  let recommendation: HarmonizationResult['recommendation'];

  if (similarityScore >= 80) {
    recommendation = 'LIKELY_MATCH';
  } else if (similarityScore >= 45) {
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

export function findCompanyMatches(
  source: DatabaseMaterial,
  materials: DatabaseMaterial[],
  targetCompany: string
): HarmonizationResult[] {

  return materials
    .filter(
      material =>
        material.company?.trim().toUpperCase() ===
        targetCompany.toUpperCase() &&
        material.id !== source.id
    )
    .map(material => harmonizeMaterial(source, material))
    .sort((a, b) => b.similarityScore - a.similarityScore);
}

export function findThreeCompanyHarmonization(
  source: DatabaseMaterial,
  materials: DatabaseMaterial[]
) {
  const hpcl = findCompanyMatches(source, materials, 'HPCL')[0] || null;
  const iocl = findCompanyMatches(source, materials, 'IOCL')[0] || null;

  return {
    source,
    hpcl,
    iocl
  };
}