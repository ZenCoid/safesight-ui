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

export type CustomNodeData = CameraNodeData | DetectorNodeData | ActionNodeData;

export interface ZoneData {
    cameraId: string;
    name: string;
    points: number[][];
}