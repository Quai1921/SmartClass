

interface IconBaseProps {
    size?: number;
    color?: string;
}


export const User = ({ size = 16, color = "#fff" }: IconBaseProps) => (
    <svg
        width={size}
        height={size}
        fill="none"
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 8.667A3.333 3.333 0 1 0 8 2a3.333 3.333 0 0 0 0 6.667Zm0 0A5.333 5.333 0 0 1 13.334 14M8 8.667A5.333 5.333 0 0 0 2.667 14"
        />
    </svg>
)

export const MailCheck = ({ size = 14, color = "#09090B" }: IconBaseProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={(size * 14) / 16}
        viewBox="0 0 16 14"
        fill="none"
    >
        <path
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14.666 7.667V3a1.333 1.333 0 0 0-1.333-1.333H2.666A1.333 1.333 0 0 0 1.333 3v8c0 .733.6 1.333 1.333 1.333H8m6.666-8.666-5.98 3.8a1.293 1.293 0 0 1-1.373 0l-5.98-3.8m9.333 8L12 13l2.666-2.667"
        />
    </svg>
);

export const Close = ({ size = 24, color = "#09090B" }: IconBaseProps) => (
    <svg
        width={size}
        height={size}
        fill="none"
        viewBox="0 0 23 24"
        xmlns="http://www.w3.org/2000/svg"
    >
        <g clipPath="url(#clip)">
            <path
                stroke={color}
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m9.428 13.886 3.771-3.772m-3.77 0 3.77 3.772m2.829-6.6A6.667 6.667 0 1 1 6.6 16.714a6.667 6.667 0 0 1 9.428-9.428Z"
            />
        </g>
        <defs>
            <clipPath id="clip">
                <path fill="#fff" d="M0 12 11.314.686 22.627 12 11.314 23.314z" />
            </clipPath>
        </defs>
    </svg>
)

export const Key = ({ size = 14, color = "#09090B" }: IconBaseProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={(size * 16) / 16}
        viewBox="0 0 16 16"
        fill="none"
    >
        <path
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="m10.333 5 1.533 1.534a.667.667 0 0 0 .934 0l1.4-1.4a.667.667 0 0 0 0-.934l-1.534-1.533M14 1.334l-6.4 6.4m1.066 2.6a3.667 3.667 0 1 1-7.333 0 3.667 3.667 0 0 1 7.333 0Z"
        />
    </svg>
);


export const Bell = ({ size = 14, color = "#09090B" }: IconBaseProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={(size * 16) / 14}
        viewBox="0 0 14 16"
        fill="none"
    >
        <path
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5.867 14a1.294 1.294 0 0 0 2.266 0M3 5.334a4 4 0 1 1 8 0c0 4.666 2 6 2 6H1s2-1.334 2-6Z"
        />
    </svg>
);


export const FolderLock = ({ size = 14, color = "#09090B" }: IconBaseProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={(size * 15) / 16}
        viewBox="0 0 16 15"
        fill="none"
    >
        <path
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6.666 12.333h-4A1.334 1.334 0 0 1 1.333 11V2.333A1.333 1.333 0 0 1 2.666 1h2.6a1.333 1.333 0 0 1 1.127.6l.54.8a1.333 1.333 0 0 0 1.113.6h5.287a1.333 1.333 0 0 1 1.333 1.333V6m-1.333 4.333V9a1.334 1.334 0 0 0-2.667 0v1.333m-.666 0h4c.368 0 .666.299.666.667v2a.667.667 0 0 1-.666.667h-4A.667.667 0 0 1 9.333 13v-2c0-.368.298-.667.667-.667Z"
        />
    </svg>
);

export const FolderSync = ({ size = 14, color = "#09090B" }: IconBaseProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 16 16"
        fill="none"
    >
        <path
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 13.333H2.666A1.334 1.334 0 0 1 1.333 12V3.333A1.333 1.333 0 0 1 2.666 2h2.6a1.333 1.333 0 0 1 1.127.6l.54.8a1.333 1.333 0 0 0 1.113.6h5.287a1.333 1.333 0 0 1 1.333 1.333v.334M8 6.667v2.666m0 0h2.666M8 9.333l1.023-1.07a3.333 3.333 0 0 1 5.333 1m.31 5.404V12m0 0H12m2.666 0-1.023 1.07a3.333 3.333 0 0 1-5.333-1"
        />
    </svg>
);


export const ShieldCheck = ({ size = 14, color = "#09090B" }: IconBaseProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 16 16"
        fill="none"
    >
        <path
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="m6 8 1.334 1.333L10 6.667m3.334 2c0 3.333-2.334 5-5.107 5.966a.666.666 0 0 1-.447-.006C5 13.667 2.667 12 2.667 8.667V4a.667.667 0 0 1 .667-.667c1.333 0 3-.8 4.16-1.813a.78.78 0 0 1 1.013 0c1.167 1.02 2.827 1.813 4.16 1.813a.667.667 0 0 1 .667.667v4.667Z"
        />
    </svg>
);


export const FileSpreadsheet = ({ size = 14, color = "#09090B" }: IconBaseProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 16 16"
        fill="none"
    >
        <path
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.334 1.333V4a1.333 1.333 0 0 0 1.333 1.333h2.667m-8 3.334h1.333m2.667 0h1.333m-5.333 2.667h1.333m2.667 0h1.333m-.667-10H4a1.333 1.333 0 0 0-1.333 1.333v10.666A1.333 1.333 0 0 0 4 14.668h8a1.333 1.333 0 0 0 1.334-1.333V4.667L10 1.334Z"
        />
    </svg>
);



export const Network = ({ size = 14, color = "#09090B" }: IconBaseProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 16 16"
        fill="none"
    >
        <g clipPath="url(#clip0_1_1)">
            <path
                stroke={color}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3.333 10.667v-2A.667.667 0 0 1 4 8h8a.667.667 0 0 1 .666.667v2M8 8V5.333m3.333 5.334H14c.368 0 .666.298.666.667V14a.667.667 0 0 1-.666.667h-2.667a.667.667 0 0 1-.667-.667v-2.666c0-.369.299-.667.667-.667Zm-9.333 0h2.666c.369 0 .667.298.667.667V14a.667.667 0 0 1-.667.667H2A.667.667 0 0 1 1.333 14v-2.666c0-.369.298-.667.667-.667Zm4.666-9.334h2.667c.368 0 .667.299.667.667v2.667a.667.667 0 0 1-.667.667H6.666A.667.667 0 0 1 6 4.667V2c0-.368.298-.667.666-.667Z"
            />
        </g>
        <defs>
            <clipPath id="clip0_1_1">
                <path fill="#fff" d="M0 0h16v16H0z" />
            </clipPath>
        </defs>
    </svg>
);

export const Plus = ({ size = 19, color = "#ffffff" }: IconBaseProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 19 19"
        fill="none"
    >
        <path
            fill={color}
            d="M9.202 10.6h-4.5V9.1h4.5V4.6h1.5v4.5h4.5v1.5h-4.5v4.5h-1.5v-4.5Z"
        />
    </svg>
);

/* navbar */

export const Home = ({ size = 18, color = "#fff" }: IconBaseProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={(size * 16) / 18} viewBox="0 0 18 16" fill="none">
        <path fill={color} d="m9 3.158 4.167 3.75v6.509H11.5v-5h-5v5H4.833V6.908L9 3.158ZM9 .917l-8.333 7.5h2.5v6.666h5v-5h1.666v5h5V8.417h2.5L9 .917Z" />
    </svg>
);

export const Student = ({ size = 20, color = "#fff" }: IconBaseProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 20 20" fill="none">
        <path fill={color} d="M9.99999 2.5 0.833328 7.5 4.16666 9.31667V14.3167L9.99999 17.5 15.8333 14.3167V9.31667L17.5 8.40833V14.1667H19.1667V7.5L9.99999 2.5ZM15.6833 7.5 9.99999 10.6 4.31666 7.5 9.99999 4.4 15.6833 7.5ZM14.1667 13.325 9.99999 15.6 5.83333 13.325V10.225L9.99999 12.5 14.1667 10.225V13.325Z" />
    </svg>
);

export const Teacher = ({ size = 20, color = "#fff" }: IconBaseProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 20 20" fill="none">
        <path fill={color} d="M10 5c.917 0 1.667.75 1.667 1.667 0 .916-.75 1.666-1.667 1.666s-1.667-.75-1.667-1.666C8.333 5.75 9.083 5 10 5Zm0 7.5c2.25 0 4.833 1.075 5 1.667V15H5v-.825c.167-.6 2.75-1.675 5-1.675Zm0-9.167A3.332 3.332 0 1 0 10 10a3.332 3.332 0 0 0 3.333-3.333A3.332 3.332 0 0 0 10 3.333Zm0 7.5c-2.225 0-6.667 1.117-6.667 3.334v2.5h13.334v-2.5c0-2.217-4.442-3.334-6.667-3.334Z" />
    </svg>
);

export const Calendar = ({ size = 20, color = "#fff" }: IconBaseProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 20 20" fill="none">
        <path fill={color} d="M16.667 2.5h-.834V.833h-1.666V2.5H5.833V.833H4.167V2.5h-.834c-.916 0-1.666.75-1.666 1.667V17.5c0 .917.75 1.667 1.666 1.667h13.334c.916 0 1.666-.75 1.666-1.667V4.167c0-.917-.75-1.667-1.666-1.667Zm0 15H3.333V8.333h13.334V17.5Zm0-10.833H3.333v-2.5h13.334v2.5Z" />
    </svg>
);

export const Report = ({ size = 20, color = "#fff" }: IconBaseProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 20 20" fill="none">
        <path fill={color} d="M6.667 7.5H3.333v9.167h3.334V7.5ZM16.667 10.833h-3.334v5.834h3.334v-5.834ZM11.667 3.333H8.333v13.334h3.334V3.333Z" />
    </svg>
);

export const Setting = ({ size = 20, color = "#fff" }: IconBaseProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 20 20" fill="none">
        <path fill={color} d="M16.194 10.817c.033-.267.058-.534.058-.817a6.5 6.5 0 0 0-.058-.817l1.758-1.375a.42.42 0 0 0 .1-.533l-1.667-2.883a.416.416 0 0 0-.508-.184l-2.075.834a6.088 6.088 0 0 0-1.409-.817l-.316-2.208a.406.406 0 0 0-.409-.35H8.335a.406.406 0 0 0-.408.35L7.61 4.225a6.402 6.402 0 0 0-1.408.817l-2.075-.834a.472.472 0 0 0-.15-.025.413.413 0 0 0-.358.209L1.952 7.275a.41.41 0 0 0 .1.533L3.81 9.183a6.607 6.607 0 0 0-.058.817c0 .275.025.55.058.817l-1.758 1.375a.42.42 0 0 0-.1.533l1.667 2.883a.416.416 0 0 0 .508.184l2.075-.834c.433.334.9.609 1.408.817l.317 2.208c.025.2.2.35.408.35h3.333c.209 0 .384-.15.409-.35l.316-2.208a6.405 6.405 0 0 0 1.409-.817l2.075.834c.05.016.1.025.15.025a.413.413 0 0 0 .358-.209l1.667-2.883a.42.42 0 0 0-.1-.533l-1.759-1.375Zm-1.65-1.425c.033.258.041.433.041.608s-.017.358-.042.608l-.116.942.742.583.9.7-.584 1.009-1.058-.425-.867-.35-.75.566c-.358.267-.7.467-1.042.609l-.883.358-.133.942-.167 1.125H9.418L9.127 14.6l-.884-.358a4.728 4.728 0 0 1-1.025-.592l-.758-.583-.883.358-1.058.425-.584-1.008.9-.7.742-.584-.117-.941A6.703 6.703 0 0 1 5.418 10c0-.167.017-.358.042-.608l.117-.942-.742-.583-.9-.7.584-1.009 1.058.425.867.35.75-.566a4.88 4.88 0 0 1 1.041-.609l.883-.358.134-.942.166-1.125h1.159l.291 2.067.884.358c.358.15.691.342 1.025.592l.758.583.883-.358 1.059-.425.583 1.008-.891.709-.742.583.117.942Zm-4.542-2.725a3.332 3.332 0 1 0 0 6.666 3.332 3.332 0 1 0 0-6.666Zm0 5c-.917 0-1.667-.75-1.667-1.667s.75-1.667 1.667-1.667c.916 0 1.666.75 1.666 1.667s-.75 1.667-1.666 1.667Z" />
    </svg>
);

export const Mail = ({ size = 20, color = "#fff" }: IconBaseProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 20 20"
        fill="none"
    >
        <path
            fill={color}
            d="M18.333 5c0-.917-.75-1.667-1.667-1.667H3.333c-.917 0-1.667.75-1.667 1.667v10c0 .917.75 1.667 1.667 1.667h13.333c.917 0 1.667-.75 1.667-1.667V5Zm-1.667 0L9.999 9.167 3.333 5h13.333Zm0 10H3.333V6.667l6.666 4.167 6.667-4.167V15Z"
        />
    </svg>
)

export const Institution = ({ size = 20, color = "#fff" }: IconBaseProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 20 20"
        fill="none"
    >
        <path
            fill={color}
            d="M15.833 4.167v1.666H12.5V4.167h3.333Zm-8.333 0v5H4.167v-5H7.5Zm8.333 6.666v5H12.5v-5h3.333ZM7.5 14.167v1.666H4.167v-1.666H7.5ZM17.5 2.5h-6.667v5H17.5v-5Zm-8.333 0H2.5v8.333h6.667V2.5ZM17.5 9.167h-6.667V17.5H17.5V9.167ZM9.167 12.5H2.5v5h6.667v-5Z"
        />
    </svg>
)

export const Stats = ({ size = 20, color = "#fff" }: IconBaseProps) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M6.66659 7.49992H3.33325V16.6666H6.66659V7.49992Z" fill={color} />
        <path d="M16.6666 10.8333H13.3333V16.6666H16.6666V10.8333Z" fill={color} />
        <path d="M11.6666 3.33325H8.33325V16.6666H11.6666V3.33325Z" fill={color} />
    </svg>
)

export const SearchIcon = ({ size = 24, color = "#667085", ...props }: IconBaseProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        fill="none"
        viewBox="0 0 24 25"
        {...props}
    >
        <path
            fill={color}
            d="M15.758 14.395h-.79l-.28-.27a6.471 6.471 0 0 0 1.57-4.23 6.5 6.5 0 1 0-6.5 6.5c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99 1.49-1.49-4.99-5Zm-6 0c-2.49 0-4.5-2.01-4.5-4.5s2.01-4.5 4.5-4.5 4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5Z"
        />
    </svg>
);

export const EditIcon = ({ size = 24, color = "#667085", ...props }: IconBaseProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        fill="none"
        viewBox="0 0 24 25"
        {...props}
    >
        <path
            fill={color}
            d="M2.937 8.64h11v2h-11v-2Zm0-2h11v-2h-11v2Zm0 8h7v-2h-7v2Zm15.01-3.13.71-.71a.996.996 0 0 1 1.41 0l.71.71c.39.39.39 1.02 0 1.41l-.71.71-2.12-2.12Zm-.71.71-5.3 5.3v2.12h2.12l5.3-5.3-2.12-2.12Z"
        />
    </svg>
);

export const PdfExport = ({ size = 24, color = "#667085", ...props }: IconBaseProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        fill="none"
        viewBox="0 0 24 25"
        {...props}
    >
        <path
            fill={color}
            d="M20.003 2.5h-12c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-12c0-1.1-.9-2-2-2Zm0 14h-12v-12h12v12Zm-16-10h-2v14c0 1.1.9 2 2 2h14v-2h-14v-14Zm12 6v-3c0-.55-.45-1-1-1h-2v5h2c.55 0 1-.45 1-1Zm-2-3h1v3h-1v-3Zm4 2h1v-1h-1v-1h1v-1h-2v5h1v-2Zm-8 0h1c.55 0 1-.45 1-1v-1c0-.55-.45-1-1-1h-2v5h1v-2Zm0-2h1v1h-1v-1Z"
        />
    </svg>
);

export const DownloadIcon = ({ size = 21, color = "#667085", ...props }: IconBaseProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        fill="none"
        viewBox="0 0 21 21"
        {...props}
    >
        <g clipPath="url(#clip)">
            <path
                stroke={color}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3.412 7.033V16.2a1.667 1.667 0 0 0 1.666 1.666h1.667m10-10.833v9.166a1.667 1.667 0 0 1-1.667 1.667h-1.666m-5.834-5 2.5-2.5m0 0 2.5 2.5m-2.5-2.5v7.5m-7.5-15h15c.46 0 .834.373.834.834v2.5c0 .46-.373.833-.834.833h-15a.833.833 0 0 1-.833-.833V3.7c0-.46.373-.834.833-.834Z"
            />
        </g>
        <defs>
            <clipPath id="clip">
                <path fill="#fff" d="M.078.366h20v20h-20z" />
            </clipPath>
        </defs>
    </svg>
);

export const UploadIcon = ({ size = 21, color = "#667085", ...props }: IconBaseProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        fill="none"
        viewBox="0 0 21 21"
        {...props}
    >
        <path
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.578 12.866V16.2a1.667 1.667 0 0 1-1.666 1.666H4.245A1.667 1.667 0 0 1 2.578 16.2v-3.334M5.911 8.7l4.167 4.166m0 0L14.245 8.7m-4.167 4.166v-10"
        />
    </svg>
);

export const EyeSlashIcon = ({ size = 21, color = "#667085", ...props }: IconBaseProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        width={size}
        height={size}
        viewBox="0 0 21 22"
        {...props}
    >
        <path d="M10.5 3.5C6.5 3.5 2.5 8 1 11C2.5 14 6.5 18.5 10.5 18.5C14.5 18.5 18.5 14 20 11C18.5 8 14.5 3.5 10.5 3.5Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10.3401 8.07895L13.3462 11.0851L13.3605 10.9276C13.3605 9.34819 12.077 8.06464 10.4976 8.06464L10.3401 8.07895Z" fill="black" />
        <path d="M10.4975 6.15601C13.1315 6.15601 15.2692 8.29372 15.2692 10.9277C15.2692 11.5432 15.1451 12.1301 14.9304 12.6693L17.7218 15.4607C19.1628 14.2583 20.2985 12.7027 20.9999 10.9277C19.3442 6.73818 15.274 3.7702 10.4976 3.7702C9.16149 3.7702 7.88272 4.00877 6.69458 4.43822L8.75593 6.49478C9.29507 6.28484 9.88198 6.15601 10.4975 6.15601Z" fill="black" />
        <path d="M0.954313 3.55545L3.13018 5.73132L3.56442 6.16556C1.98977 7.39664 0.744376 9.03333 0 10.9276C1.651 15.1171 5.72597 18.0851 10.4976 18.0851C11.9769 18.0851 13.3892 17.7988 14.6824 17.2787L15.088 17.6843L17.8699 20.4709L19.0866 19.2589L2.17108 2.33868L0.954313 3.55545ZM6.23178 8.82813L7.70622 10.3026C7.66327 10.5078 7.63464 10.7129 7.63464 10.9276C7.63464 12.5071 8.9182 13.7906 10.4976 13.7906C10.7124 13.7906 10.9175 13.762 11.118 13.7191L12.5924 15.1935C11.9577 15.5084 11.2516 15.6993 10.4976 15.6993C7.86368 15.6993 5.72597 13.5616 5.72597 10.9276C5.72597 10.1737 5.91685 9.46752 6.23178 8.82813Z" fill="black" />
    </svg>
);

export const EyeIcon = ({ size = 21, color = "currentColor", ...props }: IconBaseProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        {...props}
        width={size}
        height={size}
        viewBox="0 0 21 22"
        fill="slate"
        stroke="slate"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round">
        <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
        <circle cx="12" cy="12" r="3" /></svg>
);

