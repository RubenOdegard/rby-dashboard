import { MoreHorizontal, StarIcon, Trash } from "lucide-react";
import {
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarSeparator,
	MenubarTrigger,
} from "./ui/menubar";
import { cn } from "@/lib/utils";

interface MenubarActionsProps {
	metadataItem: any;
	onToggleFavorite: (metadataItem: any) => void;
	onDelete: (metadataItem: any) => void;
}

const MenubarActions: React.FC<MenubarActionsProps> = ({
	metadataItem,
	onToggleFavorite,
	onDelete,
}) => {
	return (
		<Menubar>
			<MenubarMenu>
				<MenubarTrigger className="flex aspect-square  items-center justify-center p-2 text-muted-foreground hover:text-yellow-400">
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
					<MenubarItem onClick={() => onDelete(metadataItem)}>
						<Trash size={12} className="mr-2 text-red-400 " />
						Delete
					</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
		</Menubar>
	);
};

export default MenubarActions;
