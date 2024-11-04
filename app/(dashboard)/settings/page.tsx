import { Separator } from "@/components/ui/separator";
import { AppearanceForm } from "./_components/appearance-form";

export default function SettingsAppearancePage() {
  return (
    <div className="space-y-6 p-8">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
          Aparência
        </h2>
        <p className="text-sm text-muted-foreground">
          Customize a aparência do painel.
        </p>
      </div>
      <Separator />
      <AppearanceForm />
    </div>
  );
}
