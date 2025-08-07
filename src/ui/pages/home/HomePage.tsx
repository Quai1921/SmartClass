import { useAuthStore } from "../../store/auth/useAuthStore";
import HomePageAdmin from "../admin/HomePageAdmin";
import HomePageInstitution from "../institution/HomePageInstitution";


const HomePage = () => {

    const {role} = useAuthStore();

    return (
        <div>
            {role === 'ADMIN' ? (
                <HomePageAdmin />
            ) : (
                <HomePageInstitution />
            )}
        </div>

    )
}

export default HomePage