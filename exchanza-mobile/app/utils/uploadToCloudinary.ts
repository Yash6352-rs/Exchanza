export const uploadToCloudinary = async (imageUri: string) => {
    try {
        const data = new FormData();

        data.append("file" ,{
            uri: imageUri,
            type: "image/jpeg",
            name: "profile.jpg"
        } as any);

        data.append("upload_preset", "exchanza_upload");

        const res = await fetch(
             "https://api.cloudinary.com/v1_1/dlalpzbbq/image/upload",
             {
                method: "POST",
                body: data,
             }
        );

        const result = await res.json();

        return result.secure_url;  // This is what we store in Firestore
    } catch (error) {
        console.log("Cloudinary upload error:", error);
        throw error;
    }
};