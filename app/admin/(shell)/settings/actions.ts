"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateSettings } from "@/lib/queries";
import { verifySessionToken, verifyPassword, hashPassword, SESSION_COOKIE } from "@/lib/auth";
import type { OpeningHours } from "@/lib/venue";

export async function saveVenueDetailsAction(input: {
  venueName: string;
  tagline: string;
  address: string;
  phone: string;
  whatsappNumber: string;
  email: string;
}) {
  await updateSettings(input);
}

export async function saveHoursAction(hours: OpeningHours) {
  await updateSettings({ openingHours: JSON.stringify(hours) });
}

export async function saveMapAction(mapUrl: string) {
  await updateSettings({ mapUrl });
}

export async function saveSocialLinksAction(links: {
  instagram: string | null;
  facebook: string | null;
  tiktok: string | null;
}) {
  await updateSettings({ socialLinks: JSON.stringify(links) });
}

export type ChangePasswordState = { error: string | null; success: boolean };

export async function changePasswordAction(
  _prev: ChangePasswordState,
  formData: FormData,
): Promise<ChangePasswordState> {
  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");

  if (newPassword.length < 8) {
    return { error: "New password must be at least 8 characters.", success: false };
  }

  const store = await cookies();
  const session = verifySessionToken(store.get(SESSION_COOKIE)?.value);
  if (!session) redirect("/admin/login");

  const admin = await prisma.admin.findUnique({ where: { id: session.adminId } });
  if (!admin || !verifyPassword(currentPassword, admin.passwordHash)) {
    return { error: "Current password is not correct.", success: false };
  }

  await prisma.admin.update({
    where: { id: admin.id },
    data: { passwordHash: hashPassword(newPassword) },
  });

  return { error: null, success: true };
}
