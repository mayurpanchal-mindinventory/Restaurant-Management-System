import apiClient from "./apiClient.js";

export const getBookingsByRestaurantId = async (
  userId,
  currentpage,
  tempFilters
) => {
  console.log({ tempFilters });
  const res = await apiClient.get(`api/owner/bookingList/${userId}`, {
    params: { page: currentpage, ...tempFilters },
  });
  return res.data.data; // Extract the bookings array from the response
};

export const updateBookingStatus = async (id, status) => {
  const res = await apiClient.patch(`api/owner/updateStatus/${id}`, { status });
  return res.data;
};
