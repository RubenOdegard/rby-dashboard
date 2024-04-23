// Icons
import { MoreHorizontal, StarIcon, Trash } from "lucide-react";

// UI Components
import {
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarSeparator,
	MenubarTrigger,
} from "@/components/ui/menubar";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Utils
import { cn } from "@/lib/utils";
import { useState } from "react";

// TODO: Add the possibility to add text to a "notes" section on url

interface CollectionEditUrlButtonProps {
	metadataItem: any;
	onToggleFavorite: (metadataItem: any) => void;
	onDelete: (metadataItem: any) => void;
}

const CollectionEditUrlButton = ({
	metadataItem,
	onToggleFavorite,
	onDelete,
}: CollectionEditUrlButtonProps) => {
	const [open, setOpen] = useState(false);

	const openDialog = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<Menubar>
			<MenubarMenu>
				<MenubarTrigger className="flex aspect-square items-center justify-center p-2 text-muted-foreground hover:text-yellow-400">
					<MoreHorizontal size={16} />
				</MenubarTrigger>
				<MenubarContent>
					<MenubarItem onClick={() => onToggleFavorite(metadataItem)}>
						<StarIcon
							size={12}
							className={cn("mr-2", metadataItem.favorite && "text-yellow-400")}
						/>
						{metadataItem.favorite
							? "Remove from favorites"
							: "Add to favorites"}
					</MenubarItem>
					<MenubarSeparator />
					<MenubarItem onClick={openDialog}>
						<Trash size={12} className="mr-2 text-red-400 " />
						Delete
					</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
			{open && (
				<AlertDialog open={open} onOpenChange={handleClose}>
					<AlertDialogTrigger className="hidden">
						<button />
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
							<AlertDialogDescription>
								This action cannot be undone. This will permanently delete the
								URL{" "}
								<span className="italic text-foreground">
									({metadataItem.url})
								</span>{" "}
								from the database.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction onClick={() => onDelete(metadataItem)}>
								Delete URL
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			)}
		</Menubar>
	);
};

export default CollectionEditUrlButton;
