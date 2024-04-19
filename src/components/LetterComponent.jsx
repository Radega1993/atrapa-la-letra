import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const getRandomX = (max) => Math.random() * max;
const getRandomY = () => Math.random() * 100 + window.innerHeight;

const LetterComponent = ({ letter, id, onClick, onExit, level }) => {
  const audio = useRef(new Audio('/sounds/ballon.mp3'));


  const initialX = useRef(getRandomX(window.innerWidth)).current;
  const initialY = useRef(getRandomY()).current;
  const finalX = useRef(getRandomX(window.innerWidth)).current;
  const [finalY, setFinalY] = useState(-window.innerHeight);  // Ajusta para usar el alto de la ventana
  const baseDuration = 5;
  const [duration, setDuration] = useState(baseDuration);
  const [isExploded, setIsExploded] = useState(false);

  useEffect(() => {
    // Reactivar cuando el tamaño de la ventana cambia
    const handleResize = () => {
      setFinalY(-window.innerHeight);  // Actualiza finalY cuando la ventana cambia de tamaño
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Ajusta la duración basada en el nivel para aumentar la dificultad
    const speedFactor = 0.1; // Factor de velocidad para reducir la duración
    const minimumDuration = 1.5; // Duración mínima para mantener el juego jugable
    const newDuration = Math.max(baseDuration - level * speedFactor, minimumDuration);
    setDuration(newDuration);
  }, [level]);

  const handleOnClick = () => {
    onClick(letter);  // Call the onClick function provided by the parent component
    audio.current.play().catch(e => console.log('Error playing sound:', e));  // Play the audio
    setIsExploded(true);  // Trigger any visual effect for exploding
    setTimeout(() => onExit(id), 200);  // Call onExit after a delay, ensuring visual effects can be seen
  };

  return (
    <motion.div
      initial={{ x: initialX, y: initialY }}
      animate={{ x: finalX, y: finalY, scale: isExploded ? 1.2 : 1, opacity: isExploded ? 0 : 1 }}
      transition={{ duration: isExploded ? 0.2 : duration, ease: "linear" }}
      onClick={handleOnClick}
      onAnimationComplete={() => {
        if (!isExploded) {
          onExit(id);
        }
      }}
      className={`balloon ${isExploded ? 'exploded' : ''}`}
    >
      <p className="select-none">{letter}</p>
    </motion.div>
  );
};

export default LetterComponent;
