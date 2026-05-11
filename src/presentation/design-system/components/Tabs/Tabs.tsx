import { useState, type ReactNode } from "react";
import { cn } from "@shared/utils";

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  defaultTabId?: string;
}

/** Animated tab switcher. */
export const Tabs = ({ items, defaultTabId }: TabsProps) => {
  const [active, setActive] = useState(defaultTabId ?? items[0]?.id);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 rounded-lg border border-default bg-subtle p-1">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            className={cn(
              "flex-1 rounded-md px-3 py-2 text-sm transition",
              active === item.id
                ? "bg-[var(--color-brand-primary)] text-inverse"
                : "text-secondary hover:bg-elevated",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div>{items.find((item) => item.id === active)?.content}</div>
    </div>
  );
};
