import { cn } from "@/lib/utils";

const TextTitle = ({
	title,
	className,
}: {
	title?: string;
	className?: string;
}) => {
	return (
		<h3 className={cn("text-pretty text-md font-semibold text-foreground/90 sm:text-lg", className)}>
			{title || "No title"}
		</h3>
	);
};

export default TextTitle;
