class Pot {
  static potCount = 0;

  constructor() {
    this.id = `pot-${++Pot.potCount}`;
    this.colors = [];
    this.element = document.createElement("div");
    this.element.className = "pot";
    this.element.id = this.id;
    this.element.dataset.colors = JSON.stringify(this.colors);
    this.element.innerHTML = `<span>Pot ${Pot.potCount}</span>`;
    this.element.draggable = true;
    this.element.ondragstart = this.drag;
    this.element.ondragover = this.allowDrop;
    this.element.ondrop = this.drop.bind(this);
  }

  allowDrop(event) {
    event.preventDefault();
  }

  drag(event) {
    event.dataTransfer.setData("text/plain", event.target.id);
  }

  drop(event) {
    event.preventDefault();
    const ingredientId = event.dataTransfer.getData("text");
    const ingredient = document.getElementById(ingredientId);
    const ingredientSpeed = ingredient.getAttribute("data-speed");
    const potIngredients = this.element.querySelectorAll(".ingredient");

    if (potIngredients.length > 0) {
      const existingSpeed = potIngredients[0].getAttribute("data-speed");
      if (ingredientSpeed !== existingSpeed) {
        alert("Ingrediënten met verschillende mengsnelheden kunnen niet worden gemengd.");
        return;
      }
    }

    const currentColors = JSON.parse(this.element.dataset.colors);
    currentColors.push(ingredient.getAttribute("data-color"));
    this.element.dataset.colors = JSON.stringify(currentColors);
    this.element.appendChild(ingredient);
  }

  getElement() {
    return this.element;
  }

  render() {
    return this.getElement();
  }
}
