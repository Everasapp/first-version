"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Euro,
  ImagePlus,
  Link2,
  LoaderCircle,
  MapPin,
  Save,
  Send,
} from "lucide-react";

import { categories } from "@/src/data/categories";
import { cities } from "@/src/data/cities";
import DeleteEventButton from "@/src/components/dashboard/DeleteEventButton";
import {
  isValidTicketUrl,
  normalizeTicketUrl,
  parsePrice,
} from "@/src/lib/eventForm";
import { normalizeEventDescription, stripHtml } from "@/src/lib/sanitizeHtml";
import { uploadEventImage } from "@/src/lib/images/uploadEventImageClient";
import { requestAdminNotification } from "@/src/lib/notifications/client";
import { createClient } from "@/src/lib/supabase/client";
import {
  isValidYoutubeUrl,
  normalizeYoutubeUrl,
} from "@/src/lib/youtube";

type PricingType = "free" | "paid";

type FormErrors = Record<string, string>;

const fieldClassName =
  "mt-2 w-full rounded-2xl border bg-white px-4 py-3 text-base text-slate-900 outline-none placeholder:text-slate-400";

export type EditableEvent = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  category: string;
  province: string | null;
  municipality: string;
  location_name: string | null;
  address: string | null;
  start_at: string;
  end_at: string | null;
  image_url: string | null;
  is_free: boolean;
  price_from: number | string | null;
  ticket_url: string | null;
  youtube_url: string | null;
  organizer_display_name: string | null;
  status: string;
};

type EditEventFormProps = {
  event: EditableEvent;
  canAssignOrganizer: boolean;
  accountOrganizerName: string;
};

function getStoragePath(imageUrl: string | null) {
  if (!imageUrl) {
    return null;
  }

  const marker = "/storage/v1/object/public/event-images/";
  const markerIndex = imageUrl.indexOf(marker);

  if (markerIndex === -1) {
    return null;
  }

  const encodedPath = imageUrl.slice(markerIndex + marker.length).split("?")[0];

  try {
    return decodeURIComponent(encodedPath);
  } catch {
    return encodedPath;
  }
}

function toDateInputValue(iso: string | null | undefined) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Rome",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const get = (type: string) =>
    parts.find((part) => part.type === type)?.value || "";

  return `${get("year")}-${get("month")}-${get("day")}`;
}

function toTimeInputValue(iso: string | null | undefined) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Rome",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const get = (type: string) =>
    parts.find((part) => part.type === type)?.value || "";

  return `${get("hour")}:${get("minute")}`;
}

function buildRomeIso(date: string, time: string) {
  const t = time && /^\d{2}:\d{2}$/.test(time) ? time : "00:00";
  const month = Number(date.slice(5, 7));
  const offset = month >= 4 && month <= 10 ? "+02:00" : "+01:00";
  return `${date}T${t}:00${offset}`;
}

export default function EditEventForm({
  event,
  canAssignOrganizer,
  accountOrganizerName,
}: EditEventFormProps) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const cityRecord = cities.find((item) => item.city === event.municipality);

  const [title, setTitle] = useState(event.title);
  const [categorySlug, setCategorySlug] = useState(event.category);
  const [imagePreview, setImagePreview] = useState(event.image_url ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState(event.image_url);

  const [startDate, setStartDate] = useState(toDateInputValue(event.start_at));
  const [startTime, setStartTime] = useState(toTimeInputValue(event.start_at));
  const [endDate, setEndDate] = useState(toDateInputValue(event.end_at));
  const [endTime, setEndTime] = useState(toTimeInputValue(event.end_at));
  const [area, setArea] = useState(cityRecord?.area ?? "");
  const [city, setCity] = useState(event.municipality);
  const [venue, setVenue] = useState(
    event.location_name ?? event.address ?? "",
  );

  const [pricing, setPricing] = useState<PricingType>(
    event.is_free ? "free" : "paid",
  );
  const [price, setPrice] = useState(
    event.price_from === null || event.price_from === undefined
      ? ""
      : String(event.price_from),
  );
  const [ticketUrl, setTicketUrl] = useState(event.ticket_url ?? "");
  const [youtubeUrl, setYoutubeUrl] = useState(event.youtube_url ?? "");
  const [description, setDescription] = useState(event.description ?? "");
  const [organizer, setOrganizer] = useState(
    event.organizer_display_name?.trim() || accountOrganizerName,
  );

  const [errors, setErrors] = useState<FormErrors>({});
  const [saveError, setSaveError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const isDraft = event.status !== "published";

  const availableCities = useMemo(() => {
    const filteredCities = area
      ? cities.filter((item) => item.area === area)
      : cities;

    return [...filteredCities].sort((a, b) =>
      a.city.localeCompare(b.city, "it"),
    );
  }, [area]);

  function clearError(field: string) {
    setErrors((currentErrors) => {
      if (!currentErrors[field]) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors[field];
      return nextErrors;
    });
  }

  function validateForm() {
    const nextErrors: FormErrors = {};

    if (!title.trim()) {
      nextErrors.title = "Inserisci il titolo dell'evento.";
    }

    if (!categorySlug) {
      nextErrors.category = "Seleziona una categoria.";
    }

    if (!imagePreview) {
      nextErrors.image = "Carica una fotografia principale.";
    }

    if (!startDate) {
      nextErrors.startDate = "Seleziona la data di inizio.";
    }

    if (!startTime) {
      nextErrors.startTime = "Seleziona l'ora di inizio.";
    }

    if (endDate && startDate && endDate < startDate) {
      nextErrors.endDate = "La data di fine è precedente all’inizio.";
    }

    if (endTime && !endDate) {
      nextErrors.endDate = "Inserisci anche la data di fine.";
    }

    if (!area) {
      nextErrors.area = "Seleziona un'area.";
    }

    if (!city) {
      nextErrors.city = "Seleziona una città.";
    }

    if (!venue.trim()) {
      nextErrors.venue = "Inserisci il luogo o l'indirizzo.";
    }

    if (pricing === "paid") {
      if (parsePrice(price) === null) {
        nextErrors.price =
          "Inserisci un prezzo maggiore di zero (es. 15 oppure 15,50).";
      }

      if (!ticketUrl.trim()) {
        nextErrors.ticketUrl = "Inserisci il link per acquistare il biglietto.";
      } else if (!isValidTicketUrl(ticketUrl)) {
        nextErrors.ticketUrl =
          "Inserisci un link valido (es. www.ticketone.it).";
      }
    }

    if (pricing === "free" && ticketUrl.trim()) {
      if (!isValidTicketUrl(ticketUrl)) {
        nextErrors.ticketUrl =
          "Inserisci un link valido (es. www.esempio.it/prenota).";
      }
    }

    if (stripHtml(description).length < 30) {
      nextErrors.description =
        "Inserisci una descrizione di almeno 30 caratteri.";
    }

    if (youtubeUrl.trim() && !isValidYoutubeUrl(youtubeUrl)) {
      nextErrors.youtubeUrl =
        "Inserisci un link YouTube valido (es. youtube.com/watch?v=… o youtu.be/…).";
    }

    if (canAssignOrganizer && !organizer.trim()) {
      nextErrors.organizer =
        "Indica almeno un organizzatore associato all'evento.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleImageChange(changeEvent: ChangeEvent<HTMLInputElement>) {
    const file = changeEvent.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setErrors((current) => ({
        ...current,
        image: "Usa un file JPG, PNG o WebP.",
      }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((current) => ({
        ...current,
        image: "La fotografia non deve superare 5 MB.",
      }));
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    clearError("image");
  }

  async function handleSave(options?: { publish?: boolean }) {
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const shouldPublish = Boolean(options?.publish);

    setIsSaving(true);
    setSaveError("");

    let uploadedPath = "";
    const previousImageUrl = existingImageUrl;

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.push(`/accedi?redirect=/dashboard/eventi/${event.id}/modifica`);
        return;
      }

      let nextImageUrl = existingImageUrl;

      if (imageFile) {
        const uploaded = await uploadEventImage(imageFile, {
          slug: event.slug,
          upsert: true,
        });
        uploadedPath = uploaded.path;
        nextImageUrl = uploaded.publicUrl;
      }

      const selectedCity = cities.find((item) => item.city === city);
      const startAt = buildRomeIso(startDate, startTime);
      let endAt: string | null = null;
      if (endDate.trim()) {
        endAt = buildRomeIso(endDate.trim(), endTime.trim() || "23:59");
      }
      const numericPrice = pricing === "paid" ? parsePrice(price) : null;
      const normalizedTicketUrl = ticketUrl.trim()
        ? normalizeTicketUrl(ticketUrl)
        : null;
      const normalizedYoutubeUrl = youtubeUrl.trim()
        ? normalizeYoutubeUrl(youtubeUrl)
        : null;

      const { error: updateError } = await supabase
        .from("events")
        .update({
          title: title.trim(),
          description: normalizeEventDescription(description),
          category: categorySlug,
          province: selectedCity?.province ?? null,
          municipality: city,
          location_name: venue.trim(),
          address: venue.trim(),
          start_at: startAt,
          end_at: endAt,
          image_url: nextImageUrl,
          is_free: pricing === "free",
          price_from: numericPrice,
          price: numericPrice ?? 0,
          ticket_url: normalizedTicketUrl,
          youtube_url: normalizedYoutubeUrl,
          organizer_display_name: canAssignOrganizer
            ? organizer.trim()
            : accountOrganizerName,
          ...(shouldPublish ? { status: "published" as const } : {}),
        })
        .eq("id", event.id)
        .eq("organizer_id", user.id);

      if (updateError) {
        if (uploadedPath) {
          await supabase.storage.from("event-images").remove([uploadedPath]);
        }

        throw new Error(
          `Salvataggio non riuscito: ${updateError.message}`,
        );
      }

      if (
        previousImageUrl &&
        nextImageUrl !== previousImageUrl &&
        imageFile
      ) {
        const { count } = await supabase
          .from("events")
          .select("id", { count: "exact", head: true })
          .eq("image_url", previousImageUrl)
          .neq("id", event.id);

        if ((count ?? 0) === 0) {
          const storagePath = getStoragePath(previousImageUrl);

          if (storagePath) {
            await supabase.storage.from("event-images").remove([storagePath]);
          }
        }
      }

      setExistingImageUrl(nextImageUrl);
      setImageFile(null);

      if (shouldPublish) {
        requestAdminNotification({
          type: "event_published",
          eventId: event.id,
        });
        router.push(`/eventi/${event.slug}`);
      } else {
        router.push(isDraft ? "/dashboard?filtro=bozze" : "/dashboard");
      }
      router.refresh();
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : "Si è verificato un errore durante il salvataggio.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-[#075EAE]"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Torna alla dashboard
      </Link>

      <form
        className="everas-light-fields mt-6 rounded-3xl border border-slate-200 bg-white p-6 text-slate-900 shadow-sm [color-scheme:light] sm:p-9"
        onSubmit={(submitEvent) => {
          submitEvent.preventDefault();
          void handleSave();
        }}
        noValidate
      >
        <h2 className="text-3xl font-bold text-slate-900">Modifica evento</h2>
        <p className="mt-2 text-slate-600">
          Aggiorna le informazioni del tuo evento. Lo slug pubblico resta
          invariato.
        </p>

        {Object.keys(errors).length > 0 && (
          <div
            role="alert"
            className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            Controlla i campi evidenziati prima di salvare.
          </div>
        )}

        {saveError && (
          <div
            role="alert"
            className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            {saveError}
          </div>
        )}

        <div className="mt-8 space-y-6">
          <label className="block">
            <span className="text-sm font-bold text-slate-900">
              Titolo dell&apos;evento
            </span>
            <input
              type="text"
              name="title"
              value={title}
              onChange={(changeEvent) => {
                setTitle(changeEvent.target.value);
                clearError("title");
              }}
              className={`${fieldClassName} focus:ring-2 ${
                errors.title
                  ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                  : "border-slate-300 focus:border-[#075EAE] focus:ring-blue-100"
              }`}
            />
            {errors.title && (
              <p className="mt-2 text-sm text-red-600">{errors.title}</p>
            )}
          </label>

          <label className="block">
            <span className="text-sm font-bold text-slate-900">Categoria</span>
            <select
              value={categorySlug}
              onChange={(changeEvent) => {
                setCategorySlug(changeEvent.target.value);
                clearError("category");
              }}
              className={`${fieldClassName} ${
                errors.category ? "border-red-400" : "border-slate-300"
              }`}
            >
              <option value="">Seleziona una categoria</option>
              {categories.map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-2 text-sm text-red-600">{errors.category}</p>
            )}
          </label>

          <label className="block">
            <span className="text-sm font-bold text-slate-900">
              Immagine principale
            </span>
            <input
              id="edit-event-image"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleImageChange}
              className="sr-only"
            />
            <label
              htmlFor="edit-event-image"
              className="mt-2 flex min-h-44 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 text-center transition hover:border-[#075EAE]"
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Anteprima immagine evento"
                  className="h-52 w-full rounded-2xl object-cover"
                />
              ) : (
                <>
                  <ImagePlus
                    aria-hidden="true"
                    className="h-8 w-8 text-[#075EAE]"
                  />
                  <p className="mt-3 font-bold text-slate-900">
                    Carica una fotografia
                  </p>
                </>
              )}
            </label>
            <p className="mt-2 text-sm text-slate-500">
              Lascia l&apos;immagine attuale o sostituiscila (JPG, PNG o WebP,
              max 5 MB). Il nuovo file viene compresso e salvato in WebP.
            </p>
            {errors.image && (
              <p className="mt-2 text-sm text-red-600">{errors.image}</p>
            )}
          </label>

          <div className="grid gap-6 sm:grid-cols-2">
            <label className="block">
              <span className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <CalendarDays className="h-4 w-4 text-[#075EAE]" />
                Data di inizio
              </span>
              <input
                type="date"
                value={startDate}
                onChange={(changeEvent) => {
                  setStartDate(changeEvent.target.value);
                  clearError("startDate");
                }}
                className={`${fieldClassName} ${
                  errors.startDate ? "border-red-400" : "border-slate-300"
                }`}
              />
              {errors.startDate && (
                <p className="mt-2 text-sm text-red-600">{errors.startDate}</p>
              )}
            </label>

            <label className="block">
              <span className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <Clock3 className="h-4 w-4 text-[#075EAE]" />
                Ora di inizio
              </span>
              <input
                type="time"
                value={startTime}
                onChange={(changeEvent) => {
                  setStartTime(changeEvent.target.value);
                  clearError("startTime");
                }}
                className={`${fieldClassName} ${
                  errors.startTime ? "border-red-400" : "border-slate-300"
                }`}
              />
              {errors.startTime && (
                <p className="mt-2 text-sm text-red-600">{errors.startTime}</p>
              )}
            </label>

            <label className="block">
              <span className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <CalendarDays className="h-4 w-4 text-[#075EAE]" />
                Data di fine (opzionale)
              </span>
              <input
                type="date"
                value={endDate}
                onChange={(changeEvent) => {
                  setEndDate(changeEvent.target.value);
                  clearError("endDate");
                }}
                className={`${fieldClassName} ${
                  errors.endDate ? "border-red-400" : "border-slate-300"
                }`}
              />
              {errors.endDate && (
                <p className="mt-2 text-sm text-red-600">{errors.endDate}</p>
              )}
            </label>

            <label className="block">
              <span className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <Clock3 className="h-4 w-4 text-[#075EAE]" />
                Ora di fine (opzionale)
              </span>
              <input
                type="time"
                value={endTime}
                onChange={(changeEvent) => {
                  setEndTime(changeEvent.target.value);
                  clearError("endTime");
                }}
                className={`${fieldClassName} border-slate-300`}
              />
              <p className="mt-2 text-sm text-slate-500">
                Se imposti solo la data di fine, useremo le 23:59.
              </p>
            </label>

            <label className="block">
              <span className="text-sm font-bold text-slate-900">Area</span>
              <select
                value={area}
                onChange={(changeEvent) => {
                  setArea(changeEvent.target.value);
                  setCity("");
                  clearError("area");
                  clearError("city");
                }}
                className={`${fieldClassName} ${
                  errors.area ? "border-red-400" : "border-slate-300"
                }`}
              >
                <option value="">Seleziona un&apos;area</option>
                <option value="Nord Sardegna">Nord Sardegna</option>
                <option value="Centro Sardegna">Centro Sardegna</option>
                <option value="Sud Sardegna">Sud Sardegna</option>
              </select>
              {errors.area && (
                <p className="mt-2 text-sm text-red-600">{errors.area}</p>
              )}
            </label>

            <label className="block">
              <span className="text-sm font-bold text-slate-900">Città</span>
              <select
                value={city}
                onChange={(changeEvent) => {
                  setCity(changeEvent.target.value);
                  clearError("city");
                }}
                className={`${fieldClassName} ${
                  errors.city ? "border-red-400" : "border-slate-300"
                }`}
              >
                <option value="">Seleziona una città</option>
                {availableCities.map((item) => (
                  <option key={item.id} value={item.city}>
                    {item.city} ({item.province})
                  </option>
                ))}
              </select>
              {errors.city && (
                <p className="mt-2 text-sm text-red-600">{errors.city}</p>
              )}
            </label>

            <label className="block sm:col-span-2">
              <span className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <MapPin className="h-4 w-4 text-[#075EAE]" />
                Indirizzo o luogo
              </span>
              <input
                type="text"
                value={venue}
                onChange={(changeEvent) => {
                  setVenue(changeEvent.target.value);
                  clearError("venue");
                }}
                className={`${fieldClassName} ${
                  errors.venue ? "border-red-400" : "border-slate-300"
                }`}
              />
              {errors.venue && (
                <p className="mt-2 text-sm text-red-600">{errors.venue}</p>
              )}
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label
              className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-5 ${
                pricing === "free"
                  ? "border-[#075EAE] bg-blue-50"
                  : "border-slate-300"
              }`}
            >
              <input
                type="radio"
                name="pricing"
                checked={pricing === "free"}
                onChange={() => {
                  setPricing("free");
                  clearError("price");
                  clearError("ticketUrl");
                }}
                className="mt-1"
              />
              <div>
                <p className="font-bold text-slate-900">Evento gratuito</p>
              </div>
            </label>

            <label
              className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-5 ${
                pricing === "paid"
                  ? "border-[#075EAE] bg-blue-50"
                  : "border-slate-300"
              }`}
            >
              <input
                type="radio"
                name="pricing"
                checked={pricing === "paid"}
                onChange={() => setPricing("paid")}
                className="mt-1"
              />
              <div>
                <p className="font-bold text-slate-900">Evento a pagamento</p>
              </div>
            </label>
          </div>

          {pricing === "paid" && (
            <label className="block">
              <span className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <Euro className="h-4 w-4 text-[#075EAE]" />
                Prezzo a partire da
              </span>
              <input
                type="text"
                inputMode="decimal"
                autoComplete="off"
                value={price}
                onChange={(changeEvent) => {
                  setPrice(changeEvent.target.value);
                  clearError("price");
                }}
                placeholder="15,00"
                className={`${fieldClassName} ${
                  errors.price ? "border-red-400" : "border-slate-300"
                }`}
              />
              {errors.price && (
                <p className="mt-2 text-sm text-red-600">{errors.price}</p>
              )}
            </label>
          )}

          <label className="block">
            <span className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <Link2 className="h-4 w-4 text-[#075EAE]" />
              {pricing === "free"
                ? "Link per prenotare (opzionale)"
                : "Link biglietti"}
            </span>
            <input
              type="url"
              inputMode="url"
              autoCapitalize="none"
              autoCorrect="off"
              value={ticketUrl}
              onChange={(changeEvent) => {
                setTicketUrl(changeEvent.target.value);
                clearError("ticketUrl");
              }}
              onBlur={() => {
                if (!ticketUrl.trim()) {
                  return;
                }

                setTicketUrl(normalizeTicketUrl(ticketUrl));
              }}
              placeholder={
                pricing === "free"
                  ? "www.esempio.it/prenota"
                  : "www.ticketone.it"
              }
              className={`${fieldClassName} ${
                errors.ticketUrl ? "border-red-400" : "border-slate-300"
              }`}
            />
            {errors.ticketUrl && (
              <p className="mt-2 text-sm text-red-600">{errors.ticketUrl}</p>
            )}
            <p className="mt-2 text-sm text-slate-500">
              {pricing === "free"
                ? "Se c’è un form o una pagina di prenotazione, inseriscila qui: il pulsante comparirà solo se compilato."
                : "Basta un indirizzo come www.ticketone.it — se manca https:// lo aggiungiamo noi."}
            </p>
          </label>

          <label className="block">
            <span className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <Link2 className="h-4 w-4 text-[#075EAE]" />
              Link video YouTube{" "}
              <span className="font-medium text-slate-400">(opzionale)</span>
            </span>
            <input
              type="url"
              inputMode="url"
              autoCapitalize="none"
              autoCorrect="off"
              value={youtubeUrl}
              onChange={(changeEvent) => {
                setYoutubeUrl(changeEvent.target.value);
                clearError("youtubeUrl");
              }}
              onBlur={() => {
                if (!youtubeUrl.trim()) {
                  return;
                }

                setYoutubeUrl(normalizeYoutubeUrl(youtubeUrl));
              }}
              placeholder="https://www.youtube.com/watch?v=…"
              className={`${fieldClassName} ${
                errors.youtubeUrl ? "border-red-400" : "border-slate-300"
              }`}
            />
            {errors.youtubeUrl && (
              <p className="mt-2 text-sm text-red-600">{errors.youtubeUrl}</p>
            )}
            <p className="mt-2 text-sm text-slate-500">
              Se presente, sulla pagina pubblica dell&apos;evento verrà mostrato
              il video player YouTube.
            </p>
          </label>

          <label className="block">
            <span className="text-sm font-bold text-slate-900">Descrizione</span>
            <textarea
              rows={8}
              value={description}
              onChange={(changeEvent) => {
                setDescription(changeEvent.target.value);
                clearError("description");
              }}
              className={`${fieldClassName} resize-y ${
                errors.description ? "border-red-400" : "border-slate-300"
              }`}
            />
            {errors.description && (
              <p className="mt-2 text-sm text-red-600">{errors.description}</p>
            )}
          </label>

          <label className="block">
            <span className="text-sm font-bold text-slate-900">
              Organizzatore associato
            </span>
            <p className="mt-1 text-sm text-slate-500">
              {canAssignOrganizer
                ? "Con il piano Pro puoi indicare uno o più organizzatori (separati da virgola)."
                : "Con Free l’organizzatore è il tuo account. Passa a Pro per personalizzare il profilo organizzatore."}
            </p>
            <input
              type="text"
              value={canAssignOrganizer ? organizer : accountOrganizerName}
              onChange={(changeEvent) => {
                if (!canAssignOrganizer) {
                  return;
                }
                setOrganizer(changeEvent.target.value);
                clearError("organizer");
              }}
              readOnly={!canAssignOrganizer}
              placeholder="Es. Associazione Zoe, Comune di Alghero"
              className={`${fieldClassName} ${
                !canAssignOrganizer
                  ? "cursor-not-allowed bg-slate-50 text-slate-600"
                  : ""
              } ${errors.organizer ? "border-red-400" : "border-slate-300"}`}
            />
            {errors.organizer && (
              <p className="mt-2 text-sm text-red-600">{errors.organizer}</p>
            )}
            {!canAssignOrganizer ? (
              <Link
                href="/dashboard/piano"
                className="mt-2 inline-flex text-sm font-bold text-[#075EAE] hover:underline"
              >
                Scopri il piano Pro →
              </Link>
            ) : null}
          </label>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={isSaving}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-6 py-4 font-bold text-slate-800 transition hover:border-[#075EAE] hover:text-[#075EAE] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? (
              <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" />
            ) : (
              <Save className="h-5 w-5" aria-hidden="true" />
            )}
            {isDraft ? "Salva bozza" : "Salva modifiche"}
          </button>

          {isDraft ? (
            <button
              type="button"
              disabled={isSaving}
              onClick={() => void handleSave({ publish: true })}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#075EAE] px-6 py-4 font-bold text-white transition hover:bg-[#064a8a] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? (
                <LoaderCircle
                  className="h-5 w-5 animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <Send className="h-5 w-5" aria-hidden="true" />
              )}
              Pubblica evento
            </button>
          ) : null}
        </div>
      </form>

      {isDraft ? (
        <div className="mt-6 rounded-2xl border border-red-100 bg-red-50/60 p-5">
          <p className="text-sm font-semibold text-red-800">Zona pericolosa</p>
          <p className="mt-1 text-sm text-red-700">
            Puoi eliminare definitivamente questa bozza. L’azione non si può
            annullare.
          </p>
          <div className="mt-4">
            <DeleteEventButton
              eventId={event.id}
              imageUrl={existingImageUrl}
              isDraft
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
