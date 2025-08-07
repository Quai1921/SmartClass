import { useState } from "react";
import ConfigOption from "./components/ConfigOption"
import FormsConfig from "./components/FormConfig"
import { HeaderAdmin } from "./components/HeaderAdmin";



const Configuration = () => {
    const [selected, setSelected] = useState("Cambiar correo");

    return (
        <div className='pb-4 max-w-[1500px] mx-auto min-h-screen 2xl:px-4'>

            <HeaderAdmin 
            title="Configuración" 
            subtitle="En esta sección puedes cambiar la configuración de la plataforma." 
            />

            <div className='flex border-t-1 mr-0.5 mt-[23px] border-[#E4E4E7] w-full h-[744px]'>
                <section className="border-r-2 mt-[8px] w-[319px] border-[#E4E4E7]">
                    <section className="mt-[18px]">
                        <h3 className="text-lg-bold ml-7">Cuenta del administrador</h3>
                        <div className="px-4 mt-[2px]">
                            <ConfigOption iconName="MailCheck" label="Cambiar correo" active={selected === "Cambiar correo"}  onClick={() => setSelected("Cambiar correo")}/>
                            <ConfigOption iconName="Key" label="Cambiar contraseña" active={selected === "Cambiar contraseña"} onClick={() => setSelected("Cambiar contraseña")} />
                        </div>
                    </section>
                    <section className="mt-[18px]">
                        <h3 className="text-lg-bold ml-7">Copias de seguridad</h3>
                        <div className="px-4 mt-[2px]">
                            <ConfigOption iconName="FolderLock" label="Generar copias de seguridad del sistema" active={selected === "Generar copias de seguridad del sistema"} onClick={() => setSelected("Generar copias de seguridad del sistema")} />
                            <ConfigOption iconName="FolderSync" label="Restaurar copias de seguridad de instituciones" active={selected === "Restaurar copias de seguridad de instituciones"} onClick={() => setSelected("Restaurar copias de seguridad de instituciones")} />
                        </div>
                    </section>
                    <section className="mt-[18px]">
                        <h3 className="text-lg-bold ml-7">Datos y privacidad</h3>
                        <div className="px-4 mt-[2px]">
                            <ConfigOption iconName="ShieldCheck" label="Configuración de políticas de datos" active={selected === "Configuración de políticas de datos"} onClick={() => setSelected("Configuración de políticas de datos")} />
                            <ConfigOption iconName="FileSpreadsheet" label="Configuración de otras políticas" active={selected === "Configuración de otras políticas"} onClick={() => setSelected("Configuración de otras políticas")} />
                        </div>
                    </section>
                    <section className="mt-[16px]">
                        <h3 className="text-lg-bold ml-7">Configuración del servidor</h3>
                        <div className="px-4 mt-[2px]">
                            <ConfigOption iconName="ShieldCheck" label={`Data center`} active={selected === `Data center`} onClick={() => setSelected(`Data center`)} />
                            <ConfigOption iconName="ShieldCheck" label={`SMTP`} active={selected === `SMTP`} onClick={() => setSelected(`SMTP`)} />
                        </div>
                    </section>
                </section>
                <section className="w-full">
                    <div>
                        <FormsConfig selected={selected} />
                    </div>
                </section>
            </div>
        </div>
    )
}

export default Configuration