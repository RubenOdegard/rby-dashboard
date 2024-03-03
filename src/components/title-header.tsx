import { Github } from "lucide-react";
import Link from "next/link";
import React from "react";

const TitleHeader = () => {
  return (
    <div className="py-4">
      <h1 className="text-3xl font-semibold tracking-wide md:text-5xl">
        Developer Dashboard
      </h1>

      <Link
        href="https://github.com/RubenOdegard"
        target={"_blank"}
        className="mt-4 flex items-center justify-center gap-1 text-sm text-muted-foreground transition-colors hover:text-accent-foreground"
      >
        <Github size={16} />
        RubenOdegard
      </Link>
    </div>
  );
};

export default TitleHeader;
