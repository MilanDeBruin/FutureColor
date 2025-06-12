const Utils = {
 getRandomColor() {
  const r = Utils.getRandomInt(0, 255);
  const g = Utils.getRandomInt(0, 255);
  const b = Utils.getRandomInt(0, 255);
  return `rgb(${r},${g},${b})`;
},

  getRandomStructuur() {
    const structuren = ["vloeibaar", "korrelig", "stroperig", "poeder", "schuimend"];
    return structuren[Math.floor(Math.random() * structuren.length)];
  },

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  mixColors(colors) {
  let r = 0, g = 0, b = 0, count = 0;
  colors.forEach(color => {
    if (color.startsWith("rgb")) {
      const rgb = color.match(/\d+/g);
      r += parseInt(rgb[0]);
      g += parseInt(rgb[1]);
      b += parseInt(rgb[2]);
      count++;
    }
  });

  if (count === 0) return "lightgray";
  return `rgb(${Math.floor(r / count)}, ${Math.floor(g / count)}, ${Math.floor(b / count)})`;
  }
}
