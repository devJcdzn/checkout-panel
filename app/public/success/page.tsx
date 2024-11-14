import { Check } from "lucide-react";

export default function SuccessPage() {
  return (
    <main
      className="flex h-full min-h-screen flex-col items-center 
    bg-[#171717] pb-20 justify-center"
    >
      <div className="flex flex-col items-center gap-3">
        <Check className="size-10 text-emerald-500" />
        <h1 className="text-white font-semibold">
          Compra realizada com sucesso!
        </h1>
      </div>
    </main>
  );
}
