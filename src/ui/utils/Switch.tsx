
import '../utils/Switch.css'

interface Props {
    isActive: boolean;
    onChange: (value: boolean) => void;
}


export const Switch = ({ isActive = false, onChange }: Props) => {

    const handleToggle = () => {
        onChange(!isActive);
    };

    return (
        <label className="switch">
            <input type="checkbox" checked={isActive} onChange={handleToggle} />
            <span className="slider"></span>
        </label>
    )
}
