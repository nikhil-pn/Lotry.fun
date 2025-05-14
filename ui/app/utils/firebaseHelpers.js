import { db } from "../../lib/firebase";
import { collection, getDocs, query, orderBy, limit, doc, getDoc, updateDoc } from "firebase/firestore";

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
 * Fetches a single token from the Firebase 'token' collection by its document ID.
 * @param {string} id - The document ID of the token in Firebase.
 * @returns {Promise<Object|null>} - Token object if found, otherwise null.
 */
export const fetchTokenById = async (id) => {
  try {
    const tokenRef = doc(db, "token", id);
    const docSnap = await getDoc(tokenRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.warn(`No token found with ID: ${id}`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching token by ID:", error);
    return null;
  }
};

/**
 * Updates a token document in Firebase, typically after blockchain confirmation.
 * @param {string} docId - The Firebase document ID of the token to update.
 * @param {Object} dataToUpdate - An object containing fields to update (e.g., tokenAddress, status).
 * @returns {Promise<boolean>} - True if update was successful, false otherwise.
 */
export const updateTokenOnLaunch = async (docId, dataToUpdate) => {
  try {
    const tokenRef = doc(db, "token", docId);
    await updateDoc(tokenRef, dataToUpdate);
    console.log(`Token document ${docId} updated successfully with:`, dataToUpdate);
    return true;
  } catch (error) {
    console.error(`Error updating token document ${docId}:`, error);
    return false;
  }
};
