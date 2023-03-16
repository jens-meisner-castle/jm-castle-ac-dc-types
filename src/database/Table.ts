import {
  Row_DatapointControlLog,
  Row_DatapointLog,
  Row_Sample,
  Row_SampleDataLog,
  Row_SampleDatapoint,
} from "../row/index.js";

export const AllTableNames = {
  sample: "Stichprobe, Muster",
  sampleDatapoint: "Datenpunkte für Muster",
  sampleDataLog: "Daten für Muster",
  datapoint_log: "Zustand Datenpunkt",
  datapoint_control_log: "Zustand Steuerung Datenpunkt",
};

export type TableName = keyof typeof AllTableNames;

export type TableRows = {
  sample: Row_Sample;
  sampleDatapoint: Row_SampleDatapoint;
  sampleDataLog: Row_SampleDataLog;
  datapoint_log: Row_DatapointLog;
  datapoint_control_log: Row_DatapointControlLog;
};
