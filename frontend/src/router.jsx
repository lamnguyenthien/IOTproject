import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import History from "./pages/History.jsx";
import Login from "./pages/Login.jsx";
import App from "./App.jsx";

const router = createBrowserRouter(
    createRoutesFromElements([
        <Route path="/" element={<App/>}>
            <Route index element={<Home/>}/>
            <Route path="/history" element={<History/>}/>
        </Route>,
        <Route path="/login" element={<Login/>}/>
    ])
)

export default router;