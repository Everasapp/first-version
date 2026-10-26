/** Use explicit location fields, never a mention of online lessons in the programme. */
export function isOnlineLocation(input: {
  municipality?: string | null;
  location_name?: string | null;
  address?: string | null;
}) {
  const city = input.municipality?.trim().toLocaleLowerCase("it") ?? "";
  if (["online", "a distanza"].includes(city)) return true;
  // A real address can belong to a blended course: keep its physical directions.
  if (input.address?.trim()) return false;
  const venue = input.location_name?.trim() ?? "";
  return /^(?:online(?:\s*[–—:-]\s*(?:aula virtuale(?: in diretta)?|zoom|in diretta))?|aula virtuale(?: in diretta)?|formazione a distanza|webinar)$/i.test(venue);
}
