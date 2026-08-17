"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  Euro,
  ImagePlus,
  Link2,
  MapPin,
  Ticket,
} from "lucide-react";

import CategoryMultiSelect from "@/src/components/events/CategoryMultiSelect";
import OrganizerDirectorySelect from "@/src/components/events/OrganizerDirectorySelect";
import Header from "@/src/components/home/Header";
import { cities } from "@/src/data/cities";
import {
  normalizeEventCategories,
  resolveCategoryLabels,
} from "@/src/lib/event-categories";
import {
  isValidTicketUrl,
  normalizeTicketUrl,
  parsePrice,
} from "@/src/lib/eventForm";
import {
  PLAN_SELECT,
  canAssignOrganizers,
  type Plan,
} from "@/src/lib/plans";
import { PROFILE_SELECT, type Profile } from "@/src/lib/profile";
import { normalizeEventDescription, stripHtml } from "@/src/lib/sanitizeHtml";
import { createSlug } from "@/src/lib/slug";
import { uploadEventImage } from "@/src/lib/images/uploadEventImageClient";
import { requestAdminNotification } from "@/src/lib/notifications/client";
import { createClient } from "@/src/lib/supabase/client";
import {
  isValidYoutubeUrl,
  normalizeYoutubeUrl,
} from "@/src/lib/youtube";

const steps = [
  "Informazioni",
  "Data e luogo",
  "Biglietti",
  "Descrizione",
  "Pubblica",
];

type PricingType = "free" | "paid";

type FormErrors = Record<string, string>;

export default function PublishEventPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [currentStep, setCurrentStep] = useState(0);

  const [title, setTitle] = useState("");
  const [categorySlugs, setCategorySlugs] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [area, setArea] = useState("");
  const [city, setCity] = useState("");
  const [venue, setVenue] = useState("");

  const [pricing, setPricing] = useState<PricingType>("free");
  const [price, setPrice] = useState("");
  const [ticketUrl, setTicketUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");

  const [description, setDescription] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [organizerDirectoryId, setOrganizerDirectoryId] = useState<
    string | null
  >(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [publishMessage, setPublishMessage] = useState("");
  const [publishError, setPublishError] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [hasPublished, setHasPublished] = useState(false);
  const publishingLockRef = useRef(false);

  const canSetOrganizer = canAssignOrganizers(plan, profile?.role);
  const defaultOrganizerName =
    profile?.business_name?.trim() ||
    profile?.full_name?.trim() ||
    "Organizzatore";

  useEffect(() => {
    let cancelled = false;

    async function loadProfilePlan() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || cancelled) {
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select(PROFILE_SELECT)
        .eq("id", user.id)
        .maybeSingle();

      if (cancelled || !profileData) {
        return;
      }

      const nextProfile = profileData as Profile;
      setProfile(nextProfile);

      if (nextProfile.plan_id) {
        const { data: planData } = await supabase
          .from("plans")
          .select(PLAN_SELECT)
          .eq("id", nextProfile.plan_id)
          .maybeSingle();

        if (!cancelled) {
          setPlan((planData as Plan | null) ?? null);
        }
      }

      if (!cancelled) {
        const fallback =
          nextProfile.business_name?.trim() ||
          nextProfile.full_name?.trim() ||
          "";
        setOrganizer((current) => current || fallback);
      }
    }

    void loadProfilePlan();

    return () => {
      cancelled = true;
    };
  }, [supabase]);

  const availableCities = useMemo(() => {
    const filteredCities = area
      ? cities.filter((item) => item.area === area)
      : cities;

    return [...filteredCities].sort((a, b) =>
      a.city.localeCompare(b.city, "it"),
    );
  }, [area]);

  const selectedCategoryLabels = useMemo(
    () => resolveCategoryLabels({ categories: categorySlugs }),
    [categorySlugs],
  );

  const formattedDate = useMemo(() => {
    if (!startDate) {
      return "Data da definire";
    }

    const date = new Date(`${startDate}T12:00:00`);

    const formatted = new Intl.DateTimeFormat("it-IT", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);

    return startTime ? `${formatted} · ${startTime}` : formatted;
  }, [startDate, startTime]);

  const parsedPreviewPrice = parsePrice(price);

  const formattedPrice =
    pricing === "free"
      ? "Gratuito"
      : parsedPreviewPrice !== null
        ? `Da €${parsedPreviewPrice.toFixed(2).replace(".", ",")}`
        : "Prezzo da definire";

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

  function validateStep(step: number) {
    const nextErrors: FormErrors = {};

    if (step === 0) {
      if (!title.trim()) {
        nextErrors.title = "Inserisci il titolo dell'evento.";
      }

      if (categorySlugs.length === 0) {
        nextErrors.category = "Seleziona almeno una categoria.";
      }

      if (!imagePreview) {
        nextErrors.image = "Carica una fotografia principale.";
      }
    }

    if (step === 1) {
      if (!startDate) {
        nextErrors.startDate = "Seleziona la data di inizio.";
      }

      if (!startTime) {
        nextErrors.startTime = "Seleziona l'ora di inizio.";
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
    }

    if (step === 2 && pricing === "paid") {
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

    if (step === 2 && pricing === "free" && ticketUrl.trim()) {
      if (!isValidTicketUrl(ticketUrl)) {
        nextErrors.ticketUrl =
          "Inserisci un link valido (es. www.esempio.it/prenota).";
      }
    }

    if (step === 3) {
      if (stripHtml(description).length < 30) {
        nextErrors.description =
          "Inserisci una descrizione di almeno 30 caratteri.";
      }

      if (youtubeUrl.trim() && !isValidYoutubeUrl(youtubeUrl)) {
        nextErrors.youtubeUrl =
          "Inserisci un link YouTube valido (es. youtube.com/watch?v=… o youtu.be/…).";
      }

      if (canSetOrganizer && !organizer.trim() && !organizerDirectoryId) {
        nextErrors.organizer =
          "Scegli un organizzatore associato all’evento.";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function goNext() {
    if (!validateStep(currentStep)) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setCurrentStep((step) => Math.min(step + 1, steps.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handlePublish() {
    if (publishingLockRef.current || hasPublished) {
      return;
    }

    const stepsToValidate = [0, 1, 2, 3];

    for (const step of stepsToValidate) {
      if (!validateStep(step)) {
        setCurrentStep(step);
        setPublishMessage("");
        setPublishError("");
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
    }

    if (!imageFile) {
      setCurrentStep(0);
      setErrors({ image: "Carica una fotografia principale." });
      setPublishMessage("");
      setPublishError("");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    publishingLockRef.current = true;
    setIsPublishing(true);
    setPublishError("");
    setPublishMessage("");

    let uploadedPath = "";

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        publishingLockRef.current = false;
        setIsPublishing(false);
        router.push("/accedi?redirect=/pubblica");
        return;
      }

      const cityRecord = cities.find((item) => item.city === city);
      const baseSlug = createSlug(title) || "evento";
      const uniqueSlug = `${baseSlug}-${Date.now().toString(36)}`;

      const uploaded = await uploadEventImage(imageFile, { slug: uniqueSlug });
      uploadedPath = uploaded.path;
      const publicUrl = uploaded.publicUrl;

      const startAt = new Date(`${startDate}T${startTime}:00`).toISOString();
      const numericPrice = pricing === "paid" ? parsePrice(price) : null;
      const normalizedTicketUrl = ticketUrl.trim()
        ? normalizeTicketUrl(ticketUrl)
        : null;
      const normalizedYoutubeUrl = youtubeUrl.trim()
        ? normalizeYoutubeUrl(youtubeUrl)
        : null;

      const { data: createdEvent, error: insertError } = await supabase
        .from("events")
        .insert({
          organizer_id: user.id,
          title: title.trim(),
          slug: uniqueSlug,
          description: normalizeEventDescription(description),
          category: normalizeEventCategories(categorySlugs)[0],
          categories: normalizeEventCategories(categorySlugs),
          subcategory: null,
          province: cityRecord?.province ?? null,
          municipality: city,
          location_name: venue.trim(),
          address: venue.trim(),
          start_at: startAt,
          end_at: null,
          image_url: publicUrl,
          is_free: pricing === "free",
          price_from: numericPrice,
          price: numericPrice ?? 0,
          ticket_url: normalizedTicketUrl,
          youtube_url: normalizedYoutubeUrl,
          organizer_display_name: canSetOrganizer
            ? organizer.trim() || defaultOrganizerName
            : defaultOrganizerName,
          organizer_directory_id: canSetOrganizer
            ? organizerDirectoryId
            : null,
          status: "published",
          is_featured: false,
        })
        .select("id, slug")
        .single();

      if (insertError) {
        await supabase.storage.from("event-images").remove([uploadedPath]);
        throw new Error(`Salvataggio evento non riuscito: ${insertError.message}`);
      }

      setErrors({});
      setHasPublished(true);
      setPublishMessage(
        createdEvent?.slug
          ? `Evento pubblicato correttamente. Slug: ${createdEvent.slug}`
          : "Evento pubblicato correttamente su EVERAS.",
      );

      if (createdEvent?.id) {
        requestAdminNotification({
          type: "event_published",
          eventId: createdEvent.id,
        });
      }

      if (createdEvent?.slug) {
        router.push(`/eventi/${createdEvent.slug}`);
        router.refresh();
      }
    } catch (error) {
      if (uploadedPath) {
        await supabase.storage.from("event-images").remove([uploadedPath]);
      }

      publishingLockRef.current = false;
      setIsPublishing(false);
      setPublishError(
        error instanceof Error
          ? error.message
          : "Si è verificato un errore durante la pubblicazione.",
      );
    }
  }

  function goBack() {
    setCurrentStep((step) => Math.max(step - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openStep(index: number) {
    if (index <= currentStep) {
      setCurrentStep(index);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

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

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    clearError("image");
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-white">
        <section className="border-b border-slate-200 bg-slate-50">
          <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#075EAE]">
              Per organizzatori
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
              Pubblica il tuo evento
            </h1>

            <p className="mt-4 max-w-2xl text-lg text-slate-600">
              Inserisci le informazioni essenziali e controlla subito come
              apparirà l&apos;evento su EVERAS.
            </p>

            <div className="mt-10">
              <div className="flex items-center">
                {steps.map((step, index) => {
                  const isActive = index === currentStep;
                  const isCompleted = index < currentStep;
                  const canOpen = index <= currentStep;

                  return (
                    <div
                      key={step}
                      className={`flex items-center ${
                        index < steps.length - 1 ? "flex-1" : ""
                      }`}
                    >
                      <button
                        type="button"
                        disabled={!canOpen}
                        onClick={() => openStep(index)}
                        aria-label={`Vai allo step ${index + 1}: ${step}`}
                        aria-current={isActive ? "step" : undefined}
                        className={`relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-bold transition ${
                          isCompleted
                            ? "bg-[#E67E22] text-white hover:bg-[#C96A1A]"
                            : isActive
                              ? "bg-[#075EAE] text-white ring-4 ring-blue-100"
                              : "cursor-not-allowed border border-slate-300 bg-white text-slate-400"
                        }`}
                      >
                        {isCompleted ? (
                          <Check aria-hidden="true" className="h-5 w-5" />
                        ) : (
                          index + 1
                        )}
                      </button>

                      {index < steps.length - 1 && (
                        <div className="mx-2 h-1 flex-1 overflow-hidden rounded-full bg-slate-200 sm:mx-3">
                          <div
                            className={`h-full rounded-full bg-[#E67E22] transition-all duration-500 ${
                              index < currentStep ? "w-full" : "w-0"
                            }`}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-5">
                <p className="text-sm font-semibold text-[#075EAE]">
                  Step {currentStep + 1} di {steps.length}
                </p>

                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                  {steps[currentStep]}
                </h2>
              </div>

              <div className="mt-5 grid grid-cols-5 gap-2">
                {steps.map((step, index) => (
                  <button
                    key={step}
                    type="button"
                    disabled={index > currentStep}
                    onClick={() => openStep(index)}
                    className={`truncate text-left text-xs font-semibold transition sm:text-sm ${
                      index === currentStep
                        ? "text-[#075EAE]"
                        : index < currentStep
                          ? "text-[#E67E22] hover:text-[#C96A1A]"
                          : "cursor-not-allowed text-slate-400"
                    }`}
                  >
                    {step}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
            <form
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9"
              onSubmit={(event) => event.preventDefault()}
              noValidate
            >
              {Object.keys(errors).length > 0 && (
                <div
                  role="alert"
                  className="mb-8 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
                >
                  Controlla i campi evidenziati prima di continuare.
                </div>
              )}
              {currentStep === 0 && (
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">
                    Informazioni principali
                  </h2>

                  <p className="mt-3 text-slate-600">
                    Cominciamo dal titolo, dalla categoria e dalla fotografia.
                  </p>

                  <div className="mt-8 space-y-6">
                    <label className="block">
                      <span className="text-sm font-bold text-slate-900">
                        Titolo dell&apos;evento
                      </span>

                      <input
                        type="text"
                        name="title"
                        value={title}
                        onChange={(event) => {
                          setTitle(event.target.value);
                          clearError("title");
                        }}
                        placeholder="Es. Jazz al tramonto"
                        aria-invalid={Boolean(errors.title)}
                        className={`mt-2 w-full rounded-2xl border px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:ring-2 ${
                          errors.title
                            ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                            : "border-slate-300 focus:border-[#075EAE] focus:ring-blue-100"
                        }`}
                      />

                      {errors.title && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.title}
                        </p>
                      )}
                    </label>

                    <CategoryMultiSelect
                      value={categorySlugs}
                      onChange={(next) => {
                        setCategorySlugs(next);
                        clearError("category");
                      }}
                      error={errors.category}
                    />

                    <label className="block">
                      <span className="text-sm font-bold text-slate-900">
                        Immagine principale
                      </span>

                      <input
                        id="event-image"
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={handleImageChange}
                        className="sr-only"
                      />

                      <label
                        htmlFor="event-image"
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

                            <p className="mt-1 text-sm text-slate-500">
                              JPG, PNG o WebP (max 5 MB). Verrà compressa e
                              salvata in WebP.
                            </p>
                          </>
                        )}
                      </label>

                      {errors.image && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.image}
                        </p>
                      )}
                    </label>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">
                    Data e luogo
                  </h2>

                  <p className="mt-3 text-slate-600">
                    Indica quando e dove si svolgerà l&apos;evento.
                  </p>

                  <div className="mt-8 grid gap-6 sm:grid-cols-2">
                    <label className="block">
                      <span className="flex items-center gap-2 text-sm font-bold text-slate-900">
                        <CalendarDays className="h-4 w-4 text-[#075EAE]" />
                        Data di inizio
                      </span>

                      <input
                        type="date"
                        name="startDate"
                        value={startDate}
                        onChange={(event) => {
                          setStartDate(event.target.value);
                          clearError("startDate");
                        }}
                        aria-invalid={Boolean(errors.startDate)}
                        className={`mt-2 w-full rounded-2xl border px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none ${
                          errors.startDate
                            ? "border-red-400 focus:border-red-500"
                            : "border-slate-300 focus:border-[#075EAE]"
                        }`}
                      />

                      {errors.startDate && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.startDate}
                        </p>
                      )}
                    </label>

                    <label className="block">
                      <span className="flex items-center gap-2 text-sm font-bold text-slate-900">
                        <Clock3 className="h-4 w-4 text-[#075EAE]" />
                        Ora di inizio
                      </span>

                      <input
                        type="time"
                        name="startTime"
                        value={startTime}
                        onChange={(event) => {
                          setStartTime(event.target.value);
                          clearError("startTime");
                        }}
                        aria-invalid={Boolean(errors.startTime)}
                        className={`mt-2 w-full rounded-2xl border px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none ${
                          errors.startTime
                            ? "border-red-400 focus:border-red-500"
                            : "border-slate-300 focus:border-[#075EAE]"
                        }`}
                      />

                      {errors.startTime && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.startTime}
                        </p>
                      )}
                    </label>

                    <label className="block">
                      <span className="text-sm font-bold text-slate-900">
                        Area
                      </span>

                      <select
                        name="area"
                        value={area}
                        onChange={(event) => {
                          setArea(event.target.value);
                          setCity("");
                          clearError("area");
                          clearError("city");
                        }}
                        aria-invalid={Boolean(errors.area)}
                        className={`mt-2 w-full rounded-2xl border bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none ${
                          errors.area
                            ? "border-red-400 focus:border-red-500"
                            : "border-slate-300 focus:border-[#075EAE]"
                        }`}
                      >
                        <option value="">Seleziona un&apos;area</option>
                        <option value="Nord Sardegna">Nord Sardegna</option>
                        <option value="Centro Sardegna">Centro Sardegna</option>
                        <option value="Sud Sardegna">Sud Sardegna</option>
                      </select>

                      {errors.area && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.area}
                        </p>
                      )}
                    </label>

                    <label className="block">
                      <span className="text-sm font-bold text-slate-900">
                        Città
                      </span>

                      <select
                        name="city"
                        value={city}
                        onChange={(event) => {
                          setCity(event.target.value);
                          clearError("city");
                        }}
                        aria-invalid={Boolean(errors.city)}
                        className={`mt-2 w-full rounded-2xl border bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none ${
                          errors.city
                            ? "border-red-400 focus:border-red-500"
                            : "border-slate-300 focus:border-[#075EAE]"
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
                        <p className="mt-2 text-sm text-red-600">
                          {errors.city}
                        </p>
                      )}
                    </label>

                    <label className="block sm:col-span-2">
                      <span className="flex items-center gap-2 text-sm font-bold text-slate-900">
                        <MapPin className="h-4 w-4 text-[#075EAE]" />
                        Indirizzo o luogo
                      </span>

                      <input
                        type="text"
                        name="venue"
                        value={venue}
                        onChange={(event) => {
                          setVenue(event.target.value);
                          clearError("venue");
                        }}
                        placeholder="Es. Lungomare Dante, Alghero"
                        aria-invalid={Boolean(errors.venue)}
                        className={`mt-2 w-full rounded-2xl border px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none ${
                          errors.venue
                            ? "border-red-400 focus:border-red-500"
                            : "border-slate-300 focus:border-[#075EAE]"
                        }`}
                      />

                      {errors.venue && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.venue}
                        </p>
                      )}
                    </label>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">
                    Biglietti e prezzo
                  </h2>

                  <p className="mt-3 text-slate-600">
                    Specifica se l&apos;evento è gratuito oppure a pagamento.
                  </p>

                  <div className="mt-8 space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label
                        className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-5 transition ${
                          pricing === "free"
                            ? "border-[#075EAE] bg-blue-50"
                            : "border-slate-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="pricing"
                          value="free"
                          checked={pricing === "free"}
                          onChange={() => {
                            setPricing("free");
                            clearError("price");
                            clearError("ticketUrl");
                          }}
                          className="mt-1"
                        />

                        <div>
                          <p className="font-bold text-slate-900">
                            Evento gratuito
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            Puoi aggiungere un link di prenotazione se serve.
                          </p>
                        </div>
                      </label>

                      <label
                        className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-5 transition ${
                          pricing === "paid"
                            ? "border-[#075EAE] bg-blue-50"
                            : "border-slate-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="pricing"
                          value="paid"
                          checked={pricing === "paid"}
                          onChange={() => setPricing("paid")}
                          className="mt-1"
                        />

                        <div>
                          <p className="font-bold text-slate-900">
                            Evento a pagamento
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            Inserisci prezzo e biglietteria.
                          </p>
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
                          name="price"
                          inputMode="decimal"
                          autoComplete="off"
                          value={price}
                          onChange={(event) => {
                            setPrice(event.target.value);
                            clearError("price");
                          }}
                          placeholder="15,00"
                          aria-invalid={Boolean(errors.price)}
                          className={`mt-2 w-full rounded-2xl border px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none ${
                            errors.price
                              ? "border-red-400 focus:border-red-500"
                              : "border-slate-300 focus:border-[#075EAE]"
                          }`}
                        />

                        {errors.price && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.price}
                          </p>
                        )}
                      </label>
                    )}

                    <label className="block">
                      <span className="flex items-center gap-2 text-sm font-bold text-slate-900">
                        <Link2 className="h-4 w-4 text-[#075EAE]" />
                        {pricing === "free"
                          ? "Link per prenotare (opzionale)"
                          : "Link per acquistare il biglietto"}
                      </span>

                      <input
                        type="url"
                        name="ticketUrl"
                        inputMode="url"
                        autoCapitalize="none"
                        autoCorrect="off"
                        value={ticketUrl}
                        onChange={(event) => {
                          setTicketUrl(event.target.value);
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
                        aria-invalid={Boolean(errors.ticketUrl)}
                        className={`mt-2 w-full rounded-2xl border px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none ${
                          errors.ticketUrl
                            ? "border-red-400 focus:border-red-500"
                            : "border-slate-300 focus:border-[#075EAE]"
                        }`}
                      />

                      {errors.ticketUrl && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.ticketUrl}
                        </p>
                      )}

                      <p className="mt-2 text-sm text-slate-500">
                        {pricing === "free"
                          ? "Se c’è un form o una pagina di prenotazione, inseriscila qui: il pulsante comparirà solo se compilato."
                          : "Basta un indirizzo come www.ticketone.it — se manca https:// lo aggiungiamo noi."}
                      </p>
                    </label>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">
                    Descrizione
                  </h2>

                  <p className="mt-3 text-slate-600">
                    Racconta cosa rende speciale il tuo evento.
                  </p>

                  <div className="mt-8 space-y-6">
                    <label className="block">
                      <span className="text-sm font-bold text-slate-900">
                        Descrizione completa
                      </span>

                      <textarea
                        name="description"
                        rows={9}
                        value={description}
                        onChange={(event) => {
                          setDescription(event.target.value);
                          clearError("description");
                        }}
                        placeholder="Descrivi il programma, l'atmosfera, gli artisti o le attività previste..."
                        aria-invalid={Boolean(errors.description)}
                        className={`mt-2 w-full resize-y rounded-2xl border px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none ${
                          errors.description
                            ? "border-red-400 focus:border-red-500"
                            : "border-slate-300 focus:border-[#075EAE]"
                        }`}
                      />

                      <div className="mt-2 flex items-center justify-between gap-4">
                        {errors.description ? (
                          <p className="text-sm text-red-600">
                            {errors.description}
                          </p>
                        ) : (
                          <span />
                        )}

                        <span className="text-xs text-slate-500">
                          {stripHtml(description).length}/30 caratteri minimi
                        </span>
                      </div>
                    </label>

                    <label className="block">
                      <span className="flex items-center gap-2 text-sm font-bold text-slate-900">
                        <Link2 className="h-4 w-4 text-[#075EAE]" />
                        Link video YouTube{" "}
                        <span className="font-medium text-slate-400">
                          (opzionale)
                        </span>
                      </span>

                      <input
                        type="url"
                        name="youtubeUrl"
                        inputMode="url"
                        autoCapitalize="none"
                        autoCorrect="off"
                        value={youtubeUrl}
                        onChange={(event) => {
                          setYoutubeUrl(event.target.value);
                          clearError("youtubeUrl");
                        }}
                        onBlur={() => {
                          if (!youtubeUrl.trim()) {
                            return;
                          }

                          setYoutubeUrl(normalizeYoutubeUrl(youtubeUrl));
                        }}
                        placeholder="https://www.youtube.com/watch?v=…"
                        aria-invalid={Boolean(errors.youtubeUrl)}
                        className={`mt-2 w-full rounded-2xl border px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none ${
                          errors.youtubeUrl
                            ? "border-red-400 focus:border-red-500"
                            : "border-slate-300 focus:border-[#075EAE]"
                        }`}
                      />

                      {errors.youtubeUrl && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.youtubeUrl}
                        </p>
                      )}

                      <p className="mt-2 text-sm text-slate-500">
                        Se inserisci un link, sulla pagina dell&apos;evento
                        comparirà il video player YouTube.
                      </p>
                    </label>

                    <label className="block">
                      <span className="text-sm font-bold text-slate-900">
                        Organizzatore associato
                      </span>
                      <p className="mt-1 text-sm text-slate-500">
                        {canSetOrganizer
                          ? "Scegli un organizzatore già salvato in rubrica, oppure lascia il tuo account."
                          : "Con Free l’organizzatore è il tuo account. Passa a Pro per associare un profilo dalla rubrica."}
                      </p>

                      {canSetOrganizer ? (
                        <OrganizerDirectorySelect
                          accountName={defaultOrganizerName}
                          directoryId={organizerDirectoryId}
                          displayName={organizer}
                          onChange={({ directoryId, displayName }) => {
                            setOrganizerDirectoryId(directoryId);
                            setOrganizer(displayName);
                            clearError("organizer");
                          }}
                          error={errors.organizer}
                        />
                      ) : (
                        <input
                          type="text"
                          name="organizer"
                          value={defaultOrganizerName}
                          readOnly
                          className="mt-2 w-full cursor-not-allowed rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-600 outline-none"
                        />
                      )}

                      {errors.organizer && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.organizer}
                        </p>
                      )}

                      {!canSetOrganizer ? (
                        <Link
                          href="/dashboard/piano"
                          className="mt-2 inline-flex text-sm font-bold text-[#075EAE] hover:underline"
                        >
                          Scopri il piano Pro →
                        </Link>
                      ) : null}
                    </label>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">
                    Controlla e pubblica
                  </h2>

                  <p className="mt-3 text-slate-600">
                    Verifica le informazioni prima di pubblicare l&apos;evento.
                  </p>

                  <div className="mt-8 space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-6">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                        Evento
                      </p>
                      <p className="mt-1 font-bold text-slate-900">
                        {title || "Titolo da inserire"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                        Data e luogo
                      </p>
                      <p className="mt-1 text-slate-700">{formattedDate}</p>
                      <p className="text-slate-700">
                        {[venue, city, area].filter(Boolean).join(" · ") ||
                          "Luogo da definire"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                        Prezzo
                      </p>
                      <p className="mt-1 font-bold text-slate-900">
                        {formattedPrice}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                        Organizzatore
                      </p>
                      <p className="mt-1 text-slate-700">
                        {canSetOrganizer
                          ? organizer.trim() || "—"
                          : defaultOrganizerName}
                      </p>
                    </div>

                    {description && (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                          Descrizione
                        </p>
                        <p className="mt-1 line-clamp-4 text-slate-700">
                          {description}
                        </p>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handlePublish}
                    disabled={isPublishing || hasPublished}
                    className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#E67E22] px-6 py-4 font-bold text-white transition hover:bg-[#C96A1A] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Ticket className="h-5 w-5" />
                    {hasPublished
                      ? "Evento pubblicato"
                      : isPublishing
                        ? "Pubblicazione in corso..."
                        : "Pubblica evento"}
                  </button>

                  {publishMessage && (
                    <p className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-center text-sm font-semibold text-emerald-800">
                      {publishMessage}
                    </p>
                  )}

                  {publishError && (
                    <p
                      role="alert"
                      className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-semibold text-red-800"
                    >
                      {publishError}
                    </p>
                  )}

                  {!publishMessage && !publishError && (
                    <p className="mt-3 text-center text-sm text-slate-500">
                      La fotografia verrà compressa in WebP e l&apos;evento
                      sarà salvato su EVERAS.
                    </p>
                  )}
                </div>
              )}

              <div className="mt-10 flex items-center justify-between border-t border-slate-200 pt-6">
                {currentStep > 0 ? (
                  <button
                    type="button"
                    onClick={goBack}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-3 font-bold text-slate-700 transition hover:border-[#075EAE] hover:text-[#075EAE]"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Indietro
                  </button>
                ) : (
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-[#075EAE]"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Torna alla home
                  </Link>
                )}

                {currentStep < steps.length - 1 && (
                  <button
                    type="button"
                    onClick={goNext}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#075EAE] px-6 py-3 font-bold text-white transition hover:bg-[#064E91]"
                  >
                    Continua
                    <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </form>

            <aside className="lg:sticky lg:top-28">
              <p className="mb-3 text-sm font-bold text-slate-900">
                Anteprima live
              </p>

              <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="relative aspect-square overflow-hidden bg-slate-100">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Anteprima evento"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center px-6 text-center text-slate-400">
                      <ImagePlus className="h-9 w-9" />
                      <p className="mt-3 text-sm font-semibold">
                        La foto apparirà qui
                      </p>
                    </div>
                  )}

                  {pricing === "free" && (
                    <span className="absolute left-4 top-4 rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm">
                      Gratuito
                    </span>
                  )}
                </div>

                <div className="p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#075EAE]">
                    {selectedCategoryLabels.length
                      ? selectedCategoryLabels.join(" · ")
                      : "Categoria"}
                  </p>

                  <h3 className="mt-2 text-xl font-bold leading-snug text-slate-900">
                    {title || "Titolo del tuo evento"}
                  </h3>

                  <div className="mt-4 space-y-2 text-sm text-slate-600">
                    <div className="flex items-start gap-2">
                      <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-[#075EAE]" />
                      <span>{formattedDate}</span>
                    </div>

                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#075EAE]" />
                      <span>
                        {[venue, city, area].filter(Boolean).join(" · ") ||
                          "Luogo da definire"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                    <span
                      className={`font-bold ${
                        pricing === "free"
                          ? "text-emerald-600"
                          : "text-[#E67E22]"
                      }`}
                    >
                      {formattedPrice}
                    </span>

                    <span className="font-bold text-[#075EAE]">
                      Scopri →
                    </span>
                  </div>
                </div>
              </article>

              <p className="mt-4 text-sm leading-6 text-slate-500">
                L&apos;anteprima si aggiorna mentre compili il modulo.
              </p>
            </aside>
          </div>
        </section>
      </main>
    </>
  );
}
