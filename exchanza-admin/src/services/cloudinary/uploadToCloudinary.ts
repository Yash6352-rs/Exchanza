export const uploadToCloudinary = async (file: File) => {

    try {
        const data = new FormData();
        data.append("file", file);

        data.append(
            "upload_preset",
            "exchanza_upload"
        );

        const res = await fetch(
            "https://api.cloudinary.com/v1_1/dlalpzbbq/image/upload",
            {
                method: "POST",
                body: data,
            }
        );

        const result = await res.json();
        return result.secure_url;

    } catch (error) {
        console.log("Cloudinary Upload Error:", error );
        throw error;
    }
};
