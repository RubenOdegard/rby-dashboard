import { cn } from "@/lib/utils";
import { StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface ImageWithLinkProps {
	imageUrl?: string;
	domain: string;
	id: number;
	favorite: boolean;
	handleImageHover: (id: number) => void;
	handleImageLeave: () => void;
	className?: string;
}

const ImageWithLink = ({
	imageUrl,
	domain,
	id,
	favorite,
	handleImageHover,
	handleImageLeave,
	className,
}: ImageWithLinkProps) => {
	const [isHovered, setIsHovered] = useState<boolean>(false);

	const handleMouseEnter = () => {
		setIsHovered(true);
		handleImageHover(id);
	};

	const handleMouseLeave = () => {
		setIsHovered(false);
		handleImageLeave();
	};

	return (
		<Link
			href={domain}
			target="_blank"
			passHref={true}
			className={cn("relative", className)}
			rel="noopener noreferrer"
			aria-label={domain}
		>
			{favorite ? (
				<StarIcon className="size-4 absolute right-5 top-5 z-40 fill-yellow-400 text-yellow-400 shadow-md" />
			) : null}

			<div
				className={cn(
					"relative aspect-video overflow-clip rounded-xl border shadow-lg transition-all duration-1000",
					{ "border-yellow-400": isHovered },
				)}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
			>
				{imageUrl ? (
					<Image
						src={imageUrl}
						alt="Image"
						quality={30}
						layout="fill"
						objectFit="cover"
						// biome-ignore lint/suspicious/noAssignInExpressions: <Rewrite this?>
						onError={(e) => ((e.target as HTMLImageElement).src = "/placeholder-img.webp")}
					/>
				) : (
					<div className="text-pretty flex aspect-video items-center justify-center text-xs">
						{isHovered ? <p className="text-white">Open in a new tab</p> : <p>Image not found</p>}
					</div>
				)}
				{isHovered && (
					<div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-70 backdrop-blur-sm transition-all">
						<p className="text-xs text-foreground">Open in a new tab</p>
					</div>
				)}
			</div>
		</Link>
	);
};

export default ImageWithLink;
