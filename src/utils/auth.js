// for managing authentication tokens in local storage
export const saveToken = (token) => {
  localStorage.setItem("token", token);
};

export const getToken = () => localStorage.getItem("token");
export const clearToken = () => localStorage.removeItem("token");

export const isLoggedIn = () => !!getToken();
