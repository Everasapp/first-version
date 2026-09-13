#!/usr/bin/env python3
"""Generate Culture town guides for all Centro Sardegna municipalities."""

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
OUT_TS = ROOT / "src" / "lib" / "seo" / "cultura-centro-towns.ts"
META_JSON = ROOT / ".tmp-cultura" / "centro-meta.json"
UA = {"User-Agent": "Everas/1.0 (https://www.everas.it; cultura sarda guides)"}

# All Centro Sardegna comuni from src/data/cities.ts
TOWNS = [
    ("Aritzo", "NU"),
    ("Atzara", "NU"),
    ("Austis", "NU"),
    ("Baunei", "NU"),
    ("Baressa", "OR"),
    ("Belvì", "NU"),
    ("Bitti", "NU"),
    ("Bosa", "OR"),
    ("Cabras", "OR"),
    ("Desulo", "NU"),
    ("Dorgali", "NU"),
    ("Fonni", "NU"),
    ("Gadoni", "NU"),
    ("Gavoi", "NU"),
    ("Girasole", "NU"),
    ("Lanusei", "NU"),
    ("Lodine", "NU"),
    ("Lollove", "NU"),
    ("Lula", "NU"),
    ("Macomer", "NU"),
    ("Mamoiada", "NU"),
    ("Meana Sardo", "NU"),
    ("Nuoro", "NU"),
    ("Oliena", "NU"),
    ("Ollolai", "NU"),
    ("Olzai", "NU"),
    ("Onanì", "NU"),
    ("Oniferi", "NU"),
    ("Orani", "NU"),
    ("Orgosolo", "NU"),
    ("Oristano", "OR"),
    ("Orosei", "NU"),
    ("Orotelli", "NU"),
    ("Ortueri", "NU"),
    ("Orune", "NU"),
    ("Ottana", "NU"),
    ("Ovodda", "NU"),
    ("Santa Maria Navarrese", "NU"),
    ("Sarule", "NU"),
    ("Scano di Montiferro", "OR"),
    ("Seneghe", "OR"),
    ("Siniscola", "NU"),
    ("Sorgono", "NU"),
    ("Tiana", "NU"),
    ("Tonara", "NU"),
    ("Tortolì", "NU"),
]

PROVINCE_LABEL = {"NU": "Nuoro", "OR": "Oristano"}

WIKI_TITLE = {
    "Bosa": "Bosa",
    "Cabras": "Cabras",
    "Nuoro": "Nuoro",
    "Oristano": "Oristano",
    "Orgosolo": "Orgosolo",
    "Mamoiada": "Mamoiada",
    "Oliena": "Oliena",
    "Dorgali": "Dorgali",
    "Baunei": "Baunei",
    "Fonni": "Fonni",
    "Macomer": "Macomer",
    "Siniscola": "Siniscola",
    "Orosei": "Orosei",
    "Tortolì": "Tortolì",
    "Lanusei": "Lanusei",
    "Sorgono": "Sorgono",
    "Tonara": "Tonara",
    "Desulo": "Desulo",
    "Gavoi": "Gavoi",
    "Orani": "Orani",
    "Ottana": "Ottana",
    "Bitti": "Bitti",
    "Aritzo": "Aritzo",
    "Belvì": "Belvì",
    "Atzara": "Atzara",
    "Austis": "Austis",
    "Baressa": "Baressa",
    "Girasole": "Girasole",
    "Lodine": "Lodine",
    "Lollove": "Lollove",
    "Lula": "Lula",
    "Meana Sardo": "Meana Sardo",
    "Ollolai": "Ollolai",
    "Olzai": "Olzai",
    "Onanì": "Onanì",
    "Oniferi": "Oniferi",
    "Orotelli": "Orotelli",
    "Ortueri": "Ortueri",
    "Orune": "Orune",
    "Ovodda": "Ovodda",
    "Santa Maria Navarrese": "Santa Maria Navarrese",
    "Sarule": "Sarule",
    "Scano di Montiferro": "Scano di Montiferro",
    "Seneghe": "Seneghe",
    "Tiana": "Tiana",
    "Gadoni": "Gadoni",
}

# Fix typo in dict above - "Atzara", should be "Atzara":
WIKI_TITLE = {k: v for k, v in WIKI_TITLE.items() if isinstance(k, str)}

SUBAREA = {
    "Aritzo": "Mandrolisai",
    "Atzara": "Mandrolisai",
    "Austis": "Barbagia di Belvì",
    "Baunei": "Ogliastra",
    "Baressa": "Alta Marmilla",
    "Belvì": "Barbagia di Belvì",
    "Bitti": "Barbagia",
    "Bosa": "Planargia",
    "Cabras": "Sinis",
    "Desulo": "Barbagia di Belvì",
    "Dorgali": "Baronia",
    "Fonni": "Barbagia",
    "Gadoni": "Barbagia di Belvì",
    "Gavoi": "Barbagia",
    "Girasole": "Ogliastra",
    "Lanusei": "Ogliastra",
    "Lodine": "Barbagia",
    "Lollove": "Nuorese",
    "Lula": "Barbagia",
    "Macomer": "Marghine",
    "Mamoiada": "Barbagia",
    "Meana Sardo": "Mandrolisai",
    "Nuoro": "Nuorese",
    "Oliena": "Barbagia",
    "Ollolai": "Barbagia",
    "Olzai": "Barbagia",
    "Onanì": "Barbagia",
    "Oniferi": "Barbagia",
    "Orani": "Barbagia",
    "Orgosolo": "Barbagia",
    "Oristano": "Oristanese",
    "Orosei": "Baronia",
    "Orotelli": "Barbagia",
    "Ortueri": "Mandrolisai",
    "Orune": "Barbagia",
    "Ottana": "Barbagia",
    "Ovodda": "Barbagia",
    "Santa Maria Navarrese": "Ogliastra",
    "Sarule": "Barbagia",
    "Scano di Montiferro": "Montiferru",
    "Seneghe": "Montiferru",
    "Siniscola": "Baronia",
    "Sorgono": "Mandrolisai",
    "Tiana": "Barbagia di Belvì",
    "Tonara": "Barbagia di Belvì",
    "Tortolì": "Ogliastra",
}

HOOKS = {
    "Nuoro": {
        "title": "Nuoro: museo MAN, Deledda e Barbagia",
        "hook": "capitale culturale della Barbagia",
        "visit": "Museo MAN, museo Deledda e centro storico",
        "tradition": "Autunno in Barbagia, letteratura e festa di San Francesco",
    },
    "Orgosolo": {
        "title": "Orgosolo: murales e Supramonte",
        "hook": "paese dei murales sul Supramonte",
        "visit": "Murales del centro e porte sul Supramonte",
        "tradition": "Canto a tenore e memoria pastorale",
    },
    "Mamoiada": {
        "title": "Mamoiada: mamuthones e issohadores",
        "hook": "casa dei mamuthones",
        "visit": "Museo delle Maschere e centro",
        "tradition": "Carnevale e Autunno in Barbagia",
    },
    "Oliena": {
        "title": "Oliena: Cannonau e Supramonte",
        "hook": "paese del Cannonau ai piedi del Corrasi",
        "visit": "Centro, cantine e porte sul Supramonte",
        "tradition": "Vino, festa e Barbagia di Ollolai",
    },
    "Bosa": {
        "title": "Bosa: castello, Temo e Planargia",
        "hook": "borgo sul Temo con castello Malaspina",
        "visit": "Castello, Sa Costa e lungofiume",
        "tradition": "Malvasia, Carnevale e Planargia",
    },
    "Oristano": {
        "title": "Oristano: Sartiglia e Sinis",
        "hook": "città della Sartiglia e porta sul Sinis",
        "visit": "Centro storico, Torre di Mariano e museo antiquarium",
        "tradition": "Sartiglia, san Giovanni e mare di Torre Grande",
    },
    "Cabras": {
        "title": "Cabras: Sinis, Tharros e bottarga",
        "hook": "capitale del Sinis e della bottarga",
        "visit": "Tharros, stagni e Museo Civico",
        "tradition": "Corsa degli Scalzi e festa della bottarga",
    },
    "Dorgali": {
        "title": "Dorgali: Grotta del Bue Marino e Golfo di Orosei",
        "hook": "paese tra montagna e Golfo di Orosei",
        "visit": "Cala Gonone, grotte e centro di Dorgali",
        "tradition": "Filigrana, Cannonau e mare della Baronia",
    },
    "Baunei": {
        "title": "Baunei: Golgo e Cala Goloritzé",
        "hook": "altopiano del Golgo e calette del golfo",
        "visit": "Golgo, San Pietro e le calette accessibili via mare",
        "tradition": "Pastorizia d’altura e Ogliastra",
    },
    "Orosei": {
        "title": "Orosei: Baronia e spiagge",
        "hook": "paese della Baronia sul Cedrino",
        "visit": "Centro storico e spiagge verso Osalla e Bidderosa",
        "tradition": "Festa di Nostra Signora del Rimedio",
    },
    "Siniscola": {
        "title": "Siniscola: Baronia e Capo Comino",
        "hook": "comune della Baronia verso Capo Comino",
        "visit": "La Caletta, Capo Comino e centro",
        "tradition": "Mare d’estate e paese dell’interno",
    },
    "Tortolì": {
        "title": "Tortolì: Ogliastra e Arbatax",
        "hook": "capoluogo dell’Ogliastra verso Arbatax",
        "visit": "Arbatax, rocce rosse e centro di Tortolì",
        "tradition": "Porto, festa e costa ogliastrina",
    },
    "Fonni": {
        "title": "Fonni: il paese più alto della Sardegna",
        "hook": "il comune più alto dell’isola",
        "visit": "Centro e porte verso Gennargentu e Bruncu Spina",
        "tradition": "Neve, pastorizia e feste di Barbagia",
    },
    "Sorgono": {
        "title": "Sorgono: Mandrolisai e Mandrolisai DOC",
        "hook": "cuore del Mandrolisai",
        "visit": "Centro e cantine del Mandrolisai",
        "tradition": "Vino, Autunno in Barbagia e Mandrolisai",
    },
    "Tonara": {
        "title": "Tonara: torrone e Barbagia di Belvì",
        "hook": "paese del torrone",
        "visit": "Laboratori del torrone e centro",
        "tradition": "Torrone, festa e Mandrolisai-Barbagia",
    },
    "Desulo": {
        "title": "Desulo: costumi e Gennargentu",
        "hook": "paese di montagna sul Gennargentu",
        "visit": "Centro e sentieri verso Bruncu Spina",
        "tradition": "Costumi tradizionali e Autunno in Barbagia",
    },
    "Gavoi": {
        "title": "Gavoi: Isola delle Storie e lago",
        "hook": "paese del festival Isola delle Storie",
        "visit": "Centro e lago di Gusana",
        "tradition": "Letteratura, formaggio e Barbagia",
    },
    "Macomer": {
        "title": "Macomer: Marghine e crocevia",
        "hook": "crocevia del Marghine",
        "visit": "Centro e territorio verso i nuraghi del Marghine",
        "tradition": "Fiera e paese di passaggio tra Nuoro e Oristano",
    },
    "Lanusei": {
        "title": "Lanusei: Ogliastra interna",
        "hook": "città vescovile dell’Ogliastra",
        "visit": "Centro storico e belvedere sull’Ogliastra",
        "tradition": "Diocesi, festa e montagna ogliastrina",
    },
    "Orani": {
        "title": "Orani: Nivola e Barbagia",
        "hook": "paese di Costantino Nivola",
        "visit": "Museo Nivola e centro",
        "tradition": "Arte contemporanea e Autunno in Barbagia",
    },
    "Ottana": {
        "title": "Ottana: boes e merdules",
        "hook": "paese delle maschere boes e merdules",
        "visit": "Centro e territorio della piana",
        "tradition": "Carnevale e festa in Barbagia",
    },
    "Aritzo": {
        "title": "Aritzo: castagne e Mandrolisai",
        "hook": "paese delle castagne",
        "visit": "Centro e sentieri del Mandrolisai",
        "tradition": "Sagra delle castagne e Autunno in Barbagia",
    },
    "Santa Maria Navarrese": {
        "title": "Santa Maria Navarrese: Ogliastra sul mare",
        "hook": "frazione marina di Baunei",
        "visit": "Spiaggia, olivastri e porto",
        "tradition": "Estate in costa ogliastrina",
    },
    "Scano di Montiferro": {
        "title": "Scano di Montiferro: Montiferru",
        "hook": "paese del Montiferru",
        "visit": "Centro e colline del Montiferru",
        "tradition": "Olio, bue rosso e festa",
    },
    "Seneghe": {
        "title": "Seneghe: olio e Montiferru",
        "hook": "paese dell’olio nel Montiferru",
        "visit": "Centro e frantoi",
        "tradition": "Olio extravergine e festa",
    },
    "Baressa": {
        "title": "Baressa: Alta Marmilla e sagra della mandorla",
        "hook": "paese dell’Alta Marmilla",
        "visit": "Centro e territorio della Marmilla",
        "tradition": "Sagra della mandorla e festa di paese",
    },
    "Lollove": {
        "title": "Lollove: borgo vicino a Nuoro",
        "hook": "piccolo borgo del nuorese",
        "visit": "Centro storico di Lollove",
        "tradition": "Borgo e Autunno in Barbagia",
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
    title = WIKI_TITLE.get(town, town)
    url = "https://it.wikipedia.org/api/rest_v1/page/summary/" + urllib.parse.quote(
        title.replace(" ", "_")
    )
    try:
        data = get_json(url)
        if data.get("type") == "disambiguation":
            return None
        return (data.get("extract") or "").strip()
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
        time.sleep(0.15)

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
        if "gianni" in low or town.replace(" ", "_") in name.replace(" ", "_"):
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
    """Italian article before a sub-area name (del / della / dell')."""
    first = area[0].lower()
    if first in "aeiouàèéìòù":
        return "dell'"
    feminine_starts = (
        "Barbagia",
        "Baronia",
        "Gallura",
        "Planargia",
        "Marmilla",
        "Ogliastra",
        "Alta ",
    )
    if any(area.startswith(p) for p in feminine_starts):
        return "della"
    return "del"


def area_title(area: str) -> str:
    """Capitalized determiner + area for section titles (La Barbagia intorno)."""
    art = area_article(area)
    if art == "dell'":
        return f"L'{area}"
    if art == "della":
        return f"La {area}"
    return f"Il {area}"


def build_article(town: str, province_code: str, extract: str | None, photo: dict, stem: str):
    slug = slugify(town)
    area = SUBAREA.get(town, "Centro Sardegna")
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
        f"{town} è un comune del Centro Sardegna, nella zona storica {area_of} {area}. "
        f"Come molti paesi dell’interno, tiene insieme memoria agro-pastorale, "
        f"chiese e un centro che si vive soprattutto nelle feste."
    )
    history2 = (
        f"Oggi {town} resta un punto della directory Cultura sarda del Centro: "
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
                f"Usa la guida dell’area Centro Sardegna per spostarti paese per paese."
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
                f"Se cerchi spiagge, nuraghi o santuari, verifica accessi e stagione. "
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
        "path": f"/cultura-sarda/centro-sardegna/{slug}",
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
        "publishedAt": "2026-09-13",
    }


def emit_ts(articles: list[dict]) -> str:
    lines = [
        'import type { CultureTownArticle } from "@/src/lib/seo/cultura-towns";',
        "",
        "/** Guide Cultura generate per i 46 comuni del Centro Sardegna. */",
        "export const CENTRO_CULTURE_TOWNS: CultureTownArticle[] = [",
    ]
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
    fallback_src = ROOT / "public" / "images" / "centro-sardegna.webp"
    articles = []
    meta = []

    for i, (town, province_code) in enumerate(TOWNS, 1):
        print(f"[{i}/{len(TOWNS)}] {town}", flush=True)
        stem = slugify(town) + "-panorama"
        dest = PUB / f"{stem}.webp"
        extract = wiki_extract(town)
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
                "sourceUrl": "https://www.everas.it/cultura-sarda/centro-sardegna",
                "commons": "fallback-centro",
            }

        article = build_article(town, province_code, extract, photo, stem)
        if photo.get("commons") == "fallback-centro":
            article["hero"]["alt"] = f"Paesaggio del Centro Sardegna (scheda {town})"
        articles.append(article)
        meta.append(
            {
                "town": town,
                "stem": stem,
                "commons": photo.get("commons"),
                "hasWiki": bool(extract),
            }
        )
        time.sleep(0.2)

    OUT_TS.write_text(emit_ts(articles), encoding="utf-8")
    META_JSON.write_text(json.dumps(meta, indent=2, ensure_ascii=False), encoding="utf-8")
    print("Wrote", OUT_TS, "articles", len(articles))


if __name__ == "__main__":
    main()
