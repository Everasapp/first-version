import EventSearchForm from "@/src/components/home/EventSearchForm";

export default function Hero() {
  return (
    <section
      className="relative isolate overflow-hidden bg-cover bg-no-repeat"
      style={{
        backgroundImage: "url('/images/concert.png')",
        backgroundPosition: "60% center",
        backgroundSize: "cover",
      }}
    >
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(90deg, rgba(4,40,84,.68) 0%, rgba(5,75,140,.35) 45%, rgba(0,0,0,.10) 100%)",
        }}
      />

      <div className="mx-auto flex min-h-[560px] max-w-7xl flex-col justify-center px-5 py-12 sm:min-h-[700px] sm:px-8 sm:py-20">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-200">
          Eventi in tutta la Sardegna
        </p>

        <h1 className="mt-3 max-w-4xl text-4xl font-black leading-[1.05] text-white sm:mt-4 sm:text-6xl lg:text-7xl">
          Scopri cosa fare in Sardegna
        </h1>

        <p className="mt-4 max-w-2xl text-base leading-7 text-blue-50 sm:mt-6 sm:text-xl sm:leading-8">
          Sagre, concerti, spettacoli, celebrazioni e attività vicino a te.
        </p>

        <EventSearchForm />
      </div>
    </section>
  );
}
