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
  }


  

  getElement() {
    return this.element;
  }
  
  render() {
    return this.getElement();
  }
}
