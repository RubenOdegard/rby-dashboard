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
import {
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarSeparator,
	MenubarTrigger,
} from "@/components/ui/menubar";
import { cn } from "@/lib/utils";
import { MoreHorizontal, StarIcon, Trash } from "lucide-react";
import { useState, useTransition } from "react";

interface CollectionEditUrlButtonProps {
	metadataItem: any;
	onToggleFavorite: (metadataItem: any) => void;
	onDelete: (metadataItem: any) => void;
}

const CollectionEditUrlButton = ({ metadataItem, onToggleFavorite, onDelete }: CollectionEditUrlButtonProps) => {
	const [open, setOpen] = useState(false);
	const [isPending, startTransition] = useTransition();

	const openDialog = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleDelete = (metadataItem: any) => {
		startTransition(() => {
			onDelete(metadataItem);
		});
	};

	return (
		<Menubar>
			<MenubarMenu>
				<MenubarTrigger className="flex aspect-square items-center justify-center p-2 text-muted-foreground hover:text-yellow-400">
					<MoreHorizontal size={16} />
				</MenubarTrigger>
				<MenubarContent>
					<MenubarItem onClick={() => onToggleFavorite(metadataItem)} className="group">
						<StarIcon
							size={12}
							className={cn(
								"mr-2 transition-colors group-hover:text-yellow-400 ",
								metadataItem.favorite && "text-yellow-400",
							)}
						/>
						{metadataItem.favorite ? "Remove from favorites" : "Add to favorites"}
					</MenubarItem>
					<MenubarSeparator />
					<MenubarItem onClick={openDialog} className="group ">
						<Trash size={12} className="mr-2 transition-colors group-hover:text-red-400 " />
						Delete
					</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
			{open && (
				<AlertDialog open={open} onOpenChange={handleClose}>
					<AlertDialogTrigger className="hidden" />
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
							<AlertDialogDescription>
								This action cannot be undone. This will permanently delete the URL{" "}
								<span className="italic text-foreground">({metadataItem.url})</span> from the database.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction disabled={isPending} onClick={() => handleDelete(metadataItem)}>
								{isPending ? "Deleting..." : "Delete"}
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			)}
		</Menubar>
	);
};

export default CollectionEditUrlButton;
