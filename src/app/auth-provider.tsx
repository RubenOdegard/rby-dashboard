import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { LogOutIcon } from "lucide-react";

export default async function AuthProvider({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const { isAuthenticated } = getKindeServerSession();

	return (await isAuthenticated()) ? (
		<div>
			<LogoutLink className="absolute right-4 top-4">
				<LogOutIcon size={20} />
			</LogoutLink>
			{children}
		</div>
	) : (
		<div className="flex h-screen flex-col items-center justify-center bg-gray-950 text-white">
			<LoginLink>Sign in</LoginLink>
		</div>
	);
}
