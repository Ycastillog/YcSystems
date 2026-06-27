from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(r"C:\Users\Yeica\Projects\YcSystems")
OUT = ROOT / "assets" / "social" / "offers"
OUT.mkdir(parents=True, exist_ok=True)

W = H = 1080

ASSETS = {
    "logo": ROOT / "assets" / "brand" / "yc-logo-horizontal-white.png",
    "nexus": ROOT / "assets" / "brand" / "nexus" / "poses" / "nexus-pointing.png",
}

COL = {
    "navy": (5, 14, 28),
    "panel": (8, 24, 45),
    "blue": (37, 99, 235),
    "cyan": (0, 216, 255),
    "green": (92, 255, 92),
    "white": (255, 255, 255),
    "muted": (197, 211, 226),
}


def font(size, bold=False):
    candidates = [
        Path(r"C:\Windows\Fonts\segoeuib.ttf") if bold else Path(r"C:\Windows\Fonts\segoeui.ttf"),
        Path(r"C:\Windows\Fonts\arialbd.ttf") if bold else Path(r"C:\Windows\Fonts\arial.ttf"),
    ]
    for path in candidates:
        if path.exists():
            return ImageFont.truetype(str(path), size)
    return ImageFont.load_default()


F = {
    "badge": font(24, True),
    "eyebrow": font(27, True),
    "headline": font(64, True),
    "sub": font(31, False),
    "price_label": font(29, True),
    "price": font(88, True),
    "small": font(24, False),
    "benefit": font(27, True),
    "cta": font(31, True),
    "footer": font(25, True),
}


def background():
    im = Image.new("RGB", (W, H), COL["navy"])
    px = im.load()
    for y in range(H):
        for x in range(W):
            dx, dy = x / W, y / H
            blue = max(0, 1 - ((dx - 0.86) ** 2 + (dy - 0.12) ** 2) / 0.42)
            teal = max(0, 1 - ((dx - 0.10) ** 2 + (dy - 0.92) ** 2) / 0.56)
            glow = max(0, 1 - ((dx - 0.42) ** 2 + (dy - 0.55) ** 2) / 0.70)
            px[x, y] = (
                int(5 + 23 * blue + 4 * teal),
                int(14 + 74 * blue + 42 * teal + 8 * glow),
                int(28 + 125 * blue + 30 * teal + 10 * glow),
            )
    return im.convert("RGBA")


def contain(path, size):
    im = Image.open(path).convert("RGBA")
    im.thumbnail(size, Image.LANCZOS)
    canvas = Image.new("RGBA", size, (0, 0, 0, 0))
    canvas.alpha_composite(im, ((size[0] - im.width) // 2, (size[1] - im.height) // 2))
    return canvas


def panel(base, box, radius=36, outline=COL["cyan"], fill=(7, 22, 42, 215)):
    x, y, w, h = box
    shadow = Image.new("RGBA", (w + 90, h + 90), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.rounded_rectangle((45, 45, w + 45, h + 45), radius=radius, fill=(0, 0, 0, 150))
    shadow = shadow.filter(ImageFilter.GaussianBlur(26))
    base.alpha_composite(shadow, (x - 45, y - 38))
    d = ImageDraw.Draw(base)
    d.rounded_rectangle((x, y, x + w, y + h), radius=radius, fill=fill, outline=outline, width=2)


def wrap(draw, text, xy, width, fnt, fill, gap=8, max_lines=3):
    words = text.split()
    lines = []
    cur = ""
    for word in words:
        trial = (cur + " " + word).strip()
        if draw.textbbox((0, 0), trial, font=fnt)[2] <= width:
            cur = trial
        else:
            if cur:
                lines.append(cur)
            cur = word
    if cur:
        lines.append(cur)
    x, y = xy
    for line in lines[:max_lines]:
        draw.text((x, y), line, font=fnt, fill=fill)
        y = draw.textbbox((x, y), line, font=fnt)[3] + gap
    return y


def build():
    im = background()
    d = ImageDraw.Draw(im)

    im.alpha_composite(contain(ASSETS["logo"], (178, 68)), (54, 44))

    d.rounded_rectangle((748, 56, 1020, 108), radius=26, fill=(8, 25, 47, 220), outline=COL["green"], width=2)
    d.text((780, 69), "OFERTA LIMITADA", font=F["badge"], fill=COL["green"])

    d.text((56, 155), "SITIO WEB PROFESIONAL", font=F["eyebrow"], fill=COL["cyan"])
    wrap(d, "Tu negocio merece una web profesional", (56, 214), 610, F["headline"], COL["white"], 10, 3)

    panel(im, (56, 540, 520, 198), 34, COL["cyan"])
    d.text((88, 566), "Desde", font=F["price_label"], fill=COL["muted"])
    d.text((88, 607), "RD$8,500", font=F["price"], fill=COL["green"])
    d.text((92, 700), "Presencia clara para vender confianza.", font=F["small"], fill=COL["white"])

    panel(im, (56, 780, 600, 145), 30, COL["cyan"], fill=(7, 22, 42, 205))
    benefits = ["Responsive", "WhatsApp", "Formulario", "Secciones base"]
    for i, text in enumerate(benefits):
        x = 88 + (i % 2) * 260
        y = 809 + (i // 2) * 54
        d.ellipse((x, y + 8, x + 22, y + 30), fill=COL["green"])
        d.text((x + 34, y), text, font=F["benefit"], fill=COL["white"])

    # Nexus visual block.
    d.rounded_rectangle((678, 350, 1040, 805), radius=34, fill=(4, 12, 25, 145), outline=(0, 216, 255, 80), width=1)
    im.alpha_composite(contain(ASSETS["nexus"], (390, 505)), (660, 328))

    d.rounded_rectangle((676, 858, 1020, 932), radius=36, fill=COL["blue"], outline=COL["cyan"], width=2)
    d.text((732, 879), "Agenda tu web", font=F["cta"], fill=COL["white"])

    d.text((56, 986), "YC Systems", font=F["footer"], fill=COL["white"])
    d.text((56, 1019), "Smart Solutions. Real Results.", font=F["badge"], fill=COL["cyan"])

    out = OUT / "oferta-web-profesional-rd8500.jpg"
    im.convert("RGB").save(out, quality=94, optimize=True)
    print(out)


if __name__ == "__main__":
    build()
