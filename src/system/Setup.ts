import { TableStatus } from "jm-castle-types";

export interface SystemSetupStatus {
  database: { name: string; tables: Record<string, TableStatus> };
}
