import { cookies } from "next/headers";
import { getVenueSettings } from "@/lib/venue";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth";
import { SettingsClient } from "./SettingsClient";

export default async function SettingsPage() {
  const [venue, store] = await Promise.all([getVenueSettings(), cookies()]);
  const session = verifySessionToken(store.get(SESSION_COOKIE)?.value);

  return <SettingsClient venue={venue} email={session?.email ?? ""} />;
}
