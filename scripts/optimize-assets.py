#!/usr/bin/env python3
"""
Pipeline de extração e otimização de ativos visuais e logotipos — Espaço Arte-Ciência.
Extrai os retratos reais anexados (sem IA generativa, preservando feições e enquadramento),
gera versões responsivas em AVIF, WebP e JPEG (fallback), e exporta PNGs dos logotipos, favicons e Open Graph.
"""

import os
from PIL import Image, ImageDraw, ImageFont

ROOT_DIR = r"c:\Espaco-Arte-Ciencia"
UPLOAD_DIR = r"C:\Users\Aguirre\.gemini\antigravity\brain\89abe06f-f5cf-4c51-9b5e-1a7fc3f07603\.user_uploaded"
IMG_OUT_DIR = os.path.join(ROOT_DIR, "public", "assets", "images")
EQUIPE_OUT_DIR = os.path.join(IMG_OUT_DIR, "equipe")
HIST_OUT_DIR = os.path.join(IMG_OUT_DIR, "institucional")
LOGO_OUT_DIR = os.path.join(ROOT_DIR, "public", "assets", "logo")

os.makedirs(EQUIPE_OUT_DIR, exist_ok=True)
os.makedirs(HIST_OUT_DIR, exist_ok=True)
os.makedirs(LOGO_OUT_DIR, exist_ok=True)

ANALYSTS = [
    {
        "slug": "alessandra-gusatto",
        "source_file": "media_1794837889720_af940220.jpg",
        "box": (534, 115, 904, 537),
    },
    {
        "slug": "conceicao-soares-beltrao",
        "source_file": "media_1794837891421_a7227447.jpg",
        "box": (559, 139, 916, 485),
    },
    {
        "slug": "elisa-freitas-machado",
        "source_file": "media_1794837893184_0ce2bee0.jpg",
        "box": (508, 127, 874, 413),
    },
    {
        "slug": "elis-souza",
        "source_file": "media_1794837895253_c5a26598.jpg",
        "box": (519, 135, 884, 421),
    },
    {
        "slug": "flora-bojunga-mattos",
        "source_file": "media_1794837897176_d9949bf3.jpg",
        "box": (537, 112, 883, 455),
    },
    {
        "slug": "nathanael-bellini-cabrera",
        "source_file": "media_1794837899555_46072f08.jpg",
        "box": (567, 149, 914, 514),
    },
]

HISTORICAL = [
    {
        "slug": "relevo-simbolico-institucional",
        "source_file": "media_1794837866754_0472de57.jpg",
        "box": (92, 155, 371, 405),
    },
    {
        "slug": "carl-gustav-jung",
        "source_file": "media_1794837868713_bd648d0a.jpg",
        "box": (433, 184, 652, 596),
    },
    {
        "slug": "marie-louise-von-franz",
        "source_file": "media_1794837870512_64249665.jpg",
        "box": (396, 196, 676, 569),
    },
]

def save_multi_format(img: Image.Image, out_dir: str, slug: str, widths=(240, 340)):
    """Salva a imagem nativa e variantes responsivas em AVIF, WebP e JPG."""
    w, h = img.size
    jpg_path = os.path.join(out_dir, f"{slug}.jpg")
    webp_path = os.path.join(out_dir, f"{slug}.webp")
    avif_path = os.path.join(out_dir, f"{slug}.avif")

    img.save(jpg_path, "JPEG", quality=86, optimize=True, progressive=True)
    img.save(webp_path, "WEBP", quality=82, method=6)
    img.save(avif_path, "AVIF", quality=75)

    generated = {"width": w, "height": h, "variants": []}
    for target_w in widths:
        if target_w < w:
            target_h = round(h * (target_w / w))
            resized = img.resize((target_w, target_h), Image.Resampling.LANCZOS)
            resized.save(os.path.join(out_dir, f"{slug}-{target_w}w.jpg"), "JPEG", quality=84, optimize=True)
            resized.save(os.path.join(out_dir, f"{slug}-{target_w}w.webp"), "WEBP", quality=80, method=6)
            resized.save(os.path.join(out_dir, f"{slug}-{target_w}w.avif"), "AVIF", quality=72)
            generated["variants"].append((target_w, target_h))
    return generated

def draw_scarab_symbol(draw: ImageDraw.ImageDraw, ox: int, oy: int, scale: float, body_color=(28, 25, 23), sun_color=(198, 46, 38), slit_color=(250, 246, 240)):
    """Desenha o símbolo do escaravelho + disco solar com supersampling."""
    def pt(x, y):
        return (round(ox + x * scale), round(oy + y * scale))

    lw = max(2, round(2.6 * scale))
    # Pernas posteriores
    draw.line([pt(16, 17), pt(7, 12), pt(2, 14)], fill=body_color, width=lw)
    draw.line([pt(16, 39), pt(7, 44), pt(2, 42)], fill=body_color, width=lw)
    # Pernas médias
    draw.line([pt(27, 14), pt(22, 6), pt(16, 5)], fill=body_color, width=lw)
    draw.line([pt(27, 42), pt(22, 50), pt(16, 51)], fill=body_color, width=lw)
    # Pernas anteriores
    draw.line([pt(41, 16), pt(51, 11), pt(59, 17)], fill=body_color, width=lw)
    draw.line([pt(41, 40), pt(51, 45), pt(59, 39)], fill=body_color, width=lw)

    # Corpo oval
    draw.ellipse([pt(10, 14.5), pt(42, 41.5)], fill=body_color)
    # Linha central dos élitros e pronoto
    slit_w = max(1, round(1.3 * scale))
    draw.line([pt(11, 28), pt(29.5, 28)], fill=slit_color, width=slit_w)
    draw.arc([pt(28, 15.5), pt(34, 40.5)], start=110, end=250, fill=slit_color, width=slit_w)

    # Disco solar
    draw.ellipse([pt(48, 20.5), pt(63, 35.5)], fill=sun_color)

def load_font(names, size):
    for name in names:
        try:
            return ImageFont.truetype(name, size)
        except Exception:
            continue
    return ImageFont.load_default()

def generate_logo_pngs_and_og():
    """Gera as exportações PNG do logo redesenhado, favicons e imagem Open Graph."""
    serif_bold = ["georgia.ttf", "georgiab.ttf", "timesbd.ttf", "times.ttf"]
    sans_semi = ["seguisb.ttf", "segoeui.ttf", "arialbd.ttf", "arial.ttf"]

    # 1. Favicon PNGs (supersampled 256x256 -> 180x180, 32x32, 16x16)
    fav_ss = Image.new("RGBA", (256, 256), (0, 0, 0, 0))
    d_fav = ImageDraw.Draw(fav_ss)
    d_fav.rounded_rectangle([8, 8, 248, 248], radius=52, fill=(250, 246, 240, 255), outline=(184, 75, 20, 255), width=10)
    draw_scarab_symbol(d_fav, 16, 20, scale=3.6)

    fav_ss.resize((180, 180), Image.Resampling.LANCZOS).save(os.path.join(LOGO_OUT_DIR, "apple-touch-icon.png"), "PNG", optimize=True)
    fav_ss.resize((32, 32), Image.Resampling.LANCZOS).save(os.path.join(LOGO_OUT_DIR, "favicon-32x32.png"), "PNG", optimize=True)
    fav_ss.resize((16, 16), Image.Resampling.LANCZOS).save(os.path.join(LOGO_OUT_DIR, "favicon-16x16.png"), "PNG", optimize=True)

    # 2. Logo Horizontal PNG (920x152)
    lh_ss = Image.new("RGBA", (1840, 304), (0, 0, 0, 0))
    d_lh = ImageDraw.Draw(lh_ss)
    draw_scarab_symbol(d_lh, 24, 40, scale=4.0)
    f_title = load_font(["georgiab.ttf", "georgia.ttf"], 102)
    f_sub = load_font(["seguisb.ttf", "segoeui.ttf"], 42)
    d_lh.text((330, 36), "ESPAÇO ARTE-CIÊNCIA", font=f_title, fill=(28, 25, 23, 255))
    d_lh.line([(334, 184), (1780, 184)], fill=(184, 75, 20, 140), width=5)
    d_lh.text((334, 204), "PSICOLOGIA ANALÍTICA · C. G. JUNG E M.-L. VON FRANZ", font=f_sub, fill=(143, 56, 12, 255))
    lh_ss.resize((920, 152), Image.Resampling.LANCZOS).save(os.path.join(LOGO_OUT_DIR, "logo-horizontal.png"), "PNG", optimize=True)

    # 3. Logo Compacto PNG (460x136)
    lc_ss = Image.new("RGBA", (920, 272), (0, 0, 0, 0))
    d_lc = ImageDraw.Draw(lc_ss)
    draw_scarab_symbol(d_lc, 16, 28, scale=3.8)
    f_comp = load_font(["georgiab.ttf", "georgia.ttf"], 72)
    d_lc.text((300, 38), "ESPAÇO", font=f_comp, fill=(28, 25, 23, 255))
    d_lc.text((300, 132), "ARTE-CIÊNCIA", font=f_comp, fill=(158, 62, 14, 255))
    lc_ss.resize((460, 136), Image.Resampling.LANCZOS).save(os.path.join(LOGO_OUT_DIR, "logo-compact.png"), "PNG", optimize=True)

    # 4. Open Graph Social Card (1200x630)
    og = Image.new("RGB", (1200, 630), (250, 246, 240))
    d_og = ImageDraw.Draw(og)
    # Moldura editorial sutil
    d_og.rectangle([28, 28, 1172, 602], outline=(214, 195, 176), width=2)
    d_og.rectangle([28, 28, 42, 602], fill=(184, 75, 20))

    # Inserir relevo simbólico institucional à direita
    relief_path = os.path.join(HIST_OUT_DIR, "relevo-simbolico-institucional.jpg")
    if os.path.exists(relief_path):
        with Image.open(relief_path) as rel:
            rel_resized = rel.resize((360, 352), Image.Resampling.LANCZOS)
            # Moldura ao redor do relevo
            d_og.rectangle([756, 134, 1124, 494], fill=(238, 228, 215), outline=(184, 75, 20), width=2)
            og.paste(rel_resized, (760, 138))

    draw_scarab_symbol(d_og, 82, 92, scale=1.7)
    f_og_brand = load_font(["georgiab.ttf", "georgia.ttf"], 34)
    f_og_h1 = load_font(["georgiab.ttf", "georgia.ttf"], 46)
    f_og_body = load_font(["segoeui.ttf", "arial.ttf"], 25)
    f_og_meta = load_font(["seguisb.ttf", "segoeui.ttf"], 21)

    d_og.text((200, 102), "ESPAÇO ARTE-CIÊNCIA", font=f_og_brand, fill=(28, 25, 23))
    d_og.text((86, 205), "Seminários e Encontros de", font=f_og_h1, fill=(28, 25, 23))
    d_og.text((86, 265), "Psicologia Analítica", font=f_og_h1, fill=(168, 62, 14))
    d_og.text((86, 350), "A produção intelectual e a visão de mundo de", font=f_og_body, fill=(68, 62, 56))
    d_og.text((86, 386), "Carl Gustav Jung e Marie-Louise von Franz.", font=f_og_body, fill=(68, 62, 56))
    d_og.line([(86, 465), (690, 465)], fill=(214, 195, 176), width=2)
    d_og.text((86, 490), "Formação · Análise Junguiana · Seminários · Cursos", font=f_og_meta, fill=(143, 56, 12))
    d_og.text((86, 526), "espacoarteciencia.com.br · Porto Alegre / RS", font=f_og_meta, fill=(92, 83, 74))

    og.save(os.path.join(IMG_OUT_DIR, "og-espaco-arte-ciencia.jpg"), "JPEG", quality=88, optimize=True, progressive=True)
    og.save(os.path.join(IMG_OUT_DIR, "og-espaco-arte-ciencia.webp"), "WEBP", quality=85, method=6)
    print("  [OK] Logotipos PNG, favicons e Open Graph gerados.")

def main():
    print("Extraindo retratos reais da equipe...")
    for item in ANALYSTS:
        src_path = os.path.join(UPLOAD_DIR, item["source_file"])
        with Image.open(src_path) as im:
            rgb = im.convert("RGB")
            cropped = rgb.crop(item["box"])
            info = save_multi_format(cropped, EQUIPE_OUT_DIR, item["slug"], widths=(240, 340))
            print(f"  [OK] {item['slug']}: {info['width']}x{info['height']}")

    print("Extraindo imagens institucionais e históricas...")
    for item in HISTORICAL:
        src_path = os.path.join(UPLOAD_DIR, item["source_file"])
        with Image.open(src_path) as im:
            rgb = im.convert("RGB")
            cropped = rgb.crop(item["box"])
            info = save_multi_format(cropped, HIST_OUT_DIR, item["slug"], widths=(220,))
            print(f"  [OK] {item['slug']}: {info['width']}x{info['height']}")

    orig_logo_src = os.path.join(UPLOAD_DIR, "media_1794837961012_9c41e517.png")
    if os.path.exists(orig_logo_src):
        with Image.open(orig_logo_src) as im:
            im.save(os.path.join(LOGO_OUT_DIR, "referencia-marca-original.png"), "PNG", optimize=True)

    jung_hero_src = os.path.join(UPLOAD_DIR, "media_1794843726800_4ce230ae.jpg")
    if os.path.exists(jung_hero_src):
        with Image.open(jung_hero_src) as im:
            rgb = im.convert("RGB")
            info = save_multi_format(rgb, HIST_OUT_DIR, "carl-gustav-jung-hero", widths=(240,))
            print(f"  [OK] carl-gustav-jung-hero: {info['width']}x{info['height']}")

    generate_logo_pngs_and_og()

if __name__ == "__main__":
    main()
