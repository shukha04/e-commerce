"use server";

import {Resend} from "resend";
import getBaseUrl from "@/lib/base-url";

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = getBaseUrl()

export const sendVerificationEmail = async (email: string, token: string) => {
	const confirmLink = `${domain}/auth/verify?token=${token}`;
	const {data, error} = await resend.emails.send({
		from: "onboarding@resend.dev",
		to: email,
		subject: "E-commerce - Verification Email",
		html: `<p>Click to <a href="${confirmLink}">confirm your email</a></p>`,
	})
	if (error) return console.log(error)
	if (data) return data
}

export const sendPasswordResetEmail = async (email: string, token: string) => {
	const confirmLink = `${domain}/auth/reset?token=${token}`;
	const {data, error} = await resend.emails.send({
		from: "onboarding@resend.dev",
		to: email,
		subject: "E-commerce - Password Reset",
		html: `<p>Click to <a href="${confirmLink}">reset your password</a></p>`,
	})
	if (error) return console.log(error)
	if (data) return data
}

export const sendTwoFactorEmail = async (email: string, token: string) => {
	const {data, error} = await resend.emails.send({
		from: "onboarding@resend.dev",
		to: email,
		subject: "E-commerce - Your 2 Factor Token",
		html: `<p>Your confirmation code is: ${token}</p>`,
	})
	if (error) return console.log(error)
	if (data) return data
}