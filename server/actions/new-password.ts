"use server";

import {NewPasswordSchema} from "@/types/new-password-schema";
import {createSafeActionClient} from "next-safe-action";
import {getPasswordResetTokenByToken} from "@/server/actions/tokens";
import {db} from "@/server";
import {eq} from "drizzle-orm";
import {passwordResetTokens, users} from "@/server/schema";
import bcrypt from "bcrypt";
import {Pool} from "@neondatabase/serverless";
import {drizzle} from "drizzle-orm/neon-serverless";

export const newPassword = createSafeActionClient().schema(NewPasswordSchema).action(async ({parsedInput: {password, token}}) => {
	const pool = new Pool({connectionString: process.env.POSTGRES_URL});
	const dbPool = drizzle(pool);

	if (!token) {
		return {error: "Missing token"}
	}

	const existingToken = await getPasswordResetTokenByToken(token);
	if (!existingToken) return {error: "Token not found"}

	const expired = new Date(existingToken.expires) < new Date()
	if (expired) return {error: "Token expired"}

	const existingUser = await db.query.users.findFirst({
		where: eq(users.email, existingToken.email)
	})
	if (!existingUser) return {error: "User not found"}

	const hashedPassword = await bcrypt.hash(password, 10)

	await dbPool.transaction(async (cxt) => {
		await cxt.update(users).set({
			password: hashedPassword
		}).where(eq(users.id, existingUser.id))

		await cxt.delete(passwordResetTokens).where(eq(passwordResetTokens.id, existingToken.id))
	})

	return {success: "Password updated"}
})