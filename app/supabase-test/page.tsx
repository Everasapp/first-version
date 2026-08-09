import { createClient } from "@/src/lib/supabase/server";

type TestResult =
  | { ok: true; count: number }
  | { ok: false; message: string };

async function runSupabaseTest(): Promise<TestResult> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("events").select("*").limit(5);

    if (error) {
      const parts = [error.message];
      if (error.details) parts.push(error.details);
      if (error.hint) parts.push(error.hint);
      return { ok: false, message: parts.join(" — ") };
    }

    return { ok: true, count: data?.length ?? 0 };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Errore sconosciuto durante il test.";
    return { ok: false, message };
  }
}

export default async function SupabaseTestPage() {
  const result = await runSupabaseTest();

  return (
    <main className="mx-auto max-w-lg p-8 font-sans">
      <h1 className="mb-4 text-xl font-semibold">Test connessione Supabase</h1>
      {result.ok ? (
        <>
          <p className="mb-2 text-green-700">Supabase collegato correttamente</p>
          <p className="text-zinc-600">Eventi restituiti: {result.count}</p>
        </>
      ) : (
        <p className="text-red-600">Errore: {result.message}</p>
      )}
    </main>
  );
}
