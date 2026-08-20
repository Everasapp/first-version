export async function requestConfirmationEmail(email: string) {
  const response = await fetch("/api/auth/resend-confirmation", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.trim() }),
  });

  const data = (await response.json().catch(() => ({}))) as {
    message?: string;
  };

  return (
    data.message ||
    "Se l’account esiste, ti abbiamo inviato un’email. Controlla anche Spam e Promozioni."
  );
}
