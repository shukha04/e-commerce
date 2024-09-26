import Products from "@/components/products/products";
import {db} from "@/server";

export const revalidate = 3600;

export default async function Home() {
  const data = await db.query.productVariants.findMany({
    with: {
      variantImages: true,
      variantTags: true,
      product: true
    },
    orderBy: (productVariants, {desc}) => [desc(productVariants.id)]
  })

  return (
    <main>
      <Products variants={data} />
    </main>
  );
};
