import apiClient from "./apiClient.js";

export const getBookingsByRestaurantId = async (userId) => {
  const res = await apiClient.get(`api/owner/bookingList/${userId}`);
  return res.data.data.booking; // Extract the booking array from the response
};

export const updateBookingStatus = async (id, status) => {
  const res = await apiClient.patch(`api/owner/updateStatus/${id}`, { status });
  return res.data;
};
