import React, { useState, useEffect } from 'react';

import Swal from 'sweetalert2';
import { HeartIcon } from '@heroicons/react/24/solid'; // Importa correctamente para Heroicons v2
import { data } from '../data/levels';
import LetterComponent from './LetterComponent';
import ImageComponent from './ImageComponent';
import { useNavigate } from 'react-router-dom';


const Game = () => {
    const navigate = useNavigate();

    const [currentLevel, setCurrentLevel] = useState(0);
    const [currentImage, setCurrentImage] = useState(data[0]);
    const [missingLetter, setMissingLetter] = useState(data[0].word[data[0].missingIndex]);
    const [selectedLetters, setSelectedLetters] = useState([]);
    const [activeLetters, setActiveLetters] = useState([]);
    const [letterPool, setLetterPool] = useState([]);
    const [lives, setLives] = useState(3);
    const [levelsCompleted, setLevelsCompleted] = useState(0);

    const getDisplayWord = () => {
        let word = currentImage.word.split('');
        word[currentImage.missingIndex] = '_';
        return word.join('');
    };

    useEffect(() => {
        let allLetters = generateLetters();
        setLetterPool(allLetters);
    }, [currentLevel, missingLetter]);

    useEffect(() => {
        const addLetter = () => {
            // Añadir nueva letra si hay menos de 4 en pantalla.
            if (activeLetters.length < 4) {
                if (letterPool.length === 0) {
                    // Regenerar el pool de letras si está vacío
                    setLetterPool(generateLetters());
                }
                const newLetter = letterPool.shift();
                setActiveLetters(currentLetters => [...currentLetters, { letter: newLetter, id: Math.random() }]);
            }
        };
    
        addLetter(); // Añadir la primera letra inmediatamente.
    
        const intervalId = setInterval(() => {
            addLetter();
        }, 500); // Añadir nuevas letras cada 500 milisegundos.
    
        return () => clearInterval(intervalId);
    }, [activeLetters.length]); // Eliminar letterPool de las dependencias para evitar reactivaciones innecesarias.
    
    
    const generateLetters = () => {
        let randomLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').filter(l => l !== missingLetter);
        randomLetters.sort(() => 0.5 - Math.random());
        let lettersToShow = randomLetters.slice(0, 9);
        lettersToShow.push(missingLetter);
        lettersToShow.sort(() => 0.5 - Math.random());
        return lettersToShow;
    };

    const handleExit = (letterId) => {
        setActiveLetters(currentLetters => currentLetters.filter(letter => letter.id !== letterId));
    };

    useEffect(() => {
        if (selectedLetters.length > 0) {
            const lastSelectedLetter = selectedLetters.at(-1); // Simplificado usando .at(-1)
            if (lastSelectedLetter === missingLetter) {
                setLevelsCompleted(prev => prev + 1); // Incrementar el contador de niveles completados
                // Selecciona siempre un nuevo nivel aleatoriamente, eliminando la condición final del juego
                const nextIndex = Math.floor(Math.random() * data.length);
                setCurrentLevel(nextIndex);
                setCurrentImage(data[nextIndex]);
                setMissingLetter(data[nextIndex].word[data[nextIndex].missingIndex]);
                setActiveLetters([]);
                setLetterPool(generateLetters()); // Asegúrate de regenerar el pool de letras
            } else {
                if (lives > 1) {
                    setLives(prev => prev - 1);
                } else {
                    Swal.fire({
                        title: '¡Fin del juego!',
                        text: `Has completado ${levelsCompleted} niveles.`,
                        icon: 'error',
                        confirmButtonText: 'Volver'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            //resetGame();
                            navigate('/');
                        }
                    });
                }
            }
        }
    }, [selectedLetters]);

    return (
        <div className="text-center h-screen items-center bg-blue-100"> {/* Margen superior para evitar que el contenido esté demasiado cerca del borde */}
            <div className="mb-4">
                <div className="flex justify-center items-center gap-2">
                    {Array.from({ length: lives }, (_, i) => (
                        <HeartIcon className="w-6 h-6 text-red-500" key={i} />
                    ))}
                </div>
                <strong>Niveles Completados: {levelsCompleted}</strong>
            </div>
            <ImageComponent image={currentImage} missingWord={getDisplayWord()} />
            {activeLetters.map(({ letter, id }) => (
                <LetterComponent
                    key={id}
                    letter={letter}
                    id={id}
                    onClick={() => {
                        const newSelectedLetters = [...selectedLetters, letter];
                        setSelectedLetters(newSelectedLetters);
                    }}
                    onExit={handleExit}
                />
            ))}
        </div>
    );
};

export default Game;
