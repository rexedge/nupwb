"use client";

import { useActionState, useState, useId, cloneElement, isValidElement } from "react";
import type { ReactElement } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Accordion } from "@/components/admin/Accordion";
import { Toggle } from "@/components/admin/Toggle";
import type { VenueSettings } from "@/lib/venue";
import { DAY_LABELS, type OpeningHours } from "@/lib/venue-utils";
import { menuUrl as buildMenuUrl } from "@/lib/site-url";
import {
  saveVenueDetailsAction,
  saveHoursAction,
  saveMapAction,
  saveSocialLinksAction,
  changePasswordAction,
  type ChangePasswordState,
} from "./actions";
import { logoutAction } from "@/app/admin/login/actions";

const DAY_ORDER: (keyof OpeningHours)[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

function SaveButton({ label, onClick, saved }: { label: string; onClick: () => void; saved: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-13 rounded-md bg-[#0E5C34] text-base font-semibold text-[#FBF6EC] hover:bg-[#083D22]"
    >
      {saved ? "Saved ✓" : label}
    </button>
  );
}

function Field({ label, children }: { label: string; children: ReactElement<{ id?: string }> }) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-[#1E1B16]">
        {label}
      </label>
      {isValidElement(children) ? cloneElement(children, { id }) : children}
    </div>
  );
}

const inputClass =
  "rounded-md border border-[#E0CD98] bg-[#FFFDF8] px-3.5 py-2.5 text-base text-[#1E1B16] focus:border-[#0E5C34] focus:outline-none";

export function SettingsClient({ venue, email }: { venue: VenueSettings; email: string }) {
  const router = useRouter();

  const [venueName, setVenueName] = useState(venue.venueName);
  const [tagline, setTagline] = useState(venue.tagline);
  const [address, setAddress] = useState(venue.address);
  const [phone, setPhone] = useState(venue.phone);
  const [whatsappNumber, setWhatsappNumber] = useState(venue.whatsappNumber);
  const [venueEmail, setVenueEmail] = useState(venue.email);
  const [venueSaved, setVenueSaved] = useState(false);

  const [hours, setHours] = useState<OpeningHours>(venue.openingHours);
  const [hoursSaved, setHoursSaved] = useState(false);

  const [mapUrl, setMapUrl] = useState(venue.mapUrl);
  const [mapSaved, setMapSaved] = useState(false);

  const [instagram, setInstagram] = useState(venue.socialLinks.instagram ?? "");
  const [facebook, setFacebook] = useState(venue.socialLinks.facebook ?? "");
  const [tiktok, setTiktok] = useState(venue.socialLinks.tiktok ?? "");
  const [socialSaved, setSocialSaved] = useState(false);

  const [copied, setCopied] = useState(false);
  const menuUrl = buildMenuUrl(venue.menuSlug);
  const menuUrlDisplay = menuUrl.replace(/^https?:\/\//, "");

  const [pwState, pwAction, pwPending] = useActionState<ChangePasswordState, FormData>(changePasswordAction, {
    error: null,
    success: false,
  });

  async function saveVenue() {
    await saveVenueDetailsAction({ venueName, tagline, address, phone, whatsappNumber, email: venueEmail });
    setVenueSaved(true);
    setTimeout(() => setVenueSaved(false), 1800);
    router.refresh();
  }

  async function saveHours() {
    await saveHoursAction(hours);
    setHoursSaved(true);
    setTimeout(() => setHoursSaved(false), 1800);
    router.refresh();
  }

  async function saveMap() {
    await saveMapAction(mapUrl);
    setMapSaved(true);
    setTimeout(() => setMapSaved(false), 1800);
    router.refresh();
  }

  async function saveSocial() {
    await saveSocialLinksAction({
      instagram: instagram.trim() || null,
      facebook: facebook.trim() || null,
      tiktok: tiktok.trim() || null,
    });
    setSocialSaved(true);
    setTimeout(() => setSocialSaved(false), 1800);
    router.refresh();
  }

  async function copyMenuLink() {
    try {
      await navigator.clipboard.writeText(menuUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard unavailable — Copy is a convenience action
    }
  }

  const socialSummary = [venue.socialLinks.instagram, venue.socialLinks.facebook, venue.socialLinks.tiktok].some(
    Boolean,
  )
    ? undefined
    : "None set";

  return (
    <div className="flex flex-1 flex-col p-4 pb-20 lg:p-8">
      <h1 className="mb-2 font-display text-2xl font-bold text-[#1E1B16]">Settings</h1>
      <div className="rounded-lg border border-[#E0CD98] bg-[#FFFDF8] px-5">
        <Accordion title="Venue details">
          <div className="flex flex-col gap-4">
            <Field label="Venue name">
              <input value={venueName} onChange={(e) => setVenueName(e.target.value)} className={inputClass} />
            </Field>
            <Field label="Tagline">
              <input value={tagline} onChange={(e) => setTagline(e.target.value)} className={inputClass} />
            </Field>
            <Field label="Address">
              <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={2} className={inputClass} />
            </Field>
            <Field label="Phone">
              <input value={phone} onChange={(e) => setPhone(e.target.value)} className={`${inputClass} font-mono`} />
            </Field>
            <Field label="WhatsApp number">
              <input
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className={`${inputClass} font-mono`}
              />
            </Field>
            <Field label="Email">
              <input value={venueEmail} onChange={(e) => setVenueEmail(e.target.value)} className={inputClass} />
            </Field>
            <SaveButton label="Save venue details" onClick={saveVenue} saved={venueSaved} />
          </div>
        </Accordion>

        <Accordion title="Opening hours" preview={`Daily ${hours.monday.open}`}>
          <div className="flex flex-col gap-3">
            {DAY_ORDER.map((key) => {
              const day = hours[key];
              return (
                <div key={key} className={`flex items-center gap-3 ${day.closed ? "opacity-45" : ""}`}>
                  <span className="w-10 text-sm font-semibold text-[#1E1B16]">{DAY_LABELS[key].short}</span>
                  <input
                    type="time"
                    value={day.open}
                    disabled={day.closed}
                    onChange={(e) => setHours((h) => ({ ...h, [key]: { ...h[key], open: e.target.value } }))}
                    className="rounded-md border border-[#E0CD98] bg-[#FFFDF8] px-2 py-1.5 text-sm tabular-nums"
                  />
                  <span className="text-[#6E6455]">—</span>
                  <input
                    type="time"
                    value={day.close}
                    disabled={day.closed}
                    onChange={(e) => setHours((h) => ({ ...h, [key]: { ...h[key], close: e.target.value } }))}
                    className="rounded-md border border-[#E0CD98] bg-[#FFFDF8] px-2 py-1.5 text-sm tabular-nums"
                  />
                  <span className="ml-auto">
                    <Toggle
                      checked={!day.closed}
                      onChange={(v) => setHours((h) => ({ ...h, [key]: { ...h[key], closed: !v } }))}
                      label={`${key} open`}
                    />
                  </span>
                </div>
              );
            })}
            <p className="text-xs text-[#6E6455]">Toggle off to mark a day closed.</p>
            <SaveButton label="Save hours" onClick={saveHours} saved={hoursSaved} />
          </div>
        </Accordion>

        <Accordion title="Map location">
          <div className="flex flex-col gap-4">
            <Field label="Google Maps link or coordinates">
              <input
                value={mapUrl}
                onChange={(e) => setMapUrl(e.target.value)}
                placeholder="6.4402, 7.4996"
                className={`${inputClass} break-all`}
              />
            </Field>
            <div className="flex h-32 flex-col items-center justify-center rounded-md border border-[#E0CD98] bg-[#EFE7D6] text-sm text-[#6E6455]">
              Map preview
            </div>
            <SaveButton label="Save location" onClick={saveMap} saved={mapSaved} />
          </div>
        </Accordion>

        <Accordion title="Social links" preview={socialSummary}>
          <div className="flex flex-col gap-4">
            <Field label="Instagram">
              <input
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="instagram.com/…"
                className={inputClass}
              />
            </Field>
            <Field label="Facebook">
              <input
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                placeholder="facebook.com/…"
                className={inputClass}
              />
            </Field>
            <Field label="TikTok">
              <input
                value={tiktok}
                onChange={(e) => setTiktok(e.target.value)}
                placeholder="tiktok.com/@…"
                className={inputClass}
              />
            </Field>
            <SaveButton label="Save links" onClick={saveSocial} saved={socialSaved} />
          </div>
        </Accordion>

        <Accordion title="Menu link & QR">
          <div className="flex flex-col gap-4">
            <Field label="Public menu link">
              <div className="flex items-center gap-2">
                <span className="flex-1 truncate rounded-md border border-[#E0CD98] bg-[#EFE7D6] px-3.5 py-2.5 text-sm text-[#1E1B16]">
                  {menuUrlDisplay}
                </span>
                <button
                  type="button"
                  onClick={copyMenuLink}
                  className="shrink-0 rounded-md border border-[#D4A32C] px-3 py-2.5 text-sm font-semibold text-[#0E5C34]"
                >
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </Field>
            <div className="flex items-center gap-3 rounded-md border border-[#E0CD98] bg-[#FBF6EC] p-3">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded border border-[#D4A32C] bg-white text-[10px] text-[#6E6455]">
                QR
              </span>
              <p className="text-xs text-[#6E6455]">
                Your QR code never changes, even when you edit prices. Printed tents stay valid.
              </p>
            </div>
            <Link
              href="/share"
              className="flex h-13 items-center justify-center rounded-md border border-[#D4A32C] text-base font-semibold text-[#0E5C34]"
            >
              Download Print Assets
            </Link>
          </div>
        </Accordion>

        <Accordion title="Account" preview={email}>
          <div className="flex flex-col gap-4">
            <form action={pwAction} className="flex flex-col gap-3">
              {pwState.error && (
                <p className="rounded-md border border-[#B7202B]/40 bg-[#B7202B]/10 px-3 py-2 text-sm text-[#B7202B]">
                  {pwState.error}
                </p>
              )}
              {pwState.success && (
                <p className="rounded-md border border-[#0E5C34]/40 bg-[#0E5C34]/10 px-3 py-2 text-sm text-[#0E5C34]">
                  Password updated.
                </p>
              )}
              <Field label="Current password">
                <input name="currentPassword" type="password" required className={inputClass} />
              </Field>
              <Field label="New password">
                <input name="newPassword" type="password" required minLength={8} className={inputClass} />
              </Field>
              <button
                type="submit"
                disabled={pwPending}
                className="h-13 rounded-md border border-[#D4A32C] text-base font-semibold text-[#0E5C34] disabled:opacity-50"
              >
                Change password
              </button>
            </form>
            <form action={logoutAction}>
              <button
                type="submit"
                className="h-14 w-full rounded-md border border-[#B7202B] text-base font-semibold text-[#B7202B]"
              >
                Sign out
              </button>
            </form>
          </div>
        </Accordion>
      </div>
    </div>
  );
}
