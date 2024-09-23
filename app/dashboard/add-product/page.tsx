import {auth} from "@/server/auth";
import {redirect} from "next/navigation";
import ProductForm from "@/app/dashboard/add-product/product-form";

export default async function AddProductPage() {
	const session = await auth();

	if (session?.user.role !== "admin") {
		redirect("/dashboard/settings")
	}

	return (
		<ProductForm />
	)
}