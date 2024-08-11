import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import Auth, { authLoader } from "./pages/Auth.jsx";
import Home, { homeLoader } from "./pages/Home.jsx";
import Error from "./pages/Error.jsx";
import authService from "./services/authService";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
    children: [
      { path: "/", element: <Auth/>, loader: () => authLoader(authService)},
      { path: "/home", element: <Home />, loader: () => homeLoader(authService) } /* prettier-ignore */,
      { path: "/error/:message", element: <Error/> }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
