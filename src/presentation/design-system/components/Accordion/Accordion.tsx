import { useState, type ReactNode } from "react";

export interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
}

/** Collapsible content panels. */
export const Accordion = ({ items }: AccordionProps) => {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div
          key={item.id}
          className="rounded-lg border border-default bg-elevated"
        >
          <button
            className="flex w-full items-center justify-between px-4 py-3 text-left text-sm text-primary"
            onClick={() => setOpenId(openId === item.id ? null : item.id)}
          >
            {item.title}
            <span>{openId === item.id ? "−" : "+"}</span>
          </button>
          {openId === item.id && (
            <div className="border-t border-default px-4 py-3 text-sm text-secondary">
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
