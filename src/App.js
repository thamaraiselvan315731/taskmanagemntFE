import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  defer
} from "react-router-dom";
import { LoginPage } from "./pages/login/Login";
// import { useAuth } from "./hooks/useAuth";
import { HomeLayout } from "./components/HomeLayout";
import { ProtectedLayout } from "./components/ProtectedLayout"
import "./styles.css";
import { AuthLayout } from "./components/AuthLayout";
import { RegisterPage } from "./pages/register/register";
import { ForgetPassword } from "./pages/forgetpassword/ForgetPassword"
const getUserData = () =>
  new Promise((resolve) =>
    setTimeout(() => {
      const user = window.localStorage.getItem("user");
      resolve(user);
    }, 3000)
  );



export const router = createBrowserRouter(

  createRoutesFromElements(

    <Route
      element={<AuthLayout />}
      loader={() => defer({ userPromise: getUserData() })}
    >
      <Route element={<HomeLayout />}>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgetpassword" element={<ForgetPassword />} />
      </Route>
      <Route path="/*" element={<ProtectedLayout />}>

      </Route>
    </Route>
  )
);