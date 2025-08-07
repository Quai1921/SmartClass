import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useQuery, useMutation } from '@tanstack/react-query';
import { acceptPolicies } from '../../../actions/auth/accept-policies';
import { getPolicies } from '../../../actions/auth/get-policies';
import { useAuthStore } from '../../store/auth/useAuthStore';
import Alert from '../../components/Alert';

const Policies: React.FC = () => {
  const [acceptedPolicies, setAcceptedPolicies] = useState<{ [key: string]: boolean }>({});
  const [acceptAllPolicies, setAcceptAllPolicies] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPolicy, setSelectedPolicy] = useState<any>(null);
  const navigate = useNavigate();
  const { updatePolicyStatus } = useAuthStore();
  // Hooks de TanStack Query para manejo eficiente de estado y datos del servidor
  const { data: allPolicies = [], isLoading: loadingPolicies, error: policiesError } = useQuery({
    queryKey: ['policies'],
    staleTime: 1000 * 60 * 10, // 10 minutos - tiempo que los datos se consideran frescos en cache
    queryFn: () => getPolicies(),
  });

  const acceptPoliciesMutation = useMutation({
    mutationFn: () => {
      // Envía únicamente las políticas aceptadas al backend para procesamiento
      const acceptedPolicyIds = Object.keys(acceptedPolicies).filter(id => acceptedPolicies[id]);
      return acceptPolicies(acceptedPolicyIds);
    },    onSuccess: (result) => {
      if (result.success) {
        updatePolicyStatus(false); // Actualiza el estado global de autenticación
        
        // Check if institution is already created after accepting policies
        const { userAuth } = useAuthStore.getState();
        if (userAuth?.institutionCreated) {
          // Institution already exists, go to dashboard
          navigate('/home');
        } else {
          // Institution not created, go to creation flow
          navigate('/create-institution');
        }
      } else {
        setError(result.message || 'Error al aceptar las políticas. Inténtalo de nuevo.');
      }
    },
    onError: (err: Error) => {
      // console.error("Error al aceptar políticas:", err);
      setError(err.message || 'Ocurrió un error al procesar su solicitud.');
    },
  });
  // Filtra solamente las políticas activas para mostrar al usuario
  const policies = allPolicies.filter((policy: any) => policy.active);

  // Manejo de errores al cargar políticas - muestra mensaje de error si la carga falla
  React.useEffect(() => {
    if (policiesError) {
      setError("Error al cargar las políticas. Inténtalo de nuevo.");
    }
  }, [policiesError]);

  // Función para manejar el cambio de estado de una política individual
  // Actualiza el estado local manteniendo el resto de políticas intactas
  const handlePolicyChange = (policyId: string, checked: boolean) => {
    setAcceptedPolicies(prev => ({
      ...prev,
      [policyId]: checked
    }));
  };

  // Función para manejar la selección/deselección masiva de todas las políticas
  // Cuando se activa, marca todas las políticas como aceptadas automáticamente
  const handleAcceptAllChange = (checked: boolean) => {    setAcceptAllPolicies(checked);
    if (checked) {
      // Marca todas las políticas como aceptadas cuando se activa "Aceptar Todo"
      const allAccepted: { [key: string]: boolean } = {};
      policies.forEach((policy: any) => {
        allAccepted[String(policy.id)] = true;
      });
      setAcceptedPolicies(allAccepted);
    }
  };

  // Función para abrir el modal con el contenido completo de una política específica
  const handlePolicyClick = (policy: any) => {
    setSelectedPolicy(policy);
    setShowModal(true);
  };

  // Función para cerrar el modal de visualización de políticas
  const closeModal = () => {
    setShowModal(false);
  };

  // Función para limpiar los mensajes de error de la interfaz
  const restartAlert = () => {
    setError(null);
  };

  // Función para proceder al siguiente paso del onboarding
  // Solo permite continuar si al menos una política ha sido aceptada
  const handleContinue = async () => {
    const acceptedPolicyIds = Object.keys(acceptedPolicies).filter(id => acceptedPolicies[id]);
    
    if (acceptedPolicyIds.length > 0 && !acceptPoliciesMutation.isPending) {
      setError(null);
      acceptPoliciesMutation.mutate();
    }
  };

  // Verifica si todas las políticas han sido aceptadas para actualizar el estado del checkbox "Aceptar Todo"
  const allPoliciesAccepted = policies.length > 0 && policies.every((policy: any) => acceptedPolicies[String(policy.id)]);
  // Actualiza automáticamente el estado del checkbox "Aceptar Todo" cuando cambian las selecciones individuales
  // Esto mantiene la sincronización entre las políticas individuales y el control maestro
  React.useEffect(() => {
    setAcceptAllPolicies(allPoliciesAccepted);
  }, [allPoliciesAccepted]);
  return (    <div      className="min-h-screen flex items-center justify-center bg-cover bg-no-repeat relative py-8"
      style={{
        backgroundImage: `url('/src/assets/background-policies.png')`,
        backgroundPosition: 'top center'
      }}
    >      {/* Superposición semitransparente que aparece cuando el modal está abierto para enfocar la atención */}
      {showModal && (
        <div className="absolute inset-0 bg-black/50 z-10"></div>
      )}
      
      <div className="w-full max-w-[505px] relative z-20">
        {/* Tarjeta principal que contiene todo el contenido del formulario de políticas */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 flex flex-col justify-between min-h-[800px]">
          {/* Logo de SmartClass - Tamaño aumentado para mejor visibilidad */}
          <div className="mb-8 flex justify-center">
            <img
              src="/assets/images/logo-smart_class.svg"
              alt="SmartClass"
              className="mx-auto h-32 w-32"
            />
          </div>

          {/* Título de la sección de términos y condiciones */}
          <h1 className="text-base font-medium text-gray-800 mb-6">
            Términos y condiciones
          </h1>

          {/* Sección de políticas - maneja los diferentes estados: carga, contenido, vacío */}
          {loadingPolicies ? (
            <div className="mb-6 text-center">
              <p className="text-sm text-gray-500">Cargando políticas...</p>
            </div>
          ) : policies.length > 0 ? (
            <div className="mb-6 space-y-4">
              {policies.map((policy) => (
                <div key={policy.id} className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id={`policy-${policy.id}`}
                    checked={acceptedPolicies[String(policy.id)] || false}
                    onChange={(e) => handlePolicyChange(String(policy.id), e.target.checked)}
                    className="mt-1 h-4 w-4 text-gray-600 border-gray-300 rounded focus:ring-gray-500 cursor-pointer"
                  />
                  <div className="flex-1">
                    <label htmlFor={`policy-${policy.id}`} className="cursor-pointer">
                      <p 
                        onClick={() => handlePolicyClick(policy)} 
                        className="text-sm text-gray-800 font-medium underline mb-2 cursor-pointer hover:text-gray-600"
                      >
                        {policy.title}
                      </p>
                    </label>
                    <p className="text-sm text-gray-400 mb-3">
                      Aceptas los términos y condiciones de {policy.title.toLowerCase()}
                    </p>
                  </div>
                </div>
              ))}
            </div>          ) : (
            <div className="mb-6">
              <p className="text-sm text-gray-500">No hay políticas disponibles.</p>
            </div>
          )}

          {/* Checkbox maestro para aceptar todas las políticas de una vez */}
          <div className="flex items-center mb-6">
            <input
              type="checkbox"
              id="acceptAllPolicies"
              checked={acceptAllPolicies}
              onChange={(e) => handleAcceptAllChange(e.target.checked)}
              className="h-5 w-5 text-gray-600 border-gray-300 rounded focus:ring-gray-500 cursor-pointer"
            />
            <label htmlFor="acceptAllPolicies" className="ml-3 text-sm text-gray-500">
              {policies.length > 0 
                ? `Acepto todos los términos y condiciones (${policies.length} políticas)`
                : 'Acepto los términos y condiciones'
              }
            </label>
          </div>

          {/* Botón para continuar al siguiente paso - solo habilitado si hay políticas aceptadas */}
          <button
                onClick={handleContinue}
                disabled={Object.keys(acceptedPolicies).filter(id => acceptedPolicies[id]).length === 0 || acceptPoliciesMutation.isPending}
                className={`w-full py-2.5 rounded-md text-sm font-medium transition-all ${
                  Object.keys(acceptedPolicies).filter(id => acceptedPolicies[id]).length > 0 && !acceptPoliciesMutation.isPending
                    ? 'bg-[#0F1D2E] text-white hover:bg-[#1a2940]'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {acceptPoliciesMutation.isPending ? 'Procesando...' : 'Siguiente'}
              </button>          {/* Indicador de progreso del proceso de onboarding - muestra el paso actual */}
          <div className="flex justify-center mt-auto pt-6 space-x-2">
            <div className="w-8 h-8 rounded-md bg-white border border-gray-200 flex items-center justify-center text-gray-800 font-medium text-sm">1</div>
            <div className="w-8 h-8 rounded-md bg-white border border-gray-200 flex items-center justify-center text-gray-400 font-medium text-sm">2</div>
            <div className="w-8 h-8 rounded-md bg-white border border-gray-200 flex items-center justify-center text-gray-400 font-medium text-sm">3</div>
          </div>
        </div>

        {/* Modal para mostrar el contenido completo de las políticas seleccionadas */}
        {showModal && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 rounded-lg">
            <div className="bg-white rounded-lg w-[95%] max-w-[450px] p-6 shadow-xl">
              {/* Botón para cerrar el modal */}
              <div className="flex justify-end mb-3">
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="text-xl">×</span>
                </button>
              </div>

              {/* Contenido principal del modal con el texto de la política */}
              <div>
                <h2 className="text-lg font-medium text-gray-800 mb-4">
                  {selectedPolicy?.title || 'Términos y condiciones'}
                </h2>

                <div className="space-y-3 text-sm text-gray-600">
                  {selectedPolicy?.content ? (
                    <div 
                      className="leading-relaxed whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{ __html: selectedPolicy.content }}
                    />
                  ) : (
                    <>
                      <p className="leading-relaxed">
                        Al acceder y utilizar esta plataforma, usted acepta cumplir con los presentes Términos y Condiciones.
                        El uso de los recursos, actividades y contenidos disponibles está destinado exclusivamente para fines
                        educativos dentro del marco institucional correspondiente. Está prohibido compartir, reproducir o distribuir
                        cualquier material sin la autorización previa por escrito de la administración del sistema.
                      </p>

                      <p className="leading-relaxed">
                        Los usuarios (estudiantes y docentes) se comprometen a utilizar la plataforma de manera responsable,
                        respetando las normas de convivencia digital, los derechos de autor, y la privacidad de los demás usuarios.
                        El incumplimiento de estas condiciones podrá conllevar a la restricción del acceso a la plataforma o
                        sanciones establecidas por la institución educativa.
                      </p>

                      <p className="leading-relaxed">
                        La plataforma podrá actualizar sus funciones, contenidos o políticas sin previo aviso, por lo que se
                        recomienda revisar periódicamente los Términos y Condiciones. Al continuar utilizando el sistema, el
                        usuario acepta las modificaciones que se puedan implementar con el fin de mejorar la experiencia
                        académica y tecnológica.
                      </p>
                    </>
                  )}                </div>

                {/* Botón de aceptación en el modal - marca automáticamente la política como aceptada */}
                <button
                  onClick={() => {
                    if (selectedPolicy) {
                      handlePolicyChange(String(selectedPolicy.id), true);
                    }
                    closeModal();
                  }}
                  className="w-full mt-5 py-3 bg-[#0F1D2E] text-white text-sm font-medium rounded-md hover:bg-[#1a2940] transition-colors"
                >
                  Acepto
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Componente de alerta para mostrar mensajes de error al usuario */}
        {error && (
          <Alert
            message={error}
            type="error"
            position="left-bottom"
            restartAlert={restartAlert}
            duration={3000}
          />
        )}
      </div>
    </div>
  );
};

export default Policies;