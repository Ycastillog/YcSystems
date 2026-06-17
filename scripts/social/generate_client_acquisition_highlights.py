from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import math


ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "assets" / "social" / "client-acquisition-highlights"
ARTIFACTS = ROOT / "artifacts"
OUT.mkdir(parents=True, exist_ok=True)
ARTIFACTS.mkdir(parents=True, exist_ok=True)

NAVY = (4, 13, 29)
NAVY_2 = (8, 27, 58)
BLUE = (37, 99, 235)
CYAN = (0, 221, 226)
GREEN = (79, 255, 72)
WHITE = (248, 251, 255)
MUTED = (166, 186, 214)


def font(size, bold=False):
    candidates = [
        "C:/Windows/Fonts/bahnschrift.ttf",
        "C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf",
        "C:/Windows/Fonts/segoeui.ttf",
    ]
    for candidate in candidates:
        if Path(candidate).exists():
            return ImageFont.truetype(candidate, size)
    return ImageFont.load_default()


F = {
    "tiny": font(28, True),
    "small": font(36),
    "small_bold": font(38, True),
    "body": font(48),
    "body_bold": font(50, True),
    "h2": font(76, True),
    "h1": font(112, True),
}


ITEMS = [
    {
        "slug": "01-start-here",
        "cover": "Inicio",
        "title": "Empieza aqui",
        "subtitle": "Si quieres mejorar tu negocio con tecnologia, este es el primer paso.",
        "chips": ["Diagnostico", "Ruta clara", "Propuesta inicial"],
    },
    {
        "slug": "02-webs",
        "cover": "Webs",
        "title": "Paginas web que venden confianza",
        "subtitle": "Para negocios que necesitan verse serios, explicar su oferta y recibir contactos.",
        "chips": ["Landing", "Corporativa", "Portafolio"],
    },
    {
        "slug": "03-sistemas",
        "cover": "Sistemas",
        "title": "Sistemas internos para operar mejor",
        "subtitle": "Clientes, tareas, estados, documentos y reportes en un solo lugar.",
        "chips": ["CRM", "Dashboard", "Roles"],
    },
    {
        "slug": "04-automatizar",
        "cover": "Auto",
        "title": "Automatizacion para ahorrar tiempo",
        "subtitle": "Menos trabajo manual, menos errores y procesos mas claros.",
        "chips": ["Flujos", "Alertas", "Reportes"],
    },
    {
        "slug": "05-tiendas",
        "cover": "Tiendas",
        "title": "Tiendas online y catalogos",
        "subtitle": "Productos, carrito, pedidos, WhatsApp y una experiencia movil lista para vender.",
        "chips": ["E-commerce", "Catalogo", "Pedidos"],
    },
    {
        "slug": "06-saas",
        "cover": "SaaS",
        "title": "SaaS y apps a medida",
        "subtitle": "Convertimos una idea en producto digital con usuarios, pagos, admin y crecimiento.",
        "chips": ["MVP", "API", "Multiusuario"],
    },
    {
        "slug": "07-mantenimiento",
        "cover": "Soporte",
        "title": "Mantenimiento mensual",
        "subtitle": "Mejoras, contenido, soporte, seguridad y cambios despues de publicar.",
        "chips": ["Soporte", "Mejoras", "Continuidad"],
    },
    {
        "slug": "08-contacto",
        "cover": "Contacto",
        "title": "Cuéntame que quieres construir",
        "subtitle": "Te respondo con una ruta inicial para web, sistema, tienda, app o automatizacion.",
        "chips": ["Brief", "Propuesta", "Inicio"],
    },
]


def bg(size):
    w, h = size
    img = Image.new("RGBA", size, NAVY + (255,))
    px = img.load()
    for y in range(h):
        for x in range(w):
            dx = (x - w * 0.78) / w
            dy = (y - h * 0.18) / h
            glow = max(0, 1 - math.sqrt(dx * dx + dy * dy) * 3.2)
            r = int(NAVY[0] + glow * 15)
            g = int(NAVY[1] + glow * 26)
            b = int(NAVY[2] + glow * 62)
            px[x, y] = (r, g, b, 255)
    d = ImageDraw.Draw(img, "RGBA")
    step = 72
    for gx in range(0, w, step):
        d.line((gx, 0, gx, h), fill=(64, 126, 205, 35), width=1)
    for gy in range(0, h, step):
        d.line((0, gy, w, gy), fill=(64, 126, 205, 30), width=1)
    for rr in [330, 440, 550]:
        d.arc((w - 650, 140, w - 650 + rr * 2, 140 + rr * 2), 196, 325, fill=(37, 99, 235, 95), width=3)
    return img


def contain(path, size):
    src = Image.open(path).convert("RGBA")
    src.thumbnail(size, Image.LANCZOS)
    out = Image.new("RGBA", size, (0, 0, 0, 0))
    out.alpha_composite(src, ((size[0] - src.width) // 2, (size[1] - src.height) // 2))
    return out


def logo(size=(260, 86)):
    path = ROOT / "assets" / "brand" / "yc-logo-horizontal-white.png"
    return contain(path, size)


def draw_icon(d, center, kind, color):
    x, y = center
    if kind == "web":
        d.rounded_rectangle((x - 48, y - 34, x + 48, y + 34), radius=10, outline=color, width=6)
        d.line((x - 48, y - 14, x + 48, y - 14), fill=color, width=5)
    elif kind == "system":
        for i in range(3):
            d.rounded_rectangle((x - 48 + i * 38, y - 46, x - 18 + i * 38, y - 16), radius=8, outline=color, width=5)
        d.line((x - 33, y + 2, x + 33, y + 2), fill=color, width=5)
        d.rounded_rectangle((x - 32, y + 20, x + 32, y + 50), radius=8, outline=color, width=5)
    elif kind == "auto":
        d.arc((x - 50, y - 50, x + 50, y + 50), 28, 316, fill=color, width=7)
        d.polygon([(x + 46, y - 28), (x + 68, y - 30), (x + 56, y - 10)], fill=color)
    elif kind == "shop":
        d.rounded_rectangle((x - 48, y - 20, x + 48, y + 48), radius=10, outline=color, width=6)
        d.line((x - 58, y - 20, x - 42, y - 54, x + 42, y - 54, x + 58, y - 20), fill=color, width=6)
    elif kind == "saas":
        d.ellipse((x - 52, y - 52, x + 52, y + 52), outline=color, width=6)
        d.line((x - 52, y, x + 52, y), fill=color, width=5)
        d.line((x, y - 52, x, y + 52), fill=color, width=5)
    elif kind == "support":
        d.arc((x - 50, y - 48, x + 50, y + 52), 210, 510, fill=color, width=7)
        d.rounded_rectangle((x - 64, y - 2, x - 36, y + 36), radius=10, outline=color, width=5)
        d.rounded_rectangle((x + 36, y - 2, x + 64, y + 36), radius=10, outline=color, width=5)
    elif kind == "contact":
        d.rounded_rectangle((x - 58, y - 38, x + 58, y + 38), radius=14, outline=color, width=6)
        d.line((x - 48, y - 26, x, y + 8, x + 48, y - 26), fill=color, width=5)
    else:
        d.line((x - 46, y, x + 46, y), fill=color, width=7)
        d.line((x, y - 46, x, y + 46), fill=color, width=7)


def wrap_text(d, text, xy, width, fill, fnt, gap=10, max_lines=None):
    x, y = xy
    lines = []
    for raw in text.split("\n"):
        words = raw.split()
        current = ""
        for word in words:
            trial = (current + " " + word).strip()
            if d.textbbox((0, 0), trial, font=fnt)[2] <= width:
                current = trial
            else:
                if current:
                    lines.append(current)
                current = word
        if current:
            lines.append(current)
    if max_lines:
        lines = lines[:max_lines]
    for line in lines:
        d.text((x, y), line, fill=fill, font=fnt)
        y += fnt.size + gap
    return y


def story(item, idx):
    img = bg((1080, 1920))
    d = ImageDraw.Draw(img, "RGBA")
    img.alpha_composite(logo(), (60, 54))
    d.text((60, 220), "YC SYSTEMS", fill=CYAN + (255,), font=F["tiny"])
    y = wrap_text(d, item["title"].upper(), (60, 290), 900, WHITE + (255,), F["h2"], 6, max_lines=3)
    d.line((60, y + 34, 260, y + 34), fill=CYAN + (240,), width=4)
    y = wrap_text(d, item["subtitle"], (60, y + 96), 900, WHITE + (235,), F["body"], 12, max_lines=4)
    y += 76
    for chip in item["chips"]:
        w = d.textbbox((0, 0), chip, font=F["small_bold"])[2] + 58
        d.rounded_rectangle((60, y, 60 + w, y + 72), radius=18, fill=BLUE + (235,))
        d.text((90, y + 16), chip, fill=WHITE + (255,), font=F["small_bold"])
        y += 94
    d.rounded_rectangle((60, 1400, 1020, 1650), radius=34, fill=(6, 21, 45, 215), outline=(83, 156, 232, 160), width=2)
    d.text((104, 1448), "Objetivo", fill=CYAN + (255,), font=F["small_bold"])
    wrap_text(d, "Convertir procesos reales en soluciones digitales claras.", (104, 1515), 820, WHITE + (235,), F["body"], 10, max_lines=2)
    d.text((60, 1782), "Smart Solutions. Real Results.", fill=WHITE + (255,), font=F["small_bold"])
    d.text((780, 1782), f"{idx:02d}", fill=GREEN + (255,), font=F["h2"])
    return img.convert("RGB")


def cover(item, idx):
    img = bg((1080, 1080))
    d = ImageDraw.Draw(img, "RGBA")
    img.alpha_composite(logo((260, 86)), (410, 72))
    color = CYAN if idx % 3 == 1 else GREEN if idx % 3 == 2 else BLUE
    d.ellipse((390, 250, 690, 550), outline=color + (230,), width=8)
    kinds = ["start", "web", "system", "auto", "shop", "saas", "support", "contact"]
    draw_icon(d, (540, 400), kinds[idx - 1], color)
    label = item["cover"].upper()
    tw = d.textbbox((0, 0), label, font=F["h2"])[2]
    d.text(((1080 - tw) // 2, 640), label, fill=WHITE + (255,), font=F["h2"])
    d.text((366, 782), "YC SYSTEMS", fill=CYAN + (255,), font=F["small_bold"])
    d.text((312, 838), "Software Products & Business Systems", fill=MUTED + (255,), font=F["small"])
    return img.convert("RGB")


def review(paths, out, cols=4, thumb=(260, 260)):
    pad, label_h = 20, 34
    rows = math.ceil(len(paths) / cols)
    canvas = Image.new("RGB", (pad + cols * (thumb[0] + pad), pad + rows * (thumb[1] + label_h + pad)), (244, 248, 252))
    d = ImageDraw.Draw(canvas)
    small = font(18, True)
    for i, path in enumerate(paths):
        im = Image.open(path).convert("RGB")
        im.thumbnail(thumb, Image.LANCZOS)
        x = pad + (i % cols) * (thumb[0] + pad)
        y = pad + (i // cols) * (thumb[1] + label_h + pad)
        d.rounded_rectangle((x, y, x + thumb[0], y + thumb[1] + label_h), radius=10, fill=(255, 255, 255), outline=(197, 228, 255))
        canvas.paste(im, (x + (thumb[0] - im.width) // 2, y + (thumb[1] - im.height) // 2))
        d.text((x + 8, y + thumb[1] + 8), path.stem, fill=(7, 18, 37), font=small)
    canvas.save(out, quality=94)


def main():
    covers = []
    stories = []
    for idx, item in enumerate(ITEMS, start=1):
        c = OUT / f"{item['slug']}-cover.jpg"
        s = OUT / f"{item['slug']}-story.jpg"
        cover(item, idx).save(c, quality=94, subsampling=0)
        story(item, idx).save(s, quality=94, subsampling=0)
        covers.append(c)
        stories.append(s)
    review(covers, ARTIFACTS / "yc-systems-highlight-covers-review.jpg")
    review(stories, ARTIFACTS / "yc-systems-highlight-stories-review.jpg", cols=4, thumb=(180, 320))
    print(ARTIFACTS / "yc-systems-highlight-covers-review.jpg")
    print(ARTIFACTS / "yc-systems-highlight-stories-review.jpg")


if __name__ == "__main__":
    main()
