import { redirect, notFound } from "next/navigation";

export default async function RedirectCodePage({
  params,
}: {
  params: { code: string };
}) {
  const { code } = await params;

  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const res = await fetch(`${base}/api/links/${code}`, {
    method: "GET",
    cache: "no-store",
  });

  if (res.status === 404) {
    notFound();
  }

  if (!res.ok) {
    throw new Error("Server error");
  }

  const data = await res.json();
  redirect(data.redirectUrl);
}
