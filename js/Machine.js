class Machine {
  static machineCount = 0;

  constructor(speed, time, outputContainer) {
    this.id = `machine-${++Machine.machineCount}`;
    this.speed = speed;
    this.time = time;
    this.outputContainer = outputContainer;

    this.element = document.createElement("div");
    this.element.className = "machine";
    this.element.id = this.id;
    this.element.innerHTML = `<span>Machine ${Machine.machineCount}</span>`;
    this.element.setAttribute("data-speed", this.speed);
    this.element.setAttribute("data-time", this.time);

    this.element.ondragover = this.allowDrop;
    this.element.ondrop = this.handlePotDrop.bind(this);
  }

  allowDrop(event) {
    event.preventDefault();
  }

  handlePotDrop(event) {
    event.preventDefault();
    const potId = event.dataTransfer.getData("text/plain");
    const pot = document.getElementById(potId);
    if (!pot.classList.contains("pot")) return;

    const ingredients = pot.querySelectorAll(".ingredient");
    if (ingredients.length === 0) {
      alert("Deze pot bevat geen ingrediënten.");
      return;
    }

    const speeds = Array.from(ingredients).map(ing => parseInt(ing.dataset.speed));
    const times = Array.from(ingredients).map(ing => parseInt(ing.dataset.mintime));
    const structuur = ingredients[0].getAttribute("data-structuur");

    const potSpeed = speeds[0];
    const highestTime = Math.max(...times);

    const effectiveMixTime = highestTime / (potSpeed * this.speed);

    const colors = Array.from(ingredients).map(ing => ing.getAttribute("data-color"));

    this.element.innerHTML = `<div class="loader"></div><p style="text-align:center;">Mengen...</p>`;

    setTimeout(() => {
      const resultColor = mixColors(colors);

      const resultPot = document.createElement("div");
      resultPot.className = `pot structuur-${structuur}`;
      resultPot.innerHTML = `<span>Resultaat</span>`;
      resultPot.style.backgroundColor = resultColor;
      resultPot.id = "result-pot-" + Date.now();
      resultPot.draggable = true;
      resultPot.ondragstart = (e) => {
        e.dataTransfer.setData("text/plain", resultPot.id);
      };

      this.outputContainer.appendChild(resultPot);
      this.element.innerHTML = `<span>Machine ${this.id.split("-")[1]}</span>`;
    }, effectiveMixTime);
  }


  

  getElement() {
    return this.element;
  }
  
  render() {
    return this.getElement();
  }
}
