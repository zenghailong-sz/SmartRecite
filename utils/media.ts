
// Synthesize game sounds using Web Audio API (No files required)
const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();

export const playGameSound = (type: 'correct' | 'wrong' | 'flip' | 'victory' | 'click') => {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  const now = audioCtx.currentTime;

  switch (type) {
    case 'correct':
      // High pitched pleasant ding
      osc.type = 'sine';
      osc.frequency.setValueAtTime(500, now);
      osc.frequency.exponentialRampToValueAtTime(1000, now + 0.1);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.5);
      break;
    
    case 'wrong':
      // Low pitched buzz
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.linearRampToValueAtTime(100, now + 0.3);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
      break;

    case 'flip':
      // Quick swoosh
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.1);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
      break;

    case 'victory':
      // Arpeggio
      ['triangle', 'triangle', 'sine'].forEach((wave, i) => {
        const vOsc = audioCtx.createOscillator();
        const vGain = audioCtx.createGain();
        vOsc.type = wave as OscillatorType;
        vOsc.connect(vGain);
        vGain.connect(audioCtx.destination);
        
        const noteTime = now + i * 0.1;
        const freq = [523.25, 659.25, 783.99][i]; // C Major
        vOsc.frequency.setValueAtTime(freq, noteTime);
        vGain.gain.setValueAtTime(0.2, noteTime);
        vGain.gain.exponentialRampToValueAtTime(0.01, noteTime + 0.6);
        vOsc.start(noteTime);
        vOsc.stop(noteTime + 0.6);
      });
      break;
      
    case 'click':
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
      break;
  }
};

// --- TTS Optimization: Cache Voices ---
let cachedVoices: SpeechSynthesisVoice[] | null = null;

// Initialize voices eagerly if possible
if (typeof window !== 'undefined' && window.speechSynthesis) {
    const loadVoices = () => {
        cachedVoices = window.speechSynthesis.getVoices();
    };
    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
    }
}

// Smart TTS: Picks the best available English Voice
export const speakText = (text: string) => {
    // Safety check for SSR or environments without speech synthesis
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    
    // Use cached voices or fetch if null (fallback)
    const voices = cachedVoices || window.speechSynthesis.getVoices();
    
    // Try to find a better voice than default
    const preferredVoice = voices.find(v => 
        (v.name.includes('Google') && v.lang.includes('en-US')) || 
        (v.name.includes('Samantha') && v.lang.includes('en-US')) ||
        (v.name.includes('Zira') && v.lang.includes('en-US'))
    );

    if (preferredVoice) utterance.voice = preferredVoice;
    
    // Slight speed adjustment for clarity
    utterance.rate = 0.9; 
    
    window.speechSynthesis.speak(utterance);
};
