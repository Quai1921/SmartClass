


interface Props {
    title: string;
    icon?: string;

}


export default function ConfigurationCard({ title, icon }: Props) {
    return (
        <div className="w-[444px] h-[173px] border-1 border-[#E3EBF5] rounded-[8px]">

            <div className=" w-full min-h-[54px] bg-[#E3EBF5]">
                {icon}
                <h3 className="px-6 lg">{title}</h3>
            </div>
            <div>

            </div>

        </div>
    )
}
