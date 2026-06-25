from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(r"C:\Users\Yeica\Projects\YcSystems")
OUT = ROOT / "assets" / "social" / "static-feed-v3"
CONTACT = OUT / "_static-feed-v3-contact-sheet.jpg"
W = H = 1080

ASSETS = {
    "logo": ROOT / "assets" / "brand" / "yc-logo-horizontal-white.png",
    "mark": ROOT / "assets" / "brand" / "yc-logo-mark-transparent.png",
    "nexus_confident": ROOT / "assets" / "brand" / "nexus" / "poses" / "nexus-confident.png",
    "nexus_dashboard": ROOT / "assets" / "brand" / "nexus" / "poses" / "nexus-dashboard.png",
    "nexus_pointing": ROOT / "assets" / "brand" / "nexus" / "poses" / "nexus-pointing.png",
    "nexus_process": ROOT / "assets" / "brand" / "nexus" / "poses" / "nexus-process.png",
    "ghost": ROOT / "assets" / "screenshots" / "ghostwear-store-live.png",
    "antony": ROOT / "assets" / "screenshots" / "antonyrealestate-live.png",
    "lps": ROOT / "assets" / "screenshots" / "lps-company-live.png",
    "cleanloop": ROOT / "assets" / "screenshots" / "cleanloop-role-demo.png",
    "soc": ROOT / "assets" / "screenshots" / "soc-dashboard.png",
    "broker": ROOT / "assets" / "screenshots" / "brokercontrol-dashboard.png",
}

COL = {
    "navy": "#06101f",
    "panel": "#0b1e34",
    "blue": "#2563eb",
    "cyan": "#00d8ff",
    "green": "#5cff5c",
    "white": "#ffffff",
    "muted": "#c5d2e3",
}


def rgb(hex_color):
    hex_color = hex_color.lstrip("#")
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))


def font(size, bold=False):
    paths = [
        Path(r"C:\Windows\Fonts\segoeuib.ttf") if bold else Path(r"C:\Windows\Fonts\segoeui.ttf"),
        Path(r"C:\Windows\Fonts\arialbd.ttf") if bold else Path(r"C:\Windows\Fonts\arial.ttf"),
    ]
    for p in paths:
        if p.exists():
            return ImageFont.truetype(str(p), size)
    return ImageFont.load_default()


F = {
    "brand": font(20, True),
    "eyebrow": font(25, True),
    "title": font(74, True),
    "title2": font(64, True),
    "subtitle": font(34, False),
    "pill": font(24, True),
    "footer": font(24, True),
    "tag": font(22, True),
}


def bg():
    im = Image.new("RGB", (W, H), rgb(COL["navy"]))
    px = im.load()
    for y in range(H):
        for x in range(W):
            dx, dy = x / W, y / H
            blue = max(0, 1 - ((dx - .82) ** 2 + (dy - .10) ** 2) / .45)
            green = max(0, 1 - ((dx - .08) ** 2 + (dy - .88) ** 2) / .56)
            px[x, y] = (
                int(6 + 22 * blue + 5 * green),
                int(16 + 70 * blue + 38 * green),
                int(31 + 125 * blue + 30 * green),
            )
    return im.convert("RGBA")


BG = bg()


def contain(path, size):
    im = Image.open(path).convert("RGBA")
    im.thumbnail(size, Image.LANCZOS)
    canvas = Image.new("RGBA", size, (0, 0, 0, 0))
    canvas.alpha_composite(im, ((size[0] - im.width)//2, (size[1] - im.height)//2))
    return canvas


def cover(path, size, zoom=1.0):
    im = Image.open(path).convert("RGB")
    iw, ih = im.size
    sw, sh = size
    scale = max(sw/iw, sh/ih) * zoom
    im = im.resize((int(iw*scale), int(ih*scale)), Image.LANCZOS)
    x = max(0, (im.width - sw)//2)
    y = max(0, (im.height - sh)//2)
    return im.crop((x, y, x+sw, y+sh)).convert("RGBA")


def rounded(base, im, box, radius=34):
    x, y, w, h = box
    im = im.resize((w, h), Image.LANCZOS).convert("RGBA")
    shadow = Image.new("RGBA", (w+80, h+80), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.rounded_rectangle((40, 40, w+40, h+40), radius=radius, fill=(0, 0, 0, 145))
    shadow = shadow.filter(ImageFilter.GaussianBlur(24))
    base.alpha_composite(shadow, (x-40, y-28))
    mask = Image.new("L", (w, h), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, w, h), radius=radius, fill=255)
    layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    layer.paste(im, (x, y), mask)
    base.alpha_composite(layer)


def wrap(draw, text, xy, width, fnt, fill, gap=8, max_lines=3):
    words = text.split()
    lines, cur = [], ""
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
    lines = lines[:max_lines]
    x, y = xy
    for line in lines:
        draw.text((x, y), line, font=fnt, fill=fill)
        y = draw.textbbox((x, y), line, font=fnt)[3] + gap
    return y


def logo(base):
    base.alpha_composite(contain(ASSETS["logo"], (170, 65)), (52, 48))


def footer(draw):
    draw.text((56, 995), "YC Systems", font=F["footer"], fill=COL["white"])
    draw.text((56, 1028), "Smart Solutions. Real Results.", font=F["tag"], fill=COL["cyan"])


def tags(draw, items, y=920):
    x = 56
    for i, item in enumerate(items[:3]):
        color = COL["green"] if i == 0 else COL["cyan"]
        bbox = draw.textbbox((0, 0), item, font=F["tag"])
        w = bbox[2] + 38
        draw.rounded_rectangle((x, y, x+w, y+44), radius=22, fill=rgb(COL["panel"]), outline=color, width=2)
        draw.text((x+19, y+9), item, font=F["tag"], fill=color)
        x += w + 12


def static_nexus(filename, eyebrow, title, subtitle, nexus, tag_items):
    im = BG.copy()
    d = ImageDraw.Draw(im)
    logo(im)
    d.text((56, 150), eyebrow.upper(), font=F["eyebrow"], fill=COL["cyan"])
    y = wrap(d, title, (56, 210), 650, F["title"], COL["white"], 8, 3)
    wrap(d, subtitle, (58, y + 24), 575, F["subtitle"], COL["muted"], 8, 2)
    im.alpha_composite(contain(ASSETS[nexus], (410, 520)), (650, 420))
    tags(d, tag_items)
    footer(d)
    save(im, filename)


def static_case(filename, eyebrow, title, subtitle, shot, tag_items):
    im = BG.copy()
    d = ImageDraw.Draw(im)
    logo(im)
    d.text((56, 145), eyebrow.upper(), font=F["eyebrow"], fill=COL["cyan"])
    title_end = wrap(d, title, (56, 200), 850, F["title2"], COL["white"], 10, 2)
    subtitle_y = max(title_end + 22, 345)
    wrap(d, subtitle, (58, subtitle_y), 790, F["subtitle"], COL["muted"], 8, 2)
    rounded(im, cover(ASSETS[shot], (850, 420), 1.0), (115, 500, 850, 420), 34)
    tags(d, tag_items, 940)
    footer(d)
    save(im, filename)


def static_product(filename, eyebrow, title, subtitle, shot, tag_items):
    im = BG.copy()
    d = ImageDraw.Draw(im)
    logo(im)
    d.text((56, 145), eyebrow.upper(), font=F["eyebrow"], fill=COL["cyan"])
    title_end = wrap(d, title, (56, 200), 800, F["title2"], COL["white"], 10, 2)
    subtitle_y = max(title_end + 22, 345)
    wrap(d, subtitle, (58, subtitle_y), 740, F["subtitle"], COL["muted"], 8, 2)
    rounded(im, cover(ASSETS[shot], (620, 350), 1.0), (58, 552, 620, 350), 30)
    im.alpha_composite(contain(ASSETS["nexus_dashboard"], (290, 360)), (740, 560))
    tags(d, tag_items, 920)
    footer(d)
    save(im, filename)


def save(im, filename):
    OUT.mkdir(parents=True, exist_ok=True)
    im.convert("RGB").save(OUT / filename, quality=94, optimize=True)


def main():
    items = [
        ("01-web-confianza-v3.jpg", static_nexus, ("Educativo", "Una web debe vender confianza", "Claridad, seguridad y contacto fácil.", "nexus_pointing", ["Web", "Confianza", "Claridad"])),
        ("02-ghostwear-caso-v3.jpg", static_case, ("Caso real", "GhostWear: tienda lista para vender", "Catálogo visual, carrito y pedido directo.", "ghost", ["Cliente real", "E-commerce", "WhatsApp"])),
        ("03-excel-sistema-v3.jpg", static_nexus, ("Operación", "Excel no siempre alcanza", "Cuando creces, el proceso necesita estructura.", "nexus_process", ["Sistema", "Orden", "Reportes"])),
        ("04-antony-caso-v3.jpg", static_case, ("Caso real", "Antony Real Estate: confianza digital", "Presencia profesional para un asesor inmobiliario.", "antony", ["Asesor", "Web", "Confianza"])),
        ("05-automatizar-v3.jpg", static_nexus, ("Automatización", "Automatizar es ganar orden", "Menos tareas repetidas. Más control.", "nexus_dashboard", ["Tiempo", "Control", "Claridad"])),
        ("06-lps-caso-v3.jpg", static_case, ("Caso real", "LPS Company: marca empresarial", "Base digital para presentar marcas y servicios.", "lps", ["Empresa", "Marca", "Presencia"])),
        ("07-tienda-dudas-v3.jpg", static_nexus, ("E-commerce", "Tu tienda debe responder dudas", "Menos preguntas repetidas. Más confianza.", "nexus_confident", ["Catálogo", "Carrito", "WhatsApp"])),
        ("08-cleanloop-v3.jpg", static_product, ("Producto", "CleanLoop: lavanderías con control", "Pedidos, rutas, roles y reportes.", "cleanloop", ["Pedidos", "Rutas", "Reportes"])),
        ("09-saas-proceso-v3.jpg", static_nexus, ("SaaS", "Un SaaS nace de un proceso", "Primero claridad. Después producto.", "nexus_process", ["MVP", "Proceso", "Escala"])),
        ("10-soc-v3.jpg", static_product, ("Producto", "SOC: operación comercial clara", "Reservas, estados, reportes y control.", "soc", ["Reservas", "Estados", "Control"])),
        ("11-mantenimiento-v3.jpg", static_nexus, ("Soporte", "Una web también se mantiene", "Tu presencia digital debe seguir vigente.", "nexus_confident", ["Soporte", "Contenido", "Continuidad"])),
        ("12-brokercontrol-v3.jpg", static_product, ("Producto", "BrokerControl: seguimiento inmobiliario", "Clientes, pipeline, agenda y CRM.", "broker", ["Pipeline", "Agenda", "CRM"])),
        ("13-dashboard-v3.jpg", static_nexus, ("Datos", "Un dashboard debe ayudar a decidir", "No son gráficos. Son respuestas.", "nexus_dashboard", ["Datos", "Decisión", "Alertas"])),
        ("14-nexus-v3.jpg", static_nexus, ("Identidad", "Nexus explica cómo construimos", "Analizar, diseñar, construir y entregar.", "nexus_pointing", ["Nexus", "Proceso", "Software"])),
        ("15-crm-v3.jpg", static_nexus, ("CRM", "Un CRM protege oportunidades", "Seguimiento claro para vender mejor.", "nexus_confident", ["Clientes", "Etapas", "Seguimiento"])),
        ("16-yc-construye-v3.jpg", static_nexus, ("YC Systems", "Soluciones para operar mejor", "Webs, tiendas, sistemas, SaaS y automatización.", "nexus_process", ["Web", "SaaS", "Sistemas"])),
        ("17-mobile-v3.jpg", static_nexus, ("Móvil", "La experiencia móvil decide", "Si no se lee bien, la oportunidad se enfría.", "nexus_pointing", ["Mobile", "Velocidad", "Contacto"])),
        ("18-cotizar-v3.jpg", static_nexus, ("Diagnóstico", "Antes de cotizar hay que entender", "Objetivo, alcance, prioridad y resultado.", "nexus_process", ["Alcance", "Prioridad", "Resultado"])),
        ("19-orden-v3.jpg", static_nexus, ("Proceso", "Orden antes que tecnología", "La solución correcta nace de un flujo claro.", "nexus_dashboard", ["Analizar", "Diseñar", "Construir"])),
        ("20-software-activo-v3.jpg", static_nexus, ("Visión", "Software como activo del negocio", "Operación, confianza y crecimiento.", "nexus_confident", ["Operación", "Confianza", "Crecimiento"])),
    ]
    for filename, fn, args in items:
        fn(filename, *args)

    tiles = []
    for p in sorted(OUT.glob("[0-9][0-9]-*.jpg")):
        im = Image.open(p).convert("RGB")
        im.thumbnail((206, 206), Image.LANCZOS)
        tile = Image.new("RGB", (226, 252), (236, 243, 250))
        tile.paste(im, ((226 - im.width)//2, 8))
        ImageDraw.Draw(tile).text((10, 222), p.stem[:24], font=font(15, True), fill=(15, 23, 42))
        tiles.append(tile)
    sheet = Image.new("RGB", (5*226, 4*252), (248, 250, 252))
    for i, tile in enumerate(tiles):
        sheet.paste(tile, ((i % 5)*226, (i//5)*252))
    sheet.save(CONTACT, quality=92)
    print(OUT)
    print(CONTACT)


if __name__ == "__main__":
    main()
