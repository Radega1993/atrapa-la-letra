import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const getRandomX = (max) => Math.random() * max;
const getRandomY = () => Math.random() * 100 + window.innerHeight;

const LetterComponent = ({ letter, id, onClick, onExit, level }) => {
  const initialX = useRef(getRandomX(window.innerWidth)).current;
  const initialY = useRef(getRandomY()).current;
  const finalX = useRef(getRandomX(window.innerWidth)).current;
  const finalY = -100;  // destino final por encima de la pantalla
  const baseDuration = 5;
  const [duration, setDuration] = useState(baseDuration);
  const [isExploded, setIsExploded] = useState(false);

  const numFragments = 5; // Number of fragments
  const fragments = Array.from({ length: numFragments }, (_, index) => ({
    tx: `${(index % 2 === 0 ? 1 : -1) * (50 + Math.random() * 50)}px`,  // Random X translation
    ty: `${(index % 2 === 0 ? -1 : 1) * (50 + Math.random() * 50)}px`  // Random Y translation
  }));
  
  const handleExplode = () => {
    setIsExploded(true);  // Activa el estado de explotado
    setTimeout(() => {
      onExit(id);  // Elimina el globo después de un breve retraso
    }, 200);  // 200 ms para ver la animación antes de que el globo se elimine
  };

  useEffect(() => {
    // Ajuste sutil para la disminución de la duración de la animación
    const speedFactor = 0.1; // Factor de velocidad para reducir la duración
    const minimumDuration = 1.5; // Duración mínima para mantener el juego jugable
    const newDuration = Math.max(baseDuration - level * speedFactor, minimumDuration);
    setDuration(newDuration);
  }, [level]);
  console.log(duration);
  return (
    <motion.div
      initial={{ x: initialX, y: initialY }}
      animate={{ 
        x: finalX, 
        y: finalY, 
        scale: isExploded ? 1.2 : 1,  // Aumenta el tamaño ligeramente antes de desaparecer
        opacity: isExploded ? 0 : 1  // Desvanece el globo al explotar
      }}
      transition={{
        duration: isExploded ? 0.2 : duration,  // Una transición más rápida para la explosión
        ease: "linear"
      }}
      onClick={() => {
        onClick(letter);  // Maneja el clic normal
        handleExplode();  // Inicia la animación de explosión
      }}
      onAnimationComplete={() => {
        if (!isExploded) {
          onExit(id);
        }
      }}
      className={`balloon ${isExploded ? 'exploded' : ''}`}
    >
       <p className="select-none">{letter}</p>
      {isExploded && fragments.map((frag, index) => (
        <span key={index} style={{ '--tx': frag.tx, '--ty': frag.ty }} />
      ))}
    </motion.div>
  );
};

export default LetterComponent;
