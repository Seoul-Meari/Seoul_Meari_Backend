export type AssetUsage = 'historical' | 'promo' | 'both';
export type AssetOS = 'android' | 'ios';
export interface Transform3D {
  location: Location;
  rotation: Rotation;
  scale: Scale;
}

export interface Location {
  latitude: number;
  longitude: number;
  altitude: number;
}

export interface Rotation {
  x: number;
  y: number;
  z: number;
}

export interface Scale {
  x: number;
  y: number;
  z: number;
}

export interface PrefabDefinition {
  id: string;
  name: string;
  sizeMB: number;
  tags: string[];
}

// 프리팹 배치 그룹 (여러 transform을 한 번에)
export interface PrefabPlacementGroup {
  groupId: string;
  prefabId: string;
  transforms: Transform3D[];
  active?: boolean;
}

export interface LayoutJson {
  bundleId: string;
  bundleUrl?: string;

  // 메타데이터
  name: string;
  os: AssetOS;
  version: string;
  usage: AssetUsage;

  // 부가 정보
  tags: string[];
  description?: string;

  mainLocation: Location;

  // 시간 관련
  updatedAt: string;

  // 크기
  totalSizeMB: number;

  // 에셋 관련
  prefabs: PrefabDefinition[];
  placementGroups: PrefabPlacementGroup[];
}
