import { cn } from "@/lib/utils";

const CollectionPreviewFormImage = ({
	loading,
	title,
	imageUrl,
	className,
}: {
	loading: boolean;
	title?: string;
	imageUrl?: string;
	className?: string;
	children?: React.ReactNode;
}) => {
	return (
		<div>
			{loading ? (
				<div className="text-pretty mt-1 aspect-video w-full animate-pulse rounded bg-muted/30 font-semibold"></div>
			) : (
				<>
					<h3 className={cn("text-pretty font-semibold", className)}>
						{title && imageUrl ? (
							<div className={cn("mt-2 aspect-video w-full", className)}>
								<img src={imageUrl} alt={title} className="w-full bg-cover" />
							</div>
						) : (
							<p>Not found</p>
						)}
					</h3>
				</>
			)}
		</div>
	);
};

export default CollectionPreviewFormImage;
