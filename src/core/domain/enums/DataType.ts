/** Data types for tag payloads. */
export const DataType = {
  Boolean: "Boolean",
  Int16: "Int16",
  Int32: "Int32",
  Int64: "Int64",
  Float: "Float",
  Double: "Double",
  String: "String",
} as const;

export type DataType = (typeof DataType)[keyof typeof DataType];
