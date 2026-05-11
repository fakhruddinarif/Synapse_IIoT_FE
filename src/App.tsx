import { RouterProvider } from "react-router";
import { router } from "./routes/router";

/** Root application entry for routing. */
export const App = () => <RouterProvider router={router} />;
