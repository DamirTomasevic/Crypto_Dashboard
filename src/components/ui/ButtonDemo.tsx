import { ButtonColorful } from "./button-colorful";

function ButtonDemo() {
    return (
        <div className="flex flex-col items-center gap-4 p-6 bg-black/30 rounded-xl border border-custom-green/20">
            <h2 className="text-lg font-bold text-white mb-4">Button Components</h2>
            <div className="flex flex-wrap gap-4">
                <ButtonColorful label="Connect Wallet" />
                <ButtonColorful label="View Dashboard" className="bg-black/80" />
                <ButtonColorful 
                    label="Explore MORE" 
                    className="animate-shimmer bg-[length:200%_100%]" 
                />
            </div>
        </div>
    );
}

export { ButtonDemo };