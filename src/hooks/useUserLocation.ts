"use client";

import { useEffect, useState } from "react";

import {
  isGeoDenied,
  markGeoDenied,
  readGeoCoords,
  saveGeoCoords,
  type GeoCoords,
} from "@/src/lib/geo-preference";

type GeoStatus = "idle" | "ready" | "denied" | "unavailable";

/**
 * Rileva (o riusa) la posizione utente per ordinare eventi vicini.
 * Non riprompta se l'utente ha già negato il permesso.
 */
export function useUserLocation() {
  const [coords, setCoords] = useState<GeoCoords | null>(null);
  const [status, setStatus] = useState<GeoStatus>("idle");

  useEffect(() => {
    const cached = readGeoCoords();
    if (cached) {
      setCoords(cached);
      setStatus("ready");
    }

    if (isGeoDenied()) {
      setStatus(cached ? "ready" : "denied");
      return;
    }

    if (!navigator.geolocation) {
      setStatus(cached ? "ready" : "unavailable");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const next = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        saveGeoCoords(next);
        setCoords(next);
        setStatus("ready");
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          markGeoDenied();
          setStatus(cached ? "ready" : "denied");
          return;
        }
        setStatus(cached ? "ready" : "unavailable");
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 30 * 60 * 1000,
      },
    );
  }, []);

  return { coords, status, hasLocation: Boolean(coords) };
}
