"use server"

import {createSafeActionClient} from "next-safe-action";
import {RegisterSchema} from "@/types/register-schema";
import {db} from "@/server";
import {eq} from "drizzle-orm";
import {users} from "@/server/schema";
import bcrypt from "bcrypt";
import {generateEmailVerificationToken} from "@/server/actions/tokens";
import {sendVerificationEmail} from "@/server/actions/email";

export const emailRegister = createSafeActionClient().schema(RegisterSchema).action(async ({parsedInput: {email, password, name}}) => {
	const hashedPassword = await bcrypt.hash(password, 10);
	const existingUser = await db.query.users.findFirst({where: eq(users.email, email)});

	if (existingUser) {
		if (!existingUser.emailVerified) {
			const verificationToken = await generateEmailVerificationToken(email);
			await sendVerificationEmail(verificationToken[0].email, verificationToken[0].token)

			return {success: "Email confirmation resent"}
		}
		return {error: "This email is already registered"};
	}

	await db.insert(users).values({
		email,
		name,
		password: hashedPassword,
	})

	const verificationToken = await generateEmailVerificationToken(email);
	await sendVerificationEmail(verificationToken[0].email, verificationToken[0].token)

	return {success: "Email confirmation sent"};
});