
const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();

/**
 * @name getMarketplaceOffers
 * @description HTTPS Callable Function to fetch, filter, and sort marketplace offers.
 * This function moves the filtering logic from the client to the server for
 * improved performance, scalability, and cost-efficiency.
 *
 * @param {object} data - The data object from the client.
 * @param {object} data.filters - The filters to apply.
 * @param {string} [data.filters.category] - e.g., 'resources', 'vehicles'.
 * @param {string} [data.filters.type] - 'sell' or 'buy'.
 * @param {string} [data.filters.searchTerm] - Text to search in title or item_name.
 * @param {number} [data.filters.priceMin] - Minimum price.
 * @param {number} [data.filters.priceMax] - Maximum price.
 * @param {string} [data.filters.orderBy='created_at'] - Field to sort by.
 * @param {string} [data.filters.orderDirection='desc'] - 'asc' or 'desc'.
 * @param {number} [data.filters.limit=20] - Number of results to return.
 * @param {string} [data.filters.startAfter] - The document ID to start after for pagination.
 * @param {object} context - The context object from Firebase.
 * @param {object} context.auth - Authentication information.
 *
 * @returns {Promise<{success: boolean, offers: object[], hasMore: boolean, error?: string}>}
 */
exports.getMarketplaceOffers = functions.https.onCall(async (data, context) => {
  // 1. Authentication Check
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "A função só pode ser chamada por um usuário autenticado.",
    );
  }

  const {filters = {}} = data;
  console.log("Recebidos filtros:", filters);

  try {
    // 2. Query Building
    let query = db.collection("marketplace_offers");

    // Base filter: only active offers
    query = query.where("status", "==