export const STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

export const MESSAGES = {
  RESTAURANT_FOUND: "Restaurant found succesfully",
  RESTAURANT_CREATED: "Restaurant created successfully.",
  RESTAURANT_UPDATED: "Restaurant updated successfully.",
  RESTAURANT_DELETED: "Restaurant deleted successfully.",
  RESTAURANT_NOT_FOUND: "Restaurant not found.",
  RESTAURANT_EXIST: "Restaurant already exists",
  INVALID_REQUEST: "Invalid request data.",
  SERVER_ERROR: "Something went wrong on the server.",
  RESTAURANT_NOTADD: "Something went wrong Restaurant adding failed",
  RESTAURANT_NOTUPDATE: "Something went wrong Restaurant update failed",
  RESTAURANT_NOTDELETE: "Something went wrong Restaurant delete failed",
  MENU_DELETED: "Menu deleted successfully.",
  MENU_NOTDELETE: "Something went wrong Menu delete failed",
  MENU_NOT_UPDATED: "Something Went Wrong while updating menu item"

};

export const sendResponse = (res, status, msg, data) => {
  return res.status(status).json({ message: msg, data });
};
