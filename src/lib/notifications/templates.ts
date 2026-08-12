import { getSiteUrl } from "@/src/lib/notifications/config";
import { buildAdminEmailLayout } from "@/src/lib/notifications/email-layout";
import { formatItalianDateTime } from "@/src/lib/notifications/format";
import type {
  AdminNotificationPayload,
  EmailContent,
} from "@/src/lib/notifications/types";

function asString(value: unknown, fallback = "—") {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return fallback;
}

export function buildAdminNotificationEmail(
  payload: AdminNotificationPayload,
): EmailContent {
  const siteUrl = getSiteUrl();
  const data = payload.data ?? {};

  switch (payload.type) {
    case "user_registered": {
      return {
        subject: "🎉 Nuovo utente registrato su EVERAS",
        html: buildAdminEmailLayout({
          title: "Nuovo utente registrato",
          intro: payload.message,
          rows: [
            { label: "Nome", value: asString(data.name) },
            { label: "Email", value: asString(data.email) },
            {
              label: "Data registrazione",
              value: formatItalianDateTime(
                asString(data.registeredAt, new Date().toISOString()),
              ),
            },
          ],
          ctaLabel: "Apri pannello amministratore",
          ctaHref: `${siteUrl}/admin`,
        }),
      };
    }

    case "organizer_registered": {
      return {
        subject: "🎉 Nuovo organizzatore registrato",
        html: buildAdminEmailLayout({
          title: "Nuovo organizzatore registrato",
          intro: payload.message,
          rows: [
            { label: "Nome", value: asString(data.name) },
            { label: "Email", value: asString(data.email) },
            { label: "Ruolo", value: asString(data.role, "organizzatore") },
            {
              label: "Data",
              value: formatItalianDateTime(
                asString(data.registeredAt, new Date().toISOString()),
              ),
            },
          ],
          ctaLabel: "Apri pannello amministratore",
          ctaHref: `${siteUrl}/admin`,
        }),
      };
    }

    case "event_published": {
      const eventUrl = asString(
        data.eventUrl,
        data.slug
          ? `${siteUrl}/eventi/${asString(data.slug)}`
          : `${siteUrl}/admin`,
      );

      return {
        subject: "📅 Nuovo evento pubblicato",
        html: buildAdminEmailLayout({
          title: "Nuovo evento pubblicato",
          intro: payload.message,
          rows: [
            { label: "Titolo evento", value: asString(data.title) },
            { label: "Organizzatore", value: asString(data.organizer) },
            { label: "Comune", value: asString(data.municipality) },
            {
              label: "Data evento",
              value: formatItalianDateTime(asString(data.startAt)),
            },
            { label: "Categoria", value: asString(data.category) },
            { label: "Link evento", value: eventUrl },
          ],
          ctaLabel: "Visualizza evento",
          ctaHref: eventUrl,
        }),
      };
    }

    default: {
      return {
        subject: payload.title,
        html: buildAdminEmailLayout({
          title: payload.title,
          intro: payload.message,
          rows: Object.entries(data).map(([label, value]) => ({
            label,
            value: asString(value),
          })),
          ctaLabel: "Apri pannello amministratore",
          ctaHref: `${siteUrl}/admin`,
        }),
      };
    }
  }
}
