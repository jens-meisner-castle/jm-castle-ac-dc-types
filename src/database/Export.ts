import {
  Row_DatapointControlLog,
  Row_DatapointLog,
  Row_Sample,
  Row_SampleDataLog,
  Row_SampleDatapoint,
} from "../row/index.js";

export interface DbExportData {
  version: { software: string; db: string };
  tables: {
    sample: { rows: Row_Sample };
    sampleDatapoint: { rows: Row_SampleDatapoint };
    sampleDataLog: { rows: Row_SampleDataLog };
    datapointLog: { rows: Row_DatapointLog[] };
    datapointControlLog: { rows: Row_DatapointControlLog[] };
  };
}
