import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ImageWithLinkProps {
	imageUrl?: string;
	domain: string;
	id: number;
	handleImageHover: (id: number) => void;
	handleImageLeave: () => void;
	className?: string;
}

const ImageWithLink = ({
	imageUrl,
	domain,
	id,
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
		<Link href={domain} target="_blank" passHref className={className}>
			<div
				className={cn(
					"relative aspect-video overflow-clip rounded-xl border transition-all duration-1000",
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
						onError={(e) =>
							((e.target as HTMLImageElement).src = "/placeholder-img.webp")
						}
					/>
				) : (
					<div className="text-pretty flex aspect-video items-center justify-center text-xs">
						{isHovered ? (
							<p className="text-white">Open in a new tab</p>
						) : (
							<p>Image not found</p>
						)}
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
