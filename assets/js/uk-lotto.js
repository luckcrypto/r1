(function() {
  // DOM element references - UK National Lottery
  const dateHolder    = document.querySelector(".date-today-uk");
  const timeHolder    = document.querySelector(".timestamp-uk");
  const ticketBody    = document.getElementById("numbers-uk");
  const quickpick     = document.getElementById("quick-pick-uk");
  const resetButton   = document.getElementById("reset-ticket-uk");
  const patternSelect = document.getElementById("pattern-select-uk");

  const MAX_LINES = 10;
  let lineCount = 0;

  if (quickpick)    quickpick.addEventListener("click", addOneLine);
  if (resetButton)  resetButton.addEventListener("click", resetTicket);

  // Optional: uncomment to add one line automatically on load
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

    const pattern = patternSelect.value;
    const pick = generatePickWithPattern(pattern);

    const line = document.createElement("ul");

    // Add the 6 main numbers
    pick.forEach((value, index) => {
      const number = document.createElement("li");
      number.className = `num${index + 1} number`;
      number.textContent = value < 10 ? `0${value}` : value;
      line.appendChild(number);
    });

    // Copy button for this line
    const copyBtn = document.createElement("li");
    copyBtn.className = "copy-btn";
    copyBtn.textContent = "📋";
    copyBtn.title = "Copy this line";
    copyBtn.style.cursor = "pointer";
    copyBtn.style.fontSize = "1.3em";
    copyBtn.style.marginLeft = "10px";
    copyBtn.style.padding = "4px 8px";
    copyBtn.style.borderRadius = "6px";
    copyBtn.style.background = "rgba(255,255,255,0.12)";
    copyBtn.style.transition = "all 0.2s";

    copyBtn.addEventListener("click", () => {
      const numbers = Array.from(line.querySelectorAll(".number"))
                           .map(el => el.textContent.trim());
      const textToCopy = numbers.join(" ");

      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          const originalText = copyBtn.textContent;
          copyBtn.textContent = "✅";
          setTimeout(() => { copyBtn.textContent = originalText; }, 1800);
        })
        .catch(err => {
          console.error("Clipboard copy failed:", err);
          alert("Could not copy — please select manually.");
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

  // ────────────────────────────────────────────────
  // Main generation logic with odd/even control
  // ────────────────────────────────────────────────
  function generatePickWithPattern(pattern) {
    const odds  = [];
    const evens = [];

    // UK Lotto: 1–59
    for (let i = 1; i <= 59; i++) {
      if (i % 2 === 0) evens.push(i);
      else             odds.push(i);
    }

    let targetOddCount;

    switch (pattern) {
      case "random":   return generateRandomPick();
      case "1o5e":     targetOddCount = 1;  break;
      case "2o4e":     targetOddCount = 2;  break;
      case "3o3e":     targetOddCount = 3;  break;
      case "4o2e":     targetOddCount = 4;  break;
      case "5o1e":     targetOddCount = 5;  break;
      case "6o":       targetOddCount = 6;  break;
      case "0o":       targetOddCount = 0;  break;
      default:         return generateRandomPick(); // fallback
    }

    const selected = [];

    // Pick required odds
    let remainingOdd = targetOddCount;
    while (remainingOdd > 0 && odds.length > 0) {
      const idx = Math.floor(Math.random() * odds.length);
      selected.push(odds.splice(idx, 1)[0]);
      remainingOdd--;
    }

    // Pick the rest as evens
    let remainingEven = 6 - selected.length;
    while (remainingEven > 0 && evens.length > 0) {
      const idx = Math.floor(Math.random() * evens.length);
      selected.push(evens.splice(idx, 1)[0]);
      remainingEven--;
    }

    // If we couldn't get enough numbers (very unlikely), fall back to random
    if (selected.length < 6) {
      console.warn("Couldn't satisfy pattern — falling back to random");
      return generateRandomPick();
    }

    selected.sort((a, b) => a - b);
    return selected;
  }

  function generateRandomPick() {
    const pick = [];
    while (pick.length < 6) {
      const value = randomNumber(59, 1);
      if (!pick.includes(value)) pick.push(value);
    }
    pick.sort((a, b) => a - b);
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