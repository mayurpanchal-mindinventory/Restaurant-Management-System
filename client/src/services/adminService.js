import apiClient from "./apiClient";

export const createRestaurant = async (body) => {
    const res = await apiClient.post(`/admin/create-restaurant`, body);

    return res.data;
}