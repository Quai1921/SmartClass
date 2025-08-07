



import { useState } from "react";
import type { JSX } from "react";
import ChangeEmailForm from "../admin/components/ChangeEmailForm";
import ChangePasswordForm from "../admin/components/ChangePasswordForm";
import UpdateInstitutionForm from "./components/UpdateInstitutionForm";
import ConfigOption from "../admin/components/ConfigOption";
import { HeaderAdmin } from "../admin/components/HeaderAdmin";

type Props = {
    selected: string
}

const formMap: Record<string, JSX.Element> = {
    "Cambiar correo": <ChangeEmailForm />,
    "Cambiar contraseña": <ChangePasswordForm />,
    "Actualizar institución": <UpdateInstitutionForm />,
}

function FormsConfig({ selected }: Props) {
    return (
        <div className="p-4">
            {formMap[selected] || <div>Selecciona una opción del menú</div>}
        </div>
    )
}

const ConfigurationPage = () => {
    const [selected, setSelected] = useState("Cambiar correo");

    return (
        <div className=''>            <HeaderAdmin 
                title="Configuración" 
                subtitle="En esta sección puedes cambiar la configuración de tu cuenta." 
            />            <div className='flex mr-0.5 mt-[23px] w-full h-[744px]'>
                <section className="border-r-2 w-[319px] border-[#E4E4E7]">
                    <section className="mt-[18px]">
                        <h3 className="text-lg-bold ml-7">Cuenta del administrador</h3>
                        <div className="px-4 mt-[2px]">
                            <ConfigOption 
                                iconName="MailCheck" 
                                label="Cambiar correo" 
                                active={selected === "Cambiar correo"}  
                                onClick={() => setSelected("Cambiar correo")}
                            />
                            <ConfigOption 
                                iconName="Key" 
                                label="Cambiar contraseña" 
                                active={selected === "Cambiar contraseña"} 
                                onClick={() => setSelected("Cambiar contraseña")} 
                            />
                        </div>
                    </section>
                    
                    <section className="mt-[32px]">
                        <h3 className="text-lg-bold ml-7">Configuración de la institución</h3>
                        <div className="px-4 mt-[2px]">                            <ConfigOption 
                                iconName="Institution" 
                                label="Actualizar institución" 
                                active={selected === "Actualizar institución"}  
                                onClick={() => setSelected("Actualizar institución")}
                            />
                        </div>
                    </section>
                </section>
                <section className="w-full">                    <div>
                        <FormsConfig selected={selected} />
                    </div>
                </section>
            </div>
        </div>
    )
}

export default ConfigurationPage