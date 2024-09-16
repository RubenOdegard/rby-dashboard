import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

const CollectionPreviewFormUndertitleContent = ({
	loading,
	title,
	className,
}: {
	loading: boolean;
	title?: string;
	className?: string;
	children?: ReactNode;
}) => {
	return (
		<div>
			{loading ? (
				<div className="text-pretty mt-1 h-5 w-full animate-pulse rounded bg-muted/30 font-semibold" />
			) : (
				<>
					<h3 className={cn("text-pretty ", className)}>{title ? <p>{title}</p> : <p>Not found</p>}</h3>
				</>
			)}
		</div>
	);
};

export default CollectionPreviewFormUndertitleContent;
