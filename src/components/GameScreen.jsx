import React, { useState, useEffect } from 'react';

import Swal from 'sweetalert2';
import { HeartIcon } from '@heroicons/react/24/solid';
import { data } from '../data/levels';
import LetterComponent from './LetterComponent';
import ImageComponent from './ImageComponent';
import { useNavigate, useParams } from 'react-router-dom';


const Game = () => {
    const navigate = useNavigate();
    const { level } = useParams();

    const [currentLevel, setCurrentLevel] = useState(0);
    const [currentImage, setCurrentImage] = useState(data[0]);
    const [missingLetter, setMissingLetter] = useState(data[0].word[data[0].missingIndex]);
    const [selectedLetters, setSelectedLetters] = useState([]);
    const [activeLetters, setActiveLetters] = useState([]);
    const [letterPool, setLetterPool] = useState([]);
    const [lives, setLives] = useState(3);
    const [levelsCompleted, setLevelsCompleted] = useState(0);

    useEffect(() => {
        const levelData = data.filter(item => item.lvl === parseInt(level));
        const randomIndex = Math.floor(Math.random() * levelData.length);
        setCurrentImage(levelData[randomIndex]);
        setMissingLetter(levelData[randomIndex].word[levelData[randomIndex].missingIndex]);
    }, [level]);

    useEffect(() => {
        let allLetters = generateLetters();
        setLetterPool(allLetters);
    }, [currentLevel, missingLetter]);

    useEffect(() => {
        const addLetter = () => {
            // Determina cuántas letras se pueden agregar sin superar el límite de 4
            const maxLettersToAdd = 3 - activeLetters.length;
            if (maxLettersToAdd > 0) {
                if (letterPool.length < maxLettersToAdd) {
                    setLetterPool(generateLetters()); // Regenera el pool si las letras disponibles son menos que las necesarias
                }
                const lettersToAdd = Math.min(Math.floor(Math.random() * 3) + 1, maxLettersToAdd);
                const newLetters = letterPool.splice(0, lettersToAdd); // Toma las primeras 'lettersToAdd' letras del pool
                // Agrega las nuevas letras a las letras activas
                setActiveLetters(currentLetters => [
                    ...currentLetters,
                    ...newLetters.map(letter => ({ letter, id: Math.random() })) // Crea un objeto para cada letra con un ID aleatorio
                ]);
            }
        };
    
        addLetter(); // Llama a addLetter inmediatamente
    
        const intervalId = setInterval(() => {
            addLetter(); // Continúa agregando letras cada 500 ms
        }, 500); 
    
        return () => clearInterval(intervalId);
    }, [activeLetters.length, letterPool]);
    
    
    const generateLetters = () => {
        let randomLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').filter(l => l !== missingLetter);
        randomLetters.sort(() => 0.5 - Math.random());
        let lettersToShow = randomLetters.slice(0, 8);
        lettersToShow.push(missingLetter, missingLetter, missingLetter, missingLetter,missingLetter);
        lettersToShow.sort(() => 0.5 - Math.random());
        return lettersToShow;
    };
    

    const handleExit = (letterId) => {
        setActiveLetters(currentLetters => currentLetters.filter(letter => letter.id !== letterId));
    };

    useEffect(() => {
        if (selectedLetters.length > 0) {
            const lastSelectedLetter = selectedLetters.at(-1);
            if (lastSelectedLetter === missingLetter) {
                setLevelsCompleted(prev => prev + 1);
    
                // Suponiendo que 'currentImage' tenga todos los datos del nivel actual,
                // incluido el índice actual y la URL de la imagen.
                const currentWord = currentImage.word;
                const currentImageUrl = `/img/${currentImage.url}`;
    
                Swal.fire({
                    title: '¡Muy bien!',
                    html: `<p>La palabra correcta es <strong>${currentWord}</strong></p>
                            <div style="text-align: center;"><img src="${currentImageUrl}" alt="Imagen" style="width: 100%; max-width: 300px; margin: auto; display: block;"/></div>`,
                    icon: 'success',
                    confirmButtonText: 'Siguiente',
                    allowOutsideClick: false
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Genera un nuevo índice aleatorio para el siguiente nivel y actualiza el estado correspondiente.
                        const levelData = data.filter(item => item.lvl === parseInt(level));
                        const nextIndex = Math.floor(Math.random() * levelData.length);
    
                        setCurrentLevel(nextIndex);
                        setCurrentImage(levelData[nextIndex]);
                        setMissingLetter(levelData[nextIndex].word[levelData[nextIndex].missingIndex]);
                        setActiveLetters([]);
                        setLetterPool(generateLetters());
                    }
                });
            } else {
                if (lives > 1) {
                    setLives(prev => prev - 1);
                } else {
                    Swal.fire({
                        title: '¡Fin del juego!',
                        text: `Has completado ${levelsCompleted} niveles.`,
                        icon: 'error',
                        confirmButtonText: 'Volver',
                        allowOutsideClick: false
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

    if (!currentImage) return <div>Cargando...</div>;


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
            <ImageComponent image={currentImage.url} missingWord={currentImage.word.replace(currentImage.word[currentImage.missingIndex], '_')} />
            {activeLetters.map(({ letter, id }) => (
                <LetterComponent
                    key={id}
                    letter={letter}
                    id={id}
                    level={levelsCompleted}
                    onClick={() => {
                        const newSelectedLetters = [...selectedLetters, letter];
                        setSelectedLetters(newSelectedLetters);
                    }}
                    onExit={() => handleExit(id)}
                />
            ))}
        </div>
    );
};

export default Game;
