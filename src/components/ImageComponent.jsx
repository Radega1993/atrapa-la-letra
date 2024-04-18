import React from 'react';


const ImageComponent = ({ image, missingWord }) => {
    // Construye la ruta hacia la imagen dentro de la carpeta 'public/img'
    const imagePath = `/img/${image}`;

    return (
        <div className="flex flex-col items-center justify-center mb-4">
            <img src={imagePath} alt="Visual representation" className="w-1/3 md:w-1/4 rounded-lg shadow-lg" />
            <p className="text-lg md:text-xl font-bold text-indigo-600 mt-2">{missingWord}</p>
        </div>
    );
};

export default ImageComponent;
