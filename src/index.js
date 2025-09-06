import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";// eslint-disable-next-line
import App from "./App";
import { RouterProvider } from "react-router-dom";
import axios from 'axios';
import { router } from "./App";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
//import Router from "./router"
// import { BrowserRouter } from "react-router-dom";
// import { SnackbarProvider } from './components/SnackBarComponent';

axios.defaults.baseURL = "http://localhost:5000/";

const token = localStorage.getItem('token');
const organizationId = localStorage.getItem('organization');

if (token) {

  axios.interceptors.request.use(
    function (config) {

      if (token) {
        config.headers['x-auth-token'] = token;
        config.headers['Organization'] = organizationId;
      }
      return config
    },
    function (error) {
      return Promise.reject(error)
    }
  );
  axios.interceptors.response.use(response => {
    return response;
  }, error => {


    return error;
  });
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
   
{/* <SnackbarProvider> */}
    <RouterProvider router={router} />

    {/* </SnackbarProvider> */}
  </React.StrictMode>
);
