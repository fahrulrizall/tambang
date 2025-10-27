import axios from "axios";

const _Get = (url, options) => {
  return axios.get(url, options);
};

const _Post = (url, data, config) => {
  return axios.post(url, data, config);
};

const _Put = (url, data, config) => {
  return axios.put(url, data, config);
};

const _Patch = (url, data, config) => {
  return axios.patch(url, data, config);
};

const _Delete = (url, config) => {
  return axios.delete(url, config);
};

export { _Get, _Post, _Put, _Patch, _Delete };
