from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import csv
import math


ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "assets" / "social" / "active-feed"
ARTIFACTS = ROOT / "artifacts"
OUT.mkdir(parents=True, exist_ok=True)
ARTIFACTS.mkdir(parents=True, exist_ok=True)

W = H = 1080
NAVY = (3, 12, 28)
BLUE = (37, 99, 235)
CYAN = (0, 221, 226)
GREEN = (79, 255, 72)
WHITE = (248, 251, 255)
MUTED = (174, 192, 218)


def font(size, bold=False):
    paths = [
        "C:/Windows/Fonts/bahnschrift.ttf",
        "C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf",
        "C:/Windows/Fonts/segoeui.ttf",
    ]
    for path in paths:
        if Path(path).exists():
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


F = {
    "tag": font(26, True),
    "small": font(28),
    "small_bold": font(30, True),
    "body": font(36),
    "body_bold": font(38, True),
    "h2": font(58, True),
    "h1": font(86, True),
}


POSTS = [
    ("01-web-confianza", "WEB PROFESIONAL", "Tu negocio necesita una web que venda confianza", "Presenta tu oferta, genera confianza y convierte visitas en contactos reales.", "Escribe WEB"),
    ("02-sistema-excel-whatsapp", "SISTEMAS INTERNOS", "Si todo depende de Excel y WhatsApp, necesitas un sistema", "Clientes, tareas, formularios, estados y reportes en un solo lugar.", "Escribe SISTEMA"),
    ("03-automatizar-orden", "AUTOMATIZACION", "Automatizar no es lujo, es orden", "Menos tareas repetidas, menos errores y mas tiempo para crecer.", "Escribe AUTO"),
    ("04-tienda-vende", "TIENDAS ONLINE", "Una tienda online debe vender, no solo verse bonita", "Catalogo, carrito, pedidos, WhatsApp y experiencia movil lista para vender.", "Escribe TIENDA"),
    ("05-saas-mvp", "SAAS / APP", "Tu idea puede convertirse en un SaaS MVP", "Definimos el problema, construimos la primera version y probamos con usuarios reales.", "Escribe SAAS"),
    ("06-mantenimiento", "SOPORTE DIGITAL", "Mantenimiento para que tu web no se quede atras", "Mejoras, contenido, cambios, soporte y continuidad despues de publicar.", "Escribe SOPORTE"),
    ("07-soluciones-reales", "YC SYSTEMS", "Creamos soluciones para negocios reales", "Webs, tiendas, sistemas, dashboards, automatizaciones, SaaS y mantenimiento.", "Cuentame tu proceso"),
    ("08-crm-oportunidades", "CRM", "Un CRM evita que pierdas oportunidades", "Seguimiento claro para clientes, ventas, tareas, agenda y proximos pasos.", "Escribe CRM"),
    ("09-dashboard-datos", "DASHBOARDS", "Un dashboard te ayuda a decidir mas rapido", "Datos claros para ventas, reservas, inventario, pagos, tareas y alertas.", "Escribe DASHBOARD"),
    ("10-proceso-primero", "METODO YC", "Primero entendemos tu proceso, luego construimos", "Analizamos que se repite, que se pierde, que se mide y que debe mejorar.", "Escribe PROYECTO"),
    ("11-reservas-control", "OPERACION", "Reservas, clientes y tareas no deben vivir regados", "Centraliza tu operacion para que el equipo pueda trabajar con mas claridad.", "Quiero orden"),
    ("12-negocio-crece", "CRECIMIENTO", "Cuando tu negocio crece, el desorden tambien crece", "Un sistema bien pensado sostiene el crecimiento sin depender de memoria.", "Quiero sistema"),
    ("13-catalogo-profesional", "CATALOGO DIGITAL", "Tus productos merecen una presentacion profesional", "Una experiencia clara ayuda al cliente a entender, confiar y comprar.", "Quiero catalogo"),
    ("14-reportes", "REPORTES", "Si tus reportes se hacen a mano, estas perdiendo tiempo", "Automatiza indicadores para ver lo importante sin rehacerlo cada semana.", "Quiero reportes"),
    ("15-app-movil", "APPS", "Una app debe resolver un problema real", "Usuarios, roles, flujos, notificaciones y datos conectados a tu negocio.", "Quiero app"),
    ("16-transformacion", "TRANSFORMACION DIGITAL", "Tecnologia clara para operar mejor", "YC Systems convierte procesos reales en soluciones digitales listas para crecer.", "Iniciar proyecto"),
]


def text_lines(draw, text, width, fnt):
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
    return lines


def draw_wrapped(draw, text, xy, width, fnt, fill, gap=8, max_lines=None):
    x, y = xy
    lines = text_lines(draw, text, width, fnt)
    if max_lines:
        lines = lines[:max_lines]
    for line in lines:
        draw.text((x, y), line, fill=fill, font=fnt)
        y += fnt.size + gap
    return y


def background():
    img = Image.new("RGBA", (W, H), NAVY + (255,))
    px = img.load()
    for y in range(H):
        for x in range(W):
            dx = (x - W * 0.80) / W
            dy = (y - H * 0.22) / H
            glow = max(0, 1 - math.sqrt(dx * dx + dy * dy) * 3.0)
            dx2 = (x - W * 0.05) / W
            dy2 = (y - H * 0.90) / H
            glow2 = max(0, 1 - math.sqrt(dx2 * dx2 + dy2 * dy2) * 4.2)
            px[x, y] = (
                int(NAVY[0] + glow * 12),
                int(NAVY[1] + glow * 24 + glow2 * 14),
                int(NAVY[2] + glow * 58 + glow2 * 18),
                255,
            )
    d = ImageDraw.Draw(img, "RGBA")
    for r in (360, 480, 600):
        d.arc((510, 110, 510 + r * 2, 110 + r * 2), 188, 326, fill=BLUE + (70,), width=3)
    d.ellipse((760, 200, 1260, 700), outline=CYAN + (18,), width=2)
    d.ellipse((-240, 720, 300, 1260), outline=GREEN + (18,), width=2)
    return img


def contain(path, size):
    img = Image.open(path).convert("RGBA")
    img.thumbnail(size, Image.LANCZOS)
    canvas = Image.new("RGBA", size, (0, 0, 0, 0))
    canvas.alpha_composite(img, ((size[0] - img.width) // 2, (size[1] - img.height) // 2))
    return canvas


def paste_logo(base):
    logo = contain(ROOT / "assets" / "brand" / "yc-logo-horizontal-white.png", (248, 82))
    base.alpha_composite(logo, (772, 44))


def paste_nexus(base):
    src = Image.open(ROOT / "assets" / "brand" / "nexus" / "nexus-social.png").convert("RGBA")
    crop = src.crop((0, 0, 650, 1060))
    crop.thumbnail((540, 870), Image.LANCZOS)
    # Soft fade on the right edge so Nexus blends with the poster.
    original_alpha = crop.getchannel("A")
    fade = Image.new("L", crop.size, 255)
    fp = fade.load()
    for y in range(crop.height):
        for x in range(crop.width):
            if x > crop.width * 0.72:
                fp[x, y] = int(255 * max(0, 1 - (x - crop.width * 0.72) / (crop.width * 0.28)))
    mask = Image.new("L", crop.size, 0)
    mask_px = mask.load()
    alpha_px = original_alpha.load()
    fade_px = fade.load()
    for y in range(crop.height):
        for x in range(crop.width):
            mask_px[x, y] = int(alpha_px[x, y] * fade_px[x, y] / 255)
    crop.putalpha(mask)
    base.alpha_composite(crop, (530, 178))


def draw_value_icons(draw):
    labels = ["Claro", "Rapido", "Confiable", "Escalable"]
    x = 62
    for i, label in enumerate(labels):
        bx = x + i * 185
        draw.rounded_rectangle((bx, 900, bx + 155, 980), radius=18, fill=(6, 24, 52, 190), outline=BLUE + (120,), width=2)
        draw.ellipse((bx + 18, 920, bx + 50, 952), outline=(CYAN if i % 2 == 0 else GREEN) + (220,), width=3)
        draw.text((bx + 62, 924), label, fill=WHITE + (235,), font=F["tag"])


def render(post, index):
    slug, kicker, title, body, cta = post
    img = background()
    d = ImageDraw.Draw(img, "RGBA")
    paste_logo(img)
    paste_nexus(img)

    d.text((62, 64), "YC SYSTEMS", fill=CYAN + (255,), font=F["tag"])
    d.text((62, 120), kicker, fill=GREEN + (255,) if index % 3 == 0 else CYAN + (255,), font=F["small_bold"])

    y = 190
    lines = text_lines(d, title.upper(), 610, F["h1"])
    if len(lines) > 3:
        lines = text_lines(d, title.upper(), 650, F["h2"])
        title_font = F["h2"]
    else:
        title_font = F["h1"]
    for line in lines[:4]:
        d.text((58, y), line, fill=WHITE + (255,), font=title_font)
        y += title_font.size + 4

    d.line((62, y + 24, 230, y + 24), fill=CYAN + (235,), width=4)
    y = draw_wrapped(d, body, (62, y + 82), 520, F["body"], WHITE + (230,), 10, max_lines=4)

    d.rounded_rectangle((62, 742, 530, 842), radius=24, fill=BLUE + (235,), outline=CYAN + (130,), width=2)
    d.text((96, 770), cta, fill=WHITE + (255,), font=F["body_bold"])

    d.rounded_rectangle((604, 750, 1018, 846), radius=24, fill=(6, 24, 52, 205), outline=CYAN + (110,), width=2)
    d.text((650, 774), "YC Systems", fill=WHITE + (245,), font=F["body_bold"])

    draw_value_icons(d)
    d.text((62, 1028), "SMART SOLUTIONS.", fill=WHITE + (245,), font=F["small_bold"])
    d.text((360, 1028), "REAL RESULTS.", fill=CYAN + (255,), font=F["small_bold"])
    return img.convert("RGB")


def make_review(paths):
    thumb = 250
    pad = 18
    label_h = 32
    cols = 4
    rows = math.ceil(len(paths) / cols)
    canvas = Image.new("RGB", (pad + cols * (thumb + pad), pad + rows * (thumb + label_h + pad)), (244, 248, 252))
    d = ImageDraw.Draw(canvas)
    label_font = font(16, True)
    for i, path in enumerate(paths):
        img = Image.open(path).convert("RGB")
        img.thumbnail((thumb, thumb), Image.LANCZOS)
        x = pad + (i % cols) * (thumb + pad)
        y = pad + (i // cols) * (thumb + label_h + pad)
        d.rounded_rectangle((x, y, x + thumb, y + thumb + label_h), radius=10, fill=(255, 255, 255), outline=(190, 225, 255))
        canvas.paste(img, (x + (thumb - img.width) // 2, y))
        d.text((x + 8, y + thumb + 8), path.stem, fill=(5, 18, 38), font=label_font)
    out = ARTIFACTS / "yc-systems-active-feed-review.jpg"
    canvas.save(out, quality=94)
    return out


def update_queue(paths):
    queue = ROOT / "content" / "yc-systems-facebook-30-day-3x-queue.tsv"
    with queue.open(encoding="utf-8", newline="") as f:
        rows = list(csv.reader(f, delimiter="\t"))
    ready_index = 0
    for row in rows[1:]:
        if len(row) >= 10 and row[9] == "Ready":
            row[5] = paths[ready_index % len(paths)].relative_to(ROOT).as_posix()
            ready_index += 1
    with queue.open("w", encoding="utf-8", newline="") as f:
        csv.writer(f, delimiter="\t", quotechar='"', quoting=csv.QUOTE_ALL, lineterminator="\n").writerows(rows)
    return ready_index


def main():
    paths = []
    for i, post in enumerate(POSTS, start=1):
        path = OUT / f"{post[0]}.jpg"
        render(post, i).save(path, quality=94, subsampling=0)
        paths.append(path)
    review = make_review(paths)
    count = update_queue(paths)
    print(review)
    print(f"updated {count} ready rows")


if __name__ == "__main__":
    main()
