import Products from "@/components/products/products";
import {db} from "@/server";
import Algolia from "@/components/products/algolia";

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
      <Algolia />
      <Products variants={data} />
    </main>
  );
};
