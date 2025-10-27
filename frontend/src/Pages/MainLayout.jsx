import React, { useState } from "react";
import { Header, Sidebar, Toaster } from "../Components";
import { Outlet } from "react-router-dom";
import { ApplicationStoreProvider } from "../Hook/UserHook";

export default function MainLayout() {
  const [isShowSidebar, setIsShowSidebar] = useState(false);

  return (
    <div className={isShowSidebar ? "toggle-sidebar" : undefined}>
      <ApplicationStoreProvider>
        <Header setIsShowSidebar={setIsShowSidebar} />
        <Sidebar setIsShowSidebar={setIsShowSidebar} />
        <Outlet />
        <Toaster />
      </ApplicationStoreProvider>
    </div>
  );
}
