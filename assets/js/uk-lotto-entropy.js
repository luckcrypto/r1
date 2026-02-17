// uk-lotto-generator.js
// UK Lotto generator with working advanced toggle + mouse-entropy collection modal

(function() {
    // ────────────────────────────────────────────────
    // DOM references
    // ────────────────────────────────────────────────
    const dateHolder       = document.querySelector(".date-today-uk-entropy");
    const timeHolder       = document.querySelector(".timestamp-uk-entropy");
    const ticketBody       = document.getElementById("numbers-uk-entropy");
    const quickpick        = document.getElementById("quick-pick-uk-entropy");
    const resetButton      = document.getElementById("reset-ticket-uk-entropy");
    const patternSelect    = document.getElementById("pattern-select-uk-entropy");
    const toggleBtn        = document.getElementById("toggle-pattern-btn");
    const patternRow       = document.getElementById("pattern-row");

    // Entropy modal elements (must exist in HTML)
    const entropyOverlay   = document.getElementById("entropy-overlay");
    const entropyCanvas    = document.getElementById("entropy-canvas");
    const entropyProgressBar = document.getElementById("entropy-progress-bar");
    const entropyProgressText = document.getElementById("entropy-progress-text");
    const entropyDone      = document.getElementById("entropy-done");
    const entropyCancel    = document.getElementById("entropy-cancel");

    const MAX_LINES = 10;
    let lineCount = 0;
    let patternFilterEnabled = false;

    // Entropy state
    const ENTROPY_REQUIRED = 256;
    let entropyData = [];
    let trailPositions = [];
    let collectingEntropy = false;
    let entropySeed = null;
    let rng = null;

    // ────────────────────────────────────────────────
    // Initial setup
    // ────────────────────────────────────────────────
    if (patternRow) patternRow.hidden = true;
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
    if (quickpick) quickpick.addEventListener("click", handleQuickPick);
    if (resetButton) resetButton.addEventListener("click", resetTicket);
    if (toggleBtn) {
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
    if (entropyCanvas) entropyCanvas.addEventListener("mousemove", collectEntropy);
    if (entropyDone) entropyDone.addEventListener("click", finishEntropyCollection);
    if (entropyCancel) entropyCancel.addEventListener("click", cancelEntropyCollection);

    // ────────────────────────────────────────────────
    // Entropy collection logic
    // ────────────────────────────────────────────────
    function handleQuickPick() {
        if (!entropySeed) {
            startEntropyCollection();
            return;
        }
        addOneLine();
    }

    function startEntropyCollection() {
        if (entropyOverlay) {
            entropyOverlay.style.display = "flex";
            setTimeout(() => { entropyOverlay.style.opacity = "1"; }, 10);
        }
        collectingEntropy = true;
        entropyData = [];
        trailPositions = [];
        updateEntropyProgress();
        entropyDone.disabled = true;
        entropyDone.style.opacity = "0.28";
        entropyDone.style.cursor = "not-allowed";
        drawTrail();
    }

    function collectEntropy(e) {
        if (!collectingEntropy) return;
        const rect = entropyCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const time = performance.now();

        entropyData.push({x, y, time});
        trailPositions.push({x, y});
        if (trailPositions.length > 1024) trailPositions.shift();

        updateEntropyProgress();

        if (entropyData.length >= ENTROPY_REQUIRED) {
            entropyDone.disabled = false;
            entropyDone.style.opacity = "1";
            entropyDone.style.cursor = "pointer";
        }
    }

    async function finishEntropyCollection() {
        collectingEntropy = false;
        if (entropyOverlay) entropyOverlay.style.opacity = "0";
        setTimeout(() => { if (entropyOverlay) entropyOverlay.style.display = "none"; }, 400);

        const entropyString = JSON.stringify(entropyData);
        const encoder = new TextEncoder();
        const data = encoder.encode(entropyString);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = new Uint32Array(hashBuffer);

        entropySeed = hashArray;
        rng = sfc32(entropySeed[0], entropySeed[1], entropySeed[2], entropySeed[3]);

        addOneLine();
    }

    function cancelEntropyCollection() {
        collectingEntropy = false;
        if (entropyOverlay) entropyOverlay.style.opacity = "0";
        setTimeout(() => { if (entropyOverlay) entropyOverlay.style.display = "none"; }, 400);
        entropyData = [];
        trailPositions = [];
    }

    function updateEntropyProgress() {
        const count = Math.min(entropyData.length, ENTROPY_REQUIRED);
        const percent = (count / ENTROPY_REQUIRED) * 100;
        if (entropyProgressBar) entropyProgressBar.style.width = percent + "%";
        if (entropyProgressText) entropyProgressText.textContent = `${count} / ${ENTROPY_REQUIRED} movements`;
    }

    function drawTrail() {
        const ctx = entropyCanvas.getContext("2d");
        if (!ctx) return;
        ctx.clearRect(0, 0, entropyCanvas.width, entropyCanvas.height);

        for (let i = 0; i < trailPositions.length; i++) {
            const ratio = (i + 1) / trailPositions.length;
            ctx.beginPath();
            ctx.arc(trailPositions[i].x, trailPositions[i].y, 8 * ratio, 0, 2 * Math.PI);
            ctx.fillStyle = `rgba(41,239,143, ${ratio * 0.8})`;
            ctx.fill();
        }

        if (collectingEntropy) requestAnimationFrame(drawTrail);
    }

    // ────────────────────────────────────────────────
    // Core generation
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

        const line = document.createElement("ul");

        pick.forEach((value, index) => {
            const number = document.createElement("li");
            number.className = `num${index + 1} number`;

            const bgColor = getBallColor(value);
            number.style.backgroundColor = bgColor;

            if (bgColor === '#ffffff' || bgColor === '#FFFF00') {
                number.style.color = '#111111';
                number.style.textShadow = '0 1px 1px rgba(0,0,0,0.1)';
            } else {
                number.style.color = '#000000';
                number.style.textShadow = '0 1px 2px rgba(0,0,0,0.1)';
            }

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
        if (dateHolder) dateHolder.textContent = "";
        if (timeHolder) timeHolder.textContent = "";
        lineCount = 0;
    }

    // ────────────────────────────────────────────────
    // Number generation
    // ────────────────────────────────────────────────
    function generatePickWithPattern(pattern) {
        const odds = [], evens = [];
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
            const idx = Math.floor(myRandom() * odds.length);
            selected.push(odds.splice(idx, 1)[0]);
            remainingOdd--;
        }

        let remainingEven = 6 - selected.length;
        while (remainingEven > 0 && evens.length > 0) {
            const idx = Math.floor(myRandom() * evens.length);
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

    function myRandom() {
        return rng ? rng() : Math.random();
    }

    function sfc32(a, b, c, d) {
        return function() {
            a |= 0; b |= 0; c |= 0; d |= 0;
            let t = (a + b | 0) + d | 0;
            d = d + 1 | 0;
            a = b ^ b >>> 9;
            b = c + (c << 3) | 0;
            c = (c << 21 | c >>> 11) + t | 0;
            return (t >>> 0) / 4294967296;
        };
    }

    // ────────────────────────────────────────────────
    // Helpers
    // ────────────────────────────────────────────────
    function getBallColor(number) {
        const n = Number(number);
        if (n <= 10) return '#ffffff';     // white
        if (n <= 20) return '#87CEEB';     // sky blue
        if (n <= 30) return '#FFB6C1';     // light pink
        if (n <= 40) return '#7CFC00';     // lime green
        if (n <= 50) return '#FFFF00';     // yellow
        return '#c985ff';                  // purple
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
        return Math.floor(myRandom() * (max - min + 1)) + min;
    }
})();