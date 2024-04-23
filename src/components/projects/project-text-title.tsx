import { cn } from "@/lib/utils";

const ProjectTextTitle = ({
	title,
	className,
}: {
	title?: string;
	className?: string;
}) => {
	return (
		<h3
			className={cn(
				"text-pretty text-center text-lg font-semibold xs:text-2xl sm:text-3xl md:text-4xl md:font-bold",
				className,
			)}
		>
			{title || "No title"}
		</h3>
	);
};

export default ProjectTextTitle;
