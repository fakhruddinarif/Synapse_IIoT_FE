import type { Tag } from "../domain/entities";

/** Repository contract for tag operations. */
export interface ITagRepository {
  getTags(): Promise<Tag[]>;
  getTagsByDevice(deviceId: string): Promise<Tag[]>;
  getTagById(tagId: string): Promise<Tag | null>;
}
