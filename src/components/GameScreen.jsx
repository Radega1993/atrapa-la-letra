import React, { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';
import { HeartIcon } from '@heroicons/react/24/solid';
import { data } from '../data/levels';
import LetterComponent from './LetterComponent';
import ImageComponent from './ImageComponent';
import { useNavigate, useParams } from 'react-router-dom';

const Game = () => {
    const navigate = useNavigate();
    const { level } = useParams();

    const audioEnd = useRef(new Audio('/sounds/end.wav'));
    const audioWin = useRef(new Audio('/sounds/win.wav'));

    const [currentImage, setCurrentImage] = useState(() => {
        const initialData = data[0];
        return { ...initialData, word: initialData.word.replace(initialData.word[initialData.missingIndex], '_') };
    });
    const [missingLetter, setMissingLetter] = useState(data[0].word[data[0].missingIndex]);
    const [selectedLetters, setSelectedLetters] = useState([]);
    const [activeLetters, setActiveLetters] = useState([]);
    const [letterPool, setLetterPool] = useState([]);
    const [lives, setLives] = useState(3);
    const [levelsCompleted, setLevelsCompleted] = useState(0);

    useEffect(() => {
        const levelData = data.filter(item => item.lvl === parseInt(level));
        const randomIndex = Math.floor(Math.random() * levelData.length);
        const chosenWord = levelData[randomIndex].word;
        const randomMissingIndex = Math.floor(Math.random() * chosenWord.length);

        const missingChar = chosenWord[randomMissingIndex];
        const updatedWord = chosenWord.split('').map((char, index) => index === randomMissingIndex ? '_' : char).join('');

        setCurrentImage({
            ...levelData[randomIndex],
            word: updatedWord
        });
        setMissingLetter(missingChar);
    }, [level, levelsCompleted]);

    useEffect(() => {
        let allLetters = generateLetters();
        setLetterPool(allLetters);
    }, [missingLetter]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            const maxLettersToAdd = 4 - activeLetters.length;
            if (letterPool.length < maxLettersToAdd) {
                setLetterPool(generateLetters());
            }
            if (maxLettersToAdd > 0) {
                const newLetters = letterPool.splice(0, maxLettersToAdd);
                setActiveLetters(currentLetters => [
                    ...currentLetters,
                    ...newLetters.map(letter => ({ letter, id: Math.random() }))
                ]);
            }
        }, 500);
        return () => clearInterval(intervalId);
    }, [activeLetters.length, letterPool]);

    const generateLetters = () => {
        let randomLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').filter(l => l !== missingLetter);
        randomLetters.sort(() => 0.5 - Math.random());
        const extraOccurrences = 4;
        return [...randomLetters.slice(0, 7), ...Array(extraOccurrences).fill(missingLetter)].sort(() => 0.5 - Math.random());
    };

    const handleExit = (letterId) => {
        setActiveLetters(currentLetters => currentLetters.filter(letter => letter.id !== letterId));
    };

    useEffect(() => {
        if (selectedLetters.length > 0 && selectedLetters.at(-1) === missingLetter) {
            setLevelsCompleted(levelsCompleted + 1);
            audioWin.current.play();
            Swal.fire({
                title: '¡Muy bien!',
                html: `<p>La palabra correcta es <strong>${currentImage.word.replace('_', missingLetter)}</strong></p>
                       <div style="text-align: center;"><img src="/img/${currentImage.url}" alt="Imagen" style="width: 100%; max-width: 300px; margin: auto; display: block;"/></div>`,
                icon: 'success',
                confirmButtonText: 'Siguiente',
                allowOutsideClick: false
            });
        } else if (selectedLetters.length > 0) {
            if (lives > 1) {
                setLives(lives - 1);
            } else {
                audioEnd.current.play();
                Swal.fire({
                    title: '¡Fin del juego!',
                    text: `Has completado ${levelsCompleted} niveles.`,
                    icon: 'success',
                    confirmButtonText: 'Volver',
                    allowOutsideClick: false
                }).then(() => navigate('/'));
            }
        }
    }, [selectedLetters]);

    return (
        <>
            <div className="sky">
                <div className="cloud" style={{ top: '10%', width: '200px', height: '200px' }}></div>
                <div className="cloud" style={{ top: '30%', width: '180px', height: '180px', animationDelay: '15s' }}></div>
                <div className="cloud" style={{ top: '50%', animationDelay: '30s' }}></div>
                <div className="cloud" style={{ top: '70%', width: '150px', height: '150px', animationDelay: '45s' }}></div>
            </div>
            <div className="text-center h-screen items-center">
                <div className="mb-4">
                    <div className="flex justify-center items-center gap-2">
                        {Array.from({ length: lives }, (_, i) => (
                            <HeartIcon className="w-6 h-6 text-red-500" key={i} />
                        ))}
                    </div>
                    <strong>Niveles Completados: {levelsCompleted}</strong>
                </div>
                <ImageComponent image={`/img/${currentImage.url}`} missingWord={currentImage.word} />
                {activeLetters.map(({ letter, id }) => (
                    <LetterComponent
                        key={id}
                        letter={letter}
                        id={id}
                        level={levelsCompleted}
                        onClick={() => setSelectedLetters([...selectedLetters, letter])}
                        onExit={handleExit}
                    />
                ))}
            </div>

        </>
    );
};

export default Game;
