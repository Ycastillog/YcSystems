from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import subprocess

ROOT = Path(r"C:\Users\Yeica\Projects\YcSystems")
OUT = ROOT / "assets" / "social" / "reels"
FRAMES_ROOT = ROOT / "output" / "videos" / "auto-reels-frames"
CONTACT = OUT / "_reels-contact-sheet.jpg"
FFMPEG = Path(r"C:\Users\Yeica\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.1.1-full_build\bin\ffmpeg.exe")

W, H, FPS = 1080, 1920, 15

ASSETS = {
    "logo": ROOT / "assets" / "brand" / "yc-logo-horizontal-white.png",
    "mark": ROOT / "assets" / "brand" / "yc-logo-mark-transparent.png",
    "nexus_confident": ROOT / "assets" / "brand" / "nexus" / "poses" / "nexus-confident.png",
    "nexus_dashboard": ROOT / "assets" / "brand" / "nexus" / "poses" / "nexus-dashboard.png",
    "nexus_pointing": ROOT / "assets" / "brand" / "nexus" / "poses" / "nexus-pointing.png",
    "nexus_process": ROOT / "assets" / "brand" / "nexus" / "poses" / "nexus-process.png",
    "ghost": ROOT / "assets" / "screenshots" / "ghostwear-store-live.png",
    "cleanloop": ROOT / "assets" / "screenshots" / "cleanloop-role-demo.png",
    "soc": ROOT / "assets" / "screenshots" / "soc-dashboard.png",
}

COL = {
    "navy": (5, 14, 28),
    "panel": (9, 29, 49),
    "white": (255, 255, 255),
    "muted": (188, 202, 220),
    "cyan": (0, 216, 255),
    "green": (92, 255, 92),
    "blue": (37, 99, 235),
}


def font(size, bold=False):
    files = [
        Path(r"C:\Windows\Fonts\segoeuib.ttf") if bold else Path(r"C:\Windows\Fonts\segoeui.ttf"),
        Path(r"C:\Windows\Fonts\arialbd.ttf") if bold else Path(r"C:\Windows\Fonts\arial.ttf"),
    ]
    for file in files:
        if file.exists():
            return ImageFont.truetype(str(file), size)
    return ImageFont.load_default()


F = {
    "hero": font(80, True),
    "h1": font(66, True),
    "h2": font(46, True),
    "body": font(34, False),
    "small": font(25, False),
    "pill": font(25, True),
}


def bg():
    im = Image.new("RGB", (W, H), COL["navy"])
    px = im.load()
    for y in range(H):
        for x in range(W):
            dx, dy = x / W, y / H
            glow = max(0, 1 - ((dx - .82) ** 2 + (dy - .15) ** 2) / .42)
            green = max(0, 1 - ((dx - .10) ** 2 + (dy - .80) ** 2) / .55)
            px[x, y] = (int(5 + 22 * glow + 5 * green), int(14 + 68 * glow + 40 * green), int(28 + 120 * glow + 32 * green))
    return im.convert("RGBA")


BG = bg()


def contain(path, size):
    im = Image.open(path).convert("RGBA")
    im.thumbnail(size, Image.LANCZOS)
    out = Image.new("RGBA", size, (0, 0, 0, 0))
    out.alpha_composite(im, ((size[0] - im.width) // 2, (size[1] - im.height) // 2))
    return out


def cover(path, size, zoom=1.0):
    im = Image.open(path).convert("RGB")
    iw, ih = im.size
    sw, sh = size
    scale = max(sw / iw, sh / ih) * zoom
    im = im.resize((int(iw * scale), int(ih * scale)), Image.LANCZOS)
    x = (im.width - sw) // 2
    y = (im.height - sh) // 2
    return im.crop((x, y, x + sw, y + sh)).convert("RGBA")


def rounded(base, im, box, radius=34):
    x, y, w, h = box
    im = im.resize((w, h), Image.LANCZOS).convert("RGBA")
    sh = Image.new("RGBA", (w + 80, h + 80), (0, 0, 0, 0))
    sd = ImageDraw.Draw(sh)
    sd.rounded_rectangle((40, 40, w + 40, h + 40), radius=radius, fill=(0, 0, 0, 135))
    sh = sh.filter(ImageFilter.GaussianBlur(24))
    base.alpha_composite(sh, (x - 40, y - 25))
    mask = Image.new("L", (w, h), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, w, h), radius=radius, fill=255)
    layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    layer.paste(im, (x, y), mask)
    base.alpha_composite(layer)


def wrap(draw, text, xy, width, fnt, fill, gap=8):
    words, lines, cur = text.split(), [], ""
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
    for line in lines:
        draw.text((x, y), line, font=fnt, fill=fill)
        y = draw.textbbox((x, y), line, font=fnt)[3] + gap


def logo(base):
    base.alpha_composite(contain(ASSETS["logo"], (230, 86)), (64, 64))


def scene(title, subtitle, nexus=None, screenshot=None, footer="YC Systems"):
    im = BG.copy()
    d = ImageDraw.Draw(im)
    logo(im)
    d.text((72, 250), "YC SYSTEMS", font=F["pill"], fill=COL["cyan"])
    wrap(d, title, (72, 330), 850, F["hero"], COL["white"], 10)
    wrap(d, subtitle, (76, 650), 820, F["body"], COL["muted"], 10)
    if screenshot:
        rounded(im, cover(ASSETS[screenshot], (820, 500), 1.0), (130, 940, 820, 500))
    if nexus:
        im.alpha_composite(contain(ASSETS[nexus], (430, 560)), (610, 880 if screenshot is None else 1260))
    d.rounded_rectangle((82, 1570, 998, 1690), radius=38, fill=COL["green"])
    d.text((142, 1606), footer, font=F["h2"], fill=COL["navy"])
    d.text((76, 1788), "Smart Solutions. Real Results.", font=F["body"], fill=COL["cyan"])
    return im


def render_reel(name, frames_specs):
    OUT.mkdir(parents=True, exist_ok=True)
    frame_dir = FRAMES_ROOT / name
    frame_dir.mkdir(parents=True, exist_ok=True)
    for old in frame_dir.glob("*.png"):
        old.unlink()
    frames = []
    for title, subtitle, nexus, screenshot, footer, seconds in frames_specs:
        img = scene(title, subtitle, nexus, screenshot, footer)
        for _ in range(int(seconds * FPS)):
            frames.append(img)
    for i, im in enumerate(frames):
        im.convert("RGB").save(frame_dir / f"frame_{i:05d}.png", quality=94)
    out = OUT / f"{name}.mp4"
    subprocess.run([
        str(FFMPEG), "-y", "-framerate", str(FPS), "-i", str(frame_dir / "frame_%05d.png"),
        "-c:v", "libx264", "-pix_fmt", "yuv420p", "-profile:v", "high", "-crf", "18",
        "-r", str(FPS), "-movflags", "+faststart", str(out)
    ], check=True)
    cover_path = OUT / f"{name}-cover.jpg"
    frames[0].convert("RGB").save(cover_path, quality=94)
    return out, cover_path


def main():
    reels = [
        ("01-web-confianza-reel", [
            ("Tu web no solo debe verse bonita", "Debe explicar, guiar y generar confianza.", "nexus_pointing", None, "Una web que vende confianza", 4),
            ("Si no se entiende rápido", "el cliente se va antes de escribir.", "nexus_confident", None, "Claridad primero", 4),
            ("YC Systems", "crea presencia digital con propósito comercial.", None, None, "Smart Solutions. Real Results.", 4),
        ]),
        ("02-excel-a-sistema-reel", [
            ("Excel ayuda al inicio", "pero cuando creces, el desorden también crece.", "nexus_process", None, "Del caos al control", 4),
            ("Un sistema interno organiza", "clientes, tareas, estados, pagos y reportes.", "nexus_dashboard", None, "Operación clara", 4),
            ("Menos memoria", "más proceso, datos y seguimiento.", None, None, "YC Systems", 4),
        ]),
        ("03-ghostwear-case-reel", [
            ("GhostWear", "de idea a tienda online real.", None, "ghost", "Caso de cliente", 4),
            ("Catálogo visual", "producto claro y pedido por WhatsApp/DM.", None, "ghost", "Lista para vender", 4),
            ("Una marca pequeña", "también puede verse seria y vendible.", "nexus_confident", None, "YC Systems", 4),
        ]),
        ("04-nexus-proceso-reel", [
            ("Así construimos", "analizamos operaciones reales.", "nexus_pointing", None, "Paso 1", 3),
            ("Diseñamos el flujo", "para que el software tenga sentido.", "nexus_process", None, "Paso 2", 3),
            ("Construimos y entregamos", "soluciones listas para operar mejor.", "nexus_dashboard", None, "Paso 3", 4),
        ]),
    ]
    covers = []
    for name, specs in reels:
        _, cover = render_reel(name, specs)
        covers.append(cover)
    sheet = Image.new("RGB", (2 * 320, 2 * 590), (236, 243, 250))
    for i, cover in enumerate(covers):
        im = Image.open(cover).convert("RGB")
        im.thumbnail((300, 533), Image.LANCZOS)
        x = (i % 2) * 320 + 10
        y = (i // 2) * 590 + 10
        sheet.paste(im, (x, y))
        ImageDraw.Draw(sheet).text((x, y + 540), cover.stem.replace("-cover", ""), font=font(18, True), fill=(15, 23, 42))
    sheet.save(CONTACT, quality=92)
    print(OUT)
    print(CONTACT)


if __name__ == "__main__":
    main()
