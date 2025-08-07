interface TutorKpiCardProps {
    label: string;
    value: string | number;
    subtitle: string;
    emoji: string;
    bgColor: string;
    isEventCard?: boolean;
}

export const TutorKpiCard = ({ 
    label, 
    value, 
    subtitle, 
    emoji, 
    bgColor, 
    isEventCard = false 
}: TutorKpiCardProps) => {
    return (
        <div className={`${bgColor} rounded-xl p-6 border border-gray-100`}>
            <div className="flex items-center justify-between mb-3">
                <div className="text-3xl">{emoji}</div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                        {value}
                    </div>
                </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">
                {label}
            </h3>
            {isEventCard ? (
                <div className="text-xs text-gray-500">
                    {subtitle.split('\n').map((line, index) => (
                        <div key={index} className="truncate">
                            {line}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-xs text-gray-500 truncate">
                    {subtitle}
                </p>
            )}
        </div>
    );
};
