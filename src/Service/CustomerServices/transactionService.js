import axios from "axios";
import { toast } from "react-toastify";
// Set up axios instance
const api = axios.create({
  baseURL: "http://localhost:5000/api", // Your API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Assuming the token is stored in localStorage
  if (token) {
    config.headers["x-auth-token"] = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response, // if success, just return response
  (error) => {
    console.log("API Error:", error);
    // Extract meaningful error message
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Something went wrong";

    // Show toast
    toast.error(message, { position: "top-right" });

    // Optionally, handle 401 Unauthorized globally
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login"; // redirect to login
    }

    // Throw error so the caller can also catch it
    return Promise.reject(error);
  }
);

export const getTasks = async () => {
  try {
    const response = await api.get("/tasks");
    return response.data;
  } catch (error) {
    toast.error(error, { position: "top-right" });
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

export const createTask = async (taskData) => {
  try {
    const response = await api.post("/tasks", taskData);
    console.log("Create Task Response:", response);
    return response.data;

  } catch (error) {
    toast.error(error, { position: "top-right" });
    console.error("Error creating task:", error);
    throw error;
  }
};

export const updateTask = async (taskId, taskData) => {
  try {
    const response = await api.put(`/tasks/details`, { taskId, ...taskData });
    return response.data;
  } catch (error) {
    toast.error(error, { position: "top-right" });
    console.error("Error updating task:", error);
    throw error;
  }
};
///

export const updateTaskStatus = async (taskId, taskData) => {
  try {
    console.log("Updating task status with data:",taskId, taskData);
    const response = await api.put(`/tasks/status`, { taskId,status:taskData  });
    return response.data;
  } catch (error) {
    toast.error(error, { position: "top-right" });
    console.error("Error updating task:", error);
    throw error;
  }
};


export const deleteTask = async (taskId) => {
  try {
    const response = await api.delete(`/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    toast.error(error, { position: "top-right" });
    console.error("Error deleting task:", error);
    throw error;
  }
};


export const getDashboardData = async () => {
  try {
    const response = await api.get("/dashboard");
    return response.data;
  } catch (error) {
    toast.error(error, { position: "top-right" });
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

export const createProject = async (projectData) => {
  try {
    const response = await api.post("/createProject", projectData);
    console.log("Create Task Response:", response);
    return response.data;

  } catch (error) {
    toast.error(error, { position: "top-right" });
    console.error("Error creating task:", error);
    throw error;
  }
};

export const updateReasignTask = async (taskId, taskData) => {
  try {
    const response = await api.put(`/tasks/assign`, { taskId, ...taskData });
    return response.data;
  } catch (error) {
    toast.error(error, { position: "top-right" });
    console.error("Error updating task:", error);
    throw error;
  }
};
