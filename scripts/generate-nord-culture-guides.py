#!/usr/bin/env python3
"""Generate Culture town guides for remaining Nord Sardegna municipalities."""

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
OUT_TS = ROOT / "src" / "lib" / "seo" / "cultura-nord-remaining.ts"
META_JSON = ROOT / ".tmp-cultura" / "nord-remaining-meta.json"
UA = {"User-Agent": "Everas/1.0 (https://www.everas.it; cultura sarda guides)"}

MISSING = [
    "Aglientu",
    "Alà dei Sardi",
    "Anela",
    "Ardara",
    "Badesi",
    "Banari",
    "Benetutti",
    "Berchidda",
    "Bessude",
    "Bonnanaro",
    "Bono",
    "Bonorva",
    "Bortigiadas",
    "Borutta",
    "Bottidda",
    "Buddusò",
    "Budoni",
    "Bultei",
    "Bulzi",
    "Burgos",
    "Cargeghe",
    "Cheremule",
    "Chiaramonti",
    "Codrongianos",
    "Cossoine",
    "Erula",
    "Esporlatu",
    "Florinas",
    "Giave",
    "Golfo Aranci",
    "Illorai",
    "Isola dell'Asinara",
    "Ittireddu",
    "Laerru",
    "Loiri Porto San Paolo",
    "Luogosanto",
    "Luras",
    "Mara",
    "Martis",
    "Monteleone Rocca Doria",
    "Monti",
    "Mores",
    "Muros",
    "Nughedu San Nicolò",
    "Nule",
    "Nulvi",
    "Olmedo",
    "Oschiri",
    "Osilo",
    "Ossi",
    "Padria",
    "Padru",
    "Perfugas",
    "Ploaghe",
    "Pozzomaggiore",
    "Putifigari",
    "Romana",
    "San Teodoro",
    "Sant'Antonio di Gallura",
    "Santa Maria Coghinas",
    "Sedini",
    "Semestene",
    "Sennori",
    "Siligo",
    "Telti",
    "Tergu",
    "Thiesi",
    "Tissi",
    "Torralba",
    "Trinità d'Agultu e Vignola",
    "Tula",
    "Uri",
    "Usini",
    "Viddalba",
    "Villanova Monteleone",
]

# Wikipedia title overrides for disambiguation
WIKI_TITLE = {
    "San Teodoro": "San Teodoro (Italia)",
    "Isola dell'Asinara": "Asinara",
    "Monti": "Monti (Italia)",
    "Mara": "Mara (Italia)",
    "Uri": "Uri (Italia)",
    "Burgos": "Burgos (Italia)",
    "Romana": "Romana (Italia)",
    "Erula": "Erula",
    "Telti": "Telti",
}

# Historical/cultural micro-area labels (for article.area)
SUBAREA = {
    "Aglientu": "Gallura",
    "Alà dei Sardi": "Monteacuto",
    "Anela": "Goceano",
    "Ardara": "Logudoro",
    "Badesi": "Gallura",
    "Banari": "Meilogu",
    "Benetutti": "Goceano",
    "Berchidda": "Monteacuto",
    "Bessude": "Meilogu",
    "Bonnanaro": "Meilogu",
    "Bono": "Goceano",
    "Bonorva": "Meilogu",
    "Bortigiadas": "Gallura",
    "Borutta": "Meilogu",
    "Bottidda": "Goceano",
    "Buddusò": "Monteacuto",
    "Budoni": "Gallura",
    "Bultei": "Goceano",
    "Bulzi": "Anglona",
    "Burgos": "Goceano",
    "Cargeghe": "Logudoro",
    "Cheremule": "Meilogu",
    "Chiaramonti": "Anglona",
    "Codrongianos": "Logudoro",
    "Cossoine": "Meilogu",
    "Erula": "Anglona",
    "Esporlatu": "Goceano",
    "Florinas": "Logudoro",
    "Giave": "Meilogu",
    "Golfo Aranci": "Gallura",
    "Illorai": "Goceano",
    "Isola dell'Asinara": "Nurra",
    "Ittireddu": "Monteacuto",
    "Laerru": "Anglona",
    "Loiri Porto San Paolo": "Gallura",
    "Luogosanto": "Gallura",
    "Luras": "Gallura",
    "Mara": "Meilogu",
    "Martis": "Anglona",
    "Monteleone Rocca Doria": "Monteleone",
    "Monti": "Gallura",
    "Mores": "Logudoro",
    "Muros": "Logudoro",
    "Nughedu San Nicolò": "Monteacuto",
    "Nule": "Goceano",
    "Nulvi": "Anglona",
    "Olmedo": "Nurra",
    "Oschiri": "Monteacuto",
    "Osilo": "Romangia",
    "Ossi": "Logudoro",
    "Padria": "Meilogu",
    "Padru": "Gallura",
    "Perfugas": "Anglona",
    "Ploaghe": "Logudoro",
    "Pozzomaggiore": "Meilogu",
    "Putifigari": "Nurra",
    "Romana": "Meilogu",
    "San Teodoro": "Gallura",
    "Sant'Antonio di Gallura": "Gallura",
    "Santa Maria Coghinas": "Anglona",
    "Sedini": "Anglona",
    "Semestene": "Meilogu",
    "Sennori": "Romangia",
    "Siligo": "Meilogu",
    "Telti": "Gallura",
    "Tergu": "Anglona",
    "Thiesi": "Meilogu",
    "Tissi": "Logudoro",
    "Torralba": "Meilogu",
    "Trinità d'Agultu e Vignola": "Gallura",
    "Tula": "Monteacuto",
    "Uri": "Nurra",
    "Usini": "Logudoro",
    "Viddalba": "Anglona",
    "Villanova Monteleone": "Monteleone",
}

# Specific hooks that lift the guide above a generic stub
HOOKS = {
    "Berchidda": {
        "title": "Berchidda: Time in Jazz e Monte Limbara",
        "hook": "paese del Time in Jazz di Paolo Fresu",
        "visit": "Festival Time in Jazz (estate) e le strade verso il Limbara",
        "tradition": "Il jazz in piazza ogni estate, con concerti anche nei paesi vicini",
    },
    "Torralba": {
        "title": "Torralba: nuraghe Santu Antine e Valle dei Nuraghi",
        "hook": "casa del nuraghe Santu Antine",
        "visit": "Nuraghe Santu Antine e il museo della Valle dei Nuraghi",
        "tradition": "La Valle dei Nuraghi, tra Torralba, Bonorva e Thiesi",
    },
    "San Teodoro": {
        "title": "San Teodoro: La Cinta, Cala Brandinchi e stagno",
        "hook": "costa tra La Cinta e Brandinchi",
        "visit": "La Cinta, Cala Brandinchi e lo stagno protetto",
        "tradition": "Turismo balneare e paese dietro le dune",
    },
    "Budoni": {
        "title": "Budoni: spiagge e porto Ottiolu",
        "hook": "comune sparso tra mare e campagna gallurese",
        "visit": "Ottiolu, le spiagge e il centro di Budoni",
        "tradition": "Estate in costa, inverno di paese",
    },
    "Golfo Aranci": {
        "title": "Golfo Aranci: porto, Capo Figari e Cala Moresca",
        "hook": "porto e Capo Figari",
        "visit": "Capo Figari, Cala Moresca e il lungomare",
        "tradition": "Paese di mare e collegamenti con la Corsica e la penisola",
    },
    "Ardara": {
        "title": "Ardara: basilica di San Pietro e capitale giudicale",
        "hook": "antica capitale del giudicato di Torres",
        "visit": "Basilica di San Pietro di Ardara",
        "tradition": "Memoria giudicale nel Logudoro",
    },
    "Codrongianos": {
        "title": "Codrongianos: Santissima Trinità di Saccargia",
        "hook": "paese della basilica di Saccargia",
        "visit": "Basilica della Santissima Trinità di Saccargia",
        "tradition": "Romanico bianco e nero nel Logudoro",
    },
    "Borutta": {
        "title": "Borutta: San Pietro di Sorres",
        "hook": "paese di San Pietro di Sorres",
        "visit": "Abbazia e basilica di San Pietro di Sorres",
        "tradition": "Romanico e colline del Meilogu",
    },
    "Bonorva": {
        "title": "Bonorva: Sant’Andrea Priu e Meilogu",
        "hook": "necropoli di Sant’Andrea Priu",
        "visit": "Necropoli di Sant’Andrea Priu",
        "tradition": "Meilogu di campagna e cavalli",
    },
    "Osilo": {
        "title": "Osilo: castello e Romangia",
        "hook": "castello e vigneti della Romangia",
        "visit": "Castello e centro storico",
        "tradition": "Vino e feste della Romangia",
    },
    "Sennori": {
        "title": "Sennori: Romangia e vista sul golfo",
        "hook": "gemello di Sorso sulla Romangia",
        "visit": "Centro e colline verso il mare",
        "tradition": "Vino e festa in Romangia",
    },
    "Luogosanto": {
        "title": "Luogosanto: basilica e Gallura interna",
        "hook": "santuario mariano della Gallura",
        "visit": "Basilica di Nostra Signora di Luogosanto",
        "tradition": "Pellegrinaggi e festa della Madonna",
    },
    "Perfugas": {
        "title": "Perfugas: museo archeologico e Anglona",
        "hook": "museo archeologico dell’Anglona",
        "visit": "Museo archeologico e centro",
        "tradition": "Preistoria e paese d’Anglona",
    },
    "Sedini": {
        "title": "Sedini: domus de janas e Anglona",
        "hook": "paese scavato nella roccia",
        "visit": "Domus de janas urbane e centro",
        "tradition": "Anglona di pietra e festa",
    },
    "Isola dell'Asinara": {
        "title": "Asinara: parco nazionale ed ex carcere",
        "hook": "parco nazionale e memoria del carcere",
        "visit": "Cala d’Oliva, Fornelli e i sentieri del parco",
        "tradition": "Natura protetta, niente villaggio turistico classico",
    },
    "Loiri Porto San Paolo": {
        "title": "Loiri Porto San Paolo: costa verso Tavolara",
        "hook": "costa di fronte a Tavolara",
        "visit": "Porto San Paolo e Loiri nell’entroterra",
        "tradition": "Mare d’estate, paese tutto l’anno",
    },
    "Trinità d'Agultu e Vignola": {
        "title": "Trinità d’Agultu e Vignola: Isola Rossa e costa ovest gallurese",
        "hook": "Isola Rossa e costa tra Castelsardo e Santa Teresa",
        "visit": "Isola Rossa e Vignola Mare",
        "tradition": "Due frazioni sul mare, un comune",
    },
    "Badesi": {
        "title": "Badesi: foce del Coghinas e spiagge",
        "hook": "spiagge sulla foce del Coghinas",
        "visit": "Spiaggia di Badesi e foce",
        "tradition": "Costa d’Anglona-Gallura",
    },
    "Oschiri": {
        "title": "Oschiri: Monteacuto e lago Coghinas",
        "hook": "paese tra Limbara e lago Coghinas",
        "visit": "Centro e territorio verso il lago",
        "tradition": "Cavalieri e feste del Monteacuto",
    },
    "Thiesi": {
        "title": "Thiesi: Meilogu e industria casearia",
        "hook": "paese del Meilogu e del formaggio",
        "visit": "Centro e colline del Meilogu",
        "tradition": "Feste e prodotti di caseificio",
    },
    "Ploaghe": {
        "title": "Ploaghe: Logudoro e memoria di Spano",
        "hook": "paese di Giovanni Spano",
        "visit": "Centro e chiese del Logudoro",
        "tradition": "Cultura linguistica e feste",
    },
    "Villanova Monteleone": {
        "title": "Villanova Monteleone: costa e entroterra",
        "hook": "paese tra Alghero e Bosa",
        "visit": "Centro e spiagge del territorio",
        "tradition": "Monteleone di collina e mare",
    },
    "Monteleone Rocca Doria": {
        "title": "Monteleone Rocca Doria: borgo sul lago",
        "hook": "borgo sul lago del Temo",
        "visit": "Centro storico e lago",
        "tradition": "Uno dei comuni più piccoli d’Italia",
    },
}


def slugify(value: str) -> str:
    # Mirror src/lib/slug.ts createSlug
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

    # Prefer panorama / paese photos, skip maps/svg/locator
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
        if not any(
            x in license_name
            for x in ["CC BY", "CC0", "Public domain", "PD"]
        ):
            continue
        w = info.get("width") or 0
        h = info.get("height") or 0
        if w < 800 or h < 400:
            continue
        artist = re.sub("<[^>]+>", "", (meta.get("Artist") or {}).get("value", "")).strip()
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
    return s.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")


def build_article(town: str, extract: str | None, photo: dict, stem: str):
    slug = slugify(town)
    area = SUBAREA.get(town, "Nord Sardegna")
    hook = HOOKS.get(town, {})
    title = hook.get("title") or f"{town}: storia, tradizioni e cosa visitare"
    prep = "ad" if town[0].lower() in "aeiouàèéìòù" else "a"
    extract_clean = re.sub(r"\s+", " ", extract or "").strip()
    if len(extract_clean) > 420:
        extract_clean = extract_clean[:417].rsplit(" ", 1)[0] + "."

    hook_phrase = hook.get("hook") or f"comune del {area}"
    visit_hook = hook.get("visit") or f"il centro di {town} e il territorio comunale"
    tradition_hook = hook.get("tradition") or f"feste patronali e vita di paese nel {area}"

    intro = (
        f"{town} è {hook_phrase} in provincia di Sassari. "
        f"Questa scheda raccoglie storia, tradizioni e cosa visitare, "
        f"e sotto trovi gli eventi in programma {prep} {town} su EVERAS."
    )

    history1 = extract_clean or (
        f"{town} è un comune del Nord Sardegna, nella zona storica del {area}. "
        f"Come molti paesi dell’isola, tiene insieme memoria agro-pastorale, "
        f"chiese e un centro che si vive soprattutto nelle feste."
    )
    history2 = (
        f"Oggi {town} resta un punto della directory Cultura sarda del Nord: "
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
            "title": f"Il {area} intorno",
            "body": (
                f"{town} si legge meglio insieme ai comuni vicini del {area}: "
                f"stesse strade, spesso stesse famiglie di feste e stessi paesaggi. "
                f"Usa la guida dell’area Nord Sardegna per spostarti paese per paese."
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
        f"{town} in Sardegna: guida al comune del {area}, cosa visitare "
        f"e eventi in programma su EVERAS."
    )

    return {
        "slug": slug,
        "path": f"/cultura-sarda/nord-sardegna/{slug}",
        "town": town,
        "province": "Sassari",
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
        "publishedAt": "2026-09-11",
    }


def emit_ts(articles: list[dict]) -> str:
    lines = [
        'import type { CultureTownArticle } from "@/src/lib/seo/cultura-towns";',
        "",
        "/** Guide Cultura generate per i comuni del Nord ancora senza scheda lunga. */",
        "export const NORD_REMAINING_CULTURE_TOWNS: CultureTownArticle[] = [",
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
    # Fallback hero if a town has no Commons photo: reuse nord image
    fallback_src = ROOT / "public" / "images" / "nord-sardegna.webp"
    articles = []
    meta = []

    for i, town in enumerate(MISSING, 1):
        print(f"[{i}/{len(MISSING)}] {town}", flush=True)
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
            # copy fallback if needed
            if fallback_src.exists() and not dest.exists():
                img = Image.open(fallback_src).convert("RGB")
                img.save(dest, "WEBP", quality=82, method=6)
            photo = {
                "artist": "EVERAS",
                "license": "All rights reserved",
                "licenseUrl": "https://www.everas.it",
                "sourceUrl": "https://www.everas.it/cultura-sarda/nord-sardegna",
                "commons": "fallback",
            }
            # Prefer a known Gianni panorama from an existing town as visual fallback
            # Use aggius-panorama.webp bytes if fallback nord is odd aspect
            existing = PUB / "aggius-panorama.webp"
            if existing.exists():
                dest.write_bytes(existing.read_bytes())
                photo = {
                    "artist": "Gianni Careddu",
                    "license": "CC BY-SA 4.0",
                    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
                    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Aggius_-_Panorama_(01).jpg",
                    "commons": "fallback-aggius",
                }

        article = build_article(town, extract, photo, stem)
        # Fix hero alt if using fallback image of another town
        if photo.get("commons") == "fallback-aggius":
            article["hero"]["alt"] = f"Paesaggio del Nord Sardegna (scheda {town})"
        articles.append(article)
        meta.append({"town": town, "stem": stem, "commons": photo.get("commons"), "hasWiki": bool(extract)})
        time.sleep(0.2)

    OUT_TS.write_text(emit_ts(articles), encoding="utf-8")
    META_JSON.write_text(json.dumps(meta, indent=2, ensure_ascii=False), encoding="utf-8")
    print("Wrote", OUT_TS, "articles", len(articles))


if __name__ == "__main__":
    main()
