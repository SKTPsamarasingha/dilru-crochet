import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import ShopPage from "@/components/ShopPage";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Shop Collection | Crochet with Dilru",
  description: "Browse handcrafted crochet cardigans, accessories, bouquets and more. Filter by category, price, and customization.",
};

export default async function ShopRoute() {
  let productsList = [];
  try {
    const snapshot = await getDocs(collection(db, "products"));
    productsList = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
    productsList.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  } catch (error) {
    console.error("Shop products fetch error:", error);
  }

  return <ShopPage initialProducts={productsList} />;
}
