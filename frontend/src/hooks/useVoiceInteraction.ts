// ─── useVoiceInteraction Hook ───────────────────────────────────────────
// Wraps Web Speech API for voice-to-text input and text-to-speech output.

import { useState, useCallback, useEffect, useRef } from 'react';

// SpeechRecognition type (not in default TS lib)
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((e: SpeechRecognitionEvent) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

const SpeechRecognition = typeof window !== 'undefined'
  ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
  : null;

export function useVoiceInteraction() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const [supported, setSupported] = useState(!!SpeechRecognition);

  useEffect(() => {
    setSupported(!!SpeechRecognition);
    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  const startListening = useCallback(() => {
    if (!SpeechRecognition) {
      setError('Speech Recognition not supported in this browser');
      return;
    }

    try {
      const recognition = new SpeechRecognition() as SpeechRecognitionInstance;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognitionRef.current = recognition;

      recognition.onresult = (e: SpeechRecognitionEvent) => {
        let interim = '';
        let final = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const text = e.results[i][0].transcript;
          if (e.results[i].isFinal) {
            final += text;
          } else {
            interim += text;
          }
        }
        if (final) {
          setTranscript((prev) => prev + final + ' ');
        }
        setInterimTranscript(interim);
        setError(null);
      };

      recognition.onerror = (e: { error: string }) => {
        if (e.error === 'no-speech') return; // ignore silence
        if (e.error === 'aborted') return; // ignore manual stop
        setError(`Voice error: ${e.error}`);
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
      };

      recognition.start();
      setIsListening(true);
      setTranscript('');
      setError(null);
    } catch (err) {
      setError('Failed to start voice recognition');
    }
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
    setInterimTranscript('');
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
  }, []);

  const speak = useCallback(
    (text: string, onEnd?: () => void) => {
      if (!voiceEnabled || !window.speechSynthesis) return;

      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;

      // Prefer a female English voice
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(
        (v) => v.lang.startsWith('en') && v.name.includes('Female')
      ) || voices.find((v) => v.lang.startsWith('en')) || voices[0];
      if (preferred) utterance.voice = preferred;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        onEnd?.();
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    },
    [voiceEnabled]
  );

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  }, []);

  return {
    supported,
    isListening,
    transcript,
    interimTranscript,
    isSpeaking,
    voiceEnabled,
    setVoiceEnabled,
    error,
    startListening,
    stopListening,
    clearTranscript,
    speak,
    stopSpeaking,
  };
}
