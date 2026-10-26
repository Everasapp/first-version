import { ExternalLink, MapPin } from "lucide-react";

import { isOnlineLocation } from "@/src/lib/course-location";
import { formatHowToArrive } from "@/src/lib/event-practical";

type Props = {
  title: string;
  municipality: string;
  province?: string | null;
  location_name?: string | null;
  address?: string | null;
  registrationUrl?: string | null;
};

export default function EventLocationDetails(props: Props) {
  if (isOnlineLocation(props)) {
    return (
      <section className="border-t border-slate-200 py-10" aria-labelledby="course-access-title">
        <h2 id="course-access-title" className="text-3xl font-bold text-slate-900">Come partecipare online</h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
          L’attività si svolge a distanza. Consulta il programma per piattaforma,
          attrezzatura richiesta, calendario e condizioni di frequenza.
          Dopo l’ammissione, segui le indicazioni dell’organizzatore per ricevere
          il collegamento o le credenziali di accesso alle lezioni.
        </p>
        {props.registrationUrl ? (
          <a href={props.registrationUrl} target="_blank" rel="noopener noreferrer"
            className="mt-5 inline-flex min-h-11 items-center gap-2 font-bold text-[#075EAE] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#075EAE] focus-visible:ring-offset-2">
            Informazioni e iscrizioni presso l’organizzatore
            <ExternalLink aria-hidden="true" className="h-4 w-4" />
          </a>
        ) : null}
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          Un account EVERAS non sostituisce la candidatura al corso.
          Conferma disponibilità e modalità di accesso direttamente con l’ente.
        </p>
      </section>
    );
  }

  const location = props.location_name || props.municipality;
  const details = [props.address, props.municipality, props.province].filter(Boolean).join(" · ");
  const query = encodeURIComponent([props.location_name, props.address, props.municipality, props.province, "Sardegna"].filter(Boolean).join(", "));
  return (
    <section className="border-t border-slate-200 py-10" aria-labelledby="event-directions-title">
      <h2 id="event-directions-title" className="text-3xl font-bold text-slate-900">Come arrivare</h2>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
        {formatHowToArrive({ locationName: props.location_name, address: props.address, municipality: props.municipality, province: props.province })}
      </p>
      <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
        <iframe title={`Mappa di ${props.title}`} src={`https://www.google.com/maps?q=${query}&output=embed`}
          width="100%" height="360" loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade" className="block w-full border-0" />
        <div className="flex flex-col gap-4 border-t border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <MapPin aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#075EAE]" />
            <div>
              <p className="font-bold text-slate-900">{location}</p>
              {details ? <p className="mt-1 text-sm text-slate-600">{details}</p> : null}
            </div>
          </div>
          <a href={`https://www.google.com/maps/search/?api=1&query=${query}`} target="_blank" rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 font-bold text-[#075EAE] hover:underline">
            Apri su Google Maps<ExternalLink aria-hidden="true" className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
