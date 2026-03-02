export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Detection {
  bbox: BoundingBox;
  class: string;
  score: number;
}

export interface DetectionResult {
  detections: Detection[];
  largestCarBbox: BoundingBox | null;
}

