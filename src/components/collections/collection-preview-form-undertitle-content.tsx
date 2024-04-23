import { cn } from "@/lib/utils";

const CollectionPreviewFormUndertitleContent = ({
	loading,
	title,
	className,
}: {
	loading: boolean;
	title?: string;
	className?: string;
	children?: React.ReactNode;
}) => {
	return (
		<div>
			{loading ? (
				<div className="text-pretty mt-1 h-5 w-full animate-pulse rounded bg-muted/30 font-semibold"></div>
			) : (
				<>
					<h3 className={cn("text-pretty font-semibold", className)}>
						{title ? <p>{title}</p> : <p>Not found</p>}
					</h3>
				</>
			)}
		</div>
	);
};

export default CollectionPreviewFormUndertitleContent;
