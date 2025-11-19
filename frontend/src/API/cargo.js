import { _Delete, _Get, _Patch, _Post } from "./base";
import Cookies from "js-cookie";

const endpoint = "Cargo";

const PagedSearchCargo = (data) => {
  let accessToken = Cookies.get("accessToken");
  let _options = {
    headers: {
      contentType: "application/json",
      authorization: `bearer ${accessToken}`,
    },
    withCredentials: true,
  };
  return _Get(
    `${process.env.REACT_APP_API_URL}/${endpoint}/list/${data.transhipmentUuid}`,
    {
      params: {
        ...data,
      },
      ..._options,
    }
  );
};

const CreateCargo = (data) => {
  let accessToken = Cookies.get("accessToken");
  let _options = {
    headers: {
      contentType: "application/json",
      authorization: `bearer ${accessToken}`,
    },
    withCredentials: true,
  };
  return _Post(`${process.env.REACT_APP_API_URL}/${endpoint}`, data, _options);
};

const UpdateCargo = (uuid, data) => {
  let accessToken = Cookies.get("accessToken");
  let _options = {
    headers: {
      contentType: "application/json",
      authorization: `bearer ${accessToken}`,
    },
    withCredentials: true,
  };
  return _Patch(
    `${process.env.REACT_APP_API_URL}/${endpoint}/${uuid}`,
    data,
    _options
  );
};

const DeleteCargo = (uuid) => {
  let accessToken = Cookies.get("accessToken");
  let _options = {
    headers: {
      contentType: "application/json",
      authorization: `bearer ${accessToken}`,
    },
    withCredentials: true,
  };
  return _Delete(
    `${process.env.REACT_APP_API_URL}/${endpoint}/${uuid}`,
    _options
  );
};

const ReadCargo = (uuid) => {
  let accessToken = Cookies.get("accessToken");
  let _options = {
    headers: {
      contentType: "application/json",
      authorization: `bearer ${accessToken}`,
    },
    withCredentials: true,
  };
  return _Get(`${process.env.REACT_APP_API_URL}/${endpoint}/${uuid}`, {
    ..._options,
  });
};

export { PagedSearchCargo, CreateCargo, UpdateCargo, DeleteCargo, ReadCargo };
