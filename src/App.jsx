import { useNavigate } from 'react-router-dom'; // Si estás usando React Router



const App = () => {
    const navigate = useNavigate(); // Obtén el hook useNavigate

    const startGame = () => {
        navigate('/game'); // Usa navigate con la ruta como argumento
    };

    return (
        <div className="h-screen flex flex-col justify-center items-center bg-blue-100">
            <h1 className="text-4xl font-bold text-blue-800 mb-5">Atrapa la Letra</h1>
            <button 
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={startGame}
            >
                Iniciar Partida
            </button>
            <footer className="absolute bottom-0 w-full text-center text-sm text-gray-600 p-2">
                Made by <a href="https://radega.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-800">Radega</a>
            </footer>
        </div>
    );
};
export default App;
