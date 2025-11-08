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

const PagedSearchTranshipmentDetail = (data) => {
  let accessToken = Cookies.get("accessToken");
  let _options = {
    headers: {
      contentType: "application/json",
      authorization: `bearer ${accessToken}`,
    },
    withCredentials: true,
  };
  return _Get(
    `${process.env.REACT_APP_API_URL}/${endpoint}/list/detail/${data.transhipmentUuid}`,
    {
      params: {
        ...data,
      },
      ..._options,
    }
  );
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

const CreateTranshipmentDetail = (data) => {
  let accessToken = Cookies.get("accessToken");
  let _options = {
    headers: {
      contentType: "application/json",
      authorization: `bearer ${accessToken}`,
    },
    withCredentials: true,
  };
  return _Post(
    `${process.env.REACT_APP_API_URL}/${endpoint}/detail`,
    data,
    _options
  );
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
const UpdateTranshipmentDetail = (uuid, data) => {
  let accessToken = Cookies.get("accessToken");
  let _options = {
    headers: {
      contentType: "application/json",
      authorization: `bearer ${accessToken}`,
    },
    withCredentials: true,
  };
  return _Patch(
    `${process.env.REACT_APP_API_URL}/${endpoint}/detail/${uuid}`,
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

const DeleteTranshipmentDetail = (uuid) => {
  let accessToken = Cookies.get("accessToken");
  let _options = {
    headers: {
      contentType: "application/json",
      authorization: `bearer ${accessToken}`,
    },
    withCredentials: true,
  };
  return _Delete(
    `${process.env.REACT_APP_API_URL}/${endpoint}/detail/${uuid}`,
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

const ReadTranshipmentDetail = (uuid) => {
  let accessToken = Cookies.get("accessToken");
  let _options = {
    headers: {
      contentType: "application/json",
      authorization: `bearer ${accessToken}`,
    },
    withCredentials: true,
  };
  return _Get(`${process.env.REACT_APP_API_URL}/${endpoint}/detail/${uuid}`, {
    ..._options,
  });
};

export {
  PagedSearchTranshipment,
  PagedSearchTranshipmentDetail,
  CreateTranshipment,
  CreateTranshipmentDetail,
  UpdateTranshipment,
  UpdateTranshipmentDetail,
  DeleteTranshipment,
  DeleteTranshipmentDetail,
  ReadTranshipment,
  ReadTranshipmentDetail,
};
