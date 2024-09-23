"use server";
import {createSafeActionClient} from "next-safe-action";
import {LoginSchema} from "@/types/login-schema";
import {db} from "@/server";
import {eq} from "drizzle-orm";
import {twoFactorTokens, users} from "@/server/schema";
import {
	generateEmailVerificationToken,
	generateTwoFactorToken,
	getTwoFactorTokenByEmail
} from "@/server/actions/tokens";
import {sendTwoFactorEmail, sendVerificationEmail} from "@/server/actions/email";
import {signIn} from "@/server/auth";
import {AuthError} from "next-auth";

export const emailSignIn = createSafeActionClient().schema(LoginSchema).action(async ({parsedInput: {email, password, code}}) => {
	try {
		const existingUser = await db.query.users.findFirst({where: eq(users.email, email)});

		if (!existingUser || !existingUser.email) {
			return {error: "User not found"};
		}

		if (!existingUser.emailVerified) {
			const verificationToken = await generateEmailVerificationToken(existingUser.email)
			await sendVerificationEmail(verificationToken[0].email, verificationToken[0].token)
			return {error: "Verify your email to sign in"}
		}

		if (existingUser.twoFactorEnabled && existingUser.email) {
			if (code) {
				const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

				if (!twoFactorToken) {
					return {error: "Invalid token"}
				}

				if (twoFactorToken.token !== code) {
					return {error: "Invalid code"}
				}

				const hasExpired = new Date(twoFactorToken.expires) < new Date();
				if (hasExpired) {
					return {error: "Token has expired"}
				}

				await db.delete(twoFactorTokens).where((eq(twoFactorTokens.id, twoFactorToken.id)));
			} else {
				const token = await generateTwoFactorToken(existingUser.email);
				if (!token) {
					return {error: "Token not generated"}
				}
				await sendTwoFactorEmail(token[0].email, token[0].token);
				return {twoFactor: "Two factor token sent!"}
			}
		}

		await signIn("credentials", {
			email,
			password,
			redirectTo: "/"
		});

		return {success: email};
	} catch (error) {
		if (error instanceof AuthError) {
			switch (error.type) {
				case "CredentialsSignin":
					return {error: "Email or password incorrect"}
				case "AccessDenied":
					return {error: error.message}
				case "OAuthSignInError":
					return {error: error.message}
				default:
					return {error: "Something went wrong"}
			}
		}
		throw error;
	}
});