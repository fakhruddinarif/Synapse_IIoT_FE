import { create } from "zustand";
import type { TagValueMap } from "@shared/types";

/** Real-time tag value cache. */
export interface TagState {
  tagValues: TagValueMap;
  setTagValues: (values: TagValueMap) => void;
  setTagValue: (tagId: string, value: TagValueMap[string]) => void;
  clearTagValues: () => void;
}

export const useTagStore = create<TagState>((set) => ({
  tagValues: {},
  setTagValues: (tagValues) => set({ tagValues }),
  setTagValue: (tagId, value) =>
    set((state) => ({
      tagValues: { ...state.tagValues, [tagId]: value },
    })),
  clearTagValues: () => set({ tagValues: {} }),
}));
