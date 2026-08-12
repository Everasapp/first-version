import { categories } from "@/src/data/categories";
import { getSiteUrl } from "@/src/lib/notifications/config";
import { sendAdminNotification } from "@/src/lib/notifications/sendAdminNotification";

export async function notifyNewUser(input: {
  name: string;
  email: string;
  registeredAt?: string;
}) {
  await sendAdminNotification({
    type: "user_registered",
    title: "Nuovo utente registrato",
    message: "Un nuovo utente si è registrato su EVERAS.",
    data: {
      name: input.name,
      email: input.email,
      registeredAt: input.registeredAt ?? new Date().toISOString(),
    },
  });
}

export async function notifyNewOrganizer(input: {
  name: string;
  email: string;
  role?: string;
  registeredAt?: string;
}) {
  await sendAdminNotification({
    type: "organizer_registered",
    title: "Nuovo organizzatore registrato",
    message: "Un nuovo organizzatore si è registrato su EVERAS.",
    data: {
      name: input.name,
      email: input.email,
      role: input.role ?? "organizzatore",
      registeredAt: input.registeredAt ?? new Date().toISOString(),
    },
  });
}

export async function notifyEventPublished(input: {
  title: string;
  organizer: string;
  municipality: string;
  startAt: string;
  category: string;
  slug: string;
}) {
  const categoryLabel =
    categories.find((category) => category.slug === input.category)?.name ??
    input.category;

  const eventUrl = `${getSiteUrl()}/eventi/${input.slug}`;

  await sendAdminNotification({
    type: "event_published",
    title: "Nuovo evento pubblicato",
    message: "È stato pubblicato un nuovo evento su EVERAS.",
    data: {
      title: input.title,
      organizer: input.organizer,
      municipality: input.municipality,
      startAt: input.startAt,
      category: categoryLabel,
      slug: input.slug,
      eventUrl,
    },
  });
}
