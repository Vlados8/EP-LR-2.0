// Points & bonus configuration per package
export const PACKAGES = {
  starter: { label: 'Starter', multiplier: 0 },
  popular: { label: 'Popular (Start Pack)', multiplier: 1 },
  business: { label: 'Business (Standard Pack)', multiplier: 1.5 },
  premium: { label: 'Premium Pack', multiplier: 2 },
} as const;

export type PackageType = keyof typeof PACKAGES;

// Referral bonus percentages per level
export const REFERRAL_BONUSES: Record<number, number> = {
  1: 20, // Level 1 — direct sponsor
  2: 10, // Level 2
  3: 5,  // Level 3
};

// Base points for approved project
export const BASE_PROJECT_POINTS = 100;

export function calculatePoints(
  basePoints: number,
  level: number,
  packageType: PackageType
): number {
  const bonusPercent = REFERRAL_BONUSES[level] ?? 0;
  const multiplier = PACKAGES[packageType]?.multiplier ?? 0;
  if (level === 0) {
    // Project author always gets base points
    return basePoints;
  }
  if (multiplier === 0) return 0; // Starter — no referral bonuses
  return Math.round((basePoints * bonusPercent / 100) * multiplier);
}
