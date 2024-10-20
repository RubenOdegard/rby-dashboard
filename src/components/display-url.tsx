"use client";
import { Loader } from "@/components/loader"; // Example loading component
import useFetchMetaDataFromUrl from "@/hooks/useFetchMetadata";
import { FolderIcon } from "lucide-react";
import { useState } from "react";
import ImageWithLink from "./collections/image-with-link";
import TextDescription from "./collections/text-description";
import TextDomain from "./collections/text-domain";
import TextTitle from "./collections/text-title";

interface FetchComponentProps {
	urls: any;
}

const DisplayUrl = ({ urls }: FetchComponentProps) => {
	const { data, isLoading, error } = useFetchMetaDataFromUrl(urls.url);
	const [hoveredImageId, setHoveredImageId] = useState<number | null>(null);

	const handleImageHover = (id: number) => {
		setHoveredImageId(id);
	};

	const handleImageLeave = () => {
		setHoveredImageId(null);
	};

	if (isLoading) {
		return <Loader />;
	}

	if (error) {
		return <div className="text-red-500">Error: {error}</div>;
	}

	const urlObject = { ...urls, ...data };

	return (
		<div>
			{urlObject ? (
				<div key={urlObject.id}>
					<div key={urlObject.id} className="mt-8 flex flex-col border-t pt-4">
						<div className="urlObjects-center mt-6 flex justify-between">
							<TextDomain
								domain={urlObject.domain}
								isHovered={hoveredImageId === urlObject.id}
								handleMouseEnter={() => handleImageHover(urlObject.id)}
								handleMouseLeave={handleImageLeave}
							/>
						</div>
						<ImageWithLink
							imageUrl={urlObject.imageUrl}
							domain={urlObject.domain}
							id={urlObject.id}
							favorite={urlObject.favorite}
							handleImageHover={handleImageHover}
							handleImageLeave={handleImageLeave}
							className="order-first mt-4"
						/>

						<TextTitle title={urlObject.title} className="mt-4" />
						<TextDescription description={urlObject.description} />
						<div className="flex">
							<div className="mt-4 flex text-yellow-200">
								{urlObject.category && (
									<span className="urlObjects-center flex gap-1.5">
										<FolderIcon className="size-4" /> {urlObject.category}
									</span>
								)}
							</div>
						</div>
					</div>
				</div>
			) : (
				"No urlObject"
			)}
		</div>
	);
};

export default DisplayUrl;
