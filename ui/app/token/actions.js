"use server";

import { fetchTokenById } from "../utils/firebaseHelpers";

/**
 * Server action to fetch a token by ID
 * @param {string} id - Token ID to fetch
 * @returns {Promise<Object|null>} - Token data or null if not found
 */
export async function getTokenData(id) {
  try {
    const token = await fetchTokenById(id);
    return token;
  } catch (error) {
    console.error("Error in getTokenData:", error);
    return null;
  }
}
