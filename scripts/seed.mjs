import pkg from "@next/env";
const { loadEnvConfig } = pkg;
// Load env variables from .env
loadEnvConfig(process.cwd());

import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, deleteDoc, getDocs } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

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

async function seed() {
  console.log("-----------------------------------------------");
  console.log("Starting Firebase Firestore Database Seeding...");
  console.log("-----------------------------------------------");

  try {
    // Authenticate seeding session
    console.log("Authenticating seeding session...");
    try {
      await createUserWithEmailAndPassword(auth, "admin@dilrucrochet.com", "AdminPassword123");
      console.log("  + Created new admin auth user in Firebase.");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        await signInWithEmailAndPassword(auth, "admin@dilrucrochet.com", "AdminPassword123");
        console.log("  + Signed in as admin@dilrucrochet.com.");
      } else {
        throw err;
      }
    }

    // 1. Seed Products
    const productsCol = collection(db, "products");
    console.log("Fetching existing products from Firestore...");
    const existingProducts = await getDocs(productsCol);
    
    if (existingProducts.size > 0) {
      console.log(`Deleting ${existingProducts.size} old products...`);
      for (const docSnap of existingProducts.docs) {
        await deleteDoc(docSnap.ref);
      }
      console.log("Old products cleared.");
    }
    
    console.log(`Writing ${products.length} new products to Firestore...`);
    for (const p of products) {
      await setDoc(doc(db, "products", p.id), p);
      console.log(`  + Seeded product [${p.id}]: ${p.name}`);
    }

    // 2. Seed Users & Pre-configured roles
    console.log("\nConfiguring user role mappings...");
    
    // Seed Admin Default Profile
    await setDoc(doc(db, "users", "admin-default"), {
      email: "admin@dilrucrochet.com",
      role: "SUPER_ADMIN",
      name: "Dilru Admin",
      uid: null,
      createdAt: new Date().toISOString()
    });
    console.log("  + Registered email admin@dilrucrochet.com -> SUPER_ADMIN");

    // Seed Editor Default Profile
    await setDoc(doc(db, "users", "editor-default"), {
      email: "editor@dilrucrochet.com",
      role: "EDITOR",
      name: "Dilru Editor",
      uid: null,
      createdAt: new Date().toISOString()
    });
    console.log("  + Registered email editor@dilrucrochet.com -> EDITOR");

    // Seed Customer Default Profile
    await setDoc(doc(db, "users", "customer-default"), {
      email: "customer@dilrucrochet.com",
      role: "USER",
      name: "Jane Doe",
      uid: null,
      createdAt: new Date().toISOString()
    });
    console.log("  + Registered email customer@dilrucrochet.com -> USER");

    // 3. Seed Mock Orders
    console.log("\nSeeding customer orders...");
    
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
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    });
    console.log("  + Seeded order-1 [COMPLETED]");

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
    console.log("  + Seeded order-2 [PENDING]");

    console.log("-----------------------------------------------");
    console.log("Firestore Seeding Completed Successfully! 🎉");
    console.log("-----------------------------------------------");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Seeding failed with error:", error.code || error.message);
    
    if (error.code === 'auth/configuration-not-found') {
      console.log("\n====================================================================");
      console.log("👉 ACTION REQUIRED: Enable Email/Password Auth in Firebase Console");
      console.log("====================================================================");
      console.log("Your Firebase project does not have Email/Password auth enabled yet.");
      console.log("1. Open: https://console.firebase.google.com/u/0/project/crochet-with-dilru/authentication/providers");
      console.log("2. Under 'Sign-in providers', click 'Add new provider'.");
      console.log("3. Select 'Email/Password', toggle 'Enable', and click 'Save'.");
      console.log("4. Once enabled, re-run this script: npm run seed");
      console.log("====================================================================\n");
    } else if (error.code === 'permission-denied') {
      console.log("\n====================================================================");
      console.log("👉 ACTION REQUIRED: Update Firestore Security Rules");
      console.log("====================================================================");
      console.log("Your Firestore rules are currently blocking writes.");
      console.log("1. Open: https://console.firebase.google.com/u/0/project/crochet-with-dilru/firestore/rules");
      console.log("2. Update your rules to allow development writes. For example:");
      console.log("   rules_version = '2';");
      console.log("   service cloud.firestore {");
      console.log("     match /databases/{database}/documents {");
      console.log("       match /{document=**} {");
      console.log("         allow read, write: if true; // ⚠️ Temporarily open for development");
      console.log("       }");
      console.log("     }");
      console.log("   }");
      console.log("3. Click 'Publish'.");
      console.log("4. Re-run this script: npm run seed");
      console.log("====================================================================\n");
    } else {
      console.error(error);
    }
    process.exit(1);
  }
}

seed();
