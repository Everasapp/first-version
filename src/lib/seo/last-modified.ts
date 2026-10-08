export type LastModifiedValue = Date | string | null | undefined;

function validTimestamp(value: LastModifiedValue) {
  if (!value) return undefined;
  const timestamp = value instanceof Date ? value.getTime() : new Date(value).getTime();
  return Number.isFinite(timestamp) ? timestamp : undefined;
}

/** Latest valid content modification date. Invalid or missing values are ignored. */
export function latestLastModified(
  values: Iterable<LastModifiedValue>,
  minimum?: LastModifiedValue,
) {
  let latest = validTimestamp(minimum);

  for (const value of values) {
    const timestamp = validTimestamp(value);
    if (timestamp !== undefined && (latest === undefined || timestamp > latest)) {
      latest = timestamp;
    }
  }

  return latest === undefined ? undefined : new Date(latest);
}

export function latestEventUpdate(
  events: readonly { updated_at?: string | null }[],
  minimum?: LastModifiedValue,
) {
  return latestLastModified(
    events.map((event) => event.updated_at),
    minimum,
  );
}
