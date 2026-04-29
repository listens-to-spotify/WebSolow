import { createBrowserRouter } from "react-router";
import HomePage from "../pages/HomePage/HomePage";
import AppPage from "../pages/AppPage/AppPage";
import DocsPage from "../pages/DocsPage/DocsPage";
import MathModelPage from "../pages/MathModelPage/MathModelPage";
import ArchPage from "../pages/ArchPage/ArchPage";

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
    },
    {
        path: "arch",
        Component: ArchPage,
    }
]);

export default router;
