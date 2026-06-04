import * as Print from "expo-print";
import { generateInvoiceHTML } from "../utils/invoiceTemplate";
import { addDoc, collection, doc, getDoc, getDocs, query, serverTimestamp, where } from "firebase/firestore";
import { db } from "@/app/services/firebase/firebase";
import * as FileSystem from "expo-file-system/legacy";
import { Asset } from "expo-asset";

export const generateInvoice = async (trade: any) => {
  try {

    // LOGO BASE64
    const logoAsset = Asset.fromModule(
      require("../../../../assets/images/exchanza_logo.png")
    );

    await logoAsset.downloadAsync();

    const logoUri = logoAsset.localUri || logoAsset.uri;

    if (!logoUri) {
      throw new Error("Logo URI not found");
    }

    const logoBase64 = await FileSystem.readAsStringAsync(
      logoUri,
      {
        encoding: FileSystem.EncodingType.Base64,
      }
    );

    // 1 Fetch Post
    let postData: any = null;

    if (trade.postId) {
      const postSnap = await getDoc(doc(db, "posts", trade.postId));

      if (postSnap.exists()) {
        postData = postSnap.data();
      }
    }

    // 2 Fetch Review
    let reviewData: any = null;

    const reviewQuery = query(
      collection(db, "reviews"),
      where("tradeId", "==", trade.id)
    );

    const reviewSnap = await getDocs(reviewQuery);

    if (!reviewSnap.empty) {
      reviewData = reviewSnap.docs[0].data();
    }

    // CHECK EXISTING
    const q = query(
      collection(db, "invoices"),
      where("tradeId", "==", trade.id)
    );

    const snapshot = await getDocs(q);

    // GENERATE HTML
    const html = generateInvoiceHTML({
      trade,
      post: postData,
      review: reviewData,
      logoBase64,
    });

    if (!snapshot.empty) {
      const { uri } = await Print.printToFileAsync({ html });
      return uri;
    }

    // CREATE INVOICE
    await addDoc(collection(db, "invoices"), {
      tradeId: trade.id,
      fromUserId: trade.fromUserId,
      toUserId: trade.toUserId,
      createdAt: serverTimestamp(),
    });

    console.log("LOGO URI:", logoUri);
    console.log("REVIEW:", reviewData);

    // PDF
    const { uri } = await Print.printToFileAsync({ html });

    return uri;

  } catch (error) {
    console.log("PDF Error:", error);
    throw error;
  }
};