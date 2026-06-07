import { createBrowserRouter } from "react-router";
import HomePage from "../pages/HomePage/HomePage";
import AppPage from "../pages/AppPage/AppPage";
import MathModelPage from "../pages/MathModelPage/MathModelPage";

const router = createBrowserRouter([
    {
        path: "/",
        Component: HomePage,
    },
    {
        path: "/app",
        Component: AppPage,
    },
    {
        path: "/mathmodel",
        Component: MathModelPage,
    }
], {
    basename: import.meta.env.BASE_URL,
});

export default router;
