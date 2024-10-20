import { cn } from "@/lib/utils";
import { PlusIcon } from "lucide-react";
import { type ReactNode, forwardRef } from "react";
import { Button } from "./ui/button";

const DialogPlusButton = forwardRef<
	HTMLButtonElement,
	{
		className?: string;
		children?: ReactNode;
		icon: boolean;
	}
>(({ className, children, icon, ...props }, ref) => {
	return (
		<Button
			variant="outline"
			size="manual"
			className={cn("h-10 w-full text-white hover:text-yellow-400 sm:aspect-square sm:w-10", className)}
			ref={ref}
			{...props}
		>
			{children}
			<PlusIcon className={icon ? "size-4 inline" : " size-4 hidden sm:inline"} />
		</Button>
	);
});

export default DialogPlusButton;
