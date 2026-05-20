import type { ReactNode } from "react";
import { CheckIcon, RefreshIcon, SparkIcon } from "./Icons";

export const Panel = ({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) => (
  <section
    className={`relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-5 shadow-[0_20px_60px_-24px_rgba(15,23,42,0.95)] backdrop-blur-xl ${className}`}
  >
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.12),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(167,139,250,0.12),transparent_28%)]" />
    <div className="relative">{children}</div>
  </section>
);

export const SectionHeader = ({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) => (
  <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
    <div className="max-w-3xl space-y-2">
      {eyebrow ? (
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-cyan-300/80">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
        {title}
      </h2>
      {description ? (
        <p className="max-w-2xl text-sm leading-6 text-slate-300">
          {description}
        </p>
      ) : null}
    </div>
    {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
  </div>
);

export const MetricCard = ({
  label,
  value,
  detail,
  tone = "cyan",
  icon,
}: {
  label: string;
  value: string;
  detail: string;
  tone?: "cyan" | "violet" | "amber" | "emerald";
  icon?: ReactNode;
}) => {
  const toneMap = {
    cyan: "from-cyan-400/25 via-cyan-400/10 to-transparent text-cyan-200",
    violet:
      "from-violet-400/25 via-violet-400/10 to-transparent text-violet-200",
    amber: "from-amber-400/25 via-amber-400/10 to-transparent text-amber-200",
    emerald:
      "from-emerald-400/25 via-emerald-400/10 to-transparent text-emerald-200",
  }[tone];

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_12px_30px_-20px_rgba(15,23,42,0.8)] transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/8">
      <div
        className={`absolute inset-x-0 top-0 h-24 bg-linear-to-br ${toneMap} opacity-75`}
      />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            {label}
          </p>
          <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
          <p className="mt-2 text-sm text-slate-300">{detail}</p>
        </div>
        {icon ? (
          <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-3 text-white/90">
            {icon}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export const Badge = ({
  tone = "neutral",
  children,
}: {
  tone?: "neutral" | "success" | "warning" | "danger" | "accent";
  children: ReactNode;
}) => {
  const toneClass = {
    neutral: "border-white/10 bg-white/5 text-slate-200",
    success: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
    warning: "border-amber-400/20 bg-amber-400/10 text-amber-200",
    danger: "border-rose-400/20 bg-rose-400/10 text-rose-200",
    accent: "border-cyan-400/20 bg-cyan-400/10 text-cyan-200",
  }[tone];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${toneClass}`}
    >
      {children}
    </span>
  );
};

export const Button = ({
  children,
  variant = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
}) => {
  const variantClass = {
    primary:
      "border-cyan-400/30 bg-cyan-400/15 text-cyan-50 hover:bg-cyan-400/20",
    secondary: "border-white/10 bg-white/6 text-white hover:bg-white/10",
    ghost: "border-transparent bg-transparent text-slate-200 hover:bg-white/5",
    danger:
      "border-rose-400/30 bg-rose-400/15 text-rose-50 hover:bg-rose-400/20",
  }[variant];

  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-medium shadow-[0_10px_24px_-18px_rgba(15,23,42,0.8)] transition duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 ${variantClass} ${className}`}
    >
      {children}
    </button>
  );
};

export const Field = ({
  label,
  hint,
  children,
  className = "",
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) => (
  <label className={`grid gap-2 ${className}`}>
    <span className="text-sm font-medium text-slate-200">{label}</span>
    {children}
    {hint ? <span className="text-xs text-slate-400">{hint}</span> : null}
  </label>
);

export const TextInput = (
  props: React.InputHTMLAttributes<HTMLInputElement>,
) => (
  <input
    {...props}
    className={`w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/15 ${props.className ?? ""}`}
  />
);

export const TextArea = (
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) => (
  <textarea
    {...props}
    className={`min-h-30 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/15 ${props.className ?? ""}`}
  />
);

export const KeyValueEditor = ({
  items,
  onChange,
  emptyLabel = "Belum ada item",
  addLabel = "Add item",
  keyPlaceholder = "Key",
  valuePlaceholder = "Value",
}: {
  items: Array<{ key: string; value: string }>;
  onChange: (items: Array<{ key: string; value: string }>) => void;
  emptyLabel?: string;
  addLabel?: string;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
}) => {
  const updateItem = (index: number, field: "key" | "value", value: string) => {
    onChange(
      items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    );
  };

  const addItem = () => {
    onChange([...items, { key: "", value: "" }]);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, itemIndex) => itemIndex !== index));
  };

  return (
    <div className="grid gap-3">
      {items.length ? (
        items.map((item, index) => (
          <div
            key={`${item.key}-${index}`}
            className="grid gap-3 rounded-3xl border border-white/10 bg-slate-950/55 p-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] md:items-center"
          >
            <TextInput
              value={item.key}
              onChange={(event) => updateItem(index, "key", event.target.value)}
              placeholder={keyPlaceholder}
            />
            <TextInput
              value={item.value}
              onChange={(event) =>
                updateItem(index, "value", event.target.value)
              }
              placeholder={valuePlaceholder}
            />
            <div className="flex justify-end">
              <Button
                type="button"
                variant="ghost"
                onClick={() => removeItem(index)}
              >
                Remove
              </Button>
            </div>
          </div>
        ))
      ) : (
        <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 px-4 py-5 text-sm text-slate-300">
          {emptyLabel}
        </div>
      )}
      <div>
        <Button type="button" variant="secondary" onClick={addItem}>
          {addLabel}
        </Button>
      </div>
    </div>
  );
};

export const JsonPreviewCard = ({
  value,
  title = "Preview",
}: {
  value: unknown;
  title?: string;
}) => (
  <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-4">
    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
      {title}
    </p>
    <pre className="mt-3 overflow-auto rounded-2xl border border-white/10 bg-black/30 p-4 text-xs leading-6 text-cyan-100">
      {JSON.stringify(value, null, 2)}
    </pre>
  </div>
);

export const Select = (
  props: React.SelectHTMLAttributes<HTMLSelectElement>,
) => (
  <select
    {...props}
    className={`w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/15 ${props.className ?? ""}`}
  />
);

export const EmptyState = ({
  title,
  description,
  icon,
  action,
}: {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: ReactNode;
}) => (
  <div className="grid place-items-center gap-4 rounded-3xl border border-dashed border-white/10 bg-white/5 px-6 py-10 text-center">
    <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-cyan-200">
      {icon ?? <SparkIcon className="h-7 w-7" />}
    </div>
    <div className="max-w-md space-y-2">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="text-sm text-slate-300">{description}</p>
    </div>
    {action}
  </div>
);

export const MiniStat = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
    <p className="text-[0.7rem] uppercase tracking-[0.24em] text-slate-400">
      {label}
    </p>
    <p className="mt-2 text-lg font-semibold text-white">{value}</p>
  </div>
);

export const InlineLoader = ({ label = "Refreshing" }: { label?: string }) => (
  <span className="inline-flex items-center gap-2 text-sm text-slate-300">
    <RefreshIcon className="h-4 w-4 animate-spin text-cyan-300" />
    {label}
  </span>
);

export const SuccessLine = ({ children }: { children: ReactNode }) => (
  <div className="inline-flex items-center gap-2 text-sm text-emerald-200">
    <CheckIcon className="h-4 w-4" />
    <span>{children}</span>
  </div>
);
