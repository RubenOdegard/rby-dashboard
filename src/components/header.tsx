"use client";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { ChevronRightIcon, LogOutIcon } from "lucide-react";

import { useStore } from "@/stores/store";
import { Separator } from "./ui/separator";
export const Header = () => {
	const { selectedTab, selectedCategory, selectedProject } = useStore();
	return (
		<nav className="fixed right-1/2 top-0 z-50 w-full max-w-6xl translate-x-1/2 shadow-lg lg:top-6 lg:px-8">
			<div className="relative inset-0">
				<div className="fixed -top-6 left-0 mx-8 h-12 w-full max-w-6xl bg-gradient-to-t from-gray-950 via-gray-950/70 to-gray-950/60 backdrop-blur-sm" />
			</div>
			<div className="bg-gray-950/85 relative z-50 flex w-full max-w-6xl items-center justify-between rounded-sm border px-8 py-4 shadow-xl backdrop-blur-md">
				<div className="z-40 flex w-full flex-col items-start justify-start md:flex-row">
					<div className="flex w-full max-w-none items-center justify-between md:max-w-fit md:justify-start">
						<div className="flex items-center gap-3">
							<h1 className="text-xl font-semibold text-white">Developer Dashboard</h1>
						</div>
						<div className="flex md:hidden">
							<LogoutLink className="z-40 text-muted-foreground/70 hover:text-yellow-400 md:flex">
								<div className="flex items-center gap-2.5">
									<span className="hidden text-sm md:flex">Sign out</span>
									<LogOutIcon size={20} />
								</div>
							</LogoutLink>
						</div>
					</div>
					<Separator orientation="vertical" className="ml-8 mr-4 hidden h-8 md:inline-block" />
					<div className="mt-3 flex w-full items-center md:mt-1.5">
						<div>
							{selectedTab && (
								<div className="flex items-center">
									<ChevronRightIcon className="size-4 mr-2 text-muted-foreground" />
									<h2 className="font-mono text-sm font-light capitalize text-foreground/80">
										{selectedTab}
									</h2>
								</div>
							)}
						</div>
						<div>
							{selectedTab && selectedCategory && (
								<div className="flex items-center">
									<ChevronRightIcon className="size-4 mx-2 text-muted-foreground" />
									<h2 className="max-w-[17ch] truncate font-mono text-sm font-light capitalize text-foreground sm:max-w-none">
										{selectedTab === "collections" ? selectedCategory : selectedProject}
									</h2>
								</div>
							)}
						</div>
					</div>
					<div className="hidden md:flex">
						<LogoutLink className="z-40 text-muted-foreground/70 hover:text-yellow-400 md:flex">
							<div className="mt-1 flex items-center gap-2.5">
								<LogOutIcon size={20} />
							</div>
						</LogoutLink>
					</div>
				</div>
			</div>
		</nav>
	);
};
