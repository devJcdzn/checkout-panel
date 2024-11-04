import CurrencyInput from "react-currency-input-field";
import { cn } from "@/lib/utils";

interface Props {
  value?: string;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  isExpense?: boolean;
}

export function AmountInput({
  value,
  onChange,
  placeholder,
  disabled,
  isExpense,
}: Props) {
  return (
    <>
      <CurrencyInput
        className="pl-2 flex h-10 w-full rounded-md border border-input 
        bg-background px-3 py-2 text-sm ring-offset-background 
        file:border-0 file:bg-transparent file:text-sm 
        file:font-medium placeholder:text-muted-foreground 
        focus-visible:outline-none focus-visible:ring-2 
        focus-visible:ring-ring focus-visible:ring-offset-2 
        disabled:cursor-not-allowed disabled:opacity-50"
        prefix="R$"
        placeholder={placeholder}
        value={value}
        decimalsLimit={2}
        decimalScale={2}
        decimalSeparator=","
        groupSeparator="."
        onValueChange={onChange}
        disabled={disabled}
      />
    </>
  );
}
