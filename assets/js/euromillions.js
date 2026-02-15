(function() {
  // DOM element references - EuroMillions
  const dateHolder = document.querySelector(".date-today-euros");
  const timeHolder = document.querySelector(".timestamp-euros");
  const ticketBody = document.getElementById("numbers-euros");
  const quickpick = document.getElementById("quick-pick-euros");
  const resetButton = document.getElementById("reset-ticket-euros");

  const MAX_LINES = 10;
  let lineCount = 0;

  if (quickpick) quickpick.addEventListener("click", addOneLine);
  if (resetButton) resetButton.addEventListener("click", resetTicket);

  // Optional: uncomment to add one line automatically on load
  // addOneLine();

  function addOneLine() {
    if (lineCount >= MAX_LINES) {
      alert("You've reached the maximum of 10 lines per EuroMillions generator! Click reset to start again.");
      return;
    }

    if (lineCount === 0) {
      dateHolder.textContent = getDate();
      timeHolder.textContent = getTimestamp();
    }

    const pick = generatePick();
    const line = document.createElement("ul");

    // Add the 5 main numbers + 2 Lucky Stars
    pick.forEach((value, index) => {
      const number = document.createElement("li");

      if (index < 5) {
        number.className = `num${index + 1}`;
      } else if (index === 5) {
        number.className = "LS LS1";
      } else {
        number.className = "LS LS2";
      }

      number.className += " number";
      number.textContent = value < 10 ? `0${value}` : value;

      line.appendChild(number);
    });

    // Copy button for this line
    const copyBtn = document.createElement("li");
    copyBtn.className = "copy-btn";
    copyBtn.textContent = "📋";
    copyBtn.title = "Copy this line (main | stars)";
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

      // Split: first 5 = main numbers, last 2 = lucky stars
      const mainNumbers = numbers.slice(0, 5).join(" ");
      const luckyStars = numbers.slice(5).join(" ");

      // Format: main numbers | lucky stars
      const textToCopy = `${mainNumbers} | ${luckyStars}`;

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

    // 5 unique main numbers (1–50)
    while (pick.length < 5) {
      const num = randomNumber(50, 1);
      if (!pick.includes(num)) {
        pick.push(num);
      }
    }
    pick.sort((a, b) => a - b);

    // 2 unique Lucky Stars (1–12), sorted ascending
    const luckyStars = [];
    while (luckyStars.length < 2) {
      const num = randomNumber(12, 1);
      if (!luckyStars.includes(num)) {
        luckyStars.push(num);
      }
    }
    luckyStars.sort((a, b) => a - b);

    pick.push(...luckyStars);

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