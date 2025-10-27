import React, { useState } from "react";
import { HandleLogin } from "../API";
import Cookies from "js-cookie";

export default function Login({ setIsValidLogin }) {
  const initial = {
    username: "username",
    password: "password",
  };

  const accessToken = "accessToken";

  const [user, setUser] = useState(initial);
  const [isSuccess, setIsSuccess] = useState(true);
  const [isloading, setIsLoading] = useState(false);

  const onClickLogin = async () => {
    setIsLoading(true);

    HandleLogin(user)
      .then((res) => {
        setIsValidLogin(true);
        Cookies.set(accessToken, res.data.accessToken);
      })
      .catch((error) => {
        setIsLoading(false);
        setIsSuccess(false);
      });
  };

  return (
    <div className="container">
      <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
              <div className="d-flex justify-content-center py-4">
                <a
                  href="index.html"
                  className="logo d-flex align-items-center w-auto"
                >
                  <img src="assets/img/logo.png" alt="" />
                  <span className="d-none d-lg-block">Traceback</span>
                </a>
              </div>

              <div className="card mb-3">
                <div className="card-body">
                  <div className="pt-4 pb-2">
                    <h5 className="card-title text-center pb-0 fs-4">
                      Login to Your Account
                    </h5>
                    <p className="text-center small">
                      Enter your username &amp; password to login
                    </p>
                  </div>

                  <form className="row g-3 needs-validation" noValidate="">
                    <div className="col-12">
                      <label htmlFor="yourUsername" className="form-label">
                        Username
                      </label>
                      <div className="input-group has-validation">
                        <input
                          type="text"
                          name="username"
                          className="form-control"
                          id="yourUsername"
                          required=""
                          value={user.username}
                          onChange={(e) =>
                            setUser({ ...user, username: e.target.value })
                          }
                        />
                        <div className="invalid-feedback">
                          Please enter your username.
                        </div>
                      </div>
                    </div>

                    <div className="col-12">
                      <label htmlFor="yourPassword" className="form-label">
                        Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        className="form-control"
                        id="yourPassword"
                        required=""
                        onChange={(e) =>
                          setUser({ ...user, password: e.target.value })
                        }
                      />
                      <div className="invalid-feedback">
                        Please enter your password!
                      </div>
                    </div>
                    <div className="col-12">
                      <button
                        className="btn btn-primary w-100"
                        type="submit"
                        onClick={(e) => {
                          e.preventDefault();
                          onClickLogin();
                        }}
                      >
                        {isloading ? (
                          <span
                            className="spinner-border"
                            style={{ height: "1.5rem", width: "1.5rem" }}
                          ></span>
                        ) : (
                          "Login"
                        )}
                      </button>
                    </div>
                    {!isSuccess && (
                      <div className="col-12">
                        <p className="text-danger text-center">
                          wrong email or password
                        </p>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
