import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import StoreFront from "@/components/StoreFront";

export const dynamic = "force-dynamic";

function isPlaceholderProduct(product) {
  const haystack =
    `${product.name || ""} ${product.description || ""}`.toLowerCase();
  return ["test", "placeholder", "sample", "dummy"].some((term) =>
    haystack.includes(term),
  );
}

export default async function Home() {
  let productsList = [];
  try {
    const productsCol = collection(db, "products");
    const snapshot = await getDocs(productsCol);
    productsList = snapshot.docs
      .map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }))
      .filter((product) => !isPlaceholderProduct(product));

    productsList.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  } catch (error) {
    console.error("Server Side Products Fetch Error:", error);
  }

  return <StoreFront initialProducts={productsList} />;
}
