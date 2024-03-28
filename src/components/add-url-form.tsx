import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogFooter,
} from "@/components/ui/dialog";
import { useStore } from "@/stores/store";
import { Checkbox } from "./ui/checkbox";
import { UrlFormData } from "@/types/urlFormData";
import { fetchDataFromDatabase, insertURLToDatabase } from "@/app/actions";
import { generateRandomId, toastError, toastSuccess } from "@/lib/utils";
import PreviewFormUntertitle from "./preview-form-undertitle";

const formSchema = z.object({
	url: z.string().url({ message: "Invalid URL format" }),
	category: z.string().optional(),
});

// TODO: Add loading state to fetching previews

const AddUrlForm = () => {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<UrlFormData>({
		resolver: zodResolver(formSchema),
	});

	// Get global vars from store
	const { urls, toolCategories, setUrls, setToolCategories } = useStore();
	// Handle dialog state
	const [dialogOpen, setDialogOpen] = useState(false);
	// Initialise states for the form inputs
	const [isNewCategory, setIsNewCategory] = useState(false);
	const [newCategory, setNewCategory] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("");
	// Initialise states for the preview
	const [previewVisible, setPreviewVisible] = useState(false);
	const [previewError, setPreviewError] = useState<string | null>(null);
	const [previewUrl, setPreviewUrl] = useState<{
		url: string;
		title: string;
		imageUrl: string;
		description: string;
	}>({ url: "", title: "", imageUrl: "", description: "" });

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
		reset();
	};

	const handlePreview = async () => {
		setPreviewError(null);

		const urlInput = document.getElementById("url") as HTMLInputElement;

		// if urlInput doesnt exsists, as null or "" or starts with https://
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

	const handleAddUrl = async (data: UrlFormData) => {
		const category = isNewCategory ? newCategory : selectedCategory;
		// Validate the input fields
		formSchema.parse(data);
		// Handle duplicate URLs
		if (urls.some((url) => url.url === data.url)) {
			alert("URL already exists in the list.");
			return;
		}
		// Handle empty category
		if (category === "" || undefined) {
			alert("Please select or input a new category.");
			return;
		}
		// Add URL to database
		try {
			const id = generateRandomId();
			await insertURLToDatabase({
				id: id,
				url: data.url,
				category: category,
				project: "none",
				favorite: false,
			});
			setUrls([
				...urls,
				{
					id: id,
					url: data.url,
					category: category,
					project: "none",
					favorite: false,
				},
			]);
			toastSuccess(`Successfully added ${data.url}`);
		} catch (error) {
			toastError(`Error adding ${data.url}`);
			return;
		}
		if (isNewCategory) {
			setToolCategories([...toolCategories, newCategory]);
		}
		handleReset();
		fetchDataFromDatabase();
		setDialogOpen(false);
	};

	// Fetch preview metadata
	const handleFetchPreviewMetadata = async () => {
		const urlInput = document.getElementById("url") as HTMLInputElement;

		if (!urlInput) {
			return;
		}

		const url = urlInput.value;
		try {
			const response = await fetch(
				`/api/fetchMetadata?url=${encodeURIComponent(url)}`,
			);
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
		} catch (error) {
			console.error("Error fetching metadata for", url, ":", error);
		}
	};

	return (
		<Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
			<DialogTrigger asChild>
				<Button variant="outline">Add Tool</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						<div className="flex flex-col gap-0.5">
							<div>
								Add a new <b className="text-yellow-400">Tool</b> by specifying
								its URL
							</div>
							<span className="text-xs text-yellow-500">
								URLs needs to include &quot;https://&quot; and not include path
								segments.
							</span>
						</div>
					</DialogTitle>
					<DialogDescription>
						<form
							onSubmit={handleSubmit(handleAddUrl)}
							className="flex flex-col space-y-4"
						>
							<div className="flex flex-col gap-1">
								<label htmlFor="url" className="sr-only">
									URL:
								</label>
								<Input
									type="text"
									id="url"
									placeholder="https://..."
									{...register("url")}
									className="mt-4"
								/>

								{errors.url && (
									<p className="text-red-500">{errors.url.message}</p>
								)}
							</div>
							<div className="flex flex-col gap-4">
								<div className="flex items-center space-x-2 ">
									<Checkbox
										id="newCategoryCheckbox"
										checked={isNewCategory}
										onCheckedChange={handleCheckboxChange}
										className={`form-checkbox h-5 w-5`}
									/>
									<label
										htmlFor="newCategoryCheckbox"
										className={
											isNewCategory
												? "text-yellow-400"
												: "" +
												  "select-none text-sm text-gray-600 hover:cursor-pointer"
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
											{toolCategories.map((category) => (
												<SelectItem key={category} value={category}>
													{category}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								)}
							</div>
							<Button type="submit" className="rounded">
								Add URL
							</Button>
						</form>
					</DialogDescription>
				</DialogHeader>

				<DialogFooter className="flex w-full flex-col sm:flex-col">
					<div className="order-1 flex w-full flex-col">
						<Button variant={"outline"} onClick={() => handlePreview()}>
							{previewVisible ? "Hide Preview" : "Show Preview"}
						</Button>
					</div>
					{previewError && previewError.length > 0 && (
						<div className="order-2 mt-2 flex">
							<p className="text-sm text-red-500">{previewError}</p>
						</div>
					)}
					{previewVisible && (
						<div className="order-2 mt-6 flex flex-col gap-4 border-t pt-6">
							<div className="-mt-[34px] flex justify-center">
								<span className="text-xs text-yellow-400">Preview</span>
							</div>
							<div>
								<PreviewFormUntertitle text="Title" />
								<h3 className="text-pretty font-semibold">
									{previewUrl.title ? (
										<p>{previewUrl.title}</p>
									) : (
										<p>Title not found</p>
									)}
								</h3>
							</div>
							<div>
								<PreviewFormUntertitle text="Image" />
								{previewUrl.imageUrl ? (
									<div className="mt-2 aspect-video w-full">
										<img
											src={previewUrl.imageUrl}
											alt={previewUrl.title}
											className="w-full bg-cover"
										/>
									</div>
								) : (
									<p>Image not found</p>
								)}
							</div>
							<div>
								<PreviewFormUntertitle text="Description" />
								{previewUrl.description ? (
									<p>{previewUrl.description}</p>
								) : (
									<p>Description not found</p>
								)}
							</div>
						</div>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default AddUrlForm;
