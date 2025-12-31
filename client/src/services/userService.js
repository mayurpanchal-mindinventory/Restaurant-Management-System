import apiClient from "./apiClient.js";

export const createBookings = async (body) => {
  return await apiClient.post(`api/user/create-booking`, body);
};

export const getBookings = async (userId, options = {}) => {
  const params = new URLSearchParams();

  // Add pagination params
  if (options.page) params.set("page", options.page);
  if (options.limit) params.set("limit", options.limit);

  // Add filter params
  if (options.searchDate) params.set("searchDate", options.searchDate);
  if (options.searchRestaurant)
    params.set("searchRestaurant", options.searchRestaurant);
  if (options.status) params.set("status", options.status);

  // Add sort params
  if (options.sortBy) params.set("sortBy", options.sortBy);
  if (options.sortOrder) params.set("sortOrder", options.sortOrder);

  const queryString = params.toString();

  if (userId) {
    return await apiClient.get(
      `api/user/bookings/${userId}${queryString ? "?" + queryString : ""}`
    );
  }
  return await apiClient.get(
    `api/user/bookings${queryString ? "?" + queryString : ""}`
  );
};

export const getBillByUser = async (userId, options = {}) => {
  const params = new URLSearchParams();

  // Add pagination params
  if (options.page) params.set("page", options.page);
  if (options.limit) params.set("limit", options.limit);

  // Add filter params
  if (options.searchDate) params.set("searchDate", options.searchDate);
  if (options.searchRestaurant)
    params.set("searchRestaurant", options.searchRestaurant);

  // Add sort params
  if (options.sortBy) params.set("sortBy", options.sortBy);
  if (options.sortOrder) params.set("sortOrder", options.sortOrder);

  const queryString = params.toString();
  return await apiClient.get(
    `api/user/bill/${userId}${queryString ? "?" + queryString : ""}`
  );
};

export const updateSharedWithUserByBookingid = async (bookingid) => {
  return await apiClient.patch(`api/user/bill/${bookingid}`);
};
