import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AllRoutes from "./Routes";
import Login from "./Pages/Login";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";
import { ApplicationStoreProvider } from "./Hook/UserHook";

export default function App() {
  const accessToken = "accessToken";

  const [isValidLogin, setIsValidLogin] = useState(false);
  const [expire, setExpire] = useState();
  const accessTokenCookie = Cookies.get(accessToken);

  useEffect(() => {
    if (accessTokenCookie) {
      setIsValidLogin(true);
      const decoded = jwt_decode(accessTokenCookie);
      setExpire(decoded.exp);
    }
  }, [accessTokenCookie]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="*"
          element={
            isValidLogin ? (
              <AllRoutes />
            ) : (
              <Login setIsValidLogin={setIsValidLogin} />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
