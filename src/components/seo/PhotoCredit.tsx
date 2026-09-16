import type { PhotoCredit as PhotoCreditData } from "@/src/lib/seo/cultura-towns";

type PhotoCreditProps = {
  credit: PhotoCreditData;
};

export default function PhotoCredit({ credit }: PhotoCreditProps) {
  const prefix = credit.creditPrefix ?? "Foto di";
  const sourceLabel = credit.sourceLabel ?? "Wikimedia Commons";

  return (
    <p className="mt-2 text-xs text-slate-500">
      {prefix} {credit.author} ·{" "}
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
        {sourceLabel}
      </a>
      {". Ridimensionata per il web."}
    </p>
  );
}
