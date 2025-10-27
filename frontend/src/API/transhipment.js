import { _Delete, _Get, _Patch, _Post } from "./base";
import Cookies from "js-cookie";

const endpoint = "transhipment";

const PagedSearchTranshipment = (data) => {
  let accessToken = Cookies.get("accessToken");
  let _options = {
    headers: {
      contentType: "application/json",
      authorization: `bearer ${accessToken}`,
    },
    withCredentials: true,
  };
  return _Get(`${process.env.REACT_APP_API_URL}/${endpoint}/list`, {
    params: {
      ...data,
    },
    ..._options,
  });
};

const CreateTranshipment = (data) => {
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

const UpdateTranshipment = (uuid, data) => {
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

const DeleteTranshipment = (uuid) => {
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

const ReadTranshipment = (uuid) => {
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

export {
  PagedSearchTranshipment,
  CreateTranshipment,
  UpdateTranshipment,
  DeleteTranshipment,
  ReadTranshipment,
};
