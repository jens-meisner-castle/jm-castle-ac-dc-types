export type PersistentRow = Record<string, unknown>;

export interface Row_DatapointLog extends PersistentRow {
  datapoint_id: string;
  value_num?: number;
  value_string?: string;
  logged_at: number;
  logged_at_ms: number;
  changed_at: number;
  changed_at_ms: number;
}

export interface Row_DatapointControlLog extends PersistentRow {
  device_id: string;
  datapoint_id: string;
  value_num?: number;
  value_string?: string;
  executed: number;
  success: number;
  logged_at: number;
  logged_at_ms: number;
}

export type Row_AnyLog =
  | Row_DatapointControlLog
  | (Row_DatapointLog & { executed: never; success: never });
