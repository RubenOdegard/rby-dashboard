import { cn } from "@/lib/utils";
import { useStore } from "@/stores/store";
const TextDescription = (text: { description?: string }) => {
	const { viewExpanded } = useStore();
	return (
		<p
			className={cn(
				{ "mt-1": viewExpanded },
				"text-pretty pt-0 text-sm text-muted-foreground sm:text-base",
			)}
		>
			{text.description || "No description"}
		</p>
	);
};

export default TextDescription;
