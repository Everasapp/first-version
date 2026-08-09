import Link from "next/link";
import Header from "@/src/components/home/Header";
import { categories } from "@/src/data/categories";

export default function CategoriesPage() {
  return (
    <>
      <Header />

      <main className="bg-white">
        {/* Hero */}

        <section className="border-b border-slate-200 bg-slate-50">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#075EAE]">
              EVERAS
            </p>

            <h1 className="mt-3 text-5xl font-black tracking-tight text-slate-900">
              Tutte le categorie
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Esplora gli eventi in Sardegna in base ai tuoi interessi.
            </p>
          </div>
        </section>

        {/* Grid */}

        <section className="py-16">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

              {categories.map((category) => {
                const Icon = category.icon;

                return (
                  <Link
                    key={category.id}
                    href={`/categorie/${category.slug}`}
                    className={`group rounded-3xl bg-gradient-to-br ${category.gradient} p-7 text-white transition duration-300 hover:-translate-y-2 hover:shadow-2xl`}
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
                      <Icon
                        className="h-9 w-9"
                        strokeWidth={1.8}
                      />
                    </div>

                    <h2 className="mt-8 text-2xl font-bold">
                      {category.name}
                    </h2>

                    <p className="mt-2 text-white/80">
                      Scopri tutti gli eventi
                    </p>

                    <span className="mt-6 inline-flex font-semibold">
                      Esplora →
                    </span>
                  </Link>
                );
              })}

            </div>
          </div>
        </section>
      </main>
    </>
  );
}