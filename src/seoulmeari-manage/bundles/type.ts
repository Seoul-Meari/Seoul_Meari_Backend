import { AssetStatus } from './enums/asset-status.enum';

export type AssetUsage = 'historical' | 'promo' | 'both';
export type AssetOS = 'android' | 'ios';

export interface LayoutJson {
  name: string;
  version: string;
  os: AssetOS;
  usage: AssetUsage;
  status: AssetStatus;
  tags: string[];
  prefabs: Array<{
    id: string;
    name: string;
    sizeMB: number;
    tags: string[];
  }>;
  placementGroups: unknown[]; // Keep validation simple for this complex field
  totalSizeMB: number;
  description?: string;
  bundleUrl?: string; // Not in the new example, so made optional
}
