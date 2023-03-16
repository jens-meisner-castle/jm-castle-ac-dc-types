import { Row_DatapointControlLog, Row_DatapointLog } from "../row/index.js";

export const AllTableNames = {
  datapoint_log: "Zustand Datenpunkt",
  datapoint_control_log: "Zustand Steuerung Datenpunkt",
};

export type TableName = keyof typeof AllTableNames;

export type TableRows = {
  datapoint_log: Row_DatapointLog;
  datapoint_control_log: Row_DatapointControlLog;
};
