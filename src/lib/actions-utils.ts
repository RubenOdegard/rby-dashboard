"use server";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export const { getUser } = getKindeServerSession();

export const getUserOrThrowError = async () => {
	const user = await getUser();
	if (!user) {
		throw new Error("User not found");
	}
	return user;
};

// !!! Custom function to create a timeout promise, which will race against the database call !!!
// !!! This serves as a way to cancel the database call if it takes too long. !!!
export async function createTimeout(duration: number) {
	return new Promise((_, reject) => {
		setTimeout(() => {
			reject(new Error("Operation timed out"));
		}, duration);
	});
}

// !!! User auth needs to be checked before a database call !!!
// !!! Additionally check if the users id === the user id on the selected row in a table !!!
// !!! Users can only edit their own data. If this is not checked, a authenticated user can edit other users data !!!
export const checkUserAuthOrThrowError = async () => {
	const { isAuthenticated } = getKindeServerSession();
	if (await isAuthenticated()) {
		return true;
	}
	throw new Error("Not authenticated");
};
