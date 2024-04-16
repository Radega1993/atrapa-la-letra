import React, { useRef } from 'react';
import { motion } from 'framer-motion';

const getRandomX = (max) => Math.random() * max;
const getRandomY = () => Math.random() * 100 + window.innerHeight; // un poco por debajo de la pantalla

const LetterComponent = ({ letter, id, onClick, onExit }) => {
    const initialX = useRef(getRandomX(window.innerWidth)).current;
    const initialY = useRef(getRandomY()).current;
    const finalX = useRef(getRandomX(window.innerWidth)).current;
    const finalY = -100; 

    const duration = 5; 

    return (
        <motion.div
            initial={{ x: initialX, y: initialY }}
            animate={{ x: finalX, y: finalY }}
            transition={{
                duration: duration,
                ease: "linear"
            }}
            onClick={() => onClick(letter)}
            onAnimationComplete={() => onExit(id)}
            className="absolute cursor-pointer text-lg md:text-xl font-bold text-white bg-red-500 rounded-full w-12 h-12 flex items-center justify-center shadow-md"
        >
            {letter}
        </motion.div>
    );
};

export default LetterComponent;
