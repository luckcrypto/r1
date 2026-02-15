(function() {
  // DOM element references - El Gordo La Primitiva
  const dateHolder = document.querySelector(".date-today-gordoprimitiva");
  const timeHolder = document.querySelector(".timestamp-gordoprimitiva");
  const ticketBody = document.getElementById("numbers-gordoprimitiva");
  const quickpick = document.getElementById("quick-pick-gordoprimitiva");
  const resetButton = document.getElementById("reset-ticket-gordoprimitiva");

  const MAX_LINES = 10;
  let lineCount = 0;

  if (quickpick) quickpick.addEventListener("click", addOneLine);
  if (resetButton) resetButton.addEventListener("click", resetTicket);

  // Optional: uncomment to add one line automatically on load
  // addOneLine();

  function addOneLine() {
    if (lineCount >= MAX_LINES) {
      alert("You've reached the maximum of 10 lines per El Gordo La Primitiva generator! Click reset to start again.");
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
        // Main numbers (1-54)
        number.className = `alt-num${index + 1}`;
      } else {
        // Reintegro (0-9)
        number.className = "RI RI1";
      }

      number.className += " number";
      number.textContent = value < 10 ? `0${value}` : value;

      line.appendChild(number);
    });

    // Copy button for this line
    const copyBtn = document.createElement("li");
    copyBtn.className = "copy-btn";
    copyBtn.textContent = "📋";
    copyBtn.title = "Copy this line (main numbers | Reintegro)";
    copyBtn.style.cursor = "pointer";
    copyBtn.style.fontSize = "1.3em";
    copyBtn.style.marginLeft = "10px";
    copyBtn.style.padding = "4px 8px";
    copyBtn.style.borderRadius = "6px";
    copyBtn.style.background = "rgba(255,255,255,0.12)";
    copyBtn.style.transition = "all 0.2s";

    copyBtn.addEventListener("click", () => {
      // Get all numbers from this line
      const numbers = Array.from(line.querySelectorAll(".number"))
                           .map(el => el.textContent.trim());

      // Split: first 5 = main numbers, last 1 = Reintegro
      const mainNumbers = numbers.slice(0, 5).join(" ");
      const reintegro   = numbers.slice(5).join(" ");

      // Format: main numbers | Reintegro
      const textToCopy = `${mainNumbers} | ${reintegro}`;

      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          // Success feedback
          const originalText = copyBtn.textContent;
          copyBtn.textContent = "✅";
          setTimeout(() => {
            copyBtn.textContent = originalText;
          }, 1800);
        })
        .catch(err => {
          console.error("Clipboard copy failed:", err);
          alert("Could not copy — please select the numbers manually.");
        });
    });

    // Hover effect
    copyBtn.addEventListener("mouseenter", () => {
      copyBtn.style.background = "rgba(255,255,255,0.25)";
    });
    copyBtn.addEventListener("mouseleave", () => {
      copyBtn.style.background = "rgba(255,255,255,0.12)";
    });

    line.appendChild(copyBtn);
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

    // Reintegro: single digit 0–9
    const reintegro = randomNumber(9, 0);  // 0 to 9 inclusive
    pick.push(reintegro);

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