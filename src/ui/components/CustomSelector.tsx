import { IconComponent } from "../pages/admin/components/Icon"
import * as Icons from "../pages/admin/components/Icons"

type IconName = keyof typeof Icons;


interface Props {
    iconName?: IconName;
    label: string;
    width?: string;
    value?: string;
    options?: { value: string; label: string }[];
    onChange?: (value: string | undefined) => void;
}


export default function CustomSelector({ iconName, label, width, options = [], onChange, value }: Props) {
    return (
        <div className="flex items-center relative ">
            {
                iconName ? (
                    <div>
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <IconComponent name={iconName} size={16} color="#09090B" />
                        </div>

                        <select
                            value={value || ''}
                            onChange={(e) => {
                                const value = e.target.value;
                                onChange?.(value === '' ? undefined : value);
                            }}                            className={`text-[14px] pl-9 w-[150px] ${width} py-[6px] border-[#CCCCCC] bg-transparent border-1 rounded-md outline-none`}
                        >
                            <option value="" style={{ color: '#9CA3AF' }}>{label}</option>
                            {options.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>
                ) : (
                    <select
                        value={value || ''}
                        onChange={(e) => {
                            const value = e.target.value;
                            onChange?.(value === '' ? undefined : value);
                        }}                        className={`text-[14px] pl-3 w-[150px] ${width} py-[6px] border-[#CCCCCC] bg-transparent border-1 rounded-md outline-none`}
                    >
                        <option value="" style={{ color: '#9CA3AF' }}>{label}</option>
                        {options.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                )
            }

        </div >
    );
}

