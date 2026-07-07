import { Metadata } from "next";
import ResetPasswordForm from "@modules/account/components/reset-password-form";

export const metadata: Metadata = {
  title: "Passwort zurücksetzen",
  description: "Setze dein Passwort zurück.",
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; email?: string }>;
}) {
  const { token, email } = await searchParams;

  return (
    <div className="flex justify-center py-12 px-4">
      <ResetPasswordForm token={token ?? ""} email={email ?? ""} />
    </div>
  );
}
