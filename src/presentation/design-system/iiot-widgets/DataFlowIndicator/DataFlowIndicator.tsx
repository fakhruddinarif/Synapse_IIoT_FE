export interface DataFlowIndicatorProps {
  label?: string;
}

/** Animated data flow indicator for real-time streams. */
export const DataFlowIndicator = ({
  label = "Streaming",
}: DataFlowIndicatorProps) => (
  <div className="flex items-center gap-2 text-xs text-brand">
    <span className="relative h-2 w-8 overflow-hidden rounded-full bg-[var(--color-brand-faint)]">
      <span className="absolute inset-0 bg-[linear-gradient(90deg,transparent,var(--color-brand-primary),transparent)] animate-[data-flow_1.4s_linear_infinite]" />
    </span>
    {label}
  </div>
);
