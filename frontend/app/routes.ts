import { createBrowserRouter } from "react-router";
import HomePage from "../pages/HomePage/HomePage";
import AppPage from "../pages/AppPage/AppPage";
import DocsPage from "../pages/DocsPage/DocsPage";
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
        path: "/docs",
        Component: DocsPage,
    },
    {
        path: "/mathmodel",
        Component: MathModelPage,
    }
]);

export default router;
