import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  deleteDoc, 
  getDocFromServer
} from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";
import { UserProfile, Product, Order } from "../types";

// Initialize Firebase
const app = initializeApp({
  apiKey: firebaseConfig.apiKey,
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  messagingSenderId: firebaseConfig.messagingSenderId,
  appId: firebaseConfig.appId,
});

// Initialize Firestore with custom databaseId if provided
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || "(default)");

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errMessage = error instanceof Error ? error.message : String(error);
  const errInfo: FirestoreErrorInfo = {
    error: errMessage,
    authInfo: {
      userId: null,
      email: null,
      emailVerified: null,
      isAnonymous: null,
      tenantId: null,
      providerInfo: []
    },
    operationType,
    path
  };
  console.error("Firestore Error:", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Validate connection on boot
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, "test", "connection"));
    console.log("Firebase Firestore connected successfully.");
  } catch (error) {
    if (error instanceof Error && error.message.includes("offline")) {
      console.error("Please check your Firebase configuration or internet connection.");
    }
  }
}
testConnection();

// Collection helpers with seamless handling of seeding to ensure perfect live experience.
export async function getRemoteUsers(fallback: UserProfile[]): Promise<UserProfile[]> {
  const path = "users";
  try {
    const colRef = collection(db, path);
    const snap = await getDocs(colRef);
    if (snap.empty) {
      // Seed initial users
      for (const u of fallback) {
        await setDoc(doc(db, "users", u.id), u);
      }
      return fallback;
    }
    const list: UserProfile[] = [];
    snap.forEach((docSnap) => {
      list.push(docSnap.data() as UserProfile);
    });
    return list;
  } catch (err) {
    console.error("Error reading users from firestore:", err);
    handleFirestoreError(err, OperationType.GET, path);
    return fallback;
  }
}

export async function saveRemoteUser(user: UserProfile) {
  const path = `users/${user.id}`;
  try {
    await setDoc(doc(db, "users", user.id), user);
  } catch (err) {
    console.error("Error saving user to firestore:", err);
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function deleteRemoteUser(userId: string) {
  const path = `users/${userId}`;
  try {
    await deleteDoc(doc(db, "users", userId));
  } catch (err) {
    console.error("Error deleting user from firestore:", err);
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

export async function getRemoteProducts(fallback: Product[]): Promise<Product[]> {
  const path = "products";
  try {
    const colRef = collection(db, path);
    const snap = await getDocs(colRef);
    if (snap.empty) {
      // Seed initial products
      for (const p of fallback) {
        await setDoc(doc(db, "products", p.id), p);
      }
      return fallback;
    }
    const list: Product[] = [];
    snap.forEach((docSnap) => {
      list.push(docSnap.data() as Product);
    });
    return list;
  } catch (err) {
    console.error("Error reading products from firestore:", err);
    handleFirestoreError(err, OperationType.GET, path);
    return fallback;
  }
}

export async function saveRemoteProduct(product: Product) {
  const path = `products/${product.id}`;
  try {
    await setDoc(doc(db, "products", product.id), product);
  } catch (err) {
    console.error("Error saving product to firestore:", err);
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function deleteRemoteProduct(productId: string) {
  const path = `products/${productId}`;
  try {
    await deleteDoc(doc(db, "products", productId));
  } catch (err) {
    console.error("Error deleting product from firestore:", err);
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

export async function getRemoteOrders(fallback: Order[]): Promise<Order[]> {
  const path = "orders";
  try {
    const colRef = collection(db, path);
    const snap = await getDocs(colRef);
    if (snap.empty) {
      // Seed initial orders
      for (const o of fallback) {
        await setDoc(doc(db, "orders", o.id), o);
      }
      return fallback;
    }
    const list: Order[] = [];
    snap.forEach((docSnap) => {
      list.push(docSnap.data() as Order);
    });
    return list;
  } catch (err) {
    console.error("Error reading orders from firestore:", err);
    handleFirestoreError(err, OperationType.GET, path);
    return fallback;
  }
}

export async function saveRemoteOrder(order: Order) {
  const path = `orders/${order.id}`;
  try {
    await setDoc(doc(db, "orders", order.id), order);
  } catch (err) {
    console.error("Error saving order to firestore:", err);
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function deleteRemoteOrder(orderId: string) {
  const path = `orders/${orderId}`;
  try {
    await deleteDoc(doc(db, "orders", orderId));
  } catch (err) {
    console.error("Error deleting order from firestore:", err);
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}
