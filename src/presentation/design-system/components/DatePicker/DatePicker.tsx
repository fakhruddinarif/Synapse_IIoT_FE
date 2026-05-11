import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export interface DatePickerProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
}

/** Date picker wrapper with Synapse styling. */
export const DatePicker = ({ selected, onChange }: DatePickerProps) => (
  <ReactDatePicker
    selected={selected}
    onChange={onChange}
    className="w-full rounded-md border border-default bg-surface px-3 py-2 text-sm text-primary"
    popperClassName="z-50"
  />
);
