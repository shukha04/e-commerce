"use client"

import {useSearchParams, useRouter} from "next/navigation";
import {useCallback, useEffect, useState} from "react";
import {verifyToken} from "@/server/actions/tokens";
import {AuthCard} from "@/components/auth/auth-card";
import {FormSuccess} from "@/components/auth/form-success";
import {FormError} from "@/components/auth/form-error";

export const EmailVerificationForm = () => {
	const token = useSearchParams().get("token");
	const router = useRouter();
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const handleVerification = useCallback(() => {
		if (success || error) return;

		if (!token) {
			setError("Token not found")
			return
		}
		verifyToken(token).then((data) => {
			if (data.error) {
				setError(data.error);
			}
			if (data.success) {
				setSuccess(data.success);
				router.push("/auth/login");
			}
		})
	}, [])

	useEffect(() => {
		handleVerification()
	}, [])

	return (
		<AuthCard cardTitle="Verify email" backBtnHref="/auth/login" backBtnLbl="Back to login">
			<div className="text-center">
				<p>{!success && !error ? "Verifying email..." : null}</p>
				<FormSuccess message={success} />
				<FormError message={error} />
			</div>
		</AuthCard>
	);
};