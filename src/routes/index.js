import { Route, Routes } from "react-router-dom";

import Home from "../pages/Home";
import Register from "../pages/Register";
import Admin from "../pages/Admin";
import Private from "./Private";
import PrivateHome from "./PrivateHome";

export default function RoutesApp() {
    return (
        <Routes>
            <Route path="/" element={<PrivateHome><Home /></PrivateHome>} />
            <Route path="/register" element={<PrivateHome><Register /></PrivateHome>} />

            <Route path="/admin" element={<Private><Admin /></Private>} />
        </Routes>
    )
}