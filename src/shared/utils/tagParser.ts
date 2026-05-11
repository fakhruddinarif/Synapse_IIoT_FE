import { ProtocolType } from "@core/domain/enums";
import type { TagAddress } from "@core/domain/value-objects";

/** Parses a raw tag address into a structured object. */
export const parseTagAddress = (
  raw: string,
  protocol: ProtocolType,
): TagAddress => {
  const [path, query] = raw.split("?");
  const metadata: Record<string, string> = {};

  if (query) {
    query.split("&").forEach((pair) => {
      const [key, value] = pair.split("=");
      if (key && value) {
        metadata[key] = value;
      }
    });
  }

  return {
    raw,
    protocol,
    path,
    metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
  };
};
