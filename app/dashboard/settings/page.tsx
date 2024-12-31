import { Separator } from "@/components/ui/separator";
import { ProfileForm } from "./_components/profile-form";
import { getUser } from "@/app/_data/user";

export default async function SettingsPage() {
  // TODO: Fetch user data and populate the ProfileForm with the fetched data.
  const user = await getUser();

  return (
    <div className="space-y-6 p-8">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
          Perfil
        </h2>
        <p className="text-sm text-muted-foreground">Customize seu Perfil.</p>
      </div>
      <Separator />
      <ProfileForm user={user} />
    </div>
  );
}
