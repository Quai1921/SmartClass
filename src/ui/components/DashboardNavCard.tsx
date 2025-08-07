import CustomButton from "./CustomButton";



interface Props {
    title?: string
    subtitle?: string
    image?: string
    description?: string
    labelButton?: string;
    path?: string
}

export default function DashboardNavCard({ title, subtitle, image, description, labelButton, path }: Props) {
    return (
        <article className="flex flex-col justify-between w-[30%] min-h-[10%] rounded-[12px] border border-zinc-200 hover:bg-[#C4C4C4] shadow transition-all">
            {/* Título y subtítulo */}
            <div className="ml-6 mt-2 xl:mt-4">
                <h3 className="font-semibold text-surface mt-1]">{title}</h3>
                <p className="text-md xl:text-2xl font-bold">{subtitle}</p>
            </div>

            {/* Imagen */}
            <div className="w-full mt-3">
                <img
                    src={`${image}`}
                    alt=""
                    className="w-full h-66 2xl:h-96 object-cover"
                />
            </div>

            {/* Descripción y botón */}
            <div className="flex flex-col flex-grow">
                <p className="py-3 px-4 text-base-regular text-surface-variant mb-auto">
                    {description}
                </p>

                <div className="self-end mr-6 pb-[38px]">
                    <CustomButton label={`${labelButton}`}  path={path} padingX="px-[17px]" padingY="py-[9px]" rounded="rounded-[6px]" />
                </div>
            </div>
        </article>
    )
}
