(function() {
  // DOM element references - El Gordo La Primitiva
  const dateHolder   = document.querySelector(".date-today-gordoprimitiva");
  const timeHolder   = document.querySelector(".timestamp-gordoprimitiva");
  const ticketBody   = document.getElementById("numbers-gordoprimitiva");
  const quickpick    = document.getElementById("quick-pick-gordoprimitiva");
  const resetButton  = document.getElementById("reset-ticket-gordoprimitiva");

  const MAX_LINES = 10;
  let lineCount = 0;

  if (quickpick) quickpick.addEventListener("click", addOneLine);
  if (resetButton) resetButton.addEventListener("click", resetTicket);

  // Optional: start with one line on load
  // addOneLine();

  function addOneLine() {
    if (lineCount >= MAX_LINES) {
      alert("You've reached the maximum of 10 lines per El Gordo La Primitiva generator! Click the reset button to try again!");
      return;
    }

    if (lineCount === 0) {
      dateHolder.textContent = getDate();
      timeHolder.textContent = getTimestamp();
    }

    const pick = generatePick();
    const line = document.createElement("ul");

    pick.forEach((value, index) => {
      const number = document.createElement("li");

      if (index < 5) {
        // Main numbers (1-54, numeric)
        number.className = `alt-num${index + 1}`;
        number.textContent = value < 10 ? `0${value}` : value;
      } else {
        // Reintegro: 1 Random number from 0-9
        number.className = "RI RI1";
        number.textContent = value;
      }

      number.className += " number";
      line.appendChild(number);
    });

    const luck = document.createElement("li");
    luck.textContent = "🤞";
    luck.className = "luck";
    line.appendChild(luck);

    ticketBody.appendChild(line);
    lineCount++;
  }

  function resetTicket() {
    ticketBody.innerHTML = "";
    dateHolder.textContent = "";
    timeHolder.textContent = "";
    lineCount = 0;
  }

  function generatePick() {
    const pick = [];

    // 5 unique main numbers from 1–54
    while (pick.length < 5) {
      const value = randomNumber(54, 1);
      if (!pick.includes(value)) {
        pick.push(value);
      }
    }

    // Sort main numbers ascending
    pick.sort((a, b) => a - b);

    // Single El Gordo La Primitiva: 1 random number from 0-9
    const reintegro = ['0','1','2','3','4','5','6','7','8','9'];
    const randomIndex = Math.floor(Math.random() * reintegro.length);
    const Reintegro = reintegro[randomIndex];

    pick.push(Reintegro);

    return pick;
  }

  function getDate() {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day   = today.getDate();
    const year  = today.getFullYear();
    return `${month}/${day}/${year}`;
  }

  function getTimestamp() {
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes().toString().padStart(2, "0");
    const s = now.getSeconds().toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  }

  function randomNumber(max, min = 1) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
})();