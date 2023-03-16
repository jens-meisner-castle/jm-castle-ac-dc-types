export type PersistentRow = Record<string, unknown>;

export interface Row_Datapoint extends PersistentRow {
  datapoint_id: string;
  name: string;
  value_unit?: string;
  value_type: string;
  description?: string;
  meaning?: string;
}

export interface Row_Sample extends PersistentRow {
  sample_id: string;
  name: string;
  description?: string;
  length_in_ms: number;
}
export interface Row_SampleDatapoint extends Row_Datapoint {
  sample_id: string;
}

export interface Row_SampleDataLog extends PersistentRow {
  sample_id: string;
  datapoint_id: string;
  value_num?: number;
  value_string?: string;
  changed_at: number;
  changed_at_ms: number;
}
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
