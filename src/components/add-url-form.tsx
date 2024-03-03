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
import { useStore } from "@/stores/store";
import { Checkbox } from "./ui/checkbox";

const formSchema = z.object({
  url: z.string().url({ message: "Invalid URL format" }),
});

interface UrlFormData {
  url: string;
}

const AddUrlForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UrlFormData>({
    resolver: zodResolver(formSchema),
  });
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const { urls, toolCategories, setUrls, setToolCategories } = useStore();

  const handleCheckboxChange = () => {
    setIsNewCategory(!isNewCategory);
    setNewCategory("");
    setSelectedCategory("");
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleAddUrl = (data: UrlFormData) => {
    // Validate the input fields
    if (
      !data.url &&
      !data.url.includes("https://") &&
      !data.url.includes("http://")
    ) {
      alert("Please enter a valid URL.");
      return;
    }

    if (isNewCategory) {
      if (!newCategory) {
        alert("Please enter the category.");
        return;
      }
    } else {
      if (!selectedCategory) {
        alert("Please select a category.");
        return;
      }
    }

    // Check if the URL is already in the list
    if (urls.some((url) => url.url === data.url)) {
      alert("URL already exists in the list.");
      return;
    }

    // Create a new URL object
    const newUrlObject = {
      url: data.url,
      category: isNewCategory ? newCategory : selectedCategory,
      projects: null,
      favorite: false,
    };

    // Add the new URL to the existing URLs array
    const updatedUrls = [...urls, newUrlObject];
    setUrls(updatedUrls);

    // If it's a new category, add it to the existing categories
    if (isNewCategory) {
      setToolCategories([...toolCategories, newCategory]);
    }

    // Reset the form fields
    setNewCategory("");
    setIsNewCategory(false);
    setSelectedCategory("");
    reset();
  };

  return (
    <div className="mt-4 w-full max-w-sm rounded-md border p-4">
      <h2 className="mb-2 text-lg font-semibold">Add New URL</h2>
      <form
        onSubmit={handleSubmit(handleAddUrl)}
        className="flex flex-col space-y-4"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="url" className="block">
            URL:
          </label>
          <Input
            type="text"
            id="url"
            {...register("url")}
            className="rounded border p-2"
          />

          {errors.url && typeof errors.url === "string" && (
            <p className="text-red-500">{errors.url}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="newCategoryCheckbox"
              checked={isNewCategory}
              onCheckedChange={handleCheckboxChange}
              className="form-checkbox h-5 w-5 text-blue-500"
            />
            <label
              htmlFor="newCategoryCheckbox"
              className="text-sm text-gray-600"
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
                className="rounded border p-2"
              />
            </div>
          ) : (
            <Select
              defaultValue="all"
              onValueChange={handleCategoryChange}
              value={selectedCategory}
            >
              <SelectTrigger className="w-full">
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
        <Button type="submit" className="rounded px-4 py-2">
          Add URL
        </Button>
      </form>
    </div>
  );
};

export default AddUrlForm;
