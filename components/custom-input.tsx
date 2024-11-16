"use client";
import type { ComponentProps } from "react";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";

export const CustomInput = ({
  bgColor,
  ...props
}: ComponentProps<"input"> & { bgColor?: string }) => {
  return (
    <Input
      {...props}
      className={cn(
        "block w-full rounded-[10px] bg-[#272727] py-[0.70rem] text-sm outline-none placeholder:text-xs placeholder:text-muted-foreground focus:ring-0 sm:text-sm sm:leading-6 pl-9 focus:border-white border border-[#474747] focus:border-[1px]",
        bgColor,
        props.className
      )}
    />
  );
};
