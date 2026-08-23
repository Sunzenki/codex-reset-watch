from pathlib import Path
from PIL import Image, ImageDraw


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


if __name__ == "__main__":
    main()
