    import { IconComponent } from '../pages/admin/components/Icon';



    type SelectedTagProps = {
        label: string;
        onRemove: () => void;
    };

    export const SelectedTag = ({ label, onRemove }: SelectedTagProps) => {
        return (
            <button className="flex items-center gap-2 px-3 text-center border border-dashed border-zinc-200 bg-transparent hover:bg-[#B2B2B2] outline-none rounded-lg transition-colors"
                onClick={onRemove}>
                {<IconComponent name={"Close"} size={30} color="#09090B" />}
                <span className='text-zinc-950 text-[12px] font-medium'>{label}</span>
            </button>
        );
    };
