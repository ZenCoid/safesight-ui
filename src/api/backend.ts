import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000',
});

export interface Camera {
    id: string;
    name: string;
    rtsp_url: string;
    enabled: boolean;
    health_status: string;
    current_fps: number;
    created_at: string;
    updated_at: string;
}

export interface PolygonZone {
    name: string;
    points: number[][]; // normalized 0‑1
}

export interface ScheduleWindow {
    days: string[];
    start_time: string;
    end_time: string;
    timezone: string;
}

export interface EscalationLevel {
    channels: string[];
    delay_seconds: number;
    unacknowledged_seconds?: number;
}

export interface MultiCameraLink {
    trigger_camera_id: string;
    target_camera_id: string;
    action: 'increase_sensitivity' | 'enable_rule' | 'disable_rule';
    rule_ids?: string[];
}

export interface RuleDefinition {
    rule_id: string;
    rule_name: string;
    version: string;
    enabled: boolean;
    cameras: string[];
    detection_modules: string[];
    zones: PolygonZone[];
    confidence_threshold: number;
    min_duration_seconds: number;
    cooldown_seconds: number;
    schedule: ScheduleWindow | null;
    escalation_levels: EscalationLevel[];
    multi_camera_links: MultiCameraLink[];   // now correctly typed
    condition: string;
}

export interface PinnedSearchRequest {
    query: string;
    channel: string;
    interval_frames: number;
    minio_keys: string[];
    camera_id?: string;
    rule_id?: string;
}

export const getCameras = () => api.get<Camera[]>('/cameras/');
export const createRule = (rule: RuleDefinition) => api.post('/rules/', rule);
export const createPinned = (payload: PinnedSearchRequest) => api.post('/v1/pinned', payload);