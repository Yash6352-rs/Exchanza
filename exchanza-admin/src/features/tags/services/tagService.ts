/* eslint-disable @typescript-eslint/no-explicit-any */
import { query, collection, orderBy, onSnapshot, addDoc, updateDoc, doc, increment, deleteDoc } from "firebase/firestore";
import { db } from "../../../services/firebase/firebase";

export const subscribeToTags = ( callback: (tags: any[]) => void) => {

    const q = query(
        collection(db, "tags"),
        orderBy("usageCount", "desc")
    );

    return onSnapshot(q, (snapshot) => {
        const tags = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
        }));

        callback(tags);
    });
};

export const createTag = async ( name: string ) => {
    await addDoc(
        collection(db, "tags"),
        {
            name: name.toLowerCase(),
            usageCount: 0,
            createdAt: Date.now(),
        }
    );

    await updateDoc(
        doc(db, "stats", "global"),
        {
            totalTags: increment(1),
        }
    );
};

export const deleteTag = async ( tagId: string ) => {
    await deleteDoc(
        doc(db, "tags", tagId)
    );

    await updateDoc(
        doc(db, "stats", "global"),
        {
            totalTags: increment(-1),
        }
    );
};