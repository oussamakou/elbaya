import { redirect } from "@/i18n/routing";
export default async function ForgePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect({ href: "/farm", locale });
}
