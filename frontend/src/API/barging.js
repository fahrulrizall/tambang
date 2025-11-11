import { _Delete, _Get, _Patch, _Post } from "./base";
import Cookies from "js-cookie";

const endpoint = "barging";

const PagedSearchBarging = (data) => {
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

const PagedSearchBargingGroup = (data) => {
  let accessToken = Cookies.get("accessToken");
  let _options = {
    headers: {
      contentType: "application/json",
      authorization: `bearer ${accessToken}`,
    },
    withCredentials: true,
  };
  return _Get(`${process.env.REACT_APP_API_URL}/${endpoint}/list/group`, {
    params: {
      ...data,
    },
    ..._options,
  });
};

const PagedSearchBargingDetail = (data) => {
  let accessToken = Cookies.get("accessToken");
  let _options = {
    headers: {
      contentType: "application/json",
      authorization: `bearer ${accessToken}`,
    },
    withCredentials: true,
  };
  return _Get(
    `${process.env.REACT_APP_API_URL}/${endpoint}/list/detail/${data.bargingUuid}`,
    {
      params: {
        ...data,
      },
      ..._options,
    }
  );
};

const CreateBarging = (data) => {
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

const CreateBargingDetail = (data) => {
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

const UpdateBarging = (uuid, data) => {
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

const UpdateBargingDetail = (uuid, data) => {
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

const DeleteBarging = (uuid) => {
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

const DeleteBargingDetail = (uuid) => {
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

const ReadBarging = (uuid) => {
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

const ReadBargingDetail = (uuid) => {
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
  PagedSearchBarging,
  PagedSearchBargingDetail,
  CreateBarging,
  CreateBargingDetail,
  UpdateBarging,
  UpdateBargingDetail,
  DeleteBarging,
  DeleteBargingDetail,
  ReadBarging,
  ReadBargingDetail,
  PagedSearchBargingGroup,
};
