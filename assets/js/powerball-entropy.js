// Powerball generator with SHA-256 entropy collection (same as UK Lotto version)

(function() {
    // ────────────────────────────────────────────────
    // DOM references
    // ────────────────────────────────────────────────
    const dateHolder = document.querySelector(".date-today-powerball-entropy");
    const timeHolder = document.querySelector(".timestamp-powerball-entropy");
    const ticketBody = document.getElementById("numbers-powerball-entropy");
    const quickpick = document.getElementById("quick-pick-powerball-entropy");
    const resetButton = document.getElementById("reset-ticket-powerball-entropy");

    // Entropy modal elements (you need to add these to your HTML)
    const entropyOverlay = document.getElementById("entropy-overlay");
    const entropyCanvas = document.getElementById("entropy-canvas");
    const entropyProgressBar = document.getElementById("entropy-progress-bar");
    const entropyProgressText = document.getElementById("entropy-progress-text");
    const entropyDone = document.getElementById("entropy-done");
    const entropyCancel = document.getElementById("entropy-cancel");

    const MAX_LINES = 10;
    let lineCount = 0;
    let collectingEntropy = false;
    let entropyMixer = new Uint8Array(32);
    let eventCount = 0;
    let lastTime = 0;
    let trailPositions = [];
    let rng = null;

    const ENTROPY_REQUIRED_EVENTS = 256;

    // ────────────────────────────────────────────────
    // Event listeners
    // ────────────────────────────────────────────────
    if (quickpick) quickpick.addEventListener("click", handleQuickPick);
    if (resetButton) resetButton.addEventListener("click", resetTicket);

    // Entropy canvas events
    if (entropyCanvas) {
        entropyCanvas.addEventListener("mousemove", collectEntropyEvent);
        entropyCanvas.addEventListener("touchmove", collectEntropyEvent, { passive: false });
        entropyCanvas.addEventListener("touchstart", collectEntropyEvent, { passive: false });
    }
    if (entropyDone) entropyDone.addEventListener("click", finishEntropyCollection);
    if (entropyCancel) entropyCancel.addEventListener("click", cancelEntropyCollection);

    // ────────────────────────────────────────────────
    // Entropy logic
    // ────────────────────────────────────────────────
    function handleQuickPick() {
        if (!rng) {
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
        entropyMixer.fill(0);
        eventCount = 0;
        lastTime = performance.now();
        trailPositions = [];
        updateEntropyProgress();
        entropyDone.disabled = true;
        entropyDone.style.opacity = "0.28";
        entropyDone.style.cursor = "not-allowed";
        drawTrail();
    }

    function collectEntropyEvent(e) {
        if (!collectingEntropy) return;
        e.preventDefault?.();

        const rect = entropyCanvas.getBoundingClientRect();
        const touch = e.touches?.[0] ?? e;
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        const now = performance.now();
        const deltaTime = now - lastTime;

        const qx  = Math.floor(x * 4)   >>> 0;
        const qy  = Math.floor(y * 4)   >>> 0;
        const qdt = Math.floor(deltaTime * 8) >>> 0;

        for (let i = 0; i < 32; i += 4) {
            let v = (entropyMixer[i]   << 24 | entropyMixer[i+1] << 16 |
                     entropyMixer[i+2] <<  8 | entropyMixer[i+3]) >>> 0;

            v ^= qx ^ (qy << 16) ^ (qdt * (i + 1));
            const rot = ((qx + qy + i) % 31) + 1;
            v = (v << rot) | (v >>> (32 - rot));

            entropyMixer[i]   = (v >>> 24) & 0xff;
            entropyMixer[i+1] = (v >>> 16) & 0xff;
            entropyMixer[i+2] = (v >>>  8) & 0xff;
            entropyMixer[i+3] =  v         & 0xff;
        }

        lastTime = now;
        eventCount++;
        trailPositions.push({x, y});
        if (trailPositions.length > 1024) trailPositions.shift();

        updateEntropyProgress();
        checkEntropyReady();
    }

    function checkEntropyReady() {
        if (eventCount >= ENTROPY_REQUIRED_EVENTS) {
            entropyDone.disabled = false;
            entropyDone.style.opacity = "1";
            entropyDone.style.cursor = "pointer";
        }
    }

    async function finishEntropyCollection() {
        collectingEntropy = false;
        if (entropyOverlay) entropyOverlay.style.opacity = "0";
        setTimeout(() => { if (entropyOverlay) entropyOverlay.style.display = "none"; }, 400);

        const encoder = new TextEncoder();
        const context = encoder.encode(
            `canvas:${entropyCanvas.width}x${entropyCanvas.height};` +
            `events:${eventCount};` +
            `ts:${performance.now().toFixed(0)}`
        );

        const finalInput = new Uint8Array(entropyMixer.length + context.length);
        finalInput.set(entropyMixer);
        finalInput.set(context, entropyMixer.length);

        const hashBuffer = await crypto.subtle.digest('SHA-256', finalInput);
        const hashArray = new Uint32Array(hashBuffer);
        rng = sfc32(hashArray[0], hashArray[1], hashArray[2], hashArray[3]);

        console.log(`Powerball entropy collected: ${eventCount} events → seed created`);

        entropyMixer.fill(0);
        trailPositions = [];

        addOneLine();
    }

    function cancelEntropyCollection() {
        collectingEntropy = false;
        if (entropyOverlay) entropyOverlay.style.opacity = "0";
        setTimeout(() => { if (entropyOverlay) entropyOverlay.style.display = "none"; }, 400);
        entropyMixer.fill(0);
        trailPositions = [];
        eventCount = 0;
        // Auto-seed with secure RNG if cancelled
        autoSeed();
        addOneLine();
    }

    function autoSeed() {
        if (!rng) {
            const seed = new Uint32Array(4);
            crypto.getRandomValues(seed);
            rng = sfc32(seed[0], seed[1], seed[2], seed[3]);
            console.log("Powerball auto-seeded with crypto.getRandomValues");
        }
    }

    function updateEntropyProgress() {
        const count = Math.min(eventCount, ENTROPY_REQUIRED_EVENTS);
        const percent = (count / ENTROPY_REQUIRED_EVENTS) * 100;
        if (entropyProgressBar) entropyProgressBar.style.width = percent + "%";
        if (entropyProgressText) entropyProgressText.textContent = `${count} / ${ENTROPY_REQUIRED_EVENTS} movements`;
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
    // Ticket generation
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

        // Auto-seed if still no RNG (safety net)
        if (!rng) autoSeed();

        const pick = generatePick();

        const line = document.createElement("ul");

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

        // Copy button
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
            const numbers = Array.from(line.querySelectorAll(".number"))
                                 .map(el => el.textContent.trim());
            const whiteBalls = numbers.slice(0, 5).join(" ");
            const powerball = numbers[5];
            const textToCopy = `${whiteBalls} | ${powerball}`;
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
    function generatePick() {
        const pick = [];
        // 5 unique white balls 1–69
        while (pick.length < 5) {
            const value = randomNumber(69, 1);
            if (!pick.includes(value)) pick.push(value);
        }
        pick.sort((a, b) => a - b);

        // Powerball 1–26
        const pb = randomNumber(26, 1);
        pick.push(pb);

        return pick;
    }

    function randomNumber(max, min = 1) {
        return Math.floor(myRandom() * (max - min + 1)) + min;
    }

    function myRandom() {
        if (!rng) {
            autoSeed();
        }
        return rng();
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
})();