from pathlib import Path
from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"


def rounded_line(draw, points, fill, width):
    draw.line(points, fill=fill, width=width, joint="curve")
    radius = width // 2
    for x, y in (points[0], points[-1]):
        draw.ellipse((x - radius, y - radius, x + radius, y + radius), fill=fill)


def brand_icon(size: int) -> Image.Image:
    canvas = 1024
    image = Image.new("RGBA", (canvas, canvas), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)

    draw.rounded_rectangle((48, 48, 976, 976), radius=232, fill="#BCEEFF")
    purple = "#896CF6"
    pink = "#F75A80"
    draw.arc((205, 190, 815, 800), start=42, end=320, fill=purple, width=126)
    draw.polygon(((690, 142), (855, 293), (627, 330)), fill=purple)
    rounded_line(draw, ((394, 392), (515, 500), (394, 608)), pink, 78)
    rounded_line(draw, ((565, 608), (690, 608)), pink, 78)

    if size != canvas:
        image = image.resize((size, size), Image.Resampling.LANCZOS)
    return image


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    filename = "arialbd.ttf" if bold else "arial.ttf"
    return ImageFont.truetype(str(Path("C:/Windows/Fonts") / filename), size)


def social_card() -> Image.Image:
    image = Image.new("RGB", (1200, 630), "#FFFDF8")
    draw = ImageDraw.Draw(image)

    for y in range(28, 630, 28):
        for x in range(28, 1200, 28):
            draw.ellipse((x, y, x + 3, y + 3), fill="#DCEBEE")

    draw.ellipse((-130, -180, 330, 280), fill="#D7F4E1")
    draw.ellipse((920, -170, 1320, 230), fill="#FFE8C8")
    draw.ellipse((920, 390, 1300, 760), fill="#DCEEFF")
    draw.rounded_rectangle((58, 54, 1142, 576), radius=44, fill="#FFFEFB", outline="#D9D0EE", width=3)

    mark = brand_icon(176)
    image.paste(mark, (92, 116), mark)
    draw.text((300, 135), "Codex Reset Watch", fill="#62547E", font=font(62, True))
    draw.text((302, 220), "RESET TIME  •  COUNTDOWN  •  SOURCE HISTORY", fill="#7E6FB2", font=font(21, True))
    draw.text((302, 270), "A playful, human-curated tracker for public Codex reset updates.", fill="#59676B", font=font(25))

    colors = ["#D9F6DF", "#DCEEFF", "#E8E3FF", "#FFD9CA"]
    labels = ["00", "08", "24", "06"]
    left = 302
    for index, (color, label) in enumerate(zip(colors, labels)):
        x = left + index * 150
        draw.rounded_rectangle((x, 345, x + 118, 467), radius=22, fill=color, outline="#C7D3CC", width=2)
        draw.text((x + 19, 366), label, fill="#29332D", font=font(50, True))
        if index < 3:
            draw.text((x + 129, 382), ":", fill="#819087", font=font(38, True))

    draw.rounded_rectangle((302, 505, 547, 548), radius=20, fill="#FFF2B8")
    draw.text((326, 516), "crw.warpnav.com", fill="#62547E", font=font(18, True))
    draw.text((875, 516), "Unofficial • Source-first", fill="#7C8790", font=font(17))
    return image


def main():
    outputs = {
        "favicon-16.png": 16,
        "favicon-32.png": 32,
        "apple-touch-icon.png": 180,
        "icon-192.png": 192,
        "icon-512.png": 512,
    }
    for filename, size in outputs.items():
        brand_icon(size * 4).resize((size, size), Image.Resampling.LANCZOS).save(PUBLIC / filename)
    social_card().save(PUBLIC / "og.png", optimize=True)


if __name__ == "__main__":
    main()
