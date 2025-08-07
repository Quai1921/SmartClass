


interface Props {
    title: string
    subtitle?: string
}


export const HeaderAdmin = ({ title, subtitle }: Props) => {
    return (
        <div>
            <h1 className="text-[24px] font-bold mt-4 mx-auto">
                {title}
            </h1>            {
                subtitle && <h2 className="body-large mt-1 pb-2.5">{subtitle}</h2>
            }
        </div>
    )
}
