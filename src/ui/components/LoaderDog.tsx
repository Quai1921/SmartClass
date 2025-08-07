import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface Props {
    width?: number;
    height?: number;
    className?: string;
}

export const LoaderDog = ({ width, height, className }: Props) => {
    return (
        <div className={`flex justify-center items-center ${className}`}>
            <DotLottieReact
                src="src\ui\utils\Animation - Dog.lottie" // debe estar en public/animations/
                loop
                autoplay
                style={{ width, height }}
            />
        </div>
    );
};