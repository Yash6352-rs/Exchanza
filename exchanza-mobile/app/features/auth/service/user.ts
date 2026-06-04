import {
  deleteDoc,
  doc,
  getDoc,
  increment,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../../../services/firebase/firebase";
import { deleteUser, signOut } from "firebase/auth";

export const createUserIfNotExists = async (user: any) => {
  const docRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    await setDoc(docRef, {
      id: user.uid,
      name: user.displayName || "",
      email: user.email,
      role: "user",
      bio: "",
      skills: [],
      profileImage: "",
      rating: 0,
      totalReviews: 0,
      totalRatings: 0,
      profileCompleted: false,
      isBlocked: false,
      themePreference: "system",
      createdAt: serverTimestamp(),
    });

    // Update Global Stats
    const statsRef = doc(db, "stats", "global");

    await setDoc(
      statsRef,
      {
        totalUsers: increment(1),
      },
      { merge: true },
    );
  }
};

export const logoutUser = async () => {
  await signOut(auth);
}

export const deleteAccount = async () => {
  const user = auth.currentUser;

  if (!user) throw new Error("No user found");

  const userId = user.uid;

  // 1 Delete user document
  await deleteDoc(doc(db, "users", userId));

  // 2 Decrement global stats
  await updateDoc(doc(db, "stats", "global"), {
    totalUsers: increment(-1),
  });

  // 3 Delete auth account
  await deleteUser(user);
};


