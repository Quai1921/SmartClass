import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router"
import { useAuthStore } from "../../store/auth/useAuthStore";
import { useNotificationStore } from "../../store/notification/useNotificationStore";
import Alert from "../../components/Alert";
import Tooltip from "../../components/Tooltip";
import { Eye, EyeOff } from 'lucide-react';


function LoginPage() {
    const { login, clearLoginError, rememberMe, setRememberMe, checkStatus, status, userAuth, role } = useAuthStore();
    const loginError = useAuthStore((state) => state.loginError);
    const { addNotification } = useNotificationStore();
    const navigate = useNavigate();
    const isMountedRef = useRef(true);

    const [form, setform] = useState({
        username: '',
        password: ''
    });
    const [isPosting, setisPosting] = useState(false);
    const [toggleVisibility, setToggleVisibility] = useState(true);
    const [showAlert, setShowAlert] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    // Track component mount status to prevent notifications after navigation
    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        };
    }, []);    // Check authentication status when component mounts
    useEffect(() => {
        const initializeAuth = async () => {
            await checkStatus();
            
            // Wait a bit longer and check again to ensure auth state is properly set
            await new Promise(resolve => setTimeout(resolve, 100));
            
            const currentState = useAuthStore.getState();
            if (currentState.status === "SUCCESS" && currentState.userAuth) {
                // Already authenticated, no need to show loading
                setIsCheckingAuth(false);
            } else if (currentState.status === "not-authenticated") {
                // Not authenticated, safe to show login form
                setIsCheckingAuth(false);
            } else {
                // Still checking, wait a bit more
                setTimeout(() => {
                    setIsCheckingAuth(false);
                }, 300);
            }
        };
        
        initializeAuth();
    }, [checkStatus]);    // Redirect if already authenticated
    useEffect(() => {
        if (status === "SUCCESS" && userAuth && role) {
            // For INSTITUTION_ADMIN users, check onboarding status
            if (role === "INSTITUTION_ADMIN") {
                if (userAuth.policyPending) {
                    navigate('/policies', { replace: true });
                } else if (!userAuth.institutionCreated) {
                    navigate('/create-institution', { replace: true });
                } else {
                    // Institution admin with completed onboarding
                    navigate('/institucion-dashboard', { replace: true });
                }
            } else if (role === "ADMIN") {
                // System admin users go directly to home
                navigate('/home', { replace: true });
            } else if (role === "TUTOR") {
                // Tutor users go to tutor dashboard
                navigate('/tutor-dashboard', { replace: true });
            } else {
                // Other roles default to home
                navigate('/home', { replace: true });
            }
        } else if (status === "not-authenticated") {
            setIsCheckingAuth(false);
        }
    }, [status, userAuth, role, navigate]);

    // Check if form is valid (both fields have content)
    const isFormValid = form.username.trim() !== '' && form.password.trim() !== '';

    // Clear login error when user starts typing (only on actual changes, not just non-empty fields)
    const [previousFormValues, setPreviousFormValues] = useState({ username: '', password: '' });
    useEffect(() => {
        // Only clear error if user actually changed the form fields AND there's an error
        const userTyped = form.username !== previousFormValues.username || form.password !== previousFormValues.password;
        
        if (loginError && userTyped) {
            clearLoginError();
            setShowAlert(false);
        }
        
        // Update previous values
        setPreviousFormValues({ username: form.username, password: form.password });
    }, [form.username, form.password, loginError, clearLoginError, previousFormValues.username, previousFormValues.password]);

    // Show alert when there's a login error
    useEffect(() => {
        if (loginError) {
            setShowAlert(true);
        }
    }, [loginError]);

    const onLogin = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        
        // Prevent submission if form is invalid or already posting
        if (!isFormValid || isPosting) {
            return;
        }
        
        setisPosting(true);
        const result = await login(form.username, form.password, rememberMe);
        setisPosting(false);        if (result.success) {
            const { userAuth, role } = useAuthStore.getState();
            
            // Implement conditional routing based on user role and status
            if (userAuth && role) {
                if (role === "INSTITUTION_ADMIN") {
                    // For institution admin, check onboarding status
                    if (userAuth.policyPending) {
                        return navigate('/policies');
                    } else if (!userAuth.institutionCreated) {
                        return navigate('/create-institution');
                    } else {
                        // Institution admin with completed onboarding
                        return navigate('/institucion-dashboard');
                    }
                } else if (role === "ADMIN") {
                    // System admin users go directly to home
                    return navigate('/home');
                } else if (role === "TUTOR") {
                    // Tutor users go to tutor dashboard
                    return navigate('/tutor-dashboard');
                } else {
                    // Other roles default to home
                    return navigate('/home');
                }
            }
            
            // Fallback to home if no specific conditions match
            return navigate('/home');
        }

        // Only handle 500 server errors with notification, other errors are handled by loginError state
        // The top Alert component will show other login errors (wrong credentials, etc.)
        // Only show notification if component is still mounted (user hasn't navigated away)
        if (result.statusCode === 500 && isMountedRef.current) {
            addNotification({
                message: "Error interno del servidor. Por favor, intenta más tarde.",
                type: "error",
                position: "left-bottom",
                duration: 5000
            });
        }
    };
    
    // Show loading while checking authentication
    if (isCheckingAuth || status === "checking") {
        return (
            <div className="flex items-center justify-center login-screen font-poppins">
                <div className="flex flex-col items-center justify-center bg-white rounded-lg p-8 shadow-lg">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-background mb-4"></div>
                    <p className="text-gray-600">Verificando sesión...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-end pr-5 xl:pr-14 login-screen font-poppins">
            {/* Alert Component for login errors */}
            {showAlert && loginError && (
                <Alert
                    message={loginError}
                    type="error"
                    position="top"
                    duration={5000}
                    restartAlert={() => {
                        setShowAlert(false);
                        clearLoginError();
                    }}
                />
            )}
            
            <div className="flex flex-col w-[350px] xl:w-[400px] pb-10 relative bg-white rounded-[10px] border-[0.5px] border-gray-400 text-[10px]">
                <img
                    src="assets/images/logo-smart_class.svg"
                    alt="logo smart class"
                    width={114}
                    height={114}
                    className="mt-2 mx-auto"
                />

                <section className="flex flex-col gap-2 mt-2 mx-auto w-full px-5 ">
                    <form onSubmit={onLogin} className='text-font-size-xs border border-slate-200 h-[369px] rounded-[6px]'>
                        <section className="flex flex-col mx-auto w-full px-4">
                            <h3 className="mt-[25px] text-subtle">Completa los campos para ingresar a la plataforma.</h3>
                            
                            {/* input user and password */}
                            <label htmlFor="user" className='block text-white w-full h-14 mt-6'>
                                <span className="text-[14px] text-inter-500 ">Usuario</span>
                                <input
                                    value={form.username}
                                    onChange={(value) => setform({ ...form, username: value.target.value })}
                                    name="user"
                                    className='w-full text-[14px] mt-[5px] h-[38px] px-[9px] border border-slate-300 rounded-[6px] outline-none placeholder-slate-900 text-black'
                                    type="text"
                                    id="user"
                                    placeholder='Ingresa tu usuario' />
                            </label>

                            <label htmlFor="password" className='block text-white w-full h-14 mt-6'>
                                <span className="text-[14px] text-inter-500 ">Contraseña</span>
                                <div className="flex items-center relative">
                                    <input
                                        value={form.password}
                                        name="password"
                                        onChange={(value) => setform({ ...form, password: value.target.value })}
                                        className="w-full text-[14px] mt-[5px] h-[38px] px-[9px] border border-slate-300 rounded-[6px] outline-none placeholder-slate-900 text-black"
                                        type={toggleVisibility ? "password" : "text"}
                                        placeholder="Ingresa tu contraseña"
                                    />
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2"
                                        onClick={() => {
                                            setToggleVisibility(!toggleVisibility)
                                        }}>

                                        <Tooltip
                                            text={toggleVisibility ? "Mostrar contraseña" : "Ocultar contraseña"}
                                            position="top"
                                        >
                                            {
                                                toggleVisibility ?
                                                    <Eye
                                                        color="#000"
                                                        size={22} /> :
                                                    <EyeOff
                                                        color="#000"
                                                        size={22} />
                                            }
                                        </Tooltip>
                                    </div>
                                </div>
                            </label>
                            
                            {/* checkbox remember and forgot password */}
                            <div className="flex justify-between w-full h-6 mt-8">
                                <label htmlFor="remember" className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name="remember"
                                        id="remember"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="" />
                                    <span className=" text-inter-500">Recordarme</span>
                                </label>
                                <p className=''>
                                    <Link to={`/recover`} className=' text-subtle'>Olvidaste tu contraseña?</Link>
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={isPosting || !isFormValid}
                                className={`mt-[31px] py-[11px] border-0 rounded-lg text-white w-full transition-all duration-200 ${
                                    isFormValid && !isPosting 
                                        ? 'bg-background cursor-pointer hover:bg-opacity-90' 
                                        : 'bg-gray-400 cursor-not-allowed'
                                }`}
                            >
                                {isPosting ? 'Ingresando...' : 'Ingresar'}
                            </button>

                        </section>
                    </form>

                </section>
            </div>
        </div>
    )
}

export default LoginPage;
