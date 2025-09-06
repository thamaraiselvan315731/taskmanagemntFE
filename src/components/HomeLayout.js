import { Navigate, useOutlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";


export const HomeLayout = () => {
    const { user } = useAuth();
    const outlet = useOutlet();

    if (user) {
        return <Navigate to="/home" replace />;
    }

    return (
        <div>
            {outlet}
        </div>
    );
};
// import { Navigate, useOutlet } from "react-router-dom";
// import { useAuth } from "../hooks/useAuth";
// import { useEffect, useState } from "react";

// export const HomeLayout = () => {
//     const { user } = useAuth();
//     const outlet = useOutlet();
//     const [redirect, setRedirect] = useState(false);

//     useEffect(() => {
//         if (user) {
//             console.log("User detected, redirecting to /home...");
//             setRedirect(true);
//         }
//     }, [user]);

//     if (redirect) {
//         return <Navigate to="/home" replace />;
//     }

//     return <div>{outlet}</div>;
//};
