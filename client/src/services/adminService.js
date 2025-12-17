import apiClient from "./apiClient.js";

export const createRestaurant = async (body) => {
    return await apiClient.post(`api/admin/create-restaurant`, body);
}
export const getAllRestaurants = async () => {
    const res = await apiClient.get("api/admin/display-restaurant");

    return res.data;
}

export const getRestaurantsById = async (id) => {
    const res = await apiClient.get(`api/admin/display-restaurant/${id}`);

    return res.data;
}
export const deleteRestaurantById = async (id) => {
    const res = await apiClient.delete(`api/admin/delete-restaurant/${id}`);
    return res.data;
}
export const updateRestaurant = async (restaurantId, body) => {
    return await apiClient.put(`api/admin/update-restaurant/${restaurantId}`, body);
}

//Menu and Categories API Services
export const getAllCategories = async () => {
    const res = await apiClient.get("api/admin/categories");

    return res.data;
}

export const createMenu = async (body) => {
    return await apiClient.post(`api/admin/menu`, body);
}
export const getMenuList = async (id) => {
    return await apiClient.get(`api/admin/menulist/${id}`);
}
export const deleteMenuById = async (id) => {
    const res = await apiClient.delete(`api/admin/delete-menu/${id}`);
    return res.data;
}
export const getMenuById = async (id) => {
    const res = await apiClient.get(`api/admin/menu/${id}`);
    return res.data;
}
export const updateMenuById = async (menuId, body) => {
    return await apiClient.put(`api/admin/update-menu/${menuId}`, body);
}




//Slot Api's

export const createSlot = async (body) => {
    return await apiClient.post(`api/admin/slot`, body);
}
export const getSlotListByRestaurant = async (id) => {
    return await apiClient.get(`api/admin/slotlist/${id}`);
}
export const deleteSlotById = async (id) => {
    const res = await apiClient.delete(`api/admin/delete-slot/${id}`);
    return res.data;
}
export const getSlotById = async (id) => {
    const res = await apiClient.get(`api/admin/slot/${id}`);

    return res.data;
}
export const updateSlot = async (slotId, body) => {
    return await apiClient.put(`api/admin/update-slot/${slotId}`, body);
}