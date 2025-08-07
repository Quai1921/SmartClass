import { Link } from "react-router";

const NotFoundPage = () => {
    return (
        <div className="h-screen flex flex-col justify-center items-center text-center p-4">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Página no encontrada</h1>
            <p className="text-gray-600 mb-6">
                Lo sentimos, la ruta que intentaste acceder no existe.
            </p>
            <Link to="/home" className="text-blue-500 underline">
                Volver al inicio
            </Link>
        </div>
    );
};

export default NotFoundPage;
