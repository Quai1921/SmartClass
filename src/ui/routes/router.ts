import { createBrowserRouter } from "react-router";
import App from "../App";
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import { MainLayout } from "../layout/MainLayout";
import HomePage from "../pages/home/HomePage";
import InstitucionPage from "../pages/admin/InstitucionPage";
import { ImageWidgetTest } from "../pages/ImageWidgetTest";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: App,

    },
    {
        path: "/login",
        Component: LoginPage,

    },
    {
        path: "/register/:id",
        Component: RegisterPage,    },
    {
        path: "/image-widget-test",
        Component: ImageWidgetTest,
    },
    {
        path: "",
        Component: MainLayout,        children:
            [
                { path: "home", Component: HomePage },
                { path: "instituciones", Component: InstitucionPage },
                { path: "image-widget-test", Component: ImageWidgetTest },
            ],
    }
]);
