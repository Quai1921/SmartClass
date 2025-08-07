import * as Icons from './Icons';

type IconName = keyof typeof Icons;

interface IconProps {
    name: IconName;
    size?: number;
    color?: string;
    onClick?: () => void;
}

export const IconComponent = ({ name, size, color }: IconProps) => {
    const SvgIcon = Icons[name];
    return SvgIcon ?
        (<div className='cursor-pointer'>
            <SvgIcon size={size} color={color} />
        </div>)
        :
        null;
};
