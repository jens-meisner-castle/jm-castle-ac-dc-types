import { TableStatus } from "../database/Table.js";

export interface SystemSetupStatus {
  database: { name: string; tables: Record<string, TableStatus> };
}
