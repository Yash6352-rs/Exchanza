import { db } from "@/app/services/firebase/firebase";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, increment, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";

type CreatePostParams = {
    userId: string;
    type: "offer" | "request";
    title: string;
    description: string;
    tags: string[];
}

type UpdatePostParams = {
    postId: string;
    type: "offer" | "request";
    title: string;
    description: string;
    tags: string[];
}

export const createPost = async ({ userId, type, title, description, tags}: CreatePostParams) => {
    // Create Post
    const docRef = await addDoc(collection(db, "posts"), {
        userId,
        type,
        title,
        description,
        tags,
        status: "open",
        acceptedTradeId: null,
        createdAt: serverTimestamp(),
    });

    // Update Global Stats
    const statsRef = doc(db, "stats", "global");

    await setDoc(
        statsRef,
        {
            totalPosts: increment(1),
            totalOffers: type === "offer" ? increment(1) : increment(0),
            totalRequests: type === "request" ? increment(1) : increment(0),
            totalTags: increment(tags.length),
        },
        { merge: true }
    );

    // 3. Handle tags
    for (const tag of tags) {
        const normalizedTag = tag.toLowerCase();

        const tagRef = doc(db, "tags", normalizedTag);
        const tagSnap = await getDoc(tagRef);

        if (tagSnap.exists()) {
            // increment usage
            await setDoc(
                tagRef, {
                    usageCount: increment(1),
                },
                { merge: true }
            );
        } else {
            // create new tag
            await setDoc(tagRef, {
                name: normalizedTag,
                usageCount: 1,
                createdAt: serverTimestamp(),
            })
        }
    }

    return docRef.id;
}

export const subscribeToPosts = (callback: (posts: any[]) => void) => {
    const q = query(
        collection(db, "posts"),
        where("status", "==", "open"),
        orderBy("createdAt", "desc")
    );

    return onSnapshot(q, async (snapshot) => {
        const posts = await Promise.all(
            snapshot.docs.map(async (docSnap) => {
            const data = docSnap.data();

            // Fetch user data
            const userRef = doc(db, "users", data.userId);
            const userSnap = await getDoc(userRef);
            const userData = userSnap.exists() ? userSnap.data() : null;

            return {
                id: docSnap.id,
                title: data.title,
                userId: data.userId,
                type: data.type,
                tags: data.tags || [],
                description: data.description,

                // attach user data
                userName: userData?.name || "User",
                userAvatar: userData?.profileImage || "",
                rating: userData?.rating || 0.0,
                totalReviews: userData?.totalReviews || 0,
            };
        })
    );
    callback(posts);
  });
};

export const subscribeToTags = (callback: (tags: any[]) => void) => {
    const q = query(
        collection(db, "tags"),
        orderBy("usageCount", "desc")
    );

    return onSnapshot(q, (snapshot) => {
        const tags = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        usageCount: doc.data().usageCount || 0,
    }));

    callback(tags);
  });
}

export const deletePost = async (postId: string) => {
    try {
        const postRef = doc(db, "posts", postId);
        const postSnap = await getDoc(postRef);

        if (!postSnap.exists()) {
            throw new Error("Post not found");
        }
        const post = postSnap.data();

        // Update global stats (reverse)
        const statsRef = doc(db, "stats", "global");

        await setDoc(
            statsRef, {
                totalPosts: increment(-1),
                totalOffers: post.type === "offer" ? increment(-1) : increment(0),
                totalRequests: post.type === "request" ? increment(-1) : increment(0),
                totalTags: increment(-(post.tags?.length || 0)),
            },
            { merge: true }
        );

        // Delete post
        await deleteDoc(doc(db, "posts", postId));

    } catch (error: any) {
        console.log("Delete Post Error:", error.message);
        throw new Error("Failed to delete post")  
    }
}

export const updatePost = async ({ postId, type, title, description, tags}: UpdatePostParams) => {
    try {
        const postRef = doc(db, "posts", postId);
        const snap = await getDoc(postRef);

        if (!snap.exists()) throw new Error("Post not found");

        const oldPost = snap.data();

        // 1 Update Post
        await updateDoc(postRef, {
            type, 
            title, 
            description, 
            tags
        });

        // 2 Handle type change (stats)
        const statsRef = doc(db, "stats", "global");
        
        if (oldPost.type !== type) {
            await setDoc(statsRef, {
                totalOffers: type === "offer" ? increment(1) : increment(-1),
                totalRequests: type === "request" ? increment(1) : increment(-1),
            },
            { merge: true }
        )}

        // 3 Handle tags diff
        const oldTags = oldPost.tags || [];

        const addedTags = tags.filter(t => !oldTags.includes(t));
        const removedTags = oldTags.filter((t: any) => !tags.includes(t));

        // Add new tags
        for (const tag of addedTags) {
            const tagRef = doc(db, "tags", tag)

            await setDoc(tagRef, {
                name: tag,
                usageCount: increment(1),
            },
            { merge: true }
            );
        }

        // Remove old tags
        for (const tag of removedTags) {
            const tagRef = doc(db, "tags", tag);

            await setDoc(tagRef, {
                usageCount: increment(-1),
            },
            { merge: true }
            );
        }
    } catch (error: any) {
        console.log("Updates Post Error.", error.messgae)
        throw new Error("Failed to update post");
    }
}


