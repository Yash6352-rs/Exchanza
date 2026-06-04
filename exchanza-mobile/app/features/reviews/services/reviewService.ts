import { db } from "@/app/services/firebase/firebase";
import { addDoc, collection, doc, getDoc, getDocs, query, serverTimestamp, updateDoc, where } from "firebase/firestore";

type CreateReviewParams = {
    tradeId: string;
    reviewerId: string;
    reviewedUserId: string;
    rating: number;
    comment?: string;
}

export const createReview = async ({
    tradeId, reviewerId, reviewedUserId, rating, comment
}: CreateReviewParams) => {
    try {
        // 1 Check duplicate review
        const q = query(
            collection(db, "reviews"),
            where("tradeId", "==", tradeId),
            where("reviewerId", "==", reviewerId)
        );

        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
            throw new Error("You have already reviewed this trade.");
        }

        // 2 Create Review
        await addDoc(collection(db, "reviews"), {
            tradeId,
            reviewerId,
            reviewedUserId,
            rating,
            comment: comment || "",
            createdAt: serverTimestamp(),
        });

        // Update User Rating
        await updateUserRating(reviewedUserId, rating);

        return { success: true };
    } catch (error: any) {
        throw new Error(error.message);
    }
}

const updateUserRating = async (userId: string, newRating: number) => {
    const userRef = doc(db, "users", userId);

    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) return;

    const userData = userSnap.data();

    const oldAvg = userData.rating || 0;
    const total = userData.totalReviews || 0;

    const newAvg = (oldAvg * total + newRating) / (total + 1) ;

    await updateDoc(userRef, {
        rating: Number(newAvg.toFixed(2)),
        totalReviews: total + 1,
    });
};

