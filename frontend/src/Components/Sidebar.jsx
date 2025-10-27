import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar({ setIsShowSidebar }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState("");
  const inventoryRef = useRef();
  const sidebarRef = useRef(null);

  useEffect(() => {
    setActive(location.pathname.substring(1));
  }, [location]);

  // useEffect(() => {
  //   function handleClickOutside(event) {
  //     if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
  //       setIsShowSidebar(false);
  //     }
  //   }

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, []);

  return (
    <aside id="sidebar" className="sidebar" ref={sidebarRef}>
      <ul className="sidebar-nav" id="sidebar-nav">
        <li className="nav-item">
          <a
            className={`nav-link ${active === "dashboard" ? "" : "collapsed"}`}
            href="#"
          >
            <i className="bi bi-grid"></i>
            <span>Dashboard</span>
          </a>
        </li>

        <li className="nav-item">
          <a
            className={`nav-link ${active === "tugboat" ? "" : "collapsed"}`}
            data-bs-target="#components-nav"
            data-bs-toggle="collapse"
            href="/tugboat"
            onClick={(e) => {
              e.preventDefault();
              navigate("/tugboat");
            }}
          >
            <i className="bi bi-building-gear"></i>
            <span>TubBoat</span>
          </a>
        </li>

        <li className="nav-item">
          <a
            className={`nav-link ${active === "barging" ? "" : "collapsed"}`}
            data-bs-target="#components-nav"
            data-bs-toggle="collapse"
            href="/barging"
            onClick={(e) => {
              e.preventDefault();
              navigate("/barging");
            }}
          >
            <i className="bi bi-building-gear"></i>
            <span>Barging</span>
          </a>
        </li>

        <li className="nav-item">
          <a
            className={`nav-link ${
              active === "transhipment" ? "" : "collapsed"
            }`}
            data-bs-target="#components-nav"
            data-bs-toggle="collapse"
            href="/transhipment"
            onClick={(e) => {
              e.preventDefault();
              navigate("/transhipment");
            }}
          >
            <i className="bi bi-building-gear"></i>
            <span>Transhipment</span>
          </a>
        </li>
      </ul>
    </aside>
  );
}
