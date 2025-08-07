import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useNotificationStore } from "../../store/notification/useNotificationStore";
import { activateAccount } from "../../../actions/auth/activate";
import Alert from "../../components/Alert";
import Tooltip from "../../components/Tooltip";
import { Eye, EyeOff } from 'lucide-react';

function RegisterPage() {
    const { id } = useParams<{ id: string }>();
    const { addNotification } = useNotificationStore();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: '',
        password: '',
        email: '',
        firstName: '',
        lastName: '',
        identificationNumber: ''
    });
    const [isPosting, setIsPosting] = useState(false);
    const [toggleVisibility, setToggleVisibility] = useState(true);
    const [showAlert, setShowAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Check if form is valid (all required fields have content)
    const isFormValid = form.username.trim() !== '' && 
                       form.password.trim() !== '' && 
                       form.email.trim() !== '' && 
                       form.firstName.trim() !== '' && 
                       form.lastName.trim() !== '' && 
                       form.identificationNumber.trim() !== '';

    useEffect(() => {
        // Redirect to login if no activation ID is provided
        if (!id) {
            addNotification({
                message: "Enlace de activación inválido. Por favor, verifica el enlace en tu correo electrónico.",
                type: "error",
                position: "right-top",
                duration: 5000
            });
            navigate('/login');
        }
    }, [id, navigate, addNotification]);

    // Clear error when user starts typing
    const [previousFormValues, setPreviousFormValues] = useState(form);
    useEffect(() => {
        const userTyped = Object.keys(form).some(key => 
            form[key as keyof typeof form] !== previousFormValues[key as keyof typeof form]
        );
        
        if (errorMessage && userTyped) {
            setErrorMessage('');
            setShowAlert(false);
        }
        
        setPreviousFormValues(form);
    }, [form, errorMessage, previousFormValues]);

    // Show alert when there's an error
    useEffect(() => {
        if (errorMessage) {
            setShowAlert(true);
        }
    }, [errorMessage]);

    const onRegister = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        
        // Prevent submission if form is invalid or no activation ID
        if (!isFormValid || !id) {
            return;
        }        setIsPosting(true);
        const result = await activateAccount(
            id,
            form.username,
            form.password,
            form.email,
            form.firstName,
            form.lastName,
            "INSTITUTION_ADMIN", // Role for institution admin registration
            form.identificationNumber
        );
        setIsPosting(false);

        if (result.success) {
            addNotification({
                message: "Cuenta activada exitosamente. Ahora puedes iniciar sesión.",
                type: "message",
                position: "right-top",
                duration: 5000
            });
            
            // Redirect to login after successful registration
            navigate('/login');
        } else {
            // Handle errors
            setErrorMessage(result.data?.message || "Error al activar la cuenta. Por favor, intenta nuevamente.");
            
            // Handle 500 server errors with left-bottom notification
            if (result.statusCode === 500) {
                addNotification({
                    message: "Error interno del servidor. Por favor, intenta más tarde.",
                    type: "error",
                    position: "left-bottom",
                    duration: 5000
                });
            }
        }
    };

    return (
        <div className="flex items-center justify-center login-screen font-poppins">
            {/* Alert Component for registration errors */}
            {showAlert && errorMessage && (
                <Alert
                    message={errorMessage}
                    type="error"
                    position="top"
                    duration={5000}
                    restartAlert={() => {
                        setShowAlert(false);
                        setErrorMessage('');
                    }}
                />
            )}
            
            <div className="flex flex-col gap-4 w-[506px] h-[818px] relative left-[319px] bottom-4 bg-white rounded-[10px] border-[0.5px] border-gray-400 text-[10px]">
                <img
                    src="/assets/images/logo-smart_class.svg"
                    alt="logo smart class"
                    width={114}
                    height={114}
                    className="mt-[20px] mx-auto"
                />

                <section className="flex flex-col gap-2 mt-[20px] mx-auto w-[400px]">
                    <form onSubmit={onRegister} className='text-font-size-xs border border-slate-200 h-[650px] rounded-[6px]'>
                        <section className="flex flex-col mx-auto w-[350px] h-[600px]">
                            <h3 className="mt-[25px] text-subtle">Completa los campos para registrarte en la plataforma.</h3>
                            
                            {/* Username */}
                            <label htmlFor="username" className='block text-white w-[350px] h-[62px] mt-[20px]'>
                                <span className="text-[14px] text-inter-500">Usuario</span>
                                <input
                                    value={form.username}
                                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                                    name="username"
                                    className='w-full text-[14px] mt-[5px] h-[38px] px-[9px] border border-slate-300 rounded-[6px] outline-none placeholder-slate-900 text-black'
                                    type="text"
                                    id="username"
                                    placeholder='Ingresa tu usuario'
                                />
                            </label>

                            {/* Password */}
                            <label htmlFor="password" className='block text-white w-[350px] h-[62px] mt-[15px]'>
                                <span className="text-[14px] text-inter-500">Contraseña</span>
                                <div className="flex items-center relative">
                                    <input
                                        value={form.password}
                                        name="password"
                                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                                        className="w-full text-[14px] mt-[5px] h-[38px] px-[9px] border border-slate-300 rounded-[6px] outline-none placeholder-slate-900 text-black"
                                        type={toggleVisibility ? "password" : "text"}
                                        placeholder="Ingresa tu contraseña"
                                    />
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2"
                                         onClick={() => setToggleVisibility(!toggleVisibility)}>
                                        <Tooltip
                                            text={toggleVisibility ? "Mostrar contraseña" : "Ocultar contraseña"}
                                            position="top"
                                        >
                                            {toggleVisibility ?
                                                <Eye color="#000" size={22} /> :
                                                <EyeOff color="#000" size={22} />
                                            }
                                        </Tooltip>
                                    </div>
                                </div>
                            </label>

                            {/* Email */}
                            <label htmlFor="email" className='block text-white w-[350px] h-[62px] mt-[15px]'>
                                <span className="text-[14px] text-inter-500">Correo electrónico</span>
                                <input
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    name="email"
                                    className='w-full text-[14px] mt-[5px] h-[38px] px-[9px] border border-slate-300 rounded-[6px] outline-none placeholder-slate-900 text-black'
                                    type="email"
                                    id="email"
                                    placeholder='Ingresa tu correo electrónico'
                                />
                            </label>

                            {/* First Name and Last Name */}
                            <div className="flex gap-4 mt-[15px]">
                                <label htmlFor="firstName" className='block text-white w-[167px] h-[62px]'>
                                    <span className="text-[14px] text-inter-500">Nombre</span>
                                    <input
                                        value={form.firstName}
                                        onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                                        name="firstName"
                                        className='w-full text-[14px] mt-[5px] h-[38px] px-[9px] border border-slate-300 rounded-[6px] outline-none placeholder-slate-900 text-black'
                                        type="text"
                                        id="firstName"
                                        placeholder='Tu nombre'
                                    />
                                </label>
                                
                                <label htmlFor="lastName" className='block text-white w-[167px] h-[62px]'>
                                    <span className="text-[14px] text-inter-500">Apellido</span>
                                    <input
                                        value={form.lastName}
                                        onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                                        name="lastName"
                                        className='w-full text-[14px] mt-[5px] h-[38px] px-[9px] border border-slate-300 rounded-[6px] outline-none placeholder-slate-900 text-black'
                                        type="text"
                                        id="lastName"
                                        placeholder='Tu apellido'
                                    />
                                </label>
                            </div>

                            {/* Identification Number */}
                            <label htmlFor="identificationNumber" className='block text-white w-[350px] h-[62px] mt-[15px]'>
                                <span className="text-[14px] text-inter-500">Cédula</span>
                                <input
                                    value={form.identificationNumber}
                                    onChange={(e) => setForm({ ...form, identificationNumber: e.target.value })}
                                    name="identificationNumber"
                                    className='w-full text-[14px] mt-[5px] h-[38px] px-[9px] border border-slate-300 rounded-[6px] outline-none placeholder-slate-900 text-black'
                                    type="text"
                                    id="identificationNumber"
                                    placeholder='Ingresa tu cédula'
                                />
                            </label>

                            <button
                                type="submit"
                                disabled={isPosting || !isFormValid}
                                className={`mt-[25px] py-[11px] border-0 rounded-lg text-white w-full transition-all duration-200 ${
                                    isFormValid && !isPosting 
                                        ? 'bg-background cursor-pointer hover:bg-opacity-90' 
                                        : 'bg-gray-400 cursor-not-allowed'
                                }`}
                            >
                                {isPosting ? 'Registrando...' : 'Registrarme'}
                            </button>
                        </section>
                    </form>
                </section>
            </div>
        </div>
    );
}

export default RegisterPage;
