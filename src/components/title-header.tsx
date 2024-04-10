"use client";
import { Github } from "lucide-react";
import Link from "next/link";
import React from "react";

const TitleHeader = () => {
	return (
		<div className="py-8 sm:py-4">
			<h1 className="text-2xl font-semibold tracking-wide sm:text-4xl md:text-5xl">
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
