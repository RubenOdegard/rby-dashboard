import { fetchUrlDataFromDatabase, insertUrlToDatabase } from "@/actions/collection-url-action";
import CollectionPreviewFormImage from "@/components/collections/collection-preview-form-image";
import CollectionPreviewFormUndertitle from "@/components/collections/collection-preview-form-undertitle";
import CollectionPreviewFormUndertitleContent from "@/components/collections/collection-preview-form-undertitle-content";
import DialogPlusButton from "@/components/dialog-plus-button";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toastError, toastSuccess } from "@/lib/utils";
import { useStore } from "@/stores/store";
import type { UrlFormData } from "@/types/urlFormData";
import { zodResolver } from "@hookform/resolvers/zod";
import { LinkIcon, RefreshCwIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

const formSchema = z.object({
	url: z.string().url({ message: "Invalid URL format" }),
	category: z.string().optional(),
});

const CollectionNewUrlForm = () => {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<UrlFormData>({
		resolver: zodResolver(formSchema),
	});

	const { urls, collectionCategories, setUrls, setCollectionCategories } = useStore();
	const [dialogOpen, setDialogOpen] = useState(false);
	const [isNewCategory, setIsNewCategory] = useState(false);
	const [newCategory, setNewCategory] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("");
	const [previewVisible, setPreviewVisible] = useState(false);
	const [previewError, setPreviewError] = useState<string | null>(null);
	const [previewLoading, setPreviewLoading] = useState(false);
	const [previewUrl, setPreviewUrl] = useState<{
		url: string;
		title: string;
		imageUrl: string;
		description: string;
	}>({ url: "", title: "", imageUrl: "", description: "" });
	const [isPending, startTransition] = useTransition();

	// Auth
	const { user } = useKindeBrowserClient();

	const sortedCategories = [...collectionCategories].sort((a, b) => a.localeCompare(b));

	const handleCheckboxChange = () => {
		setIsNewCategory((prev) => !prev);
		setNewCategory("");
		setSelectedCategory("");
	};

	const handleCategoryChange = (category: string) => {
		setSelectedCategory(category);
	};

	const handleDialogChange = () => {
		handleReset();
		setDialogOpen((prev) => !prev);
	};

	const handleReset = () => {
		setNewCategory("");
		setIsNewCategory(false);
		setSelectedCategory("");
		setPreviewUrl({ url: "", title: "", imageUrl: "", description: "" });
		setPreviewError(null);
		setPreviewVisible(false);
		reset();
	};

	const handlePreview = async () => {
		setPreviewError(null);

		const urlInput = document.getElementById("url") as HTMLInputElement;

		if (!urlInput.value.startsWith("https://")) {
			setPreviewVisible(false);
			setPreviewError("Please enter a valid URL to fetch a preview.");
			return;
		}

		if (previewVisible) {
			setPreviewVisible(false);
			return;
		}
		if (!urlInput || urlInput.value.trim() === "") {
			setPreviewVisible(false);
			return;
		}
		setPreviewVisible(true);
		await handleFetchPreviewMetadata();
	};

	const handleRefreshPreview = async () => {
		setPreviewLoading(true);
		const urlInput = document.getElementById("url") as HTMLInputElement;

		if (!urlInput.value.startsWith("https://")) {
			setPreviewVisible(false);
			setPreviewError("Please enter a valid URL to fetch a preview.");
			return;
		}

		if (!urlInput || urlInput.value.trim() === "") {
			setPreviewVisible(false);
			return;
		}
		await handleFetchPreviewMetadata();
		setPreviewLoading(false);
	};

	const handleAddUrl = async (data: UrlFormData) => {
		startTransition(async () => {
			const category = isNewCategory ? newCategory : selectedCategory;

			formSchema.parse(data);

			if (urls.some((url) => url.url === data.url)) {
				toastError("URL already exists in Collections.");
				return;
			}
			if (category === "" || undefined) {
				toastError("Please select or input a new category.");
				return;
			}

			if (!user) {
				throw new Error("User not found");
			}
			try {
				await insertUrlToDatabase({
					url: data.url,
					category: category,
					favorite: false,
					owner: user.id,
				});
				setUrls(await fetchUrlDataFromDatabase());
				toastSuccess(`Successfully added ${data.url}`);
			} catch (error) {
				toastError(`Error adding ${data.url}: ${error}`);
				return;
			}
			if (isNewCategory) {
				setCollectionCategories([...collectionCategories, newCategory]);
			}
			handleReset();
			setDialogOpen(false);
		});
	};

	const handleFetchPreviewMetadata = async () => {
		setPreviewLoading(true);
		const urlInput = document.getElementById("url") as HTMLInputElement;

		if (!urlInput) {
			return;
		}

		const url = urlInput.value;
		try {
			const response = await fetch(`/api/fetchMetadata?url=${encodeURIComponent(url)}`);
			if (!response.ok) {
				throw new Error(`Failed to fetch metadata for ${url}`);
			}
			const data = await response.json();
			setPreviewUrl({
				url: data.url,
				title: data.title,
				imageUrl: data.imageUrl,
				description: data.description,
			});
			setPreviewLoading(false);
		} catch (error) {
			console.error("Error fetching metadata for", url, ":", error);
		}
	};

	return (
		<Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
			<DialogTrigger asChild={true}>
				<DialogPlusButton icon={false}>
					<span className="mr-2 inline sm:hidden">
						Add a new <strong>Collection Item</strong>
					</span>
				</DialogPlusButton>
			</DialogTrigger>
			<DialogContent className="max-h-screen overflow-y-scroll">
				<DialogHeader>
					<DialogTitle>
						<div className="flex flex-col gap-0.5 text-2xl">
							<div>Add a new url to Collections</div>
						</div>
					</DialogTitle>
					<DialogDescription>
						<form onSubmit={handleSubmit(handleAddUrl)} className="flex flex-col space-y-6 border-t">
							<div className="mt-1 flex flex-col gap-1">
								<label htmlFor="url" className="mb-1 mt-4 flex items-center gap-1.5 text-white">
									<LinkIcon size={14} className="rounded-sm text-yellow-400" />
									Link
								</label>
								<Input
									type="text"
									id="url"
									placeholder="https://rubenodegard.com"
									{...register("url")}
									className=""
								/>

								{errors.url && <p className="mt-1 text-left text-red-500">{errors.url.message}</p>}
							</div>
							<div className="flex flex-col">
								<div className="mb-3 ml-1 flex items-center space-x-2">
									<Checkbox
										id="newCategoryCheckbox"
										checked={isNewCategory}
										onCheckedChange={handleCheckboxChange}
										className={"form-checkbox h-4 w-4"}
									/>
									<label
										htmlFor="newCategoryCheckbox"
										className={
											isNewCategory
												? "text-yellow-400"
												: "" + "select-none text-sm text-foreground/70 hover:cursor-pointer"
										}
									>
										New Category
									</label>
								</div>
								{isNewCategory ? (
									<div>
										<Input
											type="text"
											id="newCategory"
											placeholder="Enter new category"
											value={newCategory}
											onChange={(e) => setNewCategory(e.target.value)}
										/>
									</div>
								) : (
									<Select
										defaultValue="all"
										onValueChange={handleCategoryChange}
										value={selectedCategory}
									>
										<SelectTrigger className="w-full text-foreground">
											<SelectValue placeholder="Select a category" />
										</SelectTrigger>
										<SelectContent>
											{sortedCategories.map((category) => (
												<SelectItem key={category} value={category}>
													{category}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								)}
							</div>
							<Button type="submit" disabled={isPending} className="rounded">
								{isPending ? "Adding..." : "Add URL"}
							</Button>
						</form>
					</DialogDescription>
				</DialogHeader>

				<DialogFooter className="flex w-full flex-col sm:flex-col">
					<div className="order-1 flex w-full gap-4">
						<Button variant={"outline"} onClick={() => handlePreview()} className="w-full">
							{previewVisible ? "Hide Preview" : "Show Preview"}
						</Button>
						<Button
							variant={"outline"}
							onClick={() => handleRefreshPreview()}
							className="group w-12"
							disabled={!previewVisible}
						>
							<RefreshCwIcon size={14} className={previewLoading ? "animate-spin" : ""} />
						</Button>
					</div>
					{previewError && previewError.length > 0 && (
						<div className="order-2 mt-2 flex">
							<p className="text-sm text-red-500">{previewError}</p>
						</div>
					)}
					{previewVisible && (
						<div className="order-2 mt-12 flex flex-col gap-4 border-t pt-4">
							<div className="-mt-[28px] flex justify-center">
								<span className="bg-gray-950 px-4 text-sm font-semibold text-yellow-400">Preview</span>
							</div>
							<div>
								<CollectionPreviewFormUndertitle text="Title" />
								<CollectionPreviewFormUndertitleContent
									title={previewUrl.title}
									loading={previewLoading}
								/>
							</div>
							<div>
								<CollectionPreviewFormUndertitle text="Image" />
								<CollectionPreviewFormImage
									loading={previewLoading}
									title={previewUrl.title}
									imageUrl={previewUrl.imageUrl}
								/>
							</div>
							<div>
								<CollectionPreviewFormUndertitle text="Description" />
								<CollectionPreviewFormUndertitleContent
									title={previewUrl.description}
									loading={previewLoading}
								/>
							</div>
						</div>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default CollectionNewUrlForm;
