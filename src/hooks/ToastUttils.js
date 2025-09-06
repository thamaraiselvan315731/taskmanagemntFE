import { toast } from "react-toastify";

/**
 * Show a toast notification
 * @param {string} message - The message to display
 * @param {string} type - "success" | "error" | "info" | "warning"
 * @param {string} theme - "light" | "dark"
 */
export const showToast = (message, type = "info", theme = "light") => {
  toast[type](message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme, // React Toastify supports "light", "dark", "colored"
  });
};
