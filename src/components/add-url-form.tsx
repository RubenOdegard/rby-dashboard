import { useState } from "react";
import { useStore } from "@/stores/store";
import { Urls } from "@/types/urls";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

import { Checkbox } from "@/components/ui/checkbox";

const AddUrlForm = () => {
  const [newUrl, setNewUrl] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [isNewCategory, setIsNewCategory] = useState(false);
  const { urls, toolCategories, setUrls, setToolCategories } = useStore();
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleAddUrl = () => {
    // Validate the input fields
    if (!newUrl || (!isNewCategory && !selectedCategory && !newCategory)) {
      alert("Please enter both URL and category.");
      return;
    }

    if (!newUrl.startsWith("https://") && !newUrl.startsWith("http://")) {
      alert("Please enter a valid URL.");
      return;
    }

    // Check if the URL is already in the list
    if (urls.some((url) => url.url === newUrl)) {
      alert("URL already exists in the list.");
      return;
    }

    // Create a new URL object
    const newUrlObject: Urls = {
      url: newUrl,
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
    setNewUrl("");
    setNewCategory("");
    setIsNewCategory(false);
    setSelectedCategory("");
  };

  return (
    <div className="mt-4 w-full max-w-sm">
      <h2 className="mb-2 text-lg font-semibold">Add New URL</h2>
      <div className="flex flex-col space-y-2">
        <Input
          type="text"
          placeholder="URL"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          className="rounded border p-2"
        />
        <div className="flex items-center space-x-2">
          <Input
            type="checkbox"
            checked={isNewCategory}
            onChange={() => {
              setIsNewCategory(!isNewCategory);
              // Clear the newCategory input field when checkbox is selected
              setNewCategory("");
              setSelectedCategory("");
            }}
            className="form-checkbox h-5 w-5 text-blue-500"
          />
          <span className="text-sm text-gray-600">New Category</span>
        </div>
        {isNewCategory ? (
          <Input
            type="text"
            placeholder="New Category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="rounded border p-2"
          />
        ) : (
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded border p-2"
          >
            <option value="">Select Category</option>
            {toolCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        )}
        <Button onClick={handleAddUrl} className="rounded px-4 py-2">
          Add URL
        </Button>
      </div>
    </div>
  );
};

export default AddUrlForm;
