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
} from "@/components/ui/dialog";
import { useStore } from "@/stores/store";
import { Checkbox } from "./ui/checkbox";
import { UrlFormData } from "@/types/urlFormData";
import { fetchDataFromDatabase, insertURLToDatabase } from "@/app/actions";

const formSchema = z.object({
  url: z.string().url({ message: "Invalid URL format" }),
  category: z.string().optional(),
});

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

  // Reset form when newCategory is changed
  const handleCheckboxChange = () => {
    setIsNewCategory((prev) => !prev);
    setNewCategory("");
    setSelectedCategory("");
  };

  // Reset form when newCategory is changed
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleReset = () => {
    setNewCategory("");
    setIsNewCategory(false);
    setSelectedCategory("");
    reset();
  };

  // Temp id value before autoincrement from database takes
  const generateRandomId = () => {
    return Math.floor(Math.random() * 1000000);
  };

  const handleAddUrl = async (data: UrlFormData) => {
    // Validate the input fields
    formSchema.parse(data);

    // Call insertURLToDatabase to insert the URL into the database
    try {
      const id = generateRandomId();
      await insertURLToDatabase({
        id: id,
        url: data.url,
        category: isNewCategory ? newCategory : selectedCategory,
        project: "none",
        favorite: false,
      });
      setUrls([
        ...urls,
        {
          id: id,
          url: data.url,
          category: isNewCategory ? newCategory : selectedCategory,
          project: "none",
          favorite: false,
        },
      ]);
    } catch (error) {
      console.error("Error inserting URL to database:", error);
      // Handle error if necessary
      return;
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
      project: "none",
      favorite: false,
    };

    // Add the new URL to the existing URLs array
    // const updatedUrls = [...urls, newUrlObject];
    // setUrls(updatedUrls);

    // If it's a new category, add it to the existing categories
    if (isNewCategory) {
      setToolCategories([...toolCategories, newCategory]);
    }

    // Reset the form fields
    handleReset();

    // Refetch
    fetchDataFromDatabase();
  };

  // NOTE: Maybe close dialog on submit?

  return (
    <Dialog>
      <DialogTrigger className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
        Add Tool
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
                URLs needs to include "https://" and not include path segments.
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
                  placeholder="Enter URL: https://..."
                  {...register("url")}
                  className="mt-4 rounded border p-2"
                />

                {errors.url && (
                  <p className="text-red-500">{errors.url.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="newCategoryCheckbox"
                    checked={isNewCategory}
                    onCheckedChange={handleCheckboxChange}
                    className="form-checkbox h-5 w-5 "
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
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AddUrlForm;
