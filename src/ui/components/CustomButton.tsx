import { Link } from "react-router"

import * as Icons from "../pages/admin/components/Icons"
import { IconComponent } from '../pages/admin/components/Icon';

type IconName = keyof typeof Icons;

interface Props {
    label: string
    icon?: IconName
    iconSize?: number
    path?: string
    rounded?: string
    onClick?: () => void
    padingY?: string
    padingX?: string
}

export default function CustomButton({ label, icon, iconSize = 14, path, rounded = "rounded-[6px]", onClick, padingX="px-[17px]" ,padingY="py-[10px]" }: Props) {
    const buttonClass = `flex items-center justify-center gap-2 bg-surface text-white text-center label-large ${padingX} ${padingY} body-medium ${rounded} cursor-pointer`;
    
    if (path) {
        return (
            <Link
                to={`${path}`}
                className={buttonClass}
                onClick={onClick}
            >
                {icon && <IconComponent name={icon} size={iconSize} color="#FFFFFF" />}
                {label}
            </Link>
        );
    }
    
    return (
        <button
            type="button"
            className={buttonClass}
            onClick={onClick}
        >
            {icon && <IconComponent name={icon} size={iconSize} color="#FFFFFF" />}
            {label}
        </button>
    );
}
