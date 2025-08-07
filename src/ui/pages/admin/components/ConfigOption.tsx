import { IconComponent } from "./Icon";
import * as Icons from "./Icons";

type IconName = keyof typeof Icons;

interface Props {
    iconName: IconName;
    label: string;
    size?: number;
    active?: boolean;
    px?: string;
    py?: string;
    onClick?: () => void
}

export default function ConfigOption({ iconName, label, size = 16, active = false, px, py, onClick }: Props) {
    return (
        <button className={`flex gap-2 my-[5px] pl-3 items-center min-w-57 min-h-9 ${px} py-${py} rounded-md ${active ? "bg-zinc-100 shadow" : ""}`}
            onClick={onClick}>
            <IconComponent name={iconName} size={size} color="#09090B" />
            <span className="text-sm-medium text-left">{label}</span>
        </button>
    );
}
