import { SelectProps } from "@radix-ui/react-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../atoms";

export interface IOption {
  label: string;
  value: string;
}

export interface SelectFieldProps extends SelectProps {
  placeholder?: string;
  options: IOption[];
  className?: string;
}

export const SelectField = ({
  placeholder,
  options,
  className,
  ...restProps
}: SelectFieldProps) => {
  return (
    <div>
      <Select {...restProps}>
        <SelectTrigger className={className}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
