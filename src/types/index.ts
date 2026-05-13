export interface CameraNodeData {
    cameraId: string;
    label: string;
    snapshotUrl?: string;
}

export interface DetectorNodeData {
    modules: string[];
}

export interface ActionNodeData {
    channels: string[];
}

export interface VLMSearchNodeData {
    query: string;
    channel: string;        // "whatsapp" | "email"
    intervalFrames: number;
    imageKey?: string;       // MinIO object key of the uploaded test image
}

export type CustomNodeData = CameraNodeData | DetectorNodeData | ActionNodeData | VLMSearchNodeData;

export interface ZoneData {
    cameraId: string;
    name: string;
    points: number[][];
}