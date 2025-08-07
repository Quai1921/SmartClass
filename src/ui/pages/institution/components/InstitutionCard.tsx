


interface Props {
    label: string;
    emoji: string;
    value?: number;
    subtitle?: string;
    bgColor?: string;
    isEventCard?: boolean;
}

export default function InstitutionCard({ 
    label, 
    emoji, 
    value = 5, 
    subtitle = "de 10 registrados",
    bgColor = "bg-[#E3EBF5]",
    isEventCard = false
}: Props) {    return (
        <div className={`flex justify-start items-center w-full min-w-0 h-[120px] gap-4 ${bgColor} rounded-xl p-4 shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer`}>
            <div className="flex-shrink-0">
                <span className="text-3xl">{emoji}</span>
            </div>
            <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-700 mb-2 truncate">{label}</h3>
                {isEventCard ? (
                    <div className="text-xs text-gray-600 whitespace-pre-line break-words overflow-hidden">
                        {subtitle}
                    </div>
                ) : (
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-gray-900">{value}</span>
                        <span className="text-xs text-gray-600 truncate">{subtitle}</span>
                    </div>
                )}
            </div>
        </div>
    )
}
