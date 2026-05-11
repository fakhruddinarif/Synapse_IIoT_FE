/** Tag quality emitted by the SignalR hub. */
export type TagQuality = "Good" | "Bad" | "Uncertain";

/** Individual tag value in SignalR payload. */
export interface TagLiveValue {
  tagId: string;
  rawValue: number | null;
  engValue: number | null;
  quality: TagQuality;
  updatedAt: string;
}

/** Tag value map keyed by tag id. */
export type TagValueMap = Record<string, TagLiveValue>;

/** SignalR payload for device data updates. */
export interface DeviceDataPayload {
  deviceId: string;
  tagValues: TagValueMap;
  timestamp: string;
}

/** SignalR payload for device status updates. */
export interface DeviceStatusPayload {
  deviceId: string;
  isConnected: boolean;
  lastSeen: string | null;
  errorMessage: string | null;
}

/** SignalR payload for errors. */
export interface SignalRErrorPayload {
  message: string;
  code?: string;
}
