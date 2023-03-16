import { Row_DatapointControlLog, Row_DatapointLog } from "../row/index.js";

export interface DbExportData {
  version: { software: string; db: string };
  tables: {
    datapointLog: { rows: Row_DatapointLog[] };
    datapointControlLog: { rows: Row_DatapointControlLog[] };
  };
}
