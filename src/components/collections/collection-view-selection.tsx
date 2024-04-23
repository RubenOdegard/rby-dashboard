"use client";
import { ColumnsIcon, LayoutList } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore } from "@/stores/store";

interface ViewSelectionProps {
	className?: string;
	divider?: boolean;
}

export const CollectionViewSelection = ({
	className,
	divider,
}: ViewSelectionProps) => {
	const { setViewExpanded, viewExpanded } = useStore();

	const disabledStyling =
		"cursor-pointer text-gray-700 transition-all hover:animate-pulse hover:text-yellow-400";
	const enabledStyling =
		"cursor-pointer bg-gray-950 text-foreground transition-all";

	const handleViewExpanded = () => {
		setViewExpanded(!viewExpanded);
	};

	return (
		<div
			className={
				cn(className) +
				` ${
					divider ? "w-20 gap-1.5 divide-x-2 divide-gray-900" : "w-[72px] gap-1"
				}  hidden h-10 items-center justify-center rounded-md border bg-gray-950 sm:flex`
			}
		>
			<button className="m-0 p-0">
				<ColumnsIcon
					className={`${viewExpanded ? enabledStyling : disabledStyling} `}
					onClick={() => handleViewExpanded()}
				/>
			</button>
			<button className={`${divider === true ? "pl-1.5" : ""} + m-0 p-0`}>
				<LayoutList
					className={`${viewExpanded ? disabledStyling : enabledStyling} `}
					onClick={() => handleViewExpanded()}
				/>
			</button>
		</div>
	);
};

export default CollectionViewSelection;
