import React, { useRef, useState, useEffect } from 'react';
import { PlayIcon, MusicalNoteIcon, PauseIcon, SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/solid';

const BackgroundMusic = () => {
  const audioRef = useRef(new Audio('/sounds/game.mp3'));
  const [isPlaying, setIsPlaying] = useState(true); // Assuming you want music to play by default
  const [volumeLevel, setVolumeLevel] = useState(2); // 0 = off, 1 = half, 2 = full

  useEffect(() => {
    audioRef.current.loop = true;
    setVolume(audioRef.current, volumeLevel);

    // Handle autoplay based on isPlaying state
    const playAudio = async () => {
      try {
        await audioRef.current.play();
      } catch (e) {
        console.error('Error playing the audio:', e);
      }
    };

    if (isPlaying) {
      playAudio();
    } else {
      audioRef.current.pause();
    }
  }, [volumeLevel, isPlaying]);

  const togglePlayPause = () => {
    setIsPlaying(prev => !prev);
  };

  const adjustVolume = () => {
    const nextVolumeLevel = (volumeLevel + 1) % 3;
    setVolumeLevel(nextVolumeLevel);
  };

  const setVolume = (audio, level) => {
    switch (level) {
      case 0:
        audio.volume = 0;
        break;
      case 1:
        audio.volume = 0.5;
        break;
      case 2:
        audio.volume = 1;
        break;
      default:
        audio.volume = 1;
    }
  };

  const renderVolumeIcon = () => {
    switch (volumeLevel) {
      case 0:
        return <SpeakerXMarkIcon className="h-6 w-6 text-white" />;
      case 1:
        return <SpeakerWaveIcon className="h-6 w-6 text-white" />;
      case 2:
        return <MusicalNoteIcon className="h-6 w-6 text-white" />;
      default:
        return <SpeakerWaveIcon className="h-6 w-6 text-white" />;
    }
  };

  return (
    <div>
      <button 
        onClick={togglePlayPause} 
        className="fixed right-4 bottom-20 bg-gray-300 rounded-full p-2 shadow-lg hover:bg-gray-400 z-50 cursor-pointer"
      >
        {isPlaying ? <PauseIcon className="h-6 w-6 text-white" /> : <PlayIcon className="h-6 w-6 text-white" />}
      </button>
      <button 
        onClick={adjustVolume} 
        className="fixed right-4 bottom-4 bg-gray-300 rounded-full p-2 shadow-lg hover:bg-gray-400 z-50 cursor-pointer"
      >
        {renderVolumeIcon()}
      </button>
    </div>
  );
};

export default BackgroundMusic;
