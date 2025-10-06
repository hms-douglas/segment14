const SVG_IS_TO_FORMAT_FILE = true;

const SVG_VIEW_WIDTH = 300,
      SVG_VIEW_HEIGHT = 500,
      SVG_COLON_VIEW_WIDTH = 50;

let SVG_COLOR = "#000000";

const a = '<path d="M 56 2 H 244 L 264 22 V 27.983 L 244 47.983 H 56 L 36 27.983 V 22 L 56 2 Z"/>',
      b = '<path d="M 272.2 36 H 277.957 L 297.957 56 V 220 L 277.957 240 H 272.2 L 252.2 220 V 56 L 272.2 36 Z"/>',
      c = '<path d="M 272.2 260.6 H 277.957 L 297.957 280.6 V 444.6 L 277.957 464.6 H 272.2 L 252.2 444.6 V 280.6 L 272.2 260.6 Z"/>',
      d = '<path d="M 56 452 H 244 L 264 472 V 477.983 L 244 497.983 H 56 L 36 477.983 V 472 L 56 452 Z"/>',
      e = '<path d="M 22 260.6 H 27.757 L 47.757 280.6 V 444.6 L 27.757 464.6 H 22 L 2 444.6 V 280.6 L 22 260.6 Z"/>',
      f = '<path d="M 22 36 H 27.757 L 47.757 56 V 220 L 27.757 240 H 22 L 2 220 V 56 L 22 36 Z"/>',
      g = '<path d="M 56 227.008 H 125 L 145 247.008 V 252.991 L 125 272.991 H 56 L 36 252.991 V 247.008 L 56 227.008 Z"/>',
      h = '<path d="M 175 227.008 H 244 L 264 247.008 V 252.991 L 244 272.991 H 175 L 155 252.991 V 247.008 L 175 227.008 Z"/>',
      i = '<path d="M 70.164 58.964 L 116.637 136.309 L 116.638 216.004 L 111.144 216.008 L 58.242 127.964 L 58.242 58.974 Z"/>',
      j = '<path d="M 147.122 56.994 H 152.879 L 172.879 76.994 V 216.994 L 152.879 236.994 H 147.122 L 127.122 216.994 V 76.994 L 147.122 56.994 Z"/>',
      k = '<path d="M 241.737 127.96 L 188.833 216.008 L 183.342 216.004 L 183.342 136.305 L 229.813 58.964 L 241.737 58.974 Z"/>',
      l = '<path d="M 70.164 440.98 L 116.637 363.635 L 116.638 283.94 L 111.144 283.936 L 58.242 371.98 L 58.242 440.97 L 70.164 440.98 Z"/>',
      m = '<path d="M 147.122 262 H 152.879 L 172.879 282 V 422 L 152.879 442 H 147.122 L 127.122 422 V 282 L 147.122 262 Z"/>',
      n = '<path d="M 229.813 441.027 L 183.342 363.686 L 183.342 283.987 L 188.833 283.982 L 241.737 372.029 L 241.737 441.017 Z"/>',
      dot = '<path d="M 56 452 H 62 L 82 472 V 477.983 L 62 497.983 H 56 L 36 477.983 V 472 L 56 452 Z"/>';

function SVG_generateSvgString(segments) {
    const svgStart = '<?xml version="1.0" encoding="utf-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 500" fill="' + SVG_COLOR + '">';

    let svg;

    if(SVG_IS_TO_FORMAT_FILE) {
        svg = svgStart;

        segments.forEach((segment) => {
            svg += "\n\t" + segment;
        });

        svg += "\n</svg>";
    } else {
       svg = svgStart.replaceAll("\n", "");

        segments.forEach((segment) => {
            svg += segment;
        });

        svg += "</svg>";
    }

    return svg;
}

function SVG_getSVGColonString() {
    const svgStart = '<?xml version="1.0" encoding="utf-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 500" fill="' + SVG_COLOR + '">';

    const path = '\t<path d="M 22 262 H 27.757 L 47.757 282 V 287.8 L 27.757 307.8 H 22 L 2 287.8 V 282 L 22 262 Z"/>\n\t<path d="M 22 191.194 H 27.757 L 47.757 211.194 V 216.994 L 27.757 236.994 H 22 L 2 216.994 V 211.194 L 22 191.194 Z"/>';

    let svg;

    if(SVG_IS_TO_FORMAT_FILE) {
        svg = svgStart + "\n" + path;

        svg += "\n</svg>";
    } else {
       svg = svgStart.replaceAll("\n", "") + path.replaceAll("\n", "").replaceAll("\t", "");

        svg += "</svg>";
    }

    return svg;
}

function SVG_setColor(color) {
    SVG_COLOR = color;
}