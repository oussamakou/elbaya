from __future__ import annotations

from pathlib import Path
from typing import Iterable

from PIL import Image, ImageDraw, ImageEnhance
from pypdf import PdfReader, PdfWriter
from reportlab.graphics import renderPDF
from reportlab.graphics.barcode.qr import QrCodeWidget
from reportlab.graphics.shapes import Drawing
from reportlab.lib.colors import Color, HexColor
from reportlab.lib.pagesizes import portrait
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen.canvas import Canvas


ROOT = Path(__file__).resolve().parents[1]
IMAGES = ROOT / "public" / "assets" / "images"
TMP = ROOT / "tmp" / "pdfs" / "farm-el-baya-flyer"
OUT = ROOT / "output" / "pdf"

BLEED = 3 * mm
TRIM_W = 148 * mm
TRIM_H = 210 * mm
PAGE_W = TRIM_W + 2 * BLEED
PAGE_H = TRIM_H + 2 * BLEED
PAGE_SIZE = portrait((PAGE_W, PAGE_H))

CREAM = HexColor("#FAF7F2")
SAND = HexColor("#F5F0E8")
OLIVE = HexColor("#6F7243")
OLIVE_DARK = HexColor("#565932")
OLIVE_LIGHT = HexColor("#A4A887")
EARTH = HexColor("#2C1810")
DUSK = HexColor("#1A1A14")
MIST = HexColor("#EDE8DF")
EARTH_MUTED = HexColor("#6E625B")
CREAM_MUTED = HexColor("#E4E0D9")

FONT_DIR = Path("C:/Windows/Fonts")
FONT_SERIF = "FlyerSerif"
FONT_SERIF_ITALIC = "FlyerSerifItalic"
FONT_SANS = "FlyerSans"
FONT_SANS_BOLD = "FlyerSansBold"


def register_fonts() -> None:
    pdfmetrics.registerFont(TTFont(FONT_SERIF, str(FONT_DIR / "georgia.ttf")))
    pdfmetrics.registerFont(TTFont(FONT_SERIF_ITALIC, str(FONT_DIR / "georgiai.ttf")))
    pdfmetrics.registerFont(TTFont(FONT_SANS, str(FONT_DIR / "DejaVuSans.ttf")))
    pdfmetrics.registerFont(TTFont(FONT_SANS_BOLD, str(FONT_DIR / "DejaVuSans-Bold.ttf")))


def crop_to_ratio(image: Image.Image, ratio: float, focus_y: float = 0.5) -> Image.Image:
    src_w, src_h = image.size
    src_ratio = src_w / src_h
    if src_ratio > ratio:
        new_w = round(src_h * ratio)
        left = (src_w - new_w) // 2
        box = (left, 0, left + new_w, src_h)
    else:
        new_h = round(src_w / ratio)
        top = round((src_h - new_h) * max(0.0, min(1.0, focus_y)))
        top = max(0, min(top, src_h - new_h))
        box = (0, top, src_w, top + new_h)
    return image.crop(box)


def prepare_photo(
    name: str,
    width_px: int,
    height_px: int,
    *,
    darken: float = 1.0,
    focus_y: float = 0.5,
    gradient: bool = False,
) -> Path:
    TMP.mkdir(parents=True, exist_ok=True)
    stem = Path(name).stem
    output = TMP / f"{stem}-{width_px}x{height_px}-{darken:.2f}-{focus_y:.2f}-{int(gradient)}-baseline.jpg"
    if output.exists():
        return output

    with Image.open(IMAGES / name) as source:
        image = source.convert("RGB")
        image = crop_to_ratio(image, width_px / height_px, focus_y)
        image = image.resize((width_px, height_px), Image.Resampling.LANCZOS)
        image = ImageEnhance.Color(image).enhance(0.88)
        image = ImageEnhance.Contrast(image).enhance(1.06)
        if darken < 1.0:
            image = ImageEnhance.Brightness(image).enhance(darken)

        if gradient:
            overlay = Image.new("RGBA", image.size, (0, 0, 0, 0))
            draw = ImageDraw.Draw(overlay)
            for y in range(height_px):
                t = y / max(1, height_px - 1)
                alpha = int(120 * (1.0 - t) + 20 * t)
                draw.line((0, y, width_px, y), fill=(18, 16, 12, alpha))
            image = Image.alpha_composite(image.convert("RGBA"), overlay).convert("RGB")

        image.save(output, "JPEG", quality=94, optimize=True, progressive=False)
    return output


def draw_tracking_label(canvas: Canvas, text: str, x: float, y: float, color=OLIVE) -> None:
    canvas.setFillColor(color)
    text_object = canvas.beginText(x, y)
    text_object.setFont(FONT_SANS_BOLD, 7.4)
    text_object.setCharSpace(1.4)
    text_object.textLine(text.upper())
    canvas.drawText(text_object)


def draw_wordmark(canvas: Canvas, x: float, y: float, light: bool = True) -> None:
    main = CREAM if light else EARTH
    accent = OLIVE_LIGHT if light else OLIVE
    canvas.setFillColor(main)
    canvas.setFont(FONT_SERIF, 17)
    canvas.drawString(x, y, "Farm El Baya")
    canvas.setStrokeColor(accent)
    canvas.setLineWidth(1.3)
    canvas.line(x, y - 4, x + 29 * mm, y - 4)
    canvas.setFillColor(accent)
    text_object = canvas.beginText(x, y - 12)
    text_object.setFont(FONT_SANS_BOLD, 5.6)
    text_object.setCharSpace(1.05)
    text_object.textLine("ECO-STAY & MOVEMENT")
    canvas.drawText(text_object)


def draw_centered_lines(
    canvas: Canvas,
    lines: Iterable[str],
    center_x: float,
    top_y: float,
    font: str,
    size: float,
    leading: float,
    color,
) -> float:
    canvas.setFillColor(color)
    canvas.setFont(font, size)
    y = top_y
    for line in lines:
        canvas.drawCentredString(center_x, y, line)
        y -= leading
    return y


def draw_qr(canvas: Canvas, value: str, x: float, y: float, size: float) -> None:
    canvas.setFillColor(CREAM)
    canvas.roundRect(x - 4, y - 4, size + 8, size + 8, 3, stroke=0, fill=1)
    widget = QrCodeWidget(value=value, barLevel="M")
    bounds = widget.getBounds()
    width = bounds[2] - bounds[0]
    height = bounds[3] - bounds[1]
    drawing = Drawing(size, size, transform=[size / width, 0, 0, size / height, 0, 0])
    drawing.add(widget)
    renderPDF.draw(drawing, canvas, x, y)


def draw_photo_strip(canvas: Canvas, photos: list[tuple[str, float]], y: float, height: float) -> None:
    x0 = BLEED + 12 * mm
    available = TRIM_W - 24 * mm
    gap = 2.1 * mm
    width = (available - 2 * gap) / 3
    for index, (name, focus_y) in enumerate(photos):
        x = x0 + index * (width + gap)
        prepared = prepare_photo(name, 700, 650, focus_y=focus_y)
        canvas.saveState()
        canvas.drawImage(str(prepared), x, y, width, height, preserveAspectRatio=False)
        canvas.restoreState()
        canvas.setStrokeColor(MIST)
        canvas.setLineWidth(0.6)
        canvas.rect(x, y, width, height, stroke=1, fill=0)


def draw_stat(canvas: Canvas, x: float, y: float, width: float, value: str, label: str) -> None:
    canvas.setFillColor(EARTH)
    canvas.setFont(FONT_SERIF_ITALIC, 17)
    canvas.drawCentredString(x + width / 2, y, value)
    canvas.setFillColor(EARTH_MUTED)
    canvas.setFont(FONT_SANS, 6.8)
    canvas.drawCentredString(x + width / 2, y - 12, label)


def draw_flyer_page(canvas: Canvas, lang: str) -> None:
    is_fr = lang == "fr"
    copy = {
        "eyebrow": "UNE ESCAPADE A LA FERME" if is_fr else "A FARM ESCAPE",
        "headline": ["Dormir sous", "les oliviers."] if is_fr else ["Stay under", "the olive trees."],
        "subhead": (
            "Une chambre privée au coeur d'une ferme vivante près de Testour."
            if is_fr
            else "One private room on a living farm near Testour."
        ),
        "stat1": ("180 DT", "la nuit - tarif direct") if is_fr else ("180 DT", "per night - direct rate"),
        "stat2": ("1 heure", "depuis Tunis") if is_fr else ("1 hour", "from Tunis"),
        "stat3": ("3 hôtes", "chambre privée") if is_fr else ("3 guests", "private room + bathroom"),
        "cta": "Scannez pour réserver en direct" if is_fr else "Scan to book direct",
        "url": "farmelbaya.com/fr/book" if is_fr else "farmelbaya.com/en/book",
        "detail": (
            ("Petit-déjeuner fermier | Animaux | Oliviers", "Mouvement | Parking gratuit")
            if is_fr
            else ("Farm breakfast | Animals | Olive groves", "Movement | Free parking")
        ),
        "location": "SLOUGUIA - TESTOUR - TUNISIE" if is_fr else "SLOUGUIA - TESTOUR - TUNISIA",
        "qr": (
            "https://farmelbaya.com/fr/book?utm_source=flyer&utm_medium=offline&utm_campaign=tunis_city"
            if is_fr
            else "https://farmelbaya.com/en/book?utm_source=flyer&utm_medium=offline&utm_campaign=tunis_city"
        ),
    }

    canvas.setFillColor(CREAM)
    canvas.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)

    hero_y = 91 * mm
    hero_h = PAGE_H - hero_y
    hero_name = "outside_kitchen_fireplace.webp" if is_fr else "room_exterior_vibe.webp"
    focus_y = 0.44 if is_fr else 0.34
    hero = prepare_photo(hero_name, 1650, 1600, darken=0.82, focus_y=focus_y, gradient=True)
    canvas.saveState()
    canvas.drawImage(str(hero), 0, hero_y, PAGE_W, hero_h, preserveAspectRatio=False)
    canvas.restoreState()

    draw_wordmark(canvas, BLEED + 12 * mm, PAGE_H - BLEED - 15 * mm, light=True)
    draw_tracking_label(canvas, copy["location"], PAGE_W - BLEED - 12 * mm - 50 * mm, PAGE_H - BLEED - 11 * mm, CREAM)

    draw_tracking_label(canvas, copy["eyebrow"], BLEED + 12 * mm, hero_y + 52 * mm, OLIVE_LIGHT)
    canvas.setFillColor(CREAM)
    canvas.setFont(FONT_SERIF_ITALIC, 33)
    canvas.drawString(BLEED + 12 * mm, hero_y + 36 * mm, copy["headline"][0])
    canvas.drawString(BLEED + 12 * mm, hero_y + 23 * mm, copy["headline"][1])
    canvas.setFont(FONT_SANS, 8.6)
    canvas.setFillColor(CREAM_MUTED)
    canvas.drawString(BLEED + 12 * mm, hero_y + 13 * mm, copy["subhead"])

    stat_y = 75 * mm
    stat_x = BLEED + 10 * mm
    stat_w = (TRIM_W - 20 * mm) / 3
    draw_stat(canvas, stat_x, stat_y, stat_w, *copy["stat1"])
    draw_stat(canvas, stat_x + stat_w, stat_y, stat_w, *copy["stat2"])
    draw_stat(canvas, stat_x + 2 * stat_w, stat_y, stat_w, *copy["stat3"])
    canvas.setStrokeColor(MIST)
    canvas.setLineWidth(0.6)
    canvas.line(stat_x + stat_w, stat_y - 18, stat_x + stat_w, stat_y + 11)
    canvas.line(stat_x + 2 * stat_w, stat_y - 18, stat_x + 2 * stat_w, stat_y + 11)

    strip_photos = (
        [
            ("breakfast.webp", 0.52),
            ("baby_goat_looking_at_camera.webp", 0.34),
            ("handstand_practice.webp", 0.38),
        ]
        if is_fr
        else [
            ("room-interior.webp", 0.43),
            ("beekeeping_activity.webp", 0.38),
            ("startgazing_nightsky.webp", 0.30),
        ]
    )
    draw_photo_strip(canvas, strip_photos, 35 * mm, 28 * mm)

    canvas.setStrokeColor(MIST)
    canvas.setLineWidth(0.8)
    canvas.line(BLEED + 12 * mm, 30 * mm, PAGE_W - BLEED - 12 * mm, 30 * mm)

    qr_size = 20 * mm
    qr_x = PAGE_W - BLEED - 12 * mm - qr_size
    qr_y = BLEED + 7 * mm
    draw_qr(canvas, copy["qr"], qr_x, qr_y, qr_size)

    text_x = BLEED + 12 * mm
    canvas.setFillColor(EARTH)
    canvas.setFont(FONT_SERIF_ITALIC, 14.5)
    canvas.drawString(text_x, 22 * mm, copy["cta"])
    canvas.setFillColor(OLIVE_DARK)
    canvas.setFont(FONT_SANS_BOLD, 8.3)
    canvas.drawString(text_x, 16 * mm, copy["url"])
    canvas.setFillColor(EARTH_MUTED)
    canvas.setFont(FONT_SANS, 5.75)
    canvas.drawString(text_x, 10.8 * mm, copy["detail"][0])
    canvas.drawString(text_x, 8.1 * mm, copy["detail"][1])

    canvas.showPage()


def apply_print_boxes(source: Path, target: Path) -> None:
    reader = PdfReader(str(source))
    writer = PdfWriter()
    for page in reader.pages:
        page.trimbox.lower_left = (BLEED, BLEED)
        page.trimbox.upper_right = (PAGE_W - BLEED, PAGE_H - BLEED)
        page.bleedbox.lower_left = (0, 0)
        page.bleedbox.upper_right = (PAGE_W, PAGE_H)
        page.cropbox.lower_left = (0, 0)
        page.cropbox.upper_right = (PAGE_W, PAGE_H)
        writer.add_page(page)
    writer.add_metadata(
        {
            "/Title": "Farm El Baya - A5 bilingual promotional flyer",
            "/Author": "Farm El Baya",
            "/Subject": "French and English city-distribution flyer with direct-booking QR codes",
        }
    )
    with target.open("wb") as handle:
        writer.write(handle)


def main() -> None:
    register_fonts()
    TMP.mkdir(parents=True, exist_ok=True)
    OUT.mkdir(parents=True, exist_ok=True)

    base = TMP / "farm-el-baya-flyer-base.pdf"
    final = OUT / "farm-el-baya-flyer-a5-duplex-print.pdf"
    canvas = Canvas(str(base), pagesize=PAGE_SIZE, pageCompression=1)
    canvas.setTitle("Farm El Baya - A5 bilingual promotional flyer")
    draw_flyer_page(canvas, "fr")
    draw_flyer_page(canvas, "en")
    canvas.save()
    apply_print_boxes(base, final)
    print(final)


if __name__ == "__main__":
    main()
