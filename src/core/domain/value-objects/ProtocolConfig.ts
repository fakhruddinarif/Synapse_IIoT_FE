import { ProtocolType } from "../enums";

/** Runtime configuration used to connect to a protocol endpoint. */
export interface ProtocolConfig {
  type: ProtocolType;
  host: string;
  port: number;
  unitId?: number;
  options?: Record<string, string | number | boolean>;
}
