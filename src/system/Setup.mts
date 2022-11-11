import { TableStatus } from "../database/Table.mjs";

export interface SystemSetupStatus {
  database: { name: string; tables: Record<string, TableStatus> };
}
