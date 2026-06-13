from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter


ROOT = Path(__file__).resolve().parents[2]
SOURCE = Path(r"C:\Users\Yeica\AppData\Local\Temp\codex-clipboard-a351fbba-c93c-4b63-9015-6babf4fbafa2.png")
OUT_DIR = ROOT / "assets" / "social" / "founder"
BRAND_DIR = ROOT / "assets" / "brand"

NAVY = (5, 13, 30)
NAVY_2 = (9, 24, 44)
BLUE = (37, 99, 235)
CYAN = (0, 214, 255)
WHITE = (255, 255, 255)
MUTED = (191, 204, 224)
GREEN = (90, 255, 69)


def font(size, bold=False):
    candidates = [
        r"C:\Windows\Fonts\Montserrat-Bold.ttf" if bold else r"C:\Windows\Fonts\Montserrat-Regular.ttf",
        r"C:\Windows\Fonts\arialbd.ttf" if bold else r"C:\Windows\Fonts\arial.ttf",
    ]
    for item in candidates:
        if Path(item).exists():
            return ImageFont.truetype(item, size)
    return ImageFont.load_default()


def wrap_text(draw, text, fnt, max_width):
    lines = []
    for raw in text.split("\n"):
        words = raw.split()
        line = ""
        for word in words:
            test = f"{line} {word}".strip()
            width = draw.textbbox((0, 0), test, font=fnt)[2]
            if width <= max_width or not line:
                line = test
            else:
                lines.append(line)
                line = word
        if line:
            lines.append(line)
    return lines


def add_text(draw, xy, text, fnt, fill, max_width, line_gap=8):
    x, y = xy
    for line in wrap_text(draw, text, fnt, max_width):
        draw.text((x, y), line, font=fnt, fill=fill)
        y += draw.textbbox((0, 0), line, font=fnt)[3] + line_gap
    return y


def rounded_rect(draw, box, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def fit_cover(img, size, focus=(0.5, 0.34)):
    w, h = img.size
    tw, th = size
    scale = max(tw / w, th / h)
    nw, nh = int(w * scale), int(h * scale)
    img = img.resize((nw, nh), Image.Resampling.LANCZOS)
    left = int((nw - tw) * focus[0])
    top = int((nh - th) * focus[1])
    return img.crop((left, top, left + tw, top + th))


def gradient_bg():
    img = Image.new("RGB", (1080, 1080), NAVY)
    px = img.load()
    for y in range(1080):
        for x in range(1080):
            t = (x + y * 0.6) / 1728
            r = int(NAVY[0] * (1 - t) + NAVY_2[0] * t)
            g = int(NAVY[1] * (1 - t) + NAVY_2[1] * t)
            b = int(NAVY[2] * (1 - t) + NAVY_2[2] * t)
            if x < 420 and y > 650:
                g += 18
            if x > 640 and y > 760:
                b += 28
            px[x, y] = (min(r, 255), min(g, 255), min(b, 255))
    overlay = Image.new("RGBA", (1080, 1080), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    for x in range(0, 1080, 70):
        od.line((x, 0, x, 1080), fill=(255, 255, 255, 15), width=1)
    for y in range(0, 1080, 70):
        od.line((0, y, 1080, y), fill=(255, 255, 255, 12), width=1)
    return Image.alpha_composite(img.convert("RGBA"), overlay)


def paste_logo(canvas):
    logo_path = BRAND_DIR / "yc-logo-horizontal-white.png"
    logo = Image.open(logo_path).convert("RGBA")
    logo.thumbnail((230, 80), Image.Resampling.LANCZOS)
    canvas.alpha_composite(logo, (70, 58))


def paste_founder(canvas):
    photo = Image.open(SOURCE).convert("RGB")
    photo = fit_cover(photo, (470, 760), focus=(0.48, 0.22)).convert("RGBA")
    mask = Image.new("L", photo.size, 0)
    md = ImageDraw.Draw(mask)
    md.rounded_rectangle((0, 0, photo.width, photo.height), radius=34, fill=255)
    shadow = Image.new("RGBA", (photo.width + 60, photo.height + 60), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.rounded_rectangle((30, 30, photo.width + 30, photo.height + 30), radius=34, fill=(0, 0, 0, 180))
    shadow = shadow.filter(ImageFilter.GaussianBlur(24))
    canvas.alpha_composite(shadow, (556, 196))
    photo.putalpha(mask)
    canvas.alpha_composite(photo, (586, 226))
    frame = Image.new("RGBA", photo.size, (0, 0, 0, 0))
    fd = ImageDraw.Draw(frame)
    fd.rounded_rectangle((0, 0, photo.width - 1, photo.height - 1), radius=34, outline=(255, 255, 255, 70), width=2)
    canvas.alpha_composite(frame, (586, 226))


def build(filename, kicker, headline, body, cta, badge):
    canvas = gradient_bg()
    draw = ImageDraw.Draw(canvas)
    paste_logo(canvas)
    paste_founder(canvas)

    rounded_rect(draw, (70, 182, 294, 232), 25, (37, 99, 235, 45), outline=(0, 214, 255, 120), width=1)
    draw.text((92, 194), kicker.upper(), font=font(19, True), fill=CYAN)

    y = add_text(draw, (70, 286), headline, font(66, True), WHITE, 515, line_gap=10)
    y += 22
    add_text(draw, (73, y), body, font(31, False), MUTED, 500, line_gap=12)

    rounded_rect(draw, (70, 842, 525, 928), 18, (37, 99, 235, 230), outline=(0, 214, 255, 160), width=2)
    draw.text((96, 870), cta, font=font(28, True), fill=WHITE)
    draw.text((70, 982), "Smart Solutions. Real Results.", font=font(22, True), fill=GREEN)

    rounded_rect(draw, (668, 880, 986, 936), 28, (0, 0, 0, 120), outline=(255, 255, 255, 65), width=1)
    bw = draw.textbbox((0, 0), badge, font=font(20, True))[2]
    draw.text((668 + (318 - bw) / 2, 897), badge, font=font(20, True), fill=WHITE)

    canvas.convert("RGB").save(OUT_DIR / filename, quality=94, subsampling=0)


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    Image.open(SOURCE).save(OUT_DIR / "yeison-castillo-founder-photo.png")

    build(
        "01-founder-yc-systems.jpg",
        "Fundador",
        "Construimos software para negocios reales",
        "YC Systems crea productos, sistemas internos, tiendas online, dashboards y automatizaciones con enfoque comercial.",
        "Agenda una propuesta inicial",
        "YC Systems",
    )
    build(
        "02-business-systems.jpg",
        "Business systems",
        "Tu operación puede ser más clara",
        "Si tu negocio vive entre Excel, WhatsApp y tareas sueltas, podemos convertir ese proceso en una plataforma.",
        "Escribe SISTEMA",
        "Software Products",
    )
    build(
        "03-products-and-trust.jpg",
        "Trust",
        "Productos propios. Casos reales. Ejecución",
        "CleanLoop, SOC, BrokerControl y proyectos de clientes muestran una empresa tecnológica en crecimiento.",
        "Conoce YC Systems",
        "Real Results",
    )


if __name__ == "__main__":
    main()
