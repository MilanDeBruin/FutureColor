class Ingredient {
  constructor(id, color, structuur, minMixTime, mixSpeed) {
    this.id = `ingredient-${id}`;
    this.color = color;
    this.structuur = structuur;
    this.minMixTime = minMixTime;
    this.mixSpeed = mixSpeed;
  }

  render() {
    const div = document.createElement("div");
    div.className = "ingredient";
    div.id = this.id;
    div.style.backgroundColor = this.color;
    div.setAttribute("draggable", true);
    div.setAttribute("data-color", this.color);
    div.setAttribute("data-speed", this.mixSpeed);
    div.setAttribute("data-mintime", this.minMixTime);
    div.setAttribute("data-structuur", this.structuur);
    div.ondragstart = drag;
    return div;
  }

  static generateRandom(id) {
    const kleur = Utils.getRandomColor();
    const structuur = Utils.getRandomStructuur();
    const minMixTime = Utils.getRandomInt(2, 6); // bijvoorbeeld 2-6 sec
    const mixSpeed = 1; // bijvoorbeeld 1-3

    return new Ingredient(id, kleur, structuur, minMixTime, mixSpeed);
  }

  static createAndAppendRandom(containerId, idCounterRef) {
    const ingredient = Ingredient.generateRandom(++idCounterRef.value);
    document.getElementById(containerId).appendChild(ingredient.render());
  }
}
