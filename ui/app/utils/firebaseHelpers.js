import { db } from "../../lib/firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  doc,
  getDoc,
} from "firebase/firestore";

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

/**
 * Fetches a single token by ID from the Firebase 'token' collection
 * @param {string} tokenId - ID of the token to fetch
 * @returns {Promise<Object|null>} - Token object or null if not found
 */
export const fetchTokenById = async (tokenId) => {
  try {
    const tokenRef = doc(db, "token", tokenId);
    const tokenSnapshot = await getDoc(tokenRef);

    if (tokenSnapshot.exists()) {
      return {
        id: tokenSnapshot.id,
        ...tokenSnapshot.data(),
      };
    } else {
      console.log(`Token with ID ${tokenId} not found`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching token with ID ${tokenId}:`, error);
    return null;
  }
};
