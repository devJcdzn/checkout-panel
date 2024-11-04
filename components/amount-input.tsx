import CurrencyInput from "react-currency-input-field";

interface Props {
  value?: string;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function AmountInput({ value, onChange, placeholder, disabled }: Props) {
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
