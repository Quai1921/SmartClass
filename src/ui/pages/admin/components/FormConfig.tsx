import type { JSX } from "react"

import BackupRestore from "./BackupRestore"
import ChangeEmailForm from "./ChangeEmailForm"
import ChangePasswordForm from "./ChangePasswordForm"
import { BackupGenerate } from "./BackupGenerate"
import { DataCenterConfig } from "./DataCenterConfig"
import { SMTPConfig } from "./SMTPConfig"
import { DataPoliciesConfig } from "./DataPoliciesConfig"
import { OtherPoliciesConfig } from "./OtherPoliciesConfig"


type Props = {
    selected: string
}

const formMap: Record<string, JSX.Element> = {
    "Cambiar correo": <ChangeEmailForm />,
    "Cambiar contraseña": <ChangePasswordForm />,
    "Generar copias de seguridad del sistema": <BackupGenerate />,
    "Restaurar copias de seguridad de instituciones": <BackupRestore />,
    "Configuración de políticas de datos": <DataPoliciesConfig />,
    "Configuración de otras políticas": <OtherPoliciesConfig />,
    "Data center": <DataCenterConfig />,
    "SMTP": <SMTPConfig />
}

export default function FormsConfig({ selected }: Props) {
    return (
        <div className="p-4">
            {formMap[selected] || <div>Selecciona una opción del menú</div>}
        </div>
    )
}
