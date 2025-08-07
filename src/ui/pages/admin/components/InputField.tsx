interface Props {
    id: string;
    label?: string;
    value?: string;
    placeholder?: string;
    type?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function InputField({
    id,
    label,
    value,
    placeholder,
    type,
    onChange,
}: Props) {
    return (
        <label htmlFor={id} className="flex justify-center gap-4 items-center text-gray-700 mb-1 text-center">
            <div className="text-end w-[35%]">
                <span className="text-end">{label}</span>
            </div>
            <div className="w-[65%]">
                <input
                    type={type}
                    id={id}
                    value={value}
                    placeholder={placeholder}
                    onChange={onChange}
                    className="px-4 py-2 w-full border self-end border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>
        </label>
    );
}
