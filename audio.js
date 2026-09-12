// Procedural Web Audio API Paranormal Sound Synthesizer
class ParanormalAudio {
    constructor() {
        this.ctx = null;
        this.isMuted = true;
        this.staticNode = null;
        this.staticGain = null;
        this.staticFilter = null;
        this.ambientGain = null;
        this.thereminOsc = null;
        this.thereminGain = null;
        this.geigerInterval = null;
    }

    init() {
        if (this.ctx) return;
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();

        // Master Gain
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = this.isMuted ? 0 : 0.6;
        this.masterGain.connect(this.ctx.destination);

        this.setupRadioStatic();
        this.setupAmbientDrone();
    }

    toggleMute() {
        if (!this.ctx) this.init();
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        this.isMuted = !this.isMuted;
        if (this.masterGain) {
            this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : 0.6, this.ctx.currentTime, 0.05);
        }
        return !this.isMuted;
    }

    setupRadioStatic() {
        if (!this.ctx) return;
        const bufferSize = 2 * this.ctx.sampleRate;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = this.ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        this.staticFilter = this.ctx.createBiquadFilter();
        this.staticFilter.type = 'bandpass';
        this.staticFilter.frequency.value = 1200;
        this.staticFilter.Q.value = 3.0;

        this.staticGain = this.ctx.createGain();
        this.staticGain.gain.value = 0;

        whiteNoise.connect(this.staticFilter);
        this.staticFilter.connect(this.staticGain);
        this.staticGain.connect(this.masterGain);
        whiteNoise.start();
    }

    setupAmbientDrone() {
        if (!this.ctx) return;
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        osc1.type = 'sawtooth';
        osc2.type = 'sine';
        osc1.frequency.value = 55; // A1 deep drone
        osc2.frequency.value = 55.4; // slight beat detune

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 160;

        this.ambientGain = this.ctx.createGain();
        this.ambientGain.gain.value = 0.04;

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(this.ambientGain);
        this.ambientGain.connect(this.masterGain);

        osc1.start();
        osc2.start();
    }

    setStaticIntensity(amount, freq = 1200) {
        if (!this.staticGain || !this.ctx) return;
        const now = this.ctx.currentTime;
        this.staticGain.gain.setTargetAtTime(Math.min(0.4, amount), now, 0.05);
        this.staticFilter.frequency.setTargetAtTime(freq, now, 0.05);
    }

    playEMFClick() {
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const clickGain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(800 + Math.random() * 600, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.015);

        clickGain.gain.setValueAtTime(0.15, now);
        clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);

        osc.connect(clickGain);
        clickGain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.018);
    }

    startGeigerClicks(intensity = 0.5) {
        this.stopGeigerClicks();
        this.geigerInterval = setInterval(() => {
            if (Math.random() < intensity) {
                this.playEMFClick();
            }
        }, 120);
    }

    stopGeigerClicks() {
        if (this.geigerInterval) {
            clearInterval(this.geigerInterval);
            this.geigerInterval = null;
        }
    }

    playGhostWhisper() {
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const whisperGain = this.ctx.createGain();

        osc.type = 'sine';
        const baseFreq = 300 + Math.random() * 200;
        osc.frequency.setValueAtTime(baseFreq, now);
        osc.frequency.linearRampToValueAtTime(baseFreq + 150, now + 0.4);
        osc.frequency.linearRampToValueAtTime(baseFreq - 80, now + 0.9);

        whisperGain.gain.setValueAtTime(0, now);
        whisperGain.gain.linearRampToValueAtTime(0.08, now + 0.3);
        whisperGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

        osc.connect(whisperGain);
        whisperGain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 1.25);
    }

    playGlitchZap() {
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const zapGain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(2400, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.12);

        zapGain.gain.setValueAtTime(0.2, now);
        zapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        osc.connect(zapGain);
        zapGain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.13);
    }

    playHolyChime() {
        if (!this.ctx || this.isMuted) return;
        const chord = [523.25, 659.25, 783.99, 1046.50]; // C Major ethereal chime
        const now = this.ctx.currentTime;

        chord.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const chimeGain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.08);

            chimeGain.gain.setValueAtTime(0, now + idx * 0.08);
            chimeGain.gain.linearRampToValueAtTime(0.12, now + idx * 0.08 + 0.04);
            chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 2.5);

            osc.connect(chimeGain);
            chimeGain.connect(this.masterGain);

            osc.start(now + idx * 0.08);
            osc.stop(now + idx * 0.08 + 2.6);
        });
    }

    playRadarPing() {
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const pingGain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1760, now); // High A6 sonar ping
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.35);

        pingGain.gain.setValueAtTime(0.18, now);
        pingGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

        osc.connect(pingGain);
        pingGain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.45);
    }
}

window.paranormalAudio = new ParanormalAudio();
