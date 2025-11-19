import { _Delete, _Get, _Patch, _Post } from "./base";
import Cookies from "js-cookie";

const endpoint = "Remarks";

const PagedSearchRemarks = (data) => {
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

const CreateRemarks = (data) => {
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

const UpdateRemarks = (uuid, data) => {
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

const DeleteRemarks = (uuid) => {
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

const ReadRemarks = (uuid) => {
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
  PagedSearchRemarks,
  CreateRemarks,
  UpdateRemarks,
  DeleteRemarks,
  ReadRemarks,
};
