import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { speakEnglish, registerSpeechListener, stopSpeaking } from '../../utils/audio';

interface AudioButtonProps {
  text: string;
  speechRate?: number;
  label?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'ghost' | 'amber';
  accent?: 'GB' | 'US';
}

export const AudioButton: React.FC<AudioButtonProps> = ({
  text,
  speechRate = 0.9,
  label = 'Listen',
  className = '',
  size = 'md',
  variant = 'primary',
  accent = 'GB',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const unregister = registerSpeechListener((speakingId) => {
      setIsPlaying(speakingId === text);
    });
    return unregister;
  }, [text]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) {
      stopSpeaking();
    } else {
      speakEnglish(text, text, speechRate, accent);
    }
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs gap-1',
    md: 'px-3 py-1.5 text-xs md:text-sm gap-1.5',
    lg: 'px-4 py-2 text-sm md:text-base gap-2',
  }[size];

  const variantClasses = {
    primary:
      'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow transition-all font-medium',
    secondary:
      'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-medium',
    ghost:
      'text-indigo-600 hover:bg-indigo-50 p-1.5 rounded-full transition-colors',
    amber:
      'bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow-sm hover:shadow transition-all',
  }[variant];

  return (
    <button
      onClick={handleToggle}
      className={`inline-flex items-center justify-center rounded-xl transition-transform active:scale-95 cursor-pointer ${sizeClasses} ${variantClasses} ${
        isPlaying ? 'ring-2 ring-amber-400 animate-pulse' : ''
      } ${className}`}
      title={isPlaying ? 'Stop listening' : `Listen: "${text}"`}
      aria-label={`Pronounce: ${text}`}
    >
      {isPlaying ? (
        <VolumeX className={size === 'sm' ? 'w-3.5 h-3.5 text-amber-300' : 'w-4 h-4 text-amber-300'} />
      ) : (
        <Volume2 className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
      )}
      {label && <span>{isPlaying ? 'Speaking...' : label}</span>}
    </button>
  );
};
