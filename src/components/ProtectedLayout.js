import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import {
    Route,
} from "react-router-dom";
import { Routes } from "react-router-dom";
import Topbar from "../pages/global/Topbar";
import Sidebar from "../pages/global/Sidebar";
import Team from "../pages/team/index"
import Task from "../pages/task/index"
import {  useOutlet } from "react-router-dom";
import Dashboard from "../pages/dashboard";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "../theme";
import { ToastContainer } from "react-toastify";
// import { showToast } from "../hooks/ToastUttils";
import "react-toastify/dist/ReactToastify.css";


export const ProtectedLayout = () => {
    const { user } = useAuth();
      const outlet = useOutlet();
    const [theme, colorMode] = useMode();
    const [isSidebar, setIsSidebar] = useState(true);
    if (!user) {
        return <Navigate to="/" />;
    }

    return (
        <>
            <ColorModeContext.Provider value={colorMode}>
                <ThemeProvider theme={theme}>
                <ToastContainer />
                    <CssBaseline />
                   
                    <div className="app">
                        <Sidebar isSidebar={isSidebar} />
                        <main className="content">
                            <Topbar setIsSidebar={setIsSidebar} />
                            <Routes>

                                <Route exact path="/home" element={<Dashboard />} />
                                <Route exact path="/team" element={<Team />} />
                                <Route exact path="/task" element={<Task />} />
                              
                               
                               
                                {/* <Route path="*" element={<FAQ />} /> */}
                            </Routes>
                        </main>
                    </div>
                </ThemeProvider>
            </ColorModeContext.Provider>

            {outlet}
        </>
    );
};


