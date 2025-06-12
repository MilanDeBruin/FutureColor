class Testgrid 
{
    constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  generate(rows, cols) {
    this.container.innerHTML = "";
    this.container.style.gridTemplateRows = `repeat(${rows}, 50px)`;
    this.container.style.gridTemplateColumns = `repeat(${cols}, 50px)`;

    for (let i = 0; i < rows * cols; i++) {
      const cell = this.createCell();
      this.container.appendChild(cell);
    }
  }

  createCell() {
    const cell = document.createElement("div");
    cell.className = "test-cell";
    cell.style.width = "50px";
    cell.style.height = "50px";
    cell.style.border = "1px solid #ccc";
    cell.style.backgroundColor = "white";

    cell.onclick = () => {
      if (cell.style.backgroundColor !== "white") {
        this.showTriadicPopup(cell.style.backgroundColor);
      }
    };

    cell.ondragover = (e) => e.preventDefault();
    cell.ondrop = (event) => this.handleDrop(event, cell);

    return cell;
  }

  handleDrop(event, cell) {
    event.preventDefault();
    const potId = event.dataTransfer.getData("text/plain");
    const pot = document.getElementById(potId);

    if (!pot || !pot.classList.contains("pot")) return;

    cell.style.backgroundColor = pot.style.backgroundColor;
    cell.className = "test-cell";

    const structuurClass = Array.from(pot.classList).find(c =>
      c.startsWith("structuur-")
    );
    if (structuurClass) {
      cell.classList.add(structuurClass);
    }

    if (cell.style.backgroundColor !== "white") {
      this.showTriadicPopup(cell.style.backgroundColor);
    }
  }

  showTriadicPopup(originalColor) {
    const rgbString = getComputedRGB(originalColor);
    const rgb = rgbString.match(/\d+/g).map(Number);
    const [h, s, l] = Testgrid.rgbToHsl(rgb[0], rgb[1], rgb[2]);

    console.log("Popup color:", originalColor);

    const triad1H = (h + 120) % 360;
    const triad2H = (h + 240) % 360;

    const [r1, g1, b1] = Testgrid.hslToRgb(triad1H, s, l);
    const [r2, g2, b2] = Testgrid.hslToRgb(triad2H, s, l);

    const color1 = `rgb(${r1}, ${g1}, ${b1})`;
    const color2 = `rgb(${r2}, ${g2}, ${b2})`;

    const popup = document.createElement("div");
    popup.className = "popup";

    popup.innerHTML = `
      <h3>Triadic Kleurenadvies</h3>
      <div class="color-box"><div class="color-swatch" style="background:${originalColor}"></div> Origineel: ${originalColor}</div>
      <div class="color-box"><div class="color-swatch" style="background:${color1}"></div> Advies 1: ${color1}</div>
      <div class="color-box"><div class="color-swatch" style="background:${color2}"></div> Advies 2: ${color2}</div>
      <button class="popup-close" onclick="this.parentElement.remove()">Sluiten</button>
    `;

    document.body.appendChild(popup);
  }

  // Static color utilities
  static rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h *= 60;
    }

    return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
  }

  static hslToRgb(h, s, l) {
    s /= 100;
    l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;

    if (h >= 0 && h < 60) [r, g] = [c, x];
    else if (h < 120) [r, g] = [x, c];
    else if (h < 180) [g, b] = [c, x];
    else if (h < 240) [g, b] = [x, c];
    else if (h < 300) [r, b] = [x, c];
    else [r, b] = [c, x];

    return [
      Math.round((r + m) * 255),
      Math.round((g + m) * 255),
      Math.round((b + m) * 255),
    ];
  }
}

function getComputedRGB(color) {
  const temp = document.createElement("div");
  temp.style.color = color;
  document.body.appendChild(temp);
  const computed = getComputedStyle(temp).color;
  document.body.removeChild(temp);
  return computed;
}