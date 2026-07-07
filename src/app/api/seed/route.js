import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, doc, setDoc, deleteDoc, getDocs } from "firebase/firestore";

const products = [
  {
    id: "prod-1",
    name: "Cozy Daisy Patch Cardigan",
    description: "An incredibly soft, warm espresso-toned oversized cardigan adorned with hand-stitched cream daisy patches. Made with 100% premium acrylic yarn.",
    price: 110.00,
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=600&auto=format&fit=crop",
    category: "Apparel",
    stock: 5,
    customizable: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod-2",
    name: "Everlasting Puff Flowers Bouquet",
    description: "A beautiful hand-crocheted bouquet of 5 pastel puff flowers in soft rose and sage green. The perfect everlasting gift that never fades.",
    price: 38.00,
    image: "https://images.unsplash.com/photo-1596436889106-be35e843f974?q=80&w=600&auto=format&fit=crop",
    category: "Decor",
    stock: 12,
    customizable: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod-3",
    name: "Aesthetic Granny Square Tote Bag",
    description: "A retro-inspired shoulder tote hand-stitched with classic floral granny squares in sage green and cream. Sturdy and fully lined.",
    price: 48.00,
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600&auto=format&fit=crop",
    category: "Accessories",
    stock: 8,
    customizable: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod-4",
    name: "Ami Cute Bunny Pocket Plushie",
    description: "Adorable mini bunny keychain crocheted in soft plush yarn. Featuring safety eyes and a sweet embroidered pink nose.",
    price: 18.00,
    image: "https://images.unsplash.com/photo-1559251606-c623743a6d76?q=80&w=600&auto=format&fit=crop",
    category: "Plushies",
    stock: 15,
    customizable: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod-5",
    name: "Mini Desktop Crochet Cactus",
    description: "No watering required! A cute little potted cactus complete with a tiny pink flower. Perfect for desks, shelves, or windowsills.",
    price: 22.00,
    image: "https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=600&auto=format&fit=crop",
    category: "Decor",
    stock: 20,
    customizable: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "prod-6",
    name: "Sage Slouchy Ribbed Beanie",
    description: "Ultra-cozy ribbed beanie in organic sage green yarn. Stretchy, lightweight, and perfect for cold seasons.",
    price: 28.00,
    image: "https://images.unsplash.com/photo-1584992236310-6edddc085ff8?q=80&w=600&auto=format&fit=crop",
    category: "Apparel",
    stock: 10,
    customizable: true,
    createdAt: new Date().toISOString(),
  }
];

export async function GET() {
  try {
    // 1. Seed Products
    const productsCol = collection(db, "products");
    const existingProducts = await getDocs(productsCol);
    
    // Clear old products
    for (const docSnap of existingProducts.docs) {
      await deleteDoc(docSnap.ref);
    }
    
    // Add new products
    for (const p of products) {
      await setDoc(doc(db, "products", p.id), p);
    }

    // 2. Seed Users & Roles (pre-configure role mappings)
    // admin@dilrucrochet.com -> ADMIN
    // customer@dilrucrochet.com -> USER
    const usersCol = collection(db, "users");
    
    await setDoc(doc(db, "users", "admin-default"), {
      email: "admin@dilrucrochet.com",
      role: "SUPER_ADMIN",
      name: "Dilru Admin",
      uid: null, // Will map upon Firebase registration
      createdAt: new Date().toISOString()
    });

    await setDoc(doc(db, "users", "customer-default"), {
      email: "customer@dilrucrochet.com",
      role: "USER",
      name: "Jane Doe",
      uid: null, // Will map upon Firebase registration
      createdAt: new Date().toISOString()
    });

    // 3. Seed an initial Order for Jane Doe
    await setDoc(doc(db, "orders", "order-1"), {
      id: "order-1",
      userEmail: "customer@dilrucrochet.com",
      userName: "Jane Doe",
      userId: "customer-default",
      items: [
        {
          productId: "prod-2",
          name: "Everlasting Puff Flowers Bouquet",
          quantity: 1,
          price: 38.00
        },
        {
          productId: "prod-5",
          name: "Mini Desktop Crochet Cactus",
          quantity: 2,
          price: 22.00
        }
      ],
      total: 82.00,
      status: "COMPLETED",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1 day ago
    });

    await setDoc(doc(db, "orders", "order-2"), {
      id: "order-2",
      userEmail: "customer@dilrucrochet.com",
      userName: "Jane Doe",
      userId: "customer-default",
      items: [
        {
          productId: "prod-1",
          name: "Cozy Daisy Patch Cardigan",
          quantity: 1,
          price: 110.00
        }
      ],
      total: 110.00,
      status: "PENDING",
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully with products, users (admin & customer), and initial orders."
    });
  } catch (error) {
    console.error("Seeding Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
