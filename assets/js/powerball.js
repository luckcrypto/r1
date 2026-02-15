(function() {
  // DOM element references
  const dateHolder = document.querySelector(".date-today");
  const timeHolder = document.querySelector(".timestamp");
  const ticketBody = document.getElementById("numbers");
  const quickpick = document.getElementById("quick-pick");
  const resetButton = document.getElementById("reset-ticket");

  const MAX_LINES = 10;
  let lineCount = 0;

  if (quickpick) quickpick.addEventListener("click", addOneLine);
  if (resetButton) resetButton.addEventListener("click", resetTicket);

  // Optional: uncomment to add one line automatically on load
  // addOneLine();

  function addOneLine() {
    if (lineCount >= MAX_LINES) {
      alert("You've reached the maximum of 10 lines per Powerball generator! Click reset to start again.");
      return;
    }

    if (lineCount === 0) {
      dateHolder.textContent = getDate();
      timeHolder.textContent = getTimestamp();
    }

    const pick = generatePick();
    const line = document.createElement("ul");

    // Add the 5 white balls + 1 Powerball
    pick.forEach((value, index) => {
      const number = document.createElement("li");

      if (index < 5) {
        number.className = `num${index + 1}`;
      } else {
        number.className = "PB PB1";
      }

      number.className += " number";
      number.textContent = value < 10 ? `0${value}` : value;

      line.appendChild(number);
    });

    // Copy button for this line
    const copyBtn = document.createElement("li");
    copyBtn.className = "copy-btn";
    copyBtn.textContent = "📋";
    copyBtn.title = "Copy this line (white balls | Powerball)";
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

      // Split: first 5 = white balls, last 1 = Powerball
      const whiteBalls = numbers.slice(0, 5).join(" ");
      const powerball  = numbers.slice(5).join(" ");

      // Format: white balls | Powerball
      const textToCopy = `${whiteBalls} | ${powerball}`;

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

    // 5 unique white balls from 1–69 (current official range)
    while (pick.length < 5) {
      const value = randomNumber(69, 1);
      if (!pick.includes(value)) {
        pick.push(value);
      }
    }
    pick.sort((a, b) => a - b);

    // Single Powerball from 1–26 (current official range)
    const pb = randomNumber(26, 1);
    pick.push(pb);

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