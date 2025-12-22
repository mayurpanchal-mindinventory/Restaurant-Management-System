import apiClient from "./apiClient";

export const billService = {
  // Create a new bill for a booking
  createBill: async (billData) => {
    try {
      const response = await apiClient.post("/api/owner/createBill", billData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to create bill");
    }
  },

  // Get all bills for a restaurant
  getBills: async (userId, page = 1, limit = 5) => {
    try {
      const response = await apiClient.get(
        `/api/owner/bills/${userId}?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch bills");
    }
  },

  // Get a specific bill by ID
  getBillById: async (billId) => {
    try {
      const response = await apiClient.get(`/api/owner/bill/${billId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch bill details"
      );
    }
  },

  // Update bill payment status
  updatePaymentStatus: async (billId, paymentStatus) => {
    try {
      const response = await apiClient.patch(
        `/api/owner/bill/${billId}/paymentStatus`,
        {
          paymentStatus,
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update payment status"
      );
    }
  },

  // Get menu items for bill generation (this would use existing menu service)
  getMenuItems: async (id) => {
    try {
      const response = await apiClient.get(`/api/admin/menulist/${id}`);
      console.log(response);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch menu items"
      );
    }
  },
};
