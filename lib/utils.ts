import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import crypto from "crypto";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertAmountFromMiliunits(amount: number) {
  return amount / 1000;
}

export function convertAmountToMiliunits(amount: number) {
  return Math.round(amount * 1000);
}

export function formatCurrency(
  value: number,
  options: { addPrefix: boolean } = { addPrefix: false }
) {
  const formattedValue = Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(value);

  if (options.addPrefix) {
    return formattedValue;
  }

  const withoutCurrencySymbol = formattedValue.replace(/[^\d.,-]/g, "");

  return withoutCurrencySymbol;
}

export function generateCheckoutHash() {
  const uniqueString = `${Date.now()}-${Math.random()}`;
  const hash = crypto
    .createHash("sha256")
    .update(uniqueString)
    .digest("base64url");
  return hash.slice(0, 15);
}

export function formatCustomerTax(value: string) {
  value = value.replace(/\D/g, "");
  if (value.length <= 11) {
    return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
  } else {
    return value.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      "$1.$2.$3/$4-$5"
    );
  }
}
