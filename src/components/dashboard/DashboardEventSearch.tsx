import Link from "next/link";
import { Search, X } from "lucide-react";

import { buildDashboardHref, type DashboardFilter } from "@/src/lib/dashboardEvents";

type DashboardEventSearchProps = {
  activeFilter: DashboardFilter;
  query: string;
  date: string;
};

export default function DashboardEventSearch({
  activeFilter,
  query,
  date,
}: DashboardEventSearchProps) {
  const hasActiveSearch = Boolean(query || date);
  const clearHref = buildDashboardHref({ filtro: activeFilter });

  return (
    <form
      method="get"
      action="/dashboard"
      className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <input type="hidden" name="filtro" value={activeFilter} />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        <label className="block min-w-0 flex-1">
          <span className="text-sm font-bold text-slate-900">Cerca</span>
          <input
            type="search"
            name="cerca"
            defaultValue={query}
            placeholder="Titolo, città o luogo…"
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#075EAE] focus:ring-4 focus:ring-blue-100"
          />
        </label>

        <label className="block w-full lg:w-52">
          <span className="text-sm font-bold text-slate-900">Data</span>
          <input
            type="date"
            name="data"
            defaultValue={date}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#075EAE] focus:ring-4 focus:ring-blue-100"
          />
        </label>

        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            className="inline-flex h-[50px] items-center justify-center gap-2 rounded-2xl bg-[#075EAE] px-5 text-sm font-bold text-white transition hover:bg-[#064E91]"
          >
            <Search aria-hidden="true" className="h-4 w-4" />
            Cerca
          </button>

          {hasActiveSearch ? (
            <Link
              href={clearHref}
              className="inline-flex h-[50px] items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 text-sm font-bold text-slate-700 transition hover:border-[#075EAE] hover:text-[#075EAE]"
            >
              <X aria-hidden="true" className="h-4 w-4" />
              Azzera
            </Link>
          ) : null}
        </div>
      </div>
    </form>
  );
}
