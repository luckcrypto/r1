(function() {
  // DOM element references - UK National Lottery
  const dateHolder    = document.querySelector(".date-today-uk");
  const timeHolder    = document.querySelector(".timestamp-uk");
  const ticketBody    = document.getElementById("numbers-uk");
  const quickpick     = document.getElementById("quick-pick-uk");
  const resetButton   = document.getElementById("reset-ticket-uk");
  const patternSelect = document.getElementById("pattern-select-uk");

  // New toggle elements
  const toggleBtn     = document.getElementById("toggle-pattern-btn");
  const patternRow    = document.getElementById("pattern-row");

  const MAX_LINES = 10;
  let lineCount = 0;

  let patternFilterEnabled = false;

  function getBallColor(number) {
    const n = Number(number);
    if (n <= 10) return '#ffffff';      // white
    if (n <= 20) return '#87CEEB';      // sky blue
    if (n <= 30) return '#FFB6C1';      // light pink
    if (n <= 40) return '#7CFC00';      // lime green
      if (n <= 50) return '#FFFF00';
    return '#c985ff';                  
  }

  if (patternRow) {
    patternRow.hidden = true;
  }
  if (patternSelect) {
    patternSelect.disabled = true;
    patternSelect.value = "random";
  }
  if (toggleBtn) {
    toggleBtn.innerHTML = `Advanced settings:‎ ‎ ‎ <strong>Disabled</strong>`;
    toggleBtn.classList.remove("on");
  }

  // ────────────────────────────────────────────────
  // Event listeners
  // ────────────────────────────────────────────────
  if (quickpick) quickpick.addEventListener("click", addOneLine);
  if (resetButton) resetButton.addEventListener("click", resetTicket);

  if (toggleBtn && patternRow && patternSelect) {
    toggleBtn.addEventListener("click", () => {
      patternFilterEnabled = !patternFilterEnabled;

      toggleBtn.innerHTML = `Advanced settings:‎ ‎ ‎ <strong>${patternFilterEnabled ? "Enabled" : "Disabled"}</strong>`;
      toggleBtn.classList.toggle("on", patternFilterEnabled);

      if (patternFilterEnabled) {
        patternRow.hidden = false;
        patternSelect.disabled = false;
      } else {
        patternRow.hidden = true;
        patternSelect.disabled = true;
        patternSelect.value = "random";
      }
    });
  }

  // ────────────────────────────────────────────────
  // Core functions
  // ────────────────────────────────────────────────
  function addOneLine() {
    if (lineCount >= MAX_LINES) {
      alert("You've reached the maximum of 10 lines! Click reset to start again.");
      return;
    }

    if (lineCount === 0) {
      dateHolder.textContent = getDate();
      timeHolder.textContent = getTimestamp();
    }

    let pattern = "random";
    if (patternFilterEnabled && !patternRow.hidden) {
      pattern = patternSelect.value;
    }

    const pick = generatePickWithPattern(pattern);

    // Create the visual line
    const line = document.createElement("ul");

    pick.forEach((value, index) => {
      const number = document.createElement("li");
      number.className = `num${index + 1} number`;

      // ── Apply the same color as in the drum ──
      const bgColor = getBallColor(value);
      number.style.backgroundColor = bgColor;

      // Optional: better contrast adjustments
      // White & yellow backgrounds → dark text
      if (bgColor === '#ffffff' || bgColor === '#FFFF00') {
        number.style.color = '#111111';
        number.style.textShadow = '0 1px 1px rgba(0,0,0,0.1)';
      } else {
        number.style.color = '#000000';
        number.style.textShadow = '0 1px 2px rgba(0,0,0,0.1)';
      }

      // Optional: slight border / shadow to look more like balls
      number.style.boxShadow = 'inset 0 2px 6px rgba(0,0,0,0.35), 0 2px 8px rgba(0,0,0,0.4)';
      number.style.border = '1px solid rgba(0,0,0,0.25)';

      number.textContent = value < 10 ? `0${value}` : value;
      line.appendChild(number);
    });

    // Copy button
    const copyBtn = document.createElement("li");
    copyBtn.className = "copy-btn";
    copyBtn.textContent = "copy";
    copyBtn.title = "Copy this line";
    copyBtn.style.cursor = "pointer";
    copyBtn.style.fontSize = "10px";
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
          const original = copyBtn.textContent;
          copyBtn.textContent = "✅";
          setTimeout(() => { copyBtn.textContent = original; }, 1800);
        })
        .catch(err => {
          console.error("Clipboard failed:", err);
          alert("Could not copy — please select manually.");
        });
    });

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
  // Number generation (unchanged)
  // ────────────────────────────────────────────────
  function generatePickWithPattern(pattern) {
    const odds = [];
    const evens = [];
    for (let i = 1; i <= 59; i++) {
      if (i % 2 === 0) evens.push(i);
      else odds.push(i);
    }

    let targetOddCount;
    switch (pattern) {
      case "random": return generateRandomPick();
      case "1o5e": targetOddCount = 1; break;
      case "2o4e": targetOddCount = 2; break;
      case "3o3e": targetOddCount = 3; break;
      case "4o2e": targetOddCount = 4; break;
      case "5o1e": targetOddCount = 5; break;
      case "6o":   targetOddCount = 6; break;
      case "0o":   targetOddCount = 0; break;
      default:     return generateRandomPick();
    }

    const selected = [];
    let remainingOdd = targetOddCount;
    while (remainingOdd > 0 && odds.length > 0) {
      const idx = Math.floor(Math.random() * odds.length);
      selected.push(odds.splice(idx, 1)[0]);
      remainingOdd--;
    }

    let remainingEven = 6 - selected.length;
    while (remainingEven > 0 && evens.length > 0) {
      const idx = Math.floor(Math.random() * evens.length);
      selected.push(evens.splice(idx, 1)[0]);
      remainingEven--;
    }

    if (selected.length < 6) {
      console.warn("Pattern fallback to random");
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

  // ────────────────────────────────────────────────
  // Helpers
  // ────────────────────────────────────────────────
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