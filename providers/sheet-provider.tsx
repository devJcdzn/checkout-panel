"use client";

import { Toaster } from "@/components/ui/toaster";
import { NewCheckoutSheet } from "@/features/checkouts/components/create-checkout-sheet";
import { EditCheckoutSheet } from "@/features/checkouts/components/edit-checkout-sheet";
import { NewProductSheet } from "@/features/products/components/new-product-sheet";
import { useMountedState } from "react-use";

export function SheetProvider() {
  const isMounted = useMountedState();

  if (!isMounted) return null;

  return (
    <>
      <NewProductSheet />
      <NewCheckoutSheet />
      <EditCheckoutSheet />
      {/* toaster shadcn provider */}
      <Toaster />
    </>
  );
}
