from pathlib import Path
from textwrap import wrap

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "social" / "commercial-kit"
OUT.mkdir(parents=True, exist_ok=True)

W, H = 1080, 1350
BLUE = (37, 99, 235)
CYAN = (30, 212, 255)
NAVY = (7, 14, 32)
NAVY_2 = (11, 24, 45)
WHITE = (255, 255, 255)
MUTED = (183, 198, 218)
GREEN = (84, 255, 82)


def font(size, bold=False):
    name = "segoeuib.ttf" if bold else "segoeui.ttf"
    path = Path("C:/Windows/Fonts") / name
    return ImageFont.truetype(str(path), size=size)


F = {
    "eyebrow": font(26, True),
    "title": font(70, True),
    "title_small": font(58, True),
    "body": font(35, False),
    "body_bold": font(35, True),
    "meta": font(24, True),
    "small": font(24, False),
    "cta": font(31, True),
}


def gradient_bg():
    img = Image.new("RGB", (W, H), NAVY)
    px = img.load()
    for y in range(H):
        for x in range(W):
            fx = x / W
            fy = y / H
            glow = max(0, 1 - ((fx - 0.88) ** 2 + (fy - 0.18) ** 2) * 5)
            green = max(0, 1 - ((fx - 0.05) ** 2 + (fy - 0.55) ** 2) * 4)
            r = int(7 + 10 * fy + 10 * glow)
            g = int(14 + 34 * glow + 35 * green)
            b = int(32 + 62 * glow + 18 * green)
            px[x, y] = (r, g, b)
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    for x in range(0, W, 72):
        od.line((x, 0, x, H), fill=(255, 255, 255, 14), width=1)
    for y in range(0, H, 72):
        od.line((0, y, W, y), fill=(255, 255, 255, 13), width=1)
    return Image.alpha_composite(img.convert("RGBA"), overlay)


def paste_contain(base, src_path, box, radius=30, border=(69, 213, 255, 80), crop=False):
    x, y, w, h = box
    src = Image.open(src_path).convert("RGBA")
    if crop:
        ratio = max(w / src.width, h / src.height)
    else:
        ratio = min(w / src.width, h / src.height)
    nw, nh = int(src.width * ratio), int(src.height * ratio)
    src = src.resize((nw, nh), Image.Resampling.LANCZOS)
    if crop:
        left = max(0, (nw - w) // 2)
        top = max(0, (nh - h) // 2)
        src = src.crop((left, top, left + w, top + h))
    canvas = Image.new("RGBA", (w, h), (12, 21, 36, 255))
    canvas.alpha_composite(src, ((w - src.width) // 2, (h - src.height) // 2))
    mask = Image.new("L", (w, h), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, w, h), radius=radius, fill=255)
    shadow = Image.new("RGBA", (w, h), (0, 0, 0, 165))
    shadow = shadow.filter(ImageFilter.GaussianBlur(22))
    base.alpha_composite(shadow, (x + 10, y + 16))
    base.paste(canvas, (x, y), mask)
    d = ImageDraw.Draw(base)
    d.rounded_rectangle((x, y, x + w, y + h), radius=radius, outline=border, width=2)


def logo(base, variant="white", x=58, y=54, w=230):
    name = "yc-logo-horizontal-white.png" if variant == "white" else "yc-logo-horizontal-transparent.png"
    src = Image.open(ROOT / "assets" / "brand" / name).convert("RGBA")
    ratio = w / src.width
    src = src.resize((w, int(src.height * ratio)), Image.Resampling.LANCZOS)
    base.alpha_composite(src, (x, y))


def text_lines(draw, xy, text, fnt, fill, max_width, line_gap=12):
    x, y = xy
    lines = []
    for raw in text.split("\n"):
        if not raw.strip():
            lines.append("")
            continue
        words = raw.split()
        line = ""
        for word in words:
            test = (line + " " + word).strip()
            if draw.textlength(test, font=fnt) <= max_width:
                line = test
            else:
                if line:
                    lines.append(line)
                line = word
        if line:
            lines.append(line)
    for line in lines:
        draw.text((x, y), line, font=fnt, fill=fill)
        y += fnt.size + line_gap
    return y


def pill(draw, x, y, text, fill=(11, 24, 45, 235), outline=(30, 212, 255, 115), color=WHITE):
    pad_x = 22
    tw = int(draw.textlength(text, font=F["meta"]))
    h = 48
    draw.rounded_rectangle((x, y, x + tw + pad_x * 2, y + h), radius=22, fill=fill, outline=outline, width=1)
    draw.text((x + pad_x, y + 10), text, font=F["meta"], fill=color)
    return x + tw + pad_x * 2 + 12


def cta(draw, text, y=1238):
    draw.rounded_rectangle((58, y, 1022, y + 66), radius=24, fill=(GREEN[0], GREEN[1], GREEN[2], 255))
    draw.text((92, y + 15), text, font=F["cta"], fill=(3, 16, 28))
    draw.text((820, y + 17), "yc.systems", font=F["meta"], fill=(3, 16, 28))


def base(label, number):
    img = gradient_bg()
    d = ImageDraw.Draw(img)
    logo(img, "white")
    d.text((58, 185), f"{number:02d} / {label.upper()}", font=F["eyebrow"], fill=CYAN)
    return img, d


def save(img, name):
    img.convert("RGB").save(OUT / name, quality=95, subsampling=0)


def post_ecosystem():
    img, d = base("Ecosistema", 1)
    text_lines(d, (58, 245), "YC Systems construye software que vende y organiza negocios", F["title_small"], WHITE, 900, 10)
    text_lines(d, (58, 440), "Productos SaaS, tiendas online, CRM, dashboards, apps y automatizaciones con enfoque comercial.", F["body"], MUTED, 860, 12)
    y = 620
    for title, desc in [
        ("SOC", "Sales Operations Center"),
        ("BrokerControl", "CRM inmobiliario"),
        ("CleanLoop", "SaaS para lavanderías"),
        ("GhostWear", "Cliente e-commerce real"),
    ]:
        d.rounded_rectangle((58, y, 1022, y + 104), radius=28, fill=(11, 24, 45, 238), outline=(30, 212, 255, 95), width=2)
        d.text((90, y + 22), title, font=F["body_bold"], fill=WHITE)
        d.text((420, y + 31), desc, font=F["body"], fill=MUTED)
        y += 126
    cta(d, "¿Quieres crear o mejorar tu sistema? Hablemos")
    save(img, "01-yc-systems-ecosystem.jpg")


def post_products():
    img, d = base("Productos", 2)
    text_lines(d, (58, 245), "Productos propios para operaciones que necesitan control", F["title_small"], WHITE, 900, 10)
    paste_contain(img, ROOT / "assets/screenshots/cleanloop-role-demo.png", (58, 510, 440, 300), 28, crop=True)
    paste_contain(img, ROOT / "assets/screenshots/brokercontrol-dashboard.png", (545, 510, 477, 300), 28, crop=True)
    paste_contain(img, ROOT / "assets/screenshots/soc-dashboard.png", (58, 850, 964, 270), 28, crop=True)
    y = 1160
    x = 58
    for tag in ["SaaS", "CRM", "Dashboards", "Multi-role", "Mobile-ready"]:
        x = pill(d, x, y, tag, color=WHITE)
    cta(d, "Convierte tu proceso en software")
    save(img, "02-products-that-operate.jpg")


def case_post(num, label, title, body, screenshot, tags, out_name, cta_text):
    img, d = base(label, num)
    text_lines(d, (58, 245), title, F["title_small"], WHITE, 900, 8)
    text_lines(d, (58, 455), body, F["body"], MUTED, 900, 10)
    paste_contain(img, screenshot, (58, 690, 964, 420), 32, crop=True)
    x = 58
    for tag in tags:
        x = pill(d, x, 1140, tag)
        if x > 850:
            break
    cta(d, cta_text)
    save(img, out_name)


def post_offer():
    img, d = base("Páginas web", 7)
    text_lines(d, (58, 245), "Tu página debe vender confianza antes de que te escriban", F["title_small"], WHITE, 900, 8)
    text_lines(d, (58, 450), "Creamos presencia digital clara para marcas, servicios y negocios que necesitan verse serios y convertir visitas en conversaciones.", F["body"], MUTED, 900, 10)
    paste_contain(img, ROOT / "assets/screenshots/lucianowash-home.png", (58, 670, 460, 350), 28, crop=True)
    paste_contain(img, ROOT / "assets/screenshots/creditpilot-home.png", (560, 670, 462, 350), 28, crop=True)
    x = 58
    for tag in ["Landing", "Sitio web", "SEO base", "Formulario", "Mobile"]:
        x = pill(d, x, 1070, tag)
    cta(d, "Solicita una pagina lista para vender")
    save(img, "07-websites-that-sell-trust.jpg")


def post_internal_systems():
    img, d = base("Sistemas", 8)
    text_lines(d, (58, 245), "Si tu negocio depende de Excel y WhatsApp, ya necesitas sistema", F["title_small"], WHITE, 900, 8)
    text_lines(d, (58, 455), "Clientes, tareas, pagos, reservas, reportes y seguimiento pueden vivir en una plataforma hecha para tu forma de operar.", F["body"], MUTED, 900, 10)
    y = 665
    for title, desc in [
        ("Diagnostico", "Entendemos el flujo real del negocio"),
        ("Sistema", "Creamos pantallas, roles y procesos"),
        ("Mantenimiento", "Mejoramos y damos soporte mensual"),
    ]:
        d.rounded_rectangle((58, y, 1022, y + 118), radius=28, fill=(11, 24, 45, 238), outline=(30, 212, 255, 95), width=2)
        d.text((90, y + 20), title, font=F["body_bold"], fill=WHITE)
        d.text((90, y + 68), desc, font=F["small"], fill=MUTED)
        y += 145
    cta(d, "Escribe SISTEMA y revisamos tu caso")
    save(img, "08-internal-systems-offer.jpg")


def post_start_project():
    img, d = base("Contacto", 9)
    text_lines(d, (58, 245), "Cuéntanos qué quieres construir y te respondemos con una ruta inicial", F["title_small"], WHITE, 900, 8)
    y = 570
    for item in ["Pagina web profesional", "Tienda online", "CRM o sistema interno", "SaaS MVP", "Dashboard operativo", "Mantenimiento mensual"]:
        d.ellipse((64, y + 14, 88, y + 38), fill=CYAN)
        d.text((112, y), item, font=F["body_bold"], fill=WHITE)
        y += 78
    text_lines(d, (58, 1085), "RD, USA y Canada\nProyectos reales. Software funcional. Resultados presentables.", F["body"], MUTED, 900, 10)
    cta(d, "Empieza en ycastillog.github.io/YcSystems")
    save(img, "09-start-your-project.jpg")


post_ecosystem()
post_products()
case_post(
    3,
    "Caso real",
    "GhostWear: tienda online real para vender con dominio propio",
    "Catálogo visual, productos, carrito, experiencia móvil y pedido por WhatsApp para una marca streetwear.",
    ROOT / "assets/screenshots/ghostwear-home.png",
    ["Cliente real", "E-commerce", "WhatsApp", "Mobile"],
    "03-ghostwear-client-case.jpg",
    "¿Quieres una tienda como esta?",
)
case_post(
    4,
    "SaaS",
    "CleanLoop: plataforma operativa para lavanderías",
    "Clientes, pedidos, recogidas, entregas, drivers, pagos, mapas, roles y panel administrativo.",
    ROOT / "assets/screenshots/cleanloop-role-demo.png",
    ["SaaS", "Roles", "API", "Mobile"],
    "04-cleanloop-saas-platform.jpg",
    "Hablemos de tu SaaS MVP",
)
case_post(
    5,
    "CRM",
    "BrokerControl: CRM para operaciones inmobiliarias",
    "Pipeline, clientes, reservas, firmas, documentos, reportes y seguimiento comercial en un solo lugar.",
    ROOT / "assets/screenshots/brokercontrol-dashboard.png",
    ["CRM", "Real estate", "Reportes", "Pipeline"],
    "05-brokercontrol-crm.jpg",
    "Construyamos tu sistema interno",
)
case_post(
    6,
    "Dashboard",
    "SOC: dashboard para controlar operaciones de ventas",
    "Vista operativa para inventario, reservas, separaciones, legal, reportes y decisiones rápidas.",
    ROOT / "assets/screenshots/soc-dashboard.png",
    ["Dashboard", "Operaciones", "Ventas", "Control"],
    "06-soc-operations-dashboard.jpg",
    "Necesitas visibilidad en tu negocio?",
)
post_offer()
post_internal_systems()
post_start_project()

print(f"Generated {len([p for p in OUT.glob('*.jpg') if not p.name.startswith('_')])} commercial posts in {OUT}")
