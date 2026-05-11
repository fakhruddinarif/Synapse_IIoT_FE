/** Tag access mode. */
export const AccessMode = {
  Read: "Read",
  Write: "Write",
  ReadWrite: "ReadWrite",
} as const;

export type AccessMode = (typeof AccessMode)[keyof typeof AccessMode];
