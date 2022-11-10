import { TableStatus } from "../database/Table";

export interface SystemSetupStatus {
  database: { name: string; tables: Record<string, TableStatus> };
}
