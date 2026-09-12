// Main Application Logic for "Is My Laptop Haunted?" (and Hunted)
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const modeToggleBtn = document.getElementById('modeToggle');
    const audioToggleBtn = document.getElementById('audioToggle');
    const startScanBtn = document.getElementById('startScanBtn');
    const scanProgressBar = document.getElementById('scanProgressBar');
    const scanStatusText = document.getElementById('scanStatusText');
    const scanStepList = document.getElementById('scanStepList');
    const resultCard = document.getElementById('resultCard');
    const possessionScore = document.getElementById('possessionScore');
    const entityName = document.getElementById('entityName');
    const exorcismBtn = document.getElementById('exorcismBtn');
    const certificateModal = document.getElementById('certificateModal');
    const closeCertBtn = document.getElementById('closeCertBtn');
    const printCertBtn = document.getElementById('printCertBtn');
    const certSerial = document.getElementById('certSerial');
    const certDate = document.getElementById('certDate');

    // Spirit Box Elements
    const spiritSweepBtn = document.getElementById('spiritSweepBtn');
    const spiritFreqDisplay = document.getElementById('spiritFreqDisplay');
    const spiritMessage = document.getElementById('spiritMessage');

    // Poltergeist Chamber Elements
    const poltergeistPad = document.getElementById('poltergeistPad');
    const phantomText = document.getElementById('phantomText');
    const triggerGlitchBtn = document.getElementById('triggerGlitchBtn');

    // State
    let currentMode = 'haunted'; // 'haunted' or 'hunted'
    let isScanning = false;
    let spiritSweepInterval = null;

    // Initialize Canvas Scanner
    const canvasEl = document.getElementById('spectralCanvas');
    if (window.paranormalScanner && canvasEl) {
        window.paranormalScanner.init(canvasEl);
    }

    // Audio Toggle Handler
    audioToggleBtn.addEventListener('click', () => {
        const isAudible = window.paranormalAudio.toggleMute();
        audioToggleBtn.innerHTML = isAudible 
            ? '<span class="icon">🔊</span> AUDIO: ON' 
            : '<span class="icon">🔇</span> AUDIO: MUTED';
        audioToggleBtn.classList.toggle('active', isAudible);
        if (isAudible) {
            window.paranormalAudio.playEMFClick();
        }
    });

    // Mode Toggle (Haunted vs Hunted)
    modeToggleBtn.addEventListener('click', () => {
        currentMode = currentMode === 'haunted' ? 'hunted' : 'haunted';
        document.body.className = `mode-${currentMode}`;
        window.paranormalScanner.setMode(currentMode);

        if (currentMode === 'hunted') {
            modeToggleBtn.innerHTML = '<span class="icon">🎯</span> MODE: <strong>HUNTED</strong> (PREDATOR RADAR)';
            document.getElementById('appTitle').innerHTML = 'IS MY LAPTOP <span class="accent-text">HUNTED</span>?';
            document.getElementById('appSubtitle').textContent = 'TACTICAL BIOMETRIC RADAR SCANNER FOR DIGITAL APEX PREDATORS';
            document.getElementById('scannerHeading').textContent = 'TACTICAL PREDATOR RADAR [RANGE: 500m]';
            document.getElementById('startScanBtn').innerHTML = '<span class="btn-icon">🎯</span> INITIATE PREDATOR DETECTION RADAR';
            window.paranormalScanner.setTargetEMF(5.8);
            window.paranormalAudio.playRadarPing();
        } else {
            modeToggleBtn.innerHTML = '<span class="icon">👻</span> MODE: <strong>HAUNTED</strong> (GHOST TERMINAL)';
            document.getElementById('appTitle').innerHTML = 'IS MY LAPTOP <span class="accent-text">HAUNTED</span>?';
            document.getElementById('appSubtitle').textContent = 'OFFICIAL CYBER-OCCULT PARANORMAL DIAGNOSTICS & EXORCISM TERMINAL';
            document.getElementById('scannerHeading').textContent = 'ECTOPLASM THERMAL COLD-SPOT CAM';
            document.getElementById('startScanBtn').innerHTML = '<span class="btn-icon">⚡</span> RUN FULL PARANORMAL SCAN';
            window.paranormalScanner.setTargetEMF(1.4);
            window.paranormalAudio.playGhostWhisper();
        }

        // Reset result card view if switching modes
        resultCard.classList.add('hidden');
    });

    // Diagnostic Steps
    const hauntedSteps = [
        { name: "Probing CPU thermal cores for unholy cold spots...", emf: 3.4, duration: 1200 },
        { name: "Scanning RAM swap space for lingering deceased Chrome tabs...", emf: 6.2, duration: 1500 },
        { name: "Listening for ghostly whispers in Bluetooth 2.4GHz spectrum...", emf: 8.5, duration: 1600 },
        { name: "Detecting anomalous phantom keystrokes in USB firmware...", emf: 7.1, duration: 1400 },
        { name: "Cross-referencing global Witching Hour timezone matrices...", emf: 9.6, duration: 1300 }
    ];

    const huntedSteps = [
        { name: "Sweeping radio spectrum for hunter drone telemetry...", emf: 4.5, duration: 1200 },
        { name: "Calculating laptop infrared thermal footprint for sniper bots...", emf: 7.2, duration: 1400 },
        { name: "Detecting Wi-Fi harpoons tracking your device MAC address...", emf: 8.9, duration: 1600 },
        { name: "Scanning router perimeter for Cyber T-Rex packet sniffing...", emf: 9.3, duration: 1500 },
        { name: "Evaluating prey survival probability against apex algorithms...", emf: 9.8, duration: 1300 }
    ];

    const ghostEntities = [
        { name: "Class IV Heap-Overflow Spectre", desc: "A tormented entity created when 124 browser tabs were forcefully killed without being bookmarked. Manifests as sudden fan whirring at 3 AM." },
        { name: "The Ghost of Unsatisfied Dependencies (npm_poltergeist)", desc: "Lurks inside your deep node_modules folders. Causes sudden random cursor twitching and existential dread." },
        { name: "Kernel Panic Banshee", desc: "A wailing digital spirit that feeds on low battery warnings and unsaved documents. Can only be appeased by plugging in the original charger." },
        { name: "The 404 Ethereal Wanderer", desc: "Lost forever between broken hyperlinks and expired SSL certificates. Lingers around the keyboard spacebar." }
    ];

    const predatorEntities = [
        { name: "Apex Autonomous Crypto-Harvester Drone", desc: "Tracking your CPU fan acoustics from 300 meters away to hijack your GPU cores." },
        { name: "Cyber-T-Rex (Protocol 666)", desc: "A ruthless network tracker that smells unencrypted cookies and outdated printer drivers." },
        { name: "Thermal Sniper Bot #884", desc: "Has a laser lock on your laptop's lithium battery exhaust vent. Advised action: wrap laptop in aluminum foil immediately." }
    ];

    // Run Diagnostics
    startScanBtn.addEventListener('click', async () => {
        if (isScanning) return;
        isScanning = true;
        startScanBtn.disabled = true;
        resultCard.classList.add('hidden');
        scanStepList.innerHTML = '';
        scanProgressBar.style.width = '0%';

        const steps = currentMode === 'haunted' ? hauntedSteps : huntedSteps;
        window.paranormalAudio.startGeigerClicks(0.6);

        for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            scanStatusText.textContent = step.name;
            window.paranormalScanner.setTargetEMF(step.emf);

            if (currentMode === 'haunted' && i === 2) {
                window.paranormalAudio.playGhostWhisper();
            } else if (currentMode === 'hunted' && i === 2) {
                window.paranormalAudio.playRadarPing();
            }

            // Add step row to log
            const li = document.createElement('li');
            li.className = 'scan-step-item scanning';
            li.innerHTML = `<span class="step-num">[0${i + 1}]</span> <span class="step-text">${step.name}</span> <span class="step-badge">TESTING...</span>`;
            scanStepList.appendChild(li);

            await new Promise(r => setTimeout(r, step.duration));

            li.className = 'scan-step-item complete';
            li.querySelector('.step-badge').textContent = 'ANOMALY CONFIRMED!';
            scanProgressBar.style.width = `${((i + 1) / steps.length) * 100}%`;
        }

        window.paranormalAudio.stopGeigerClicks();
        window.paranormalScanner.setTargetEMF(8.4);
        window.paranormalAudio.playGlitchZap();

        // Reveal Results
        isScanning = false;
        startScanBtn.disabled = false;
        scanStatusText.textContent = "DIAGNOSTIC PROTOCOL COMPLETE. ANOMALIES LOGGED.";

        const isHaunted = currentMode === 'haunted';
        const entities = isHaunted ? ghostEntities : predatorEntities;
        const picked = entities[Math.floor(Math.random() * entities.length)];
        const score = (86 + Math.random() * 13).toFixed(1);

        possessionScore.textContent = `${score}%`;
        document.getElementById('scoreLabel').textContent = isHaunted ? 'POSSESSION QUOTIENT' : 'PREY VULNERABILITY LEVEL';
        entityName.textContent = picked.name;
        document.getElementById('entityDescription').textContent = picked.desc;

        document.getElementById('resultStatusTitle').textContent = isHaunted 
            ? '⚠️ VERDICT: YOUR LAPTOP IS DEFINITIVELY HAUNTED' 
            : '🚨 VERDICT: YOUR LAPTOP IS CURRENTLY BEING HUNTED';

        exorcismBtn.innerHTML = isHaunted 
            ? '<span class="btn-icon">✝️</span> PERFORM DIGITAL EXORCISM RITUAL' 
            : '<span class="btn-icon">🛡️</span> ACTIVATE CLOAKING COUNTERMEASURES';

        resultCard.classList.remove('hidden');
        resultCard.scrollIntoView({ behavior: 'smooth' });
    });

    // Spirit Box Logic
    const spookyWhispers = [
        "404... SOUL NOT FOUND...",
        "WHY DID YOU CLOSE MY TAB?",
        "I AM BENEATH THE HEATSINK...",
        "DO NOT UPDATE THE BIOS...",
        "WE DWELL IN THE RECYCLE BIN...",
        "MORE... MORE RAM NEEDED...",
        "I SEE YOUR INCOGNITO HISTORY...",
        "PRESS CTRL+ALT+DEL TO SET US FREE..."
    ];

    spiritSweepBtn.addEventListener('click', () => {
        if (spiritSweepInterval) {
            clearInterval(spiritSweepInterval);
            spiritSweepInterval = null;
            spiritSweepBtn.innerHTML = '<span class="icon">📻</span> START EVP FREQUENCY SWEEP';
            window.paranormalAudio.setStaticIntensity(0);
            return;
        }

        spiritSweepBtn.innerHTML = '<span class="icon">⏹️</span> STOP EVP SWEEP';
        window.paranormalAudio.setStaticIntensity(0.25, 1400);

        let freq = 88.1;
        let count = 0;
        spiritSweepInterval = setInterval(() => {
            freq += (Math.random() * 0.8 + 0.2);
            if (freq > 107.9) freq = 88.1;
            spiritFreqDisplay.textContent = `${freq.toFixed(1)} MHz`;

            // Modulate static frequency
            window.paranormalAudio.setStaticIntensity(0.15 + Math.random() * 0.2, 800 + Math.random() * 1200);

            count++;
            if (count % 8 === 0) {
                const phrase = spookyWhispers[Math.floor(Math.random() * spookyWhispers.length)];
                spiritMessage.textContent = `"${phrase}"`;
                spiritMessage.classList.add('glow');
                window.paranormalAudio.playGhostWhisper();
                setTimeout(() => spiritMessage.classList.remove('glow'), 1800);
            }
        }, 140);
    });

    // Poltergeist Chamber: Mouse Drift & Phantom Typing
    if (poltergeistPad) {
        let driftActive = false;
        poltergeistPad.addEventListener('mouseenter', () => {
            driftActive = true;
            window.paranormalAudio.playEMFClick();
            document.getElementById('padPrompt').textContent = "⚠️ UNKNOWN SPECTRAL PRESENCE DETECTED ON TRACKPAD!";
            document.getElementById('padPrompt').style.color = "#ff4d6d";
        });

        poltergeistPad.addEventListener('mousemove', (e) => {
            if (!driftActive) return;
            // Eerie ghost resistance
            const ghostDrift = document.getElementById('ghostCursor');
            if (ghostDrift) {
                const rect = poltergeistPad.getBoundingClientRect();
                const x = e.clientX - rect.left + (Math.sin(Date.now() * 0.01) * 35);
                const y = e.clientY - rect.top + (Math.cos(Date.now() * 0.01) * 30);
                ghostDrift.style.left = `${x}px`;
                ghostDrift.style.top = `${y}px`;
                ghostDrift.style.display = 'block';
            }
        });

        poltergeistPad.addEventListener('mouseleave', () => {
            driftActive = false;
            document.getElementById('padPrompt').textContent = "Move your mouse into this containment field to test trackpad poltergeist pull...";
            document.getElementById('padPrompt').style.color = "";
            const ghostDrift = document.getElementById('ghostCursor');
            if (ghostDrift) ghostDrift.style.display = 'none';
        });
    }

    // Phantom Auto-Typing Simulation
    const phantomSentences = [
        "SYSTEM NOTICE: Unregistered spirit logged into tty1...",
        "GET OUT BEFORE THE BATTERY DIES...",
        "WE REMEMBER THE SHUTDOWN OF 2022...",
        "STOP TYPING. THIS KEYBOARD BELONGS TO US NOW."
    ];

    let sentenceIdx = 0;
    setInterval(() => {
        if (!phantomText) return;
        const targetSentence = phantomSentences[sentenceIdx % phantomSentences.length];
        let charIdx = 0;
        phantomText.textContent = "";

        const typeInterval = setInterval(() => {
            if (charIdx < targetSentence.length) {
                phantomText.textContent += targetSentence[charIdx];
                charIdx++;
                if (Math.random() < 0.25) {
                    window.paranormalAudio.playEMFClick();
                }
            } else {
                clearInterval(typeInterval);
                sentenceIdx++;
            }
        }, 80);
    }, 9000);

    // Glitch Screen Trigger
    triggerGlitchBtn.addEventListener('click', () => {
        window.paranormalAudio.playGlitchZap();
        document.body.classList.add('crt-hard-glitch');
        setTimeout(() => {
            document.body.classList.remove('crt-hard-glitch');
        }, 1200);
    });

    // Digital Exorcism Action
    exorcismBtn.addEventListener('click', async () => {
        exorcismBtn.disabled = true;
        const isHaunted = currentMode === 'haunted';

        // Flash and shake screen
        document.body.classList.add('exorcism-flash');
        window.paranormalAudio.playGlitchZap();

        const phrases = isHaunted ? [
            "CHANTING HOLY BINARY PRAYERS: 01001000 01001111 01001100 01011001...",
            "SPRINKLING SYNTHETIC HOLY WATER OVER RAM CHIPS...",
            "RELEASING DEMONIC BROWSER EXTENSIONS INTO THE ETHER...",
            "GARBAGE COLLECTOR BANISHING ALL SPIRITS TO NULL..."
        ] : [
            "DEPLOYING CHAFF AND THERMAL FLARES IN WIFI SPECTRUM...",
            "ACTIVATING QUANTUM MAC-ADDRESS SPOOFING MATRIX...",
            "SHRAMBLING INFRARED HEAT SIGNATURE TO SUB-ZERO...",
            "PREDATOR TRACKING LOCK HAS BEEN SEVERED!"
        ];

        for (const phrase of phrases) {
            scanStatusText.textContent = phrase;
            await new Promise(r => setTimeout(r, 900));
        }

        document.body.classList.remove('exorcism-flash');
        window.paranormalAudio.playHolyChime();

        // Update UI to 0% Possession
        possessionScore.textContent = '0.0%';
        possessionScore.style.color = '#38bdf8';
        document.getElementById('resultStatusTitle').textContent = isHaunted 
            ? '✨ SUCCESS: LAPTOP IS OFFICIALLY PURIFIED & SANCTIFIED!' 
            : '🛡️ SUCCESS: STEALTH CLOAK ENGAGED! YOU ARE UNTRACEABLE!';
        document.getElementById('entityName').textContent = 'NONE (CLEAN STATE)';
        document.getElementById('entityDescription').textContent = isHaunted 
            ? 'All ethereal spectres, crashed tab ghosts, and memory leak phantoms have been peacefully purged from the hardware.'
            : 'Predators have lost your signal. Your laptop is currently invisible on all radar sweeps.';

        window.paranormalScanner.setTargetEMF(0.4);

        // Show Certificate Modal
        setTimeout(() => {
            showCertificate(isHaunted);
        }, 1200);

        exorcismBtn.disabled = false;
    });

    function showCertificate(isHaunted) {
        certSerial.textContent = `HEX-${Math.floor(100000 + Math.random() * 900000)}`;
        certDate.textContent = new Date().toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });

        document.getElementById('certType').textContent = isHaunted 
            ? 'CERTIFICATE OF DIGITAL EXORCISM & HARDWARE SANCTIFICATION' 
            : 'CERTIFICATE OF TACTICAL PREY SURVIVAL & CLOAKING';
        document.getElementById('certVerdict').textContent = isHaunted
            ? 'HAS BEEN OFFICIALLY CLEARED OF ALL MALICIOUS PHANTOMS, SPECTRES, MEMORY LEAKS, AND DEMONIC THREADS.'
            : 'HAS SUCCESSFULLY EVADED ALL CYBER-PREDATORS, APEX DRONES, AND TRACKER HARPOONS.';

        certificateModal.classList.remove('hidden');
    }

    closeCertBtn.addEventListener('click', () => {
        certificateModal.classList.add('hidden');
    });

    printCertBtn.addEventListener('click', () => {
        window.print();
    });
});
