import Link from "next/link";
import { categories } from "@/src/data/categories";

export default function CategoriesSection() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#075EAE]">
            Esplora
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
            Esplora per categoria
          </h2>

          <p className="mt-3 text-slate-600">
            Trova facilmente l&apos;evento più adatto ai tuoi interessi.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                key={category.id}
                href={`/eventi/${category.slug}`}
                className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${category.gradient} p-6 text-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl`}
              >
                <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10 transition duration-500 group-hover:scale-125" />

                <div className="relative flex min-h-[132px] flex-col justify-between sm:min-h-[170px]">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm sm:h-14 sm:w-14">
                    <Icon
                      aria-hidden="true"
                      className="h-7 w-7 text-white sm:h-8 sm:w-8"
                      strokeWidth={1.8}
                    />
                  </div>

                  <div className="mt-5 sm:mt-8">
                    <h3 className="text-base font-bold leading-snug sm:text-lg">
                      {category.name}
                    </h3>

                    <p className="mt-2 hidden text-sm text-white/80 sm:block">
                      Scopri gli eventi
                    </p>

                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold transition-transform duration-300 group-hover:translate-x-1 sm:mt-4">
                      Esplora →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/categorie"
            className="inline-flex rounded-xl border border-[#075EAE] px-6 py-3 text-sm font-bold text-[#075EAE] transition hover:bg-[#075EAE] hover:text-white"
          >
            Vedi tutte le categorie
          </Link>
        </div>
      </div>
    </section>
  );
}
