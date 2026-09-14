#!/usr/bin/env python3
"""Generate Culture town guides for all Sud Sardegna municipalities."""

from __future__ import annotations

import json
import re
import time
import urllib.parse
import urllib.request
from io import BytesIO
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
PUB = ROOT / "public" / "images" / "cultura"
OUT_TS = ROOT / "src" / "lib" / "seo" / "cultura-sud-towns.ts"
META_JSON = ROOT / ".tmp-cultura" / "sud-meta.json"
UA = {"User-Agent": "Everas/1.0 (https://www.everas.it; cultura sarda guides)"}

# All Sud Sardegna comuni from src/data/cities.ts
TOWNS = [
    ("Armungia", "CA"),
    ("Assemini", "CA"),
    ("Ballao", "CA"),
    ("Barrali", "CA"),
    ("Burcei", "CA"),
    ("Cagliari", "CA"),
    ("Capoterra", "CA"),
    ("Castiadas", "CA"),
    ("Decimomannu", "CA"),
    ("Decimoputzu", "CA"),
    ("Dolianova", "CA"),
    ("Domus de Maria", "CA"),
    ("Donori", "CA"),
    ("Elmas", "CA"),
    ("Escalaplano", "CA"),
    ("Escolca", "CA"),
    ("Esterzili", "CA"),
    ("Genoni", "CA"),
    ("Gergei", "CA"),
    ("Gesico", "CA"),
    ("Goni", "CA"),
    ("Guamaggiore", "CA"),
    ("Guasila", "CA"),
    ("Guspini", "SU"),
    ("Isili", "CA"),
    ("Mandas", "CA"),
    ("Maracalagonis", "CA"),
    ("Monastir", "CA"),
    ("Monserrato", "CA"),
    ("Mogoro", "SU"),
    ("Muravera", "CA"),
    ("Nuragus", "CA"),
    ("Nurallao", "CA"),
    ("Nuraminis", "CA"),
    ("Nurri", "CA"),
    ("Orroli", "CA"),
    ("Ortacesus", "CA"),
    ("Pimentel", "CA"),
    ("Pula", "CA"),
    ("Quartu Sant'Elena", "CA"),
    ("Quartucciu", "CA"),
    ("Sadali", "CA"),
    ("Samatzai", "CA"),
    ("Samugheo", "SU"),
    ("San Basilio", "CA"),
    ("San Nicolò Gerrei", "CA"),
    ("San Sperate", "CA"),
    ("San Vito", "CA"),
    ("Sant'Andrea Frius", "CA"),
    ("Sarroch", "CA"),
    ("Selargius", "CA"),
    ("Selegas", "CA"),
    ("Senorbì", "CA"),
    ("Serdiana", "CA"),
    ("Serri", "CA"),
    ("Sestu", "CA"),
    ("Seulo", "CA"),
    ("Settimo San Pietro", "CA"),
    ("Siliqua", "CA"),
    ("Silius", "CA"),
    ("Sinnai", "CA"),
    ("Siurgus Donigala", "CA"),
    ("Soleminis", "CA"),
    ("Suelli", "CA"),
    ("Ussana", "CA"),
    ("Uta", "CA"),
    ("Vallermosa", "CA"),
    ("Villa San Pietro", "CA"),
    ("Villanova Tulo", "CA"),
    ("Barumini", "SU"),
    ("Villacidro", "SU"),
    ("Villanovaforru", "SU"),
    ("Villaputzu", "CA"),
    ("Villasalto", "CA"),
    ("Villasimius", "CA"),
    ("Villasor", "CA"),
    ("Villaspeciosa", "CA"),
    ("Carbonia", "SU"),
    ("Carloforte", "SU"),
    ("Gonnesa", "SU"),
    ("Iglesias", "SU"),
    ("Narcao", "SU"),
    ("Portoscuso", "SU"),
    ("Sant'Antioco", "SU"),
]

PROVINCE_LABEL = {"CA": "Cagliari", "SU": "Sud Sardegna"}

SUBAREA = {
    "Armungia": "Gerrei",
    "Assemini": "Campidano di Cagliari",
    "Ballao": "Gerrei",
    "Barrali": "Trexenta",
    "Burcei": "Sarrabus",
    "Cagliari": "Cagliari",
    "Capoterra": "Campidano di Cagliari",
    "Castiadas": "Sarrabus",
    "Decimomannu": "Campidano di Cagliari",
    "Decimoputzu": "Campidano di Cagliari",
    "Dolianova": "Parteolla",
    "Domus de Maria": "Sulcis",
    "Donori": "Parteolla",
    "Elmas": "Campidano di Cagliari",
    "Escalaplano": "Sarcidano",
    "Escolca": "Sarcidano",
    "Esterzili": "Sarcidano",
    "Genoni": "Sarcidano",
    "Gergei": "Sarcidano",
    "Gesico": "Trexenta",
    "Goni": "Gerrei",
    "Guamaggiore": "Trexenta",
    "Guasila": "Trexenta",
    "Guspini": "Medio Campidano",
    "Isili": "Sarcidano",
    "Mandas": "Trexenta",
    "Maracalagonis": "Campidano di Cagliari",
    "Monastir": "Campidano di Cagliari",
    "Monserrato": "Campidano di Cagliari",
    "Mogoro": "Marmilla",
    "Muravera": "Sarrabus",
    "Nuragus": "Sarcidano",
    "Nurallao": "Sarcidano",
    "Nuraminis": "Campidano di Cagliari",
    "Nurri": "Sarcidano",
    "Orroli": "Sarcidano",
    "Ortacesus": "Trexenta",
    "Pimentel": "Trexenta",
    "Pula": "Sulcis",
    "Quartu Sant'Elena": "Campidano di Cagliari",
    "Quartucciu": "Campidano di Cagliari",
    "Sadali": "Sarcidano",
    "Samatzai": "Trexenta",
    "Samugheo": "Barigadu",
    "San Basilio": "Trexenta",
    "San Nicolò Gerrei": "Gerrei",
    "San Sperate": "Campidano di Cagliari",
    "San Vito": "Sarrabus",
    "Sant'Andrea Frius": "Trexenta",
    "Sarroch": "Campidano di Cagliari",
    "Selargius": "Campidano di Cagliari",
    "Selegas": "Trexenta",
    "Senorbì": "Trexenta",
    "Serdiana": "Parteolla",
    "Serri": "Sarcidano",
    "Sestu": "Campidano di Cagliari",
    "Seulo": "Barbagia di Seulo",
    "Settimo San Pietro": "Campidano di Cagliari",
    "Siliqua": "Campidano di Cagliari",
    "Silius": "Gerrei",
    "Sinnai": "Campidano di Cagliari",
    "Siurgus Donigala": "Trexenta",
    "Soleminis": "Parteolla",
    "Suelli": "Trexenta",
    "Ussana": "Trexenta",
    "Uta": "Campidano di Cagliari",
    "Vallermosa": "Campidano di Cagliari",
    "Villa San Pietro": "Campidano di Cagliari",
    "Villanova Tulo": "Sarcidano",
    "Barumini": "Marmilla",
    "Villacidro": "Medio Campidano",
    "Villanovaforru": "Marmilla",
    "Villaputzu": "Sarrabus",
    "Villasalto": "Gerrei",
    "Villasimius": "Sarrabus",
    "Villasor": "Campidano di Cagliari",
    "Villaspeciosa": "Campidano di Cagliari",
    "Carbonia": "Sulcis",
    "Carloforte": "Sulcis",
    "Gonnesa": "Sulcis",
    "Iglesias": "Sulcis",
    "Narcao": "Sulcis",
    "Portoscuso": "Sulcis",
    "Sant'Antioco": "Sulcis",
}

HOOKS = {
    "Cagliari": {
        "title": "Cagliari: Castello, musei e golfo",
        "hook": "capoluogo dell’isola sul golfo degli Angeli",
        "visit": "Castello, Marina, Poetto e musei cittadini",
        "tradition": "Sant’Efisio, mare e vita di città",
    },
    "Quartu Sant'Elena": {
        "title": "Quartu Sant'Elena: Poetto e città metropolitana",
        "hook": "città sul Poetto a nord di Cagliari",
        "visit": "Poetto, centro e spiaggia",
        "tradition": "Festa di Sant’Elena e estate sul golfo",
    },
    "Pula": {
        "title": "Pula: Nora e costa sud",
        "hook": "porta su Nora e le spiagge del sud",
        "visit": "Area archeologica di Nora e costa",
        "tradition": "Archeologia, mare e festa di paese",
    },
    "Villasimius": {
        "title": "Villasimius: Capo Carbonara e mare",
        "hook": "porta sull’area marina di Capo Carbonara",
        "visit": "Spiagge, porto e centro di Villasimius",
        "tradition": "Estate, diving e costa del Sarrabus",
    },
    "Domus de Maria": {
        "title": "Domus de Maria: Chia e dune",
        "hook": "comune delle spiagge di Chia",
        "visit": "Chia, torre e costa",
        "tradition": "Mare d’estate e paese dell’interno",
    },
    "Carbonia": {
        "title": "Carbonia: Sulcis e città mineraria",
        "hook": "città del Sulcis nata dalle miniere",
        "visit": "Centro razionalista e museo del carbone",
        "tradition": "Memoria mineraria e Sulcis",
    },
    "Iglesias": {
        "title": "Iglesias: miniere e centro storico",
        "hook": "città mineraria del Sulcis-Iglesiente",
        "visit": "Centro storico e territorio minerario",
        "tradition": "Miniere, festa e Iglesiente",
    },
    "Carloforte": {
        "title": "Carloforte: Isola di San Pietro",
        "hook": "paese tabarchino sull’isola di San Pietro",
        "visit": "Centro, porto e costa di San Pietro",
        "tradition": "Tonno, dialetto tabarchino e festa",
    },
    "Sant'Antioco": {
        "title": "Sant'Antioco: isola e storia",
        "hook": "isola collegata alla terraferma del Sulcis",
        "visit": "Centro storico, tophet e costa",
        "tradition": "Festa di Sant’Antioco e mare del Sulcis",
    },
    "Barumini": {
        "title": "Barumini: Su Nuraxi UNESCO",
        "hook": "casa del nuraghe Su Nuraxi, Patrimonio UNESCO",
        "visit": "Su Nuraxi e centro di Barumini",
        "tradition": "Archeologia nuragica e Marmilla",
    },
    "Muravera": {
        "title": "Muravera: Sarrabus e agrumi",
        "hook": "paese del Sarrabus e degli agrumi",
        "visit": "Centro e costa verso Costa Rei",
        "tradition": "Sagra degli agrumi e Sarrabus",
    },
    "Villacidro": {
        "title": "Villacidro: Medio Campidano",
        "hook": "centro del Medio Campidano",
        "visit": "Centro e territorio verso i monti",
        "tradition": "Festa e paese di collina",
    },
    "Guspini": {
        "title": "Guspini: Medio Campidano e Montevecchio",
        "hook": "paese verso le miniere di Montevecchio",
        "visit": "Centro e territorio minerario",
        "tradition": "Memoria mineraria e Campidano",
    },
    "Selargius": {
        "title": "Selargius: matrimonio selargino",
        "hook": "paese del matrimonio selargino",
        "visit": "Centro storico e chiesa",
        "tradition": "Matrimonio tradizionale e festa",
    },
    "Assemini": {
        "title": "Assemini: ceramica e Campidano",
        "hook": "paese della ceramica nel Campidano",
        "visit": "Centro e laboratori di ceramica",
        "tradition": "Ceramica, festa e Campidano",
    },
    "Capoterra": {
        "title": "Capoterra: laguna e costa ovest",
        "hook": "comune tra laguna e costa a ovest di Cagliari",
        "visit": "Centro, spiaggia e laguna",
        "tradition": "Mare, festa e Campidano",
    },
    "Sinnai": {
        "title": "Sinnai: colline a est di Cagliari",
        "hook": "paese sulle colline a est della città",
        "visit": "Centro e territorio verso i monti",
        "tradition": "Festa e Campidano orientale",
    },
    "San Sperate": {
        "title": "San Sperate: paese museo",
        "hook": "paese museo dei murales",
        "visit": "Murales e centro di San Sperate",
        "tradition": "Arte di strada e festa",
    },
}


def slugify(value: str) -> str:
    import unicodedata

    value = unicodedata.normalize("NFD", value)
    value = "".join(ch for ch in value if unicodedata.category(ch) != "Mn")
    value = value.lower().strip()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return value.strip("-")


def get_json(url: str):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=45) as resp:
        return json.load(resp)


def wiki_extract(town: str):
    title = town
    url = "https://it.wikipedia.org/api/rest_v1/page/summary/" + urllib.parse.quote(
        title.replace(" ", "_")
    )
    try:
        data = get_json(url)
        if data.get("type") == "disambiguation":
            # try with (Italia) or Sardegna
            for suffix in ["_(Italia)", "_(Sardegna)"]:
                try:
                    data = get_json(
                        "https://it.wikipedia.org/api/rest_v1/page/summary/"
                        + urllib.parse.quote(title.replace(" ", "_") + suffix)
                    )
                    if data.get("type") != "disambiguation":
                        break
                except Exception:
                    continue
        return (data.get("extract") or "").strip() or None
    except Exception:
        return None


def commons_search(query: str, limit=8):
    url = "https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode(
        {
            "action": "query",
            "list": "search",
            "srsearch": query,
            "srnamespace": 6,
            "srlimit": limit,
            "format": "json",
        }
    )
    data = get_json(url)
    return [x["title"][5:] for x in data["query"]["search"]]


def commons_info(filename: str):
    url = "https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode(
        {
            "action": "query",
            "titles": "File:" + filename,
            "prop": "imageinfo",
            "iiprop": "url|extmetadata|size",
            "iiurlwidth": 2000,
            "format": "json",
        }
    )
    data = get_json(url)
    page = next(iter(data["query"]["pages"].values()))
    info = (page.get("imageinfo") or [None])[0]
    return info


def pick_photo(town: str):
    queries = [
        f"{town} - Panorama",
        f"{town} panorama Sardegna",
        f"{town} Gianni Careddu",
        f"{town} Sardegna",
    ]
    seen = []
    for q in queries:
        try:
            for name in commons_search(q):
                if name not in seen:
                    seen.append(name)
        except Exception:
            continue
        time.sleep(0.12)

    ranked = []
    for name in seen:
        low = name.lower()
        if any(x in low for x in [".svg", "map of", "locator", "stemma", "collage", "dot.png"]):
            continue
        score = 0
        if "panorama" in low:
            score += 5
        if town.lower().split()[0].lower() in low:
            score += 2
        if "gianni" in low:
            score += 1
        ranked.append((score, name))
    ranked.sort(reverse=True)

    for _, name in ranked[:12]:
        info = commons_info(name)
        if not info:
            continue
        meta = info.get("extmetadata") or {}
        license_name = (meta.get("LicenseShortName") or {}).get("value", "")
        if not any(x in license_name for x in ["CC BY", "CC0", "Public domain", "PD"]):
            continue
        w = info.get("width") or 0
        h = info.get("height") or 0
        if w < 800 or h < 400:
            continue
        artist = re.sub("<[^>]+>", "", (meta.get("Artist") or {}).get("value", "")).strip()
        artist = re.sub(r"\s+", " ", artist).strip()
        if len(artist) > 120:
            artist = artist[:117].rsplit(" ", 1)[0] + "…"
        licurl = (meta.get("LicenseUrl") or {}).get("value", "").strip()
        if "by-sa/4.0" in licurl:
            licurl = "https://creativecommons.org/licenses/by-sa/4.0/deed.it"
        elif "by-sa/3.0" in licurl:
            licurl = "https://creativecommons.org/licenses/by-sa/3.0/deed.it"
        elif "by/4.0" in licurl:
            licurl = "https://creativecommons.org/licenses/by/4.0/deed.it"
        elif "by/3.0" in licurl:
            licurl = "https://creativecommons.org/licenses/by/3.0/deed.it"
        dl = (info.get("thumburl") or info.get("url") or "").split("?")[0]
        return {
            "commons": name,
            "artist": artist or "Wikimedia Commons",
            "license": license_name.strip(),
            "licenseUrl": licurl
            or "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
            "sourceUrl": "https://commons.wikimedia.org/wiki/File:"
            + name.replace(" ", "_"),
            "download": dl,
        }
    return None


def download_webp(url: str, dest: Path):
    req = urllib.request.Request(url, headers=UA)
    raw = urllib.request.urlopen(req, timeout=90).read()
    img = Image.open(BytesIO(raw)).convert("RGB")
    w, h = img.size
    if w > 1600:
        img = img.resize((1600, int(h * 1600 / w)), Image.Resampling.LANCZOS)
    dest.parent.mkdir(parents=True, exist_ok=True)
    img.save(dest, "WEBP", quality=82, method=6)


def ts_escape(s: str) -> str:
    return (
        s.replace("\\", "\\\\")
        .replace("`", "\\`")
        .replace("${", "\\${")
        .replace("\n", " ")
        .replace("\r", " ")
        .replace('"', '\\"')
    )


def area_article(area: str) -> str:
    first = area[0].lower()
    if first in "aeiouàèéìòù":
        return "dell'"
    feminine_starts = (
        "Barbagia",
        "Marmilla",
        "Ogliastra",
        "Alta ",
    )
    if any(area.startswith(p) for p in feminine_starts):
        return "della"
    return "del"


def area_title(area: str) -> str:
    art = area_article(area)
    if art == "dell'":
        return f"L'{area}"
    if art == "della":
        return f"La {area}"
    return f"Il {area}"


def build_article(town: str, province_code: str, extract: str | None, photo: dict, stem: str):
    slug = slugify(town)
    area = SUBAREA.get(town, "Sud Sardegna")
    area_of = area_article(area)
    area_heading = area_title(area)
    province = PROVINCE_LABEL[province_code]
    hook = HOOKS.get(town, {})
    title = hook.get("title") or f"{town}: storia, tradizioni e cosa visitare"
    prep = "ad" if town[0].lower() in "aeiouàèéìòù" else "a"
    extract_clean = re.sub(r"\s+", " ", extract or "").strip()
    if len(extract_clean) > 420:
        extract_clean = extract_clean[:417].rsplit(" ", 1)[0] + "."

    hook_phrase = hook.get("hook") or f"comune {area_of} {area}"
    visit_hook = hook.get("visit") or f"il centro di {town} e il territorio comunale"
    tradition_hook = hook.get("tradition") or f"feste patronali e vita di paese nel {area}"

    intro = (
        f"{town} è {hook_phrase} in provincia di {province}. "
        f"Questa scheda raccoglie storia, tradizioni e cosa visitare, "
        f"e sotto trovi gli eventi in programma {prep} {town} su EVERAS."
    )

    history1 = extract_clean or (
        f"{town} è un comune del Sud Sardegna, nella zona storica {area_of} {area}. "
        f"Come molti paesi del sud dell’isola, tiene insieme memoria agricola, "
        f"chiese e un centro che si vive soprattutto nelle feste."
    )
    history2 = (
        f"Oggi {town} resta un punto della directory Cultura sarda del Sud: "
        f"da qui colleghi musei, sagre e il calendario eventi del comune. "
        f"Se organizzi o cerchi un appuntamento {prep} {town}, la scheda evento su EVERAS "
        f"rimanda a questa guida."
    )

    traditions = [
        {
            "title": "Feste e identità locale",
            "body": (
                f"{tradition_hook}. Le date precise cambiano ogni anno: "
                f"controlla il calendario eventi {prep} {town} su EVERAS per sagre, "
                f"concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori."
            ),
        },
        {
            "title": f"{area_heading} intorno",
            "body": (
                f"{town} si legge meglio insieme ai comuni vicini {area_of} {area}: "
                f"stesse strade, spesso stesse famiglie di feste e stessi paesaggi. "
                f"Usa la guida dell’area Sud Sardegna per spostarti paese per paese."
            ),
        },
    ]

    visit = [
        {
            "name": f"Centro di {town}",
            "body": (
                f"Parti dal centro: chiese, piazza e servizi. "
                f"In paesi piccoli gli orari di musei e uffici turistici cambiano: "
                f"conferma sul sito del Comune prima di partire."
            ),
        },
        {
            "name": "Cosa vedere nel territorio",
            "body": (
                f"Nel territorio comunale conta soprattutto: {visit_hook}. "
                f"Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. "
                f"Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina."
            ),
        },
    ]

    faqs = [
        {
            "question": f"Cosa visitare {prep} {town}?",
            "answer": (
                f"{visit_hook}. Poi apri il calendario eventi per sapere cosa c’è in programma."
            ),
        },
        {
            "question": f"Dove trovo gli eventi {prep} {town}?",
            "answer": (
                f"In fondo a questa guida e sulla pagina Eventi {prep} {town} su EVERAS, "
                f"con data, luogo e locandina quando disponibili."
            ),
        },
    ]

    description = (
        f"{town} in Sardegna: guida al comune {area_of} {area}, cosa visitare "
        f"e eventi in programma su EVERAS."
    )

    return {
        "slug": slug,
        "path": f"/cultura-sarda/sud-sardegna/{slug}",
        "town": town,
        "province": province,
        "area": area,
        "title": title,
        "h1": town,
        "description": description,
        "hero": {
            "src": f"/images/cultura/{stem}.webp",
            "alt": f"Veduta di {town} in Sardegna",
            "credit": {
                "author": photo["artist"],
                "license": photo["license"],
                "licenseUrl": photo["licenseUrl"],
                "sourceUrl": photo["sourceUrl"],
            },
        },
        "intro": intro,
        "history": [history1, history2],
        "traditions": traditions,
        "visit": visit,
        "faqs": faqs,
        "publishedAt": "2026-09-14",
    }


FEATURED_SLUGS = [
    "cagliari",
    "quartu-sant-elena",
    "pula",
    "villasimius",
    "domus-de-maria",
    "carbonia",
    "iglesias",
    "carloforte",
    "sant-antioco",
    "barumini",
    "muravera",
    "decimomannu",
    "guspini",
    "selargius",
    "assemini",
    "capoterra",
    "sinnai",
    "san-sperate",
]


def emit_ts(articles: list[dict]) -> str:
    lines = [
        'import type { CultureTownArticle } from "@/src/lib/seo/cultura-towns";',
        "",
        "/**",
        ' * 18 guide “in evidenza” sul Sud (stesso ruolo delle schede editoriali del Nord).',
        " * Ordine curato: Cagliari, costa, Sulcis, UNESCO e centri più cercati.",
        " */",
        "export const SUD_FEATURED_CULTURE_SLUGS = [",
    ]
    for slug in FEATURED_SLUGS:
        lines.append(f'  "{slug}",')
    lines.extend(
        [
            "] as const;",
            "",
            "export const SUD_FEATURED_SLUG_SET = new Set<string>(",
            "  SUD_FEATURED_CULTURE_SLUGS,",
            ");",
            "",
            f"/** Guide Cultura generate per i {len(articles)} comuni del Sud Sardegna. */",
            "export const SUD_CULTURE_TOWNS: CultureTownArticle[] = [",
        ]
    )
    for a in articles:
        credit = a["hero"]["credit"]
        lines.append("  {")
        lines.append(f'    slug: "{a["slug"]}",')
        lines.append(f'    path: "{a["path"]}",')
        lines.append(f'    town: "{a["town"]}",')
        lines.append(f'    province: "{a["province"]}",')
        lines.append(f'    area: "{a["area"]}",')
        lines.append(f'    title: "{ts_escape(a["title"])}",')
        lines.append(f'    h1: "{a["h1"]}",')
        lines.append(f'    description: "{ts_escape(a["description"])}",')
        lines.append("    hero: {")
        lines.append(f'      src: "{a["hero"]["src"]}",')
        lines.append(f'      alt: "{ts_escape(a["hero"]["alt"])}",')
        lines.append("      credit: {")
        lines.append(f'        author: "{ts_escape(credit["author"])}",')
        lines.append(f'        license: "{ts_escape(credit["license"])}",')
        lines.append(f'        licenseUrl: "{credit["licenseUrl"]}",')
        lines.append(f'        sourceUrl: "{credit["sourceUrl"]}",')
        lines.append("      },")
        lines.append("    },")
        lines.append(f'    intro: `{ts_escape(a["intro"])}`,')
        lines.append("    history: [")
        for h in a["history"]:
            lines.append(f"      `{ts_escape(h)}`,")
        lines.append("    ],")
        lines.append("    traditions: [")
        for t in a["traditions"]:
            lines.append("      {")
            lines.append(f'        title: "{ts_escape(t["title"])}",')
            lines.append(f"        body: `{ts_escape(t['body'])}`,")
            lines.append("      },")
        lines.append("    ],")
        lines.append("    visit: [")
        for v in a["visit"]:
            lines.append("      {")
            lines.append(f'        name: "{ts_escape(v["name"])}",')
            lines.append(f"        body: `{ts_escape(v['body'])}`,")
            lines.append("      },")
        lines.append("    ],")
        lines.append("    faqs: [")
        for f in a["faqs"]:
            lines.append("      {")
            lines.append(f'        question: "{ts_escape(f["question"])}",')
            lines.append(f'        answer: "{ts_escape(f["answer"])}",')
            lines.append("      },")
        lines.append("    ],")
        lines.append(f'    publishedAt: "{a["publishedAt"]}",')
        lines.append("  },")
    lines.append("];")
    lines.append("")
    return "\n".join(lines)


def main():
    PUB.mkdir(parents=True, exist_ok=True)
    META_JSON.parent.mkdir(parents=True, exist_ok=True)
    fallback_src = ROOT / "public" / "images" / "sud-sardegna.webp"
    articles = []
    meta = []

    for i, (town, province_code) in enumerate(TOWNS, 1):
        print(f"[{i}/{len(TOWNS)}] {town}", flush=True)
        stem = slugify(town) + "-panorama"
        dest = PUB / f"{stem}.webp"
        extract = wiki_extract(town)
        photo = None
        if dest.exists() and dest.stat().st_size > 5000:
            photo = {
                "artist": "Wikimedia Commons / EVERAS",
                "license": "CC BY-SA 4.0",
                "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
                "sourceUrl": "https://www.everas.it/cultura-sarda/sud-sardegna",
                "commons": "reuse-local",
            }
        else:
            photo = pick_photo(town)
            if photo:
                try:
                    download_webp(photo["download"], dest)
                except Exception as e:
                    print("  photo download failed:", e)
                    photo = None
            if not photo:
                if fallback_src.exists():
                    img = Image.open(fallback_src).convert("RGB")
                    img.save(dest, "WEBP", quality=82, method=6)
                photo = {
                    "artist": "EVERAS",
                    "license": "All rights reserved",
                    "licenseUrl": "https://www.everas.it",
                    "sourceUrl": "https://www.everas.it/cultura-sarda/sud-sardegna",
                    "commons": "fallback-sud",
                }

        article = build_article(town, province_code, extract, photo, stem)
        if photo.get("commons") == "fallback-sud":
            article["hero"]["alt"] = f"Paesaggio del Sud Sardegna (scheda {town})"
        articles.append(article)
        meta.append(
            {
                "town": town,
                "stem": stem,
                "commons": photo.get("commons"),
                "hasWiki": bool(extract),
            }
        )
        time.sleep(0.15)

    OUT_TS.write_text(emit_ts(articles), encoding="utf-8")
    META_JSON.write_text(json.dumps(meta, indent=2, ensure_ascii=False), encoding="utf-8")
    print("Wrote", OUT_TS, "articles", len(articles))


if __name__ == "__main__":
    main()
