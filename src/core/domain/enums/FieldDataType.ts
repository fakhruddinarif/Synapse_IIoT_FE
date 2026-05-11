/** Field data types for master table fields. */
export const FieldDataType = {
  String: "String",
  Integer: "Integer",
  Float: "Float",
  Boolean: "Boolean",
  DateTime: "DateTime",
} as const;

export type FieldDataType = (typeof FieldDataType)[keyof typeof FieldDataType];
