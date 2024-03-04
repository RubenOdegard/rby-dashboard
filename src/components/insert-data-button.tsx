"use client";
import { deleteSampleData, insertURLToDatabase } from "@/app/actions";
import { Button } from "./ui/button";

const InsertDataButton = () => {
  return (
    <div className="flex gap-2">
      <Button
        onClick={() =>
          insertURLToDatabase({
            url: "https://vercel.com",
            category: "Example",
            project: "none",
            favorite: false,
          })
        }
      >
        Add sample data
      </Button>

      <Button onClick={() => deleteSampleData(11)}>Delete sample data</Button>
    </div>
  );
};

export default InsertDataButton;
