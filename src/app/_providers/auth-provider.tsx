import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import type { ReactNode } from "react";

export default async function AuthProvider({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	const { isAuthenticated } = getKindeServerSession();

	return (await isAuthenticated()) ? (
		<div>{children}</div>
	) : (
		<div className="flex h-screen flex-col items-center justify-center bg-gray-950 text-white">
			<LoginLink>Sign in</LoginLink>
		</div>
	);
}
