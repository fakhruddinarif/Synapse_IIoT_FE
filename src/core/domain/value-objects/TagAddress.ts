import { ProtocolType } from "../enums";

/** Parsed tag address for a given protocol. */
export interface TagAddress {
  raw: string;
  protocol: ProtocolType;
  path: string;
  metadata?: Record<string, string>;
}
