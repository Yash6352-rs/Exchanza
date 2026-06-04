import { deleteUser, signOut } from "firebase/auth";
import { auth, db,} from "../../../services/firebase/firebase";
import { deleteDoc, doc, increment, updateDoc } from "firebase/firestore";

export const logoutAdmin = async () => {
    await signOut(auth);
}

export const deleteAdminAccount = async () => {

    const user = auth.currentUser;

    if (!user) {
        throw new Error("No admin found");
    }

    const userId = user.uid;

    // DELETE USER DOCUMENT
    await deleteDoc( doc(db, "users", userId));

    // DECREMENT GLOBAL USERS
    await updateDoc(
        doc(db, "stats", "global"), {
            totalUsers: increment(-1),
        }
    );

    // DELETE AUTH ACCOUNT
    await deleteUser(user);
};