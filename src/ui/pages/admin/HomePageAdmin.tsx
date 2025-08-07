import { useQuery } from "@tanstack/react-query"
import { getUserData } from "../../../actions/user/get-user-data"
import CustomButton from "../../components/CustomButton"
import DashboardNavCard from "../../components/DashboardNavCard"
import { HeaderAdmin } from "./components/HeaderAdmin"
import { LoaderDog } from "../../components/LoaderDog"
// import { useEffect } from "react"
import { useAuthStore } from "../../store/auth/useAuthStore"

const HomePageAdmin = () => {
    const { role } = useAuthStore();
    
    // useEffect(() => {
    //     // console.log('🏠 HomePageAdmin mounted');
    //     // return () => console.log('🏠 HomePageAdmin unmounted');
    // }, []);

    const { data: userData, isLoading, isError } = useQuery({
        queryKey: ['userData'],
        staleTime: 1000 * 60 * 60, // 1 hour
        queryFn: () => getUserData(),
        enabled: role === 'ADMIN',
    })


    if (isLoading) return <LoaderDog width={200} height={200} />

    if (isError || !userData) return <p>Error cargando datos del usuario.</p>;



    return (
        <div className="flex flex-col max-w-[1500px] mx-auto min-h-screen 2xl px-4">

            <HeaderAdmin
                title={`Hola ${userData.userFirstName}`}
                subtitle="Acá podrás ver un resumen general de toda la plataforma. Para acceder a alguna sección solo haz click sobre ella."
            />


                <div className="flex justify-between mt-[20px] min-h[500px]">
                    <DashboardNavCard
                        title="Usuarios"
                        subtitle={`${userData.totalUsers} Usuarios`}
                        image="src/ui/assets/south-american-school-teacher-and-students.avif"
                        description="En este módulo podrás ver y administrar la información de los usuarios permitidos en las plataformas"
                        labelButton="Ir a usuarios"
                        path="/usuarios" />
                    <DashboardNavCard
                        title="Instituciones"
                        subtitle={`${userData.totalInstitutions} Instituciones`}
                        image="src/ui/assets/colombian-school-building.avif"
                        description="En este módulo podrás revisar la información referente a las  instituciones con acceso a la plataforma."
                        labelButton="Ir a instituciones"
                        path="/instituciones" />
                    <DashboardNavCard
                        title="Reportes"
                        subtitle=/* {`${userData.totalUsers} Reportes`} */"0 Reportes disponibles"
                        description="En este módulo podrás ver y generar reportes de cada escuela y otros datos de interés."
                        image="src/ui/assets/a-laptop-with-reports-and-data.avif"
                        labelButton="Ir a reportes"
                        path="/reportes" />
                </div>



            <div className="flex justify-end mt-5">
                <CustomButton label="Configuración" icon="Setting" path="/configuraciones" padingX="px-[20px]" />
            </div>
        </div>
    )
}

export default HomePageAdmin