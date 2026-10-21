"use client";

import { useId } from "react";
import { isLearningTopic, LEARNING_AREAS, LEARNING_TOPICS } from "@/src/lib/learning-courses";

type LearningTopicSelectProps = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
};

/** Editorial classification only: no data requests or independent state. */
export default function LearningTopicSelect({ value, onChange, error }: LearningTopicSelectProps) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-bold text-slate-900">
        Macroarea e disciplina
      </label>
      <p id={`${id}-help`} className="mt-2 text-sm leading-relaxed text-slate-600">
        Scegli in base all’obiettivo: Formazione per acquisire professionalità,
        Corsi e workshop per esperienze che arricchiscono. La stessa materia
        può avere finalità diverse.
      </p>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={`${id}-help${error ? ` ${id}-error` : ""}`}
        className={`mt-2 min-h-11 w-full rounded-2xl border bg-white px-4 py-3 text-base text-slate-900 outline-none focus:ring-2 ${error ? "border-red-400 focus:ring-red-100" : "border-slate-300 focus:border-[#075EAE] focus:ring-blue-100"}`}
      >
        <option value="">Scegli macroarea e disciplina</option>
        {value && !isLearningTopic(value) ? <option value={value}>Classificazione esistente da verificare</option> : null}
        {LEARNING_AREAS.map((area) => (
          <optgroup key={area.key} label={`${area.title} — ${area.subtitle}`}>
            {LEARNING_TOPICS.filter((topic) => topic.area === area.key).map((topic) => (
              <option key={topic.key} value={topic.key}>{topic.title}</option>
            ))}
          </optgroup>
        ))}
      </select>
      {error ? <p id={`${id}-error`} className="mt-2 text-sm text-red-600">{error}</p> : null}
      <p className="mt-2 text-sm text-slate-600">
        Specifica nel programma il formato (corso, seminario, workshop,
        laboratorio o esperienza), i destinatari e gli eventuali attestati.
      </p>
    </div>
  );
}
