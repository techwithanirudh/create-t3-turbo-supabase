import { redirect } from "next/navigation";

export default function SettingsProfilePage() {
  redirect("/dashboard/settings/profile");

  return (
    <div className="space-y-6">
      This URL has changed. You are being redirected shortly.
    </div>
  );
}
