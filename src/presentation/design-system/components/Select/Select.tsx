import SelectBase, { type Props } from "react-select";

export type SelectProps = Props;

/** Styled react-select wrapper. */
export const Select = (props: SelectProps) => (
  <SelectBase
    classNamePrefix="synapse"
    styles={{
      control: (base) => ({
        ...base,
        backgroundColor: "var(--color-bg-surface)",
        borderColor: "var(--color-border-default)",
        boxShadow: "none",
      }),
      menu: (base) => ({
        ...base,
        backgroundColor: "var(--color-bg-overlay)",
        borderColor: "var(--color-border-default)",
      }),
      singleValue: (base) => ({
        ...base,
        color: "var(--color-text-primary)",
      }),
      placeholder: (base) => ({
        ...base,
        color: "var(--color-text-muted)",
      }),
    }}
    {...props}
  />
);
