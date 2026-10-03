function languageForText(text) {
  if (/[\u0C00-\u0C7F]/u.test(text)) return "te-IN";
  if (/[\u0B80-\u0BFF]/u.test(text)) return "ta-IN";
  if (/[\u0900-\u097F]/u.test(text)) return "hi-IN";
  return "en-IN";
}

export function createDevineUtterance(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  const language = languageForText(text);
  const voices = window.speechSynthesis?.getVoices?.() || [];
  const family = language.slice(0, 2);
  const selectedVoice = voices.find((voice) => voice.lang.toLowerCase() === language.toLowerCase())
    || voices.find((voice) => voice.lang.toLowerCase().startsWith(`${family}-`))
    || voices.find((voice) => /india|indian/i.test(`${voice.name} ${voice.lang}`));

  utterance.lang = language;
  utterance.rate = 0.8;
  utterance.pitch = 0.78;
  utterance.volume = 1;
  if (selectedVoice) utterance.voice = selectedVoice;
  return utterance;
}