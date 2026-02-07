(function() {
  // DOM element references
  const dateHolder   = document.querySelector(".date-today");
  const timeHolder   = document.querySelector(".timestamp");
  const ticketBody   = document.getElementById("numbers");
  const quickpick    = document.getElementById("quick-pick");
  const resetButton  = document.getElementById("reset-ticket");

  const MAX_LINES = 10;
  let lineCount = 0;

  // Event listeners
  if (quickpick) {
    quickpick.addEventListener("click", addOneLine);
  }
  if (resetButton) {
    resetButton.addEventListener("click", resetTicket);
  }

  // Optional: start with one line when the page loads
  // addOneLine();

  function addOneLine() {
    if (lineCount >= MAX_LINES) {
      alert("You've reached the maximum of 10 lines per Power Ball generator! Click the reset button to try again!");
      return;
    }

    // Set date and time only when adding the first line
    if (lineCount === 0) {
      dateHolder.textContent = getDate();
      timeHolder.textContent = getTimestamp();
    }

    const pick = generatePick();
    const line = document.createElement("ul");

    // Add the 6 numbers (5 main + 1 PB)
    pick.forEach((value, index) => {
      const number = document.createElement("li");

      if (index < 5) {
        number.className = `num${index + 1}`;
      } else {
        number.className = "PB PB1";  // single Powerball
      }

      number.className += " number";
      number.textContent = value < 10 ? `0${value}` : value;

      line.appendChild(number);
    });

    // Luck emoji
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

  // ────────────────────────────────────────────────
  // Generate one play: 5 unique white balls (1–65) + 1 Powerball (1–35)
  function generatePick() {
    const pick = [];

    // 5 unique main numbers
    while (pick.length < 5) {
      const value = randomNumber(65, 1);
      if (!pick.includes(value)) {
        pick.push(value);
      }
    }

    // Sort main numbers ascending
    pick.sort((a, b) => a - b);

    // Single Powerball
    const pb = randomNumber(35, 1);
    pick.push(pb);

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

  // Random integer from min to max inclusive
  function randomNumber(max, min = 1) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
})();