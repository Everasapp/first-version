"use client";

import { useCallback, useEffect, useState } from "react";

import {
  isGeoDenied,
  markGeoDenied,
  readGeoCoords,
  saveGeoCoords,
  type GeoCoords,
} from "@/src/lib/geo-preference";

type GeoStatus = "idle" | "ready" | "denied" | "unavailable" | "prompting";

/**
 * Riusa la posizione in cache, oppure la richiede solo su gesto utente
 * (`requestLocation`), così il browser non chiede il permesso al page load.
 */
export function useUserLocation() {
  const [coords, setCoords] = useState<GeoCoords | null>(null);
  const [status, setStatus] = useState<GeoStatus>("idle");

  const applySuccess = useCallback((position: GeolocationPosition) => {
    const next = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
    saveGeoCoords(next);
    setCoords(next);
    setStatus("ready");
  }, []);

  const applyError = useCallback(
    (error: GeolocationPositionError, cached: GeoCoords | null) => {
      if (error.code === error.PERMISSION_DENIED) {
        markGeoDenied();
        setStatus(cached ? "ready" : "denied");
        return;
      }
      setStatus(cached ? "ready" : "unavailable");
    },
    [],
  );

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus("unavailable");
      return;
    }

    setStatus("prompting");
    navigator.geolocation.getCurrentPosition(
      applySuccess,
      (error) => applyError(error, readGeoCoords()),
      {
        enableHighAccuracy: false,
        timeout: 12000,
        maximumAge: 5 * 60 * 1000,
      },
    );
  }, [applyError, applySuccess]);

  useEffect(() => {
    const cached = readGeoCoords();
    if (cached) {
      setCoords(cached);
      setStatus("ready");
      return;
    }

    if (isGeoDenied()) {
      setStatus("denied");
      return;
    }

    if (!navigator.geolocation) {
      setStatus("unavailable");
    }
  }, []);

  return {
    coords,
    status,
    hasLocation: Boolean(coords),
    requestLocation,
  };
}
