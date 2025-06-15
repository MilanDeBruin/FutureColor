let ingredientCount = 0;
let potCount = 0;
let machineCount = 0;
let machineTimeInput = 0;
let testGrid = 0;

document.addEventListener("DOMContentLoaded", () => {

  testGrid = new Testgrid("test-grid");

  document.getElementById("generateGridBtn").addEventListener("click", () => {
    const rows = parseInt(document.getElementById("gridRows").value);
    const cols = parseInt(document.getElementById("gridCols").value);
    testGrid.generate(rows, cols);
  });
  // Event listeners
  document.getElementById("randomIngredientBtn").addEventListener("click", createRandomIngredient);
  document.getElementById("addIngredientBtn").addEventListener("click", createIngredient);
  document.getElementById("addPotBtn").addEventListener("click", createPot);
  document.getElementById("addMachineBtn").addEventListener("click", createMachine);
  document.getElementById("updateWeatherBtn").addEventListener("click", updateWeather);



  document.getElementById('hall1Radio').addEventListener('change', () => showHall('hall1'));
document.getElementById('hall2Radio').addEventListener('change', () => showHall('hall2'));

  // Init
  machineTimeInput = document.getElementById("machineTime");
  fetchWeatherData(document.getElementById("location").value);
});

function showHall() {
  const hallNumber = document.querySelector('input[name="hall"]:checked').id.replace("hall", "").replace("Radio", "");
  ["hall1", "hall2"].forEach(id => document.getElementById(id).style.display = "none");
  document.getElementById(`hall${hallNumber}`).style.display = "block";
}

async function fetchWeatherData(location) {
  try {
    const apiKey = "0213b9320d";
    const apiUrl = `https://weerlive.nl/api/weerlive_api_v2.php?key=${apiKey}&locatie=${location}`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    const temp = data.liveweer[0].temp;
    const weather = data.liveweer[0].image;
    let additionalTime = 0;

    if (["regen", "sneeuw"].includes(weather)) additionalTime = 0.1;
    else if (temp > 35) additionalTime = -0.9;
    else if (temp < 10) additionalTime = 0.15;

    let time = parseInt(machineTimeInput.value);
    time += time * additionalTime;
    machineTimeInput.value = Math.round(time);
  } catch (err) {
    console.error("Fout bij ophalen van weer:", err);
  }
}

function updateWeather() {
  fetchWeatherData(document.getElementById("location").value);
}

function createIngredient() {
  const colorType = document.getElementById("colorType").value;
  const colorValue = document.getElementById("colorValue").value;
  const minMixTime = parseInt(document.getElementById("minMixTime").value);
  const mixSpeed = parseInt(document.getElementById("mixSpeed").value);
  const structuur = document.getElementById("structuur").value;

  const color = colorType === "rgb" ? `rgb(${colorValue})` : `hsl(${colorValue})`;

  const ingredient = new Ingredient(++ingredientCount, color, structuur, minMixTime, mixSpeed);
  document.getElementById("ingredients-container").appendChild(ingredient.render());
}

function createRandomIngredient() {
  const ingredient = Ingredient.generateRandom(++ingredientCount);
  document.getElementById("ingredients-container").appendChild(ingredient.render());
}

function createPot() {
  const pot = new Pot(++potCount);
  const el = pot.render();
  el.ondrop = handleIngredientDrop;
  document.getElementById("pots-container").appendChild(el);
}

function createMachine() {
  const speed = parseInt(document.getElementById("machineSpeed").value);
  const time = parseInt(document.getElementById("machineTime").value);
  const machine = new Machine(++machineCount, speed, time);

  const hallNumber = document.querySelector('input[name="hall"]:checked').id.replace("hall", "").replace("Radio", "");
  const el = machine.render();
  el.ondrop = handlePotDrop;

  document.getElementById(`machines-container-${hallNumber}`).appendChild(el);
}

function handleIngredientDrop(event) {
  event.preventDefault();
  const ingredientId = event.dataTransfer.getData("text/plain");
  const ingredient = document.getElementById(ingredientId);
  const pot = event.currentTarget;

  const potIngredients = pot.querySelectorAll(".ingredient");
  if (potIngredients.length > 0 && ingredient.getAttribute("data-speed") !== potIngredients[0].getAttribute("data-speed")) {
    return alert("Ingrediënten met verschillende mengsnelheden kunnen niet worden gemengd.");
  }

  const currentColors = JSON.parse(pot.dataset.colors);
  currentColors.push(ingredient.getAttribute("data-color"));
  pot.dataset.colors = JSON.stringify(currentColors);
  pot.appendChild(ingredient);
}

function handlePotDrop(event) {
  event.preventDefault();
  const potId = event.dataTransfer.getData("text/plain");
  const pot = document.getElementById(potId);
  const machine = event.currentTarget;

  if (!pot.classList.contains("pot")) return;

  const ingredients = pot.querySelectorAll(".ingredient");
  if (ingredients.length === 0) {
    alert("Deze pot bevat geen ingrediënten.");
    return;
  }

  pot.remove();
  const speeds = Array.from(ingredients).map(ing => parseInt(ing.getAttribute("data-speed")));
  const times = Array.from(ingredients).map(ing => parseInt(ing.getAttribute("data-mintime")));

  const potSpeed = speeds[0];
  const highestTime = Math.max(...times);
  const machineSpeed = parseInt(machine.getAttribute("data-speed"));
  const mixTime = highestTime / (potSpeed * machineSpeed);

  const kleuren = Array.from(ingredients).map(ing => ing.getAttribute("data-color"));
  const structuur = ingredients[0].getAttribute("data-structuur");

  machine.innerHTML = `<div class="loader"></div><p style="text-align:center;">Mengen...</p>`;

  setTimeout(() => {
    const resultColor = Utils.mixColors(kleuren);
    const resultPot = new Pot("result-" + Date.now(), resultColor, structuur, true);
    document.getElementById("output-container").appendChild(resultPot.render());
    machine.innerHTML = "";
  }, mixTime);
}

// Drag & Drop helpers
function allowDrop(e) {
  e.preventDefault();
}

function drag(e) {
  e.dataTransfer.setData("text/plain", e.target.id);
}