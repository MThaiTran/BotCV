import { createBrowserRouter } from "react-router-dom";
import { publicRoutes } from "./routes";
import App from "../App";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: publicRoutes,
  },
]);
