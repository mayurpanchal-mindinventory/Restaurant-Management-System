import apiClient from "./apiClient.js";

export const createRestaurant = async (body) => {
  return await apiClient.post(`api/admin/create-restaurant`, body);
};
export const getAllRestaurants = async (currentpage, search, sortby) => {
  const res = await apiClient.get(
    `api/admin/display-restaurant?page=${currentpage}&search=${search}&sortby=${sortby}`
  );
  return res.data;
};

export const getRestaurantsById = async (id) => {
  const res = await apiClient.get(`api/admin/display-restaurant/${id}`);
  // console.log(res);
  return res.data;
};
export const deleteRestaurantById = async (id) => {
  const res = await apiClient.delete(`api/admin/delete-restaurant/${id}`);
  return res.data;
};
export const updateRestaurant = async (restaurantId, body) => {
  return await apiClient.put(
    `api/admin/update-restaurant/${restaurantId}`,
    body
  );
};

//Menu and Categories API Services
export const getAllCategories = async () => {
  const res = await apiClient.get("api/admin/categories");

  return res.data;
};

export const createMenu = async (body) => {
  return await apiClient.post(`api/admin/menu`, body);
};
export const getMenuList = async (page, id, category, sortby, search) => {
  return await apiClient.get(
    `api/admin/menulist/${id}?page=${page}&category=${category}&sortby=${sortby}&search=${search}`
  );
};
export const getMenuList1 = async (id) => {
  return await apiClient.get(`api/admin/menulist/${id}`);
};
export const deleteMenuById = async (id) => {
  const res = await apiClient.delete(`api/admin/delete-menu/${id}`);
  return res.data;
};
export const getMenuById = async (id) => {
  const res = await apiClient.get(`api/admin/menu/${id}`);
  return res.data;
};
export const updateMenuById = async (menuId, body) => {
  return await apiClient.put(`api/admin/update-menu/${menuId}`, body);
};
export const getRestaurantMenu = async (page, id) => {
  return await apiClient.get(`api/owner/menulist/${id}?page=${page}`);
};

export const createSlot = async (body) => {
  return await apiClient.post(`api/admin/slot`, body);
};
export const getSlotListByRestaurant = async (id, page, sortby, timeslot) => {
  return await apiClient.get(
    `api/admin/slotlist/${id}?page=${page}&sortby=${sortby}&timeslot=${timeslot}`
  );
};
export const deleteSlotById = async (id) => {
  const res = await apiClient.delete(`api/admin/delete-slot/${id}`);
  return res.data;
};
export const getSlotById = async (id) => {
  const res = await apiClient.get(`api/admin/slot/${id}`);

  return res.data;
};
export const updateSlot = async (slotId, body) => {
  return await apiClient.put(`api/admin/update-slot/${slotId}`, body);
};

export const getAllMenu = async (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.search) {
    params.append("search", filters.search);
  }

  if (filters.category) {
    params.append("category", filters.category);
  }

  if (filters.restaurant) {
    params.append("restaurant", filters.restaurant);
  }

  if (filters.minPrice !== undefined && filters.minPrice !== "") {
    params.append("minPrice", filters.minPrice);
  }

  if (filters.maxPrice !== undefined && filters.maxPrice !== "") {
    params.append("maxPrice", filters.maxPrice);
  }

  if (filters.sortBy) {
    params.append("sortBy", filters.sortBy);
  }

  if (filters.sortOrder) {
    params.append("sortOrder", filters.sortOrder);
  }

  if (filters.page) {
    params.append("page", filters.page);
  }

  if (filters.limit) {
    params.append("limit", filters.limit);
  }

  const queryString = params.toString();
  const url = queryString
    ? `api/admin/allmenu?${queryString}`
    : "api/admin/allmenu";

  const res = await apiClient.get(url);
};
//Booking Api
export const getAllBooking = async (page, search, sortby, status, date) => {
  const res = await apiClient.get(
    `api/admin/viewbooking?page=${page}&search=${search}&sortby=${sortby}&status=${status}&date=${date}`
  );
  return res.data;
};
