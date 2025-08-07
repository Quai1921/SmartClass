import { useNavigate } from 'react-router';

interface QuickActionCardProps {
    icon: string;
    title: string;
    description: string;
    path: string;
    bgColor: string;
}

export const QuickActionCard = ({ 
    icon, 
    title, 
    description, 
    path, 
    bgColor 
}: QuickActionCardProps) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(path);
    };

    return (
        <div 
            className={`${bgColor} rounded-lg p-4 border border-gray-100 hover:shadow-md transition-all cursor-pointer`}
            onClick={handleClick}
        >
            <div className="flex items-center space-x-3">
                <div className="text-2xl">
                    {icon}
                </div>
                <div>
                    <h4 className="font-medium text-gray-900">
                        {title}
                    </h4>
                    <p className="text-sm text-gray-600">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );
};
