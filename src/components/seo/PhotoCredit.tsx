import type { PhotoCredit as PhotoCreditData } from "@/src/lib/seo/cultura-towns";

type PhotoCreditProps = {
  credit: PhotoCreditData;
};

export default function PhotoCredit({ credit }: PhotoCreditProps) {
  return (
    <p className="mt-2 text-xs text-slate-500">
      Foto di {credit.author} ·{" "}
      <a
        href={credit.licenseUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-[#075EAE] hover:underline"
      >
        {credit.license}
      </a>
      {" · "}
      <a
        href={credit.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-[#075EAE] hover:underline"
      >
        Wikimedia Commons
      </a>
      {". Ridimensionata per il web."}
    </p>
  );
}
