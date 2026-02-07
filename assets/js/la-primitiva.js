(function() {
  // DOM element references
  const dateHolder = document.querySelector(".date-today-primitiva");
  const timeHolder = document.querySelector(".timestamp-primitiva");
  const ticketBody = document.getElementById("numbers-primitiva");
  const quickpick = document.getElementById("quick-pick-primitiva");
  const resetButton = document.getElementById("reset-ticket-primitiva");
  
  const MAX_LINES = 10;
  let lineCount = 0;

  if (quickpick) quickpick.addEventListener("click", addOneLine);
  if (resetButton) resetButton.addEventListener("click", resetTicket);

  // Optional: start with one line on load
  // addOneLine();

  function addOneLine() {
    if (lineCount >= MAX_LINES) {
      alert("You've reached the maximum of 10 lines! Click reset to start again.");
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
      number.className = `num${index + 1} number`;
      number.textContent = value < 10 ? `0${value}` : value;
      line.appendChild(number);
    });

    // Optional lucky symbol at the end
    const luck = document.createElement("li");
    luck.textContent = "🤞";
    luck.className = "🤞";
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
    while (pick.length < 6) {
      const value = randomNumber(49, 1);
      if (!pick.includes(value)) {
        pick.push(value);
      }
    }
    pick.sort((a, b) => a - b);
    return pick;
  }

  function getDate() {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const year = today.getFullYear();
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