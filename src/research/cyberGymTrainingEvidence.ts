/**
 * Seed CyberGym rows stay visible as catalog evidence.
 * A VERIFIED catalog status is not an earned or external accreditation.
 */

export interface TrainingCatalogRow {
  id: string;
  code: string;
  name: string;
  status: string;
  achievedScore?: number;
}

export function presentTrainingEvidence<T extends TrainingCatalogRow>(rows: T[]) {
  const seedCatalogCount = rows.filter((row) => row.status === 'VERIFIED').length;
  return {
    proposedAcademyName: 'AEGENTIX Academy',
    proposedNameOnly: true,
    renamed: false,
    earnedCount: 0,
    externalAccreditationCount: 0,
    seedCatalogCount,
    rows: rows.map((row) => ({
      id: row.id,
      code: row.code,
      name: row.name,
      catalogStatus: row.status,
      evidenceClass: 'SEED_FIXTURE' as const,
      earned: false as const,
      externalAccreditation: false as const,
      achievedScore: typeof row.achievedScore === 'number' ? row.achievedScore : null,
      scoreIsSeedClaim: true as const,
    })),
  };
}
