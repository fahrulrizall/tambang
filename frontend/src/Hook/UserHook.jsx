import React, { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";

const accessToken = "accessToken";

const context = {
  lastDataModificationTimestamp: 0,
  setLastDataModificationTimestamp: () => {},
  isShowModal: false,
  setIsShowModal: () => {},
  isShowToast: false,
  setIsShowToast: () => {},
  toastInfo: "",
  setToastInfo: () => {},
};

const ApplicationStoreContext = createContext(context);

export const ApplicationStoreProvider = ({ children }) => {
  const initialToast = {
    message: "",
    background: "",
  };
  const [lastDataModificationTimestamp, setLastDataModificationTimestamp] =
    useState(0);
  const [isShowModal, setIsShowModal] = useState(false);
  const [isShowToast, setIsShowToast] = useState(false);
  const [toastInfo, setToastInfo] = useState(initialToast);
  const [plant, setPlant] = useState();

  useEffect(() => {
    const accessTokenCookie = Cookies.get(accessToken);
    const decoded = jwt_decode(accessTokenCookie);
    setPlant({
      code: decoded.plant,
      uuid: decoded.plantUuid,
    });
  }, [Cookies.get(accessToken)]);

  return (
    <ApplicationStoreContext.Provider
      value={{
        lastDataModificationTimestamp,
        setLastDataModificationTimestamp,
        isShowModal,
        setIsShowModal,
        isShowToast,
        setIsShowToast,
        toastInfo,
        setToastInfo,
        plant,
      }}
    >
      {children}
    </ApplicationStoreContext.Provider>
  );
};

export const useApplicationStoreContext = () =>
  useContext(ApplicationStoreContext);
