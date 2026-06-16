export type PricingTier = "small" | "medium" | "large";

export interface TierConfig {
  key: PricingTier;
  name: string;
  priceMonthly: number;
  storageGB: number;
  aiTokensMonthly: number;
  maxUsers: number;
  maxSites: number;
  aiCreditsLabel: string;
}

export const PRICING_TIERS: TierConfig[] = [
  {
    key: "small",
    name: "Small",
    priceMonthly: 249,
    storageGB: 25,
    aiTokensMonthly: 1_000_000,
    maxUsers: 25,
    maxSites: 2,
    aiCreditsLabel: "1M tokens / month",
  },
  {
    key: "medium",
    name: "Medium",
    priceMonthly: 449,
    storageGB: 75,
    aiTokensMonthly: 3_000_000,
    maxUsers: 100,
    maxSites: 10,
    aiCreditsLabel: "3M tokens / month",
  },
  {
    key: "large",
    name: "Large",
    priceMonthly: 649,
    storageGB: 200,
    aiTokensMonthly: 6_000_000,
    maxUsers: 500,
    maxSites: 50,
    aiCreditsLabel: "6M tokens / month",
  },
];

export const STORAGE_ADDON_GB = 25;
export const STORAGE_ADDON_PRICE = 29;
export const MAX_UPLOAD_MB = 10;
