import { useNavigate } from 'react-router-dom'; // Si estás usando React Router



const App = () => {
    const navigate = useNavigate(); // Obtén el hook useNavigate

    const startGame = (level) => {
        navigate(`/game/${level}`);
    };
    return (
        <div className="h-screen flex flex-col justify-center items-center bg-blue-100">
    <img src={`${process.env.PUBLIC_URL}/logo512.png`} alt="Logo" className="mx-auto" style={{ maxWidth: '300px', width: '100%' }} />            <div className="mb-5">
                <button 
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-2 rounded focus:outline-none focus:shadow-outline"
                    onClick={() => startGame(1)}
                >
                    Nivel 1
                </button>
                <button 
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-2 rounded focus:outline-none focus:shadow-outline"
                    onClick={() => startGame(2)}
                >
                    Nivel 2
                </button>
                <button 
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-2 rounded focus:outline-none focus:shadow-outline"
                    onClick={() => startGame(3)}
                >
                    Nivel 3
                </button>
            </div>
            <footer className="absolute bottom-0 w-full text-center text-sm text-gray-600 p-2">
                Made by <a href="https://radega.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-800">Radega</a> <br/>
                Idea by <span className="text-blue-500 hover:text-blue-800">Carlota Lladó</span>
            </footer>
        </div>
    );
};
export default App;
