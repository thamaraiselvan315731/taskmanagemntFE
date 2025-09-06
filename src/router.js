// import React from 'react'
// import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
// import { ProvideAuth, useAuth } from './Auth/auth'
// import AppLogin from "./loginlayout"
// import App from "./App";

// export default function Router() {
//     return (
//         <ProvideAuth>
//             <BrowserRouter>
//                 {/* <Navigation /> */}

//                 <Routes>
//                     <Route exact path='/login'>
//                         <AppLogin />
//                     </Route>
//                     <PrivateRoute path='/'>
//                         <App />
//                     </PrivateRoute>
//                 </Routes>
//             </BrowserRouter>
//         </ProvideAuth>
//     )
// }
// function PrivateRoute({ children, ...rest }) {
//     const auth = useAuth()
//     return (
//         <Route {...rest} render={({ location }) =>
//             auth.user ? (children) :
//                 (<Navigate to={{ pathname: '/login', state: { from: location } }} />)
//         }
//         />
//     )
// }