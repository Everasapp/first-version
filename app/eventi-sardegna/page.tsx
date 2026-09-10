import type { Metadata } from "next";

import EventLandingView from "@/src/components/seo/EventLandingView";
import { loadFilteredPublishedEvents } from "@/src/lib/seo/loadEvents";
import {
  breadcrumbListSchema,
  collectionPageSchema,
  faqPageSchema,
} from "@/src/lib/seo/schema";
import { sagreExploreLinks } from "@/src/lib/seo/calendar";
import { festivalHubLinks } from "@/src/lib/seo/festival-hubs";
import { weekendExploreLinks } from "@/src/lib/seo/weekends";
import { absoluteUrl, defaultOgImages } from "@/src/lib/seo/site";

const HUB_PATH = "/eventi-sardegna";

const HUB_TITLE = "Eventi e sagre in Sardegna oggi e questo weekend";
const HUB_DESCRIPTION =
  "Cosa fare in Sardegna oggi, domani e nel weekend: sagre, concerti, feste paese e festival da Nord a Sud, aggiornati ogni giorno.";

const HUB_PARAGRAPHS = [
  "Se cerchi eventi in Sardegna, di solito vuoi il programma di oggi, cosa c’è nel weekend e dove si fa sagra. Questa pagina è la guida: un calendario vivo, non un elenco statico. Trovi concerti, fiere, spettacoli e le feste che muovono i paesi, con data, comune e locandina.",
  "Partiamo dalle ricerche vere. “Eventi oggi in Sardegna”, “cosa fare questo weekend”, “sagre a settembre”, “Autunno in Barbagia”: sono domande diverse, e per ognuna c’è una pagina. Da qui arrivi al giorno, al weekend con data, al mese o alla festa grande senza passare da filtri nascosti.",
  "Il calendario si aggiorna con fonti locali, Comuni, Pro Loco e rassegne come Salude & Trigu. Pubblichiamo solo eventi con informazioni utili. Se organizzi una sagra o un concerto, puoi segnalarla: entra in guida e resta visibile a chi cerca cosa fare sull’isola.",
];

const HUB_FAQS_BASE = [
  {
    question: "Quali sono gli eventi in programma oggi in Sardegna?",
    answer:
      "La pagina Eventi oggi mostra solo gli appuntamenti della giornata in corso, con orario e luogo sulla scheda.",
  },
  {
    question: "Quali sono le feste e le sagre in Sardegna?",
    answer:
      "Oltre al calendario mese per mese trovi le guide a Autunno in Barbagia, Candelieri, Sartiglia, Carnevale, Monumenti Aperti e Sant’Efisio.",
  },
];

export const metadata: Metadata = {
  title: HUB_TITLE,
  description: HUB_DESCRIPTION,
  alternates: { canonical: HUB_PATH },
  openGraph: {
    title: `${HUB_TITLE} | EVERAS`,
    description: HUB_DESCRIPTION,
    url: HUB_PATH,
    type: "website",
    images: defaultOgImages(),
  },
  twitter: {
    card: "summary_large_image",
    title: `${HUB_TITLE} | EVERAS`,
    description: HUB_DESCRIPTION,
    images: defaultOgImages().map((image) => image.url),
  },
};

export default async function EventiSardegnaHubPage() {
  const { events, error } = await loadFilteredPublishedEvents();
  const upcoming = events.slice(0, 24);
  const datedWeekends = weekendExploreLinks(2)
    .map((link) => link.label)
    .join(" e ");
  const faqs = [
    {
      question: "Cosa c’è da fare in Sardegna questo fine settimana?",
      answer: `Apri Eventi weekend per il fine settimana in corso. Se stai pianificando i giorni dopo, usa le pagine datate, per esempio ${datedWeekends}.`,
    },
    ...HUB_FAQS_BASE,
  ];

  return (
    <EventLandingView
      eyebrow="Guida eventi"
      h1={HUB_TITLE}
      intro={HUB_DESCRIPTION}
      paragraphs={HUB_PARAGRAPHS}
      events={upcoming}
      errorMessage={error?.message}
      breadcrumbs={[
        { name: "Home", href: "/" },
        { name: "Eventi e sagre" },
      ]}
      faqs={faqs}
      relatedLinks={[
        ...sagreExploreLinks().filter((link) => link.href !== HUB_PATH),
        ...weekendExploreLinks(),
        ...festivalHubLinks(),
      ]}
      jsonLd={[
        collectionPageSchema({
          name: HUB_TITLE,
          description: HUB_DESCRIPTION,
          url: absoluteUrl(HUB_PATH),
        }),
        breadcrumbListSchema([
          { name: "Home", path: "/" },
          { name: "Eventi e sagre", path: HUB_PATH },
        ]),
        faqPageSchema(faqs),
      ].filter((item): item is Record<string, unknown> => item != null)}
    />
  );
}
