import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import Dropdown from "react-bootstrap/Dropdown";
import { useNavigate } from "react-router-dom";
import { HandleLogout } from "../API";
import kjb from "../asset/kjb.png";

export default function Header({ setIsShowSidebar }) {
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const accessToken = "accessToken";

  useEffect(() => {
    const token = Cookies.get(accessToken);
    setUser(jwtDecode(token));
  }, []);

  const handleSignOut = () => {
    HandleLogout().then((response) => {
      navigate("/");
      Cookies.remove(accessToken);
      window.location.reload();
    });
  };

  return (
    <header id="header" className="header fixed-top d-flex align-items-center">
      <div className="d-flex align-items-center justify-content-between">
        <a href="index.html" className="logo d-flex align-items-center">
          <img src={kjb} alt="" />
          <span className="d-none d-lg-block fs-5">Kaltim Jaya Bara </span>
        </a>
        <a onClick={() => setIsShowSidebar((prev) => !prev)}>
          <i className="bi bi-list toggle-sidebar-btn"></i>
        </a>
      </div>

      <nav className="header-nav ms-auto">
        <ul className="d-flex align-items-center">
          <Dropdown className="nav-item pe-3" as={"li"}>
            <a
              className="nav-link nav-profile d-flex align-items-center pe-0"
              href=""
              data-bs-toggle="dropdown"
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              <Dropdown.Toggle className="d-none d-md-block ps-2" as="span">
                {user && user.username}
              </Dropdown.Toggle>
            </a>

            <Dropdown.Menu className="dropdown-menu-arrow profile" as="ul">
              <li>
                <Dropdown.Item
                  className="dropdown-item d-flex align-items-center"
                  as="a"
                  href=""
                  onClick={(e) => {
                    e.preventDefault();
                    handleSignOut();
                  }}
                >
                  <i className="bi bi-box-arrow-right"></i>
                  <span>Sign Out</span>
                </Dropdown.Item>
              </li>
            </Dropdown.Menu>
          </Dropdown>
        </ul>
      </nav>
    </header>
  );
}
