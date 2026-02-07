(function() {
  // DOM element references - Euro Jackpot
  const dateHolder   = document.querySelector(".date-today-eurojackpot");
  const timeHolder   = document.querySelector(".timestamp-eurojackpot");
  const ticketBody   = document.getElementById("numbers-eurojackpot");
  const quickpick    = document.getElementById("quick-pick-eurojackpot");
  const resetButton  = document.getElementById("reset-ticket-eurojackpot");

  const MAX_LINES = 10;
  let lineCount = 0;

  if (quickpick) quickpick.addEventListener("click", addOneLine);
  if (resetButton) resetButton.addEventListener("click", resetTicket);

  // Optional: start with one line on load
  // addOneLine();

  function addOneLine() {
    if (lineCount >= MAX_LINES) {
      alert("You've reached the maximum of 10 lines per Euro Jackpot generator! Click the reset button to try again!");
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
        number.className = `num${index + 1}`;
      } else if (index === 5) {
        number.className = "EN EN1";
      } else {
        number.className = "EN EN2";
      }
      number.className += " number";
      number.textContent = value < 10 ? `0${value}` : value;
      line.appendChild(number);
    });

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
    while (pick.length < 5) {
      const value = randomNumber(50, 1);
      if (!pick.includes(value)) pick.push(value);
    }
    pick.sort((a, b) => a - b);

// 2 unique Euro Numbers
    let en1 = randomNumber(12, 1);
    let en2 = randomNumber(12, 1);
    while (en2 === en1) en2 = randomNumber(12, 1);

    pick.push(en1, en2);
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