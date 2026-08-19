"use client";

import { useEffect, useMemo, useState } from "react";

import {
  parseSavedOrganizerOptions,
  type SavedOrganizerOption,
} from "@/src/lib/saved-organizers";
import { createClient } from "@/src/lib/supabase/client";

const ACCOUNT_VALUE = "__account__";
const CUSTOM_VALUE = "__custom__";
const EMPTY_VALUE = "__empty__";

type OrganizerDirectorySelectProps = {
  accountName?: string;
  directoryId: string | null;
  displayName: string;
  onChange: (next: { directoryId: string | null; displayName: string }) => void;
  disabled?: boolean;
  error?: string;
  className?: string;
  variant?: "publisher" | "directory";
  suggestedIds?: string[];
};

function namesMatch(a: string, b: string) {
  return a.trim().toLocaleLowerCase("it") === b.trim().toLocaleLowerCase("it");
}

export default function OrganizerDirectorySelect({
  accountName = "",
  directoryId,
  displayName,
  onChange,
  disabled = false,
  error,
  className = "",
  variant = "publisher",
  suggestedIds = [],
}: OrganizerDirectorySelectProps) {
  const [organizers, setOrganizers] = useState<SavedOrganizerOption[]>([]);
  const [query, setQuery] = useState("");
  const [loadError, setLoadError] = useState("");
  const isDirectoryPicker = variant === "directory";

  useEffect(() => {
    let cancelled = false;

    async function loadOrganizers() {
      const supabase = createClient();
      const adminResult = await supabase
        .from("organizer_directory")
        .select("id, name, website, claim_status")
        .order("name", { ascending: true });

      if (cancelled) {
        return;
      }

      if (!adminResult.error && (adminResult.data?.length ?? 0) > 0) {
        setOrganizers(parseSavedOrganizerOptions(adminResult.data));
        return;
      }

      const publicResult = await supabase
        .from("organizer_directory_public")
        .select("id, name, claim_status")
        .order("name", { ascending: true });

      if (cancelled) {
        return;
      }

      if (publicResult.error) {
        setLoadError("Impossibile caricare gli organizzatori salvati.");
        return;
      }

      setOrganizers(parseSavedOrganizerOptions(publicResult.data));
    }

    void loadOrganizers();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!directoryId || organizers.length === 0) {
      return;
    }

    const picked = organizers.find((item) => item.id === directoryId);
    if (!picked || namesMatch(picked.name, displayName)) {
      return;
    }

    onChange({ directoryId: picked.id, displayName: picked.name });
  }, [directoryId, displayName, onChange, organizers]);

  const selectedOrganizer = directoryId
    ? organizers.find((item) => item.id === directoryId)
    : undefined;
  const hasCustomName =
    Boolean(displayName.trim()) &&
    !namesMatch(displayName, accountName) &&
    !organizers.some((item) => namesMatch(item.name, displayName));

  const selectedValue = directoryId
    ? directoryId
    : hasCustomName
      ? CUSTOM_VALUE
      : isDirectoryPicker
        ? EMPTY_VALUE
        : ACCOUNT_VALUE;

  const filteredOrganizers = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("it");
    if (!needle) {
      return organizers;
    }

    return organizers.filter((item) =>
      item.label.toLocaleLowerCase("it").includes(needle),
    );
  }, [organizers, query]);

  const visibleOrganizers = useMemo(() => {
    if (!selectedOrganizer) {
      return filteredOrganizers;
    }

    if (filteredOrganizers.some((item) => item.id === selectedOrganizer.id)) {
      return filteredOrganizers;
    }

    return [selectedOrganizer, ...filteredOrganizers];
  }, [filteredOrganizers, selectedOrganizer]);

  const suggestedIdSet = useMemo(() => new Set(suggestedIds), [suggestedIds]);
  const suggestedOrganizers = useMemo(
    () => visibleOrganizers.filter((item) => suggestedIdSet.has(item.id)),
    [suggestedIdSet, visibleOrganizers],
  );
  const otherOrganizers = useMemo(
    () => visibleOrganizers.filter((item) => !suggestedIdSet.has(item.id)),
    [suggestedIdSet, visibleOrganizers],
  );

  const fieldClassName = `mt-2 w-full rounded-2xl border bg-white px-4 py-3 text-base text-slate-900 outline-none ${
    error ? "border-red-400" : "border-slate-300"
  } ${disabled ? "cursor-not-allowed bg-slate-50 text-slate-600" : ""}`;
  const showSearch = organizers.length > (isDirectoryPicker ? 5 : 8);

  return (
    <div className={className}>
      {showSearch ? (
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          disabled={disabled}
          placeholder="Cerca tra gli organizzatori salvati"
          className={fieldClassName}
        />
      ) : null}

      <select
        value={
          selectedValue === ACCOUNT_VALUE ||
          selectedValue === CUSTOM_VALUE ||
          selectedValue === EMPTY_VALUE ||
          organizers.some((item) => item.id === selectedValue) ||
          Boolean(directoryId)
            ? selectedValue
            : isDirectoryPicker
              ? EMPTY_VALUE
              : ACCOUNT_VALUE
        }
        disabled={disabled}
        onChange={(event) => {
          const value = event.target.value;
          if (value === EMPTY_VALUE) {
            onChange({ directoryId: null, displayName: displayName.trim() });
            return;
          }

          if (value === ACCOUNT_VALUE) {
            onChange({ directoryId: null, displayName: accountName });
            return;
          }

          if (value === CUSTOM_VALUE) {
            onChange({ directoryId: null, displayName: displayName.trim() });
            return;
          }

          const picked = organizers.find((item) => item.id === value);
          if (!picked) {
            return;
          }

          onChange({ directoryId: picked.id, displayName: picked.name });
        }}
        className={fieldClassName}
      >
        {isDirectoryPicker ? (
          <option value={EMPTY_VALUE}>Scegli un organizzatore salvato</option>
        ) : (
          <option value={ACCOUNT_VALUE}>
            Il mio account · {accountName}
          </option>
        )}
        {hasCustomName ? (
          <option value={CUSTOM_VALUE}>{displayName} (nome rilevato)</option>
        ) : null}
        {directoryId && !selectedOrganizer ? (
          <option value={directoryId}>Organizzatore selezionato</option>
        ) : null}
        {suggestedOrganizers.length > 0 ? (
          <optgroup label="Suggeriti">
            {suggestedOrganizers.map((item) => (
              <option key={`suggested-${item.id}`} value={item.id}>
                {item.label}
              </option>
            ))}
          </optgroup>
        ) : null}
        {otherOrganizers.length > 0 ? (
          suggestedOrganizers.length > 0 ? (
            <optgroup label="Tutti gli organizzatori">
              {otherOrganizers.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </optgroup>
          ) : (
            otherOrganizers.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))
          )
        ) : null}
      </select>

      {loadError ? (
        <p className="mt-2 text-sm text-red-600">{loadError}</p>
      ) : null}
    </div>
  );
}
