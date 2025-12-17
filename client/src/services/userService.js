import apiClient from "./apiClient.js";

export const createBookings = async (body) => {
  return await apiClient.post(`api/user/create-booking`, body);
};

export const getBookings = async (userId) => {
  if (userId) {
    return await apiClient.get(`api/user/bookings/${userId}`);
  }
  return await apiClient.get(`api/user/bookings`);
};
