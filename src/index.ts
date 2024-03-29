import {
  isWsMessage,
  msg_ping,
  msg_pong,
  msg_publish,
  msg_subscribe,
  msg_welcome,
  WsMessage,
  WsMethod,
  WsMethods,
} from "jm-castle-types/build";
import { DateTime, Duration } from "luxon";
import {
  AllTableNames,
  DbExportData,
  TableName,
  TableRows,
} from "./database/index.js";
import {
  PersistentRow,
  Row_AnyLog,
  Row_Datapoint,
  Row_DatapointControlLog,
  Row_DatapointLog,
  Row_Sample,
  Row_SampleDataLog,
  Row_SampleDatapoint,
} from "./row/index.js";
import {
  DurationUnit,
  DurationUnits,
  getCategoryOfUnit,
  isDurationUnit,
  LuxonKey,
  ValueType,
  ValueTypes,
  ValueUnit,
  ValueUnits,
} from "./value-type/index.js";

export { AllTableNames, TableName, TableRows, DbExportData };
export {
  PersistentRow,
  Row_AnyLog,
  Row_DatapointControlLog,
  Row_DatapointLog,
  Row_Datapoint,
  Row_Sample,
  Row_SampleDatapoint,
  Row_SampleDataLog,
};
export {
  ValueType,
  ValueTypes,
  DurationUnit,
  DurationUnits,
  isDurationUnit,
  LuxonKey,
  ValueUnit,
  ValueUnits,
  getCategoryOfUnit,
};
export {
  WsMethods,
  WsMethod,
  WsMessage,
  isWsMessage,
  msg_ping,
  msg_pong,
  msg_publish,
  msg_subscribe,
  msg_welcome,
};

export type AnyDate = Date;
export type AnyNumber = number;
export type AnyString = string;
export type AnyBoolean = boolean;
export type AnyDataValue =
  | AnyString
  | AnyDate
  | AnyNumber
  | AnyBoolean
  | null
  | undefined;

export type ControlPartTypeId = "sys-freezers-control" | "sys-action";

export type PhysicalDeviceTypeId =
  | "shelly-1-pm"
  | "shelly-plug-s"
  | "shelly-1"
  | "shelly-2-5"
  | "bosswerk-mi-600"
  | "hichi-sml-reader";

export type SimulationDeviceTypeId =
  | "sim-seconds"
  | "sim-const"
  | "sim-file"
  | "sim-day-night";

export type DeviceTypeId =
  | PhysicalDeviceTypeId
  | SimulationDeviceTypeId
  | "mqtt";

export type DatapointValueType = keyof typeof ValueTypes;

export type DatapointValueUnit = keyof typeof ValueUnits;

/**
 * @param name beschreibender Name
 * @param note optionale Bemerkungen
 * @param valueType Datentyp
 * @param valueUnit physikalische Einheit (bei valueType = number)
 */
export interface DatapointAspects {
  name: string;
  note?: string;
  valueType: DatapointValueType;
  valueUnit?: keyof typeof ValueUnits;
}

export type LocalDatapointId = string;

export type PublicDatapointId = string;

/**
 * @param id globale id (eindeutig im System)
 */
export type Datapoint = DatapointAspects & {
  deviceId?: never;
  localId?: never;
  id: string;
};

/**
 * @param deviceId id (eindeutig im System) des Geräts, zu dem der Datenpunkt gehört
 * @param localId Gerät lokal eindeutige id des Datenpunktes
 */
export type DeviceDatapoint = DatapointAspects & {
  deviceId: string;
  localId: LocalDatapointId;
  id: string;
};

/**
 * @param localId Gerät lokal eindeutige id des Datenpunktes
 */
export type LocalDatapoint = DatapointAspects & {
  deviceId?: never;
  localId: LocalDatapointId;
  id?: never;
};

export type UniqueDatapoint = Datapoint | DeviceDatapoint;

export const isLocalDatapoint = (
  datapoint: Datapoint | LocalDatapoint | DeviceDatapoint
): datapoint is LocalDatapoint => {
  return !datapoint.id && !datapoint.deviceId;
};

export const isDeviceDatapoint = (
  datapoint: Datapoint | LocalDatapoint | DeviceDatapoint
): datapoint is DeviceDatapoint => {
  return !!datapoint.deviceId && !!datapoint.localId;
};

export interface SimulationSpec {
  dateLevel: "day" | "year";
}

export interface SerializableDeviceType {
  id: DeviceTypeId;
  name: string;
  description?: string;
  isSimulation: boolean;
  simulation?: SimulationSpec;
  examples?: Device[];
  datapoints: Record<string, LocalDatapoint>;
  controlDatapoints: Record<string, LocalDatapoint>;
}

export interface Device {
  id: string;
  ipAddress: string;
  webInterface?: string;
  api: string;
  type: DeviceTypeId;
  datapoints?: Record<string, LocalDatapoint>;
  suppressPeaks?: Record<string, { max: number }>;
  controlDatapoints?: Record<string, LocalDatapoint>;
  mapControlDatapoints?: Record<
    string,
    | { id?: never; localId?: string; name?: string }
    | { id?: string; localId?: never; name?: string }
  >;
  mapDatapoints?: Record<
    string,
    | { id?: never; localId?: string; name?: string }
    | { id?: string; localId?: never; name?: string }
  >;
}

export interface DatapointState {
  id: string;
  at: number;
  valueNum?: number;
  valueString?: string;
}

export interface DatapointSequence {
  id: string;
  point: UniqueDatapoint;
}

export interface SequenceState {
  id: string;
  at: number;
  data: DatapointState[];
}

export interface DeviceStatus {
  responsive: boolean;
  accessedAt: number;
  error?: string;
  datapoints: Record<string, DatapointState>;
}

export interface EngineSettings {
  lapDuration: number;
}

export interface SerializableEngine {
  key: string;
  settings: EngineSettings;
  actions: Record<string, ActionSpec>;
}

export interface EngineStatus {
  lastStartedAt: number | undefined;
  lastLapEndAt: number | undefined;
  running: boolean;
  duration: {
    consumed: { total: number; lapStart: number; lapEnd: number };
    laps: number;
  };
  errors: { lap: number; errors: string[] }[];
}

export type EngineControlResponse =
  | { success: true; error?: never }
  | { success: false; error: string };

export type SystemControlResponse =
  | { success: true; error?: never }
  | { success: false; error: string };

export type SimulationPreviewResponse =
  | {
      result: {
        datapoints: Record<string, UniqueDatapoint>;
        data: Record<string, DatapointState[]>;
      };
      error?: never;
      errorDetails?: never;
    }
  | {
      result?: never;
      error: string;
    };

export interface QueryParametersSchema {
  type: "object";
  properties: Record<string, unknown>;
  required?: string[];
}

export interface SerializableService {
  url: string;
  parameters?: QueryParametersSchema;
  method: "GET" | "POST";
  name: string;
  scope?: "public" | "private";
}

export interface DatacollectorSpec {
  lapDuration: number;
  onEvent?: boolean;
  devices: Record<string, { datapoints: string[] }>;
}

export interface DatapointTargetSpec {
  device: string;
  datapoint: LocalDatapointId | PublicDatapointId;
}

type DatapointId = string;

export type DeviceControlRequest = Record<
  DatapointId,
  {
    target: DatapointTargetSpec;
    state: DatapointState;
  } & ControlExecutionSpec
>;

export type SerializableControlPartType = {
  id: ControlPartTypeId;
  name: string;
  description?: string;
  examples?: ControlPartSpec[];
  input: Record<string, Datapoint>;
  output: Record<string, Datapoint>;
};

export type ControlExecutionSpec = { when: "lap-end" | "part-end" | "never" };

export interface ControlPartSpec {
  type: ControlPartTypeId;
  input: Record<string, string>;
  output: Record<string, DatapointTargetSpec & ControlExecutionSpec>;
}

export const PersistenceAreas = {
  "datapoint-log": "Log für Zustand von Datenpunkten",
  "datapoint-control-log": "Log für Steuerung von Datenpunkten",
};

export type DeviceControlResponse =
  | { success: true; error?: never }
  | { success: false; error: string };

export interface StatePersistTargetSpec {
  to: string;
  into: keyof typeof PersistenceAreas;
  datapoints: string[];
}

export interface ControlPersistTargetSpec {
  to: string;
  into: keyof typeof PersistenceAreas;
  datapoints: Record<string, LocalDatapointId[]>;
}

export type DatapointMapping = Record<string, { id: string; name?: string }>;

export interface DatapointCalculationSpec {
  name: string;
  code: string;
  valueType: DatapointValueType;
  valueUnit?: DatapointValueUnit;
}

export const SequenceConditionChangeAspects = {
  value:
    "Add the new state, if the value of the new state is different to the value of the latest state in the sequence.",
  at: "Add the new state, if the date ('at' property) of the new state is different to the date of the latest state in the sequence",
};

export type SequenceCondition = {
  change: keyof typeof SequenceConditionChangeAspects;
};

export type SequenceLimit =
  | { maxCount: number; maxAge?: never }
  | { maxCount?: never; maxAge: { count: number; unit: DurationUnit } };

export interface DatapointSequenceSpec {
  sequenceId: string;
  datapointId: string;
  limit: SequenceLimit;
  condition: SequenceCondition;
}

export interface StatePartSpec {
  mapDatapoints?: DatapointMapping;
  calculateDatapoints?: Record<string, DatapointCalculationSpec>;
  sequenceDatapoints?: DatapointSequenceSpec[];
}

export const ControlActionTypes = {
  toggle: {
    description:
      'Toggles the value of the "target" datapoint between "true" and "false". Depends on the "source" datapoint.',
    paramKeys: {
      source: '"target" or UniqueDatapoint',
      ifSourceUndefined: { valueNum: 0, valueString: "false" },
      target: {
        device: "<the target device id>",
        datapoint: "<the target datapoint id",
      },
    },
  },
  increase: {
    description:
      'Increases the value of the target datapoint using a source and "params.increase" or 1 without parameter.',
    paramKeys: {
      source: '"target" or UniqueDatapoint',
      ifSourceUndefined: { valueNum: 0 },
      increase: { valueNum: 1 },
      target: {
        device: "<the target device id>",
        datapoint: "<the target datapoint id",
      },
    },
  },
};

export interface ControlActionValueParameter {
  valueNum?: number;
  valueString?: string;
}

export interface ControlAction {
  type: keyof typeof ControlActionTypes;
  params: {
    source: UniqueDatapoint | "target";
    target: DatapointTargetSpec;
  } & Record<string, ControlActionValueParameter>;
}

export interface ActionSpec {
  id: string;
  name: string;
  execution: ControlAction[];
}

export interface EngineSpec {
  id: string;
  autoStart?: boolean;
  collect?: DatacollectorSpec;
  controls?: ControlPartSpec[];
  actions?: Record<string, ActionSpec>;
  persistState?: StatePersistTargetSpec[];
  stateParts?: StatePartSpec[];
  persistControl?: ControlPersistTargetSpec[];
}

export interface MailingSMTPSpec {
  type: "smtp";
  host: string;
  port: number;
  user: string;
  password: string;
}

export interface MariaDatabaseSpec {
  type: "maria-db";
  database: string;
  host: string;
  port: number;
  user: string;
  password: string;
}

export type PersistenceSpec = { isDefault?: boolean } & MariaDatabaseSpec;

export type MailingSpec = {
  isDefault?: boolean;
  defaultReceivers?: string[];
} & MailingSMTPSpec;

export interface SystemSpec {
  name?: string;
  host: string;
  port: number;
  certs: {
    ca?: string;
    hostCert: string;
    hostKey: string;
  };
  client?: {
    path: string;
  };
}

export interface Configuration {
  system?: SystemSpec;
  persistence: Record<string, PersistenceSpec>;
  mail: Record<string, MailingSpec>;
  devices: Record<string, Device>;
  engines: Record<string, EngineSpec>;
}

export interface CheckedConfiguration extends Configuration {
  isValid?: boolean;
}

export interface SystemStatus {
  startedAt: number;
  configuration: {
    content: CheckedConfiguration;
    errors: string[] | undefined;
    valid: CheckedConfiguration;
  };
}

export interface PreviewOptions {
  interval?: { from: DateTime; to: DateTime };
  precision?: Duration;
}

export interface DatastateContent {
  datapoints: Record<string, UniqueDatapoint>;
  datapointStates: Record<string, DatapointState>;
  sequences: Record<string, DatapointSequence>;
  sequenceStates: Record<string, SequenceState>;
}

export type DeviceId = string;

export type DatapointTargets = Record<DeviceId, DeviceControlRequest>;

export interface SerializableControlContext {
  engineId: string;
  datapointTargets: DatapointTargets;
  executedRequests: {
    deviceId: string;
    request: DeviceControlRequest;
    success: boolean;
    error?: string;
  }[];
}

export interface ControlstateContent {
  controls: Record<string, { context: SerializableControlContext }>;
}
