import { db } from "../../lib/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

/**
 * Fetches tokens from the Firebase 'token' collection
 * @param {number} limitCount - Number of tokens to fetch (default: 10)
 * @returns {Promise<Array>} - Array of token objects
 */
export const fetchTokens = async (limitCount = 10) => {
  try {
    const tokensRef = collection(db, "token");
    const q = query(tokensRef, orderBy("createdAt", "desc"), limit(limitCount));
    const querySnapshot = await getDocs(q);

    const tokens = [];
    querySnapshot.forEach((doc) => {
      tokens.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return tokens;
  } catch (error) {
    console.error("Error fetching tokens:", error);
    return [];
  }
};
