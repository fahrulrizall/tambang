import React, { useState, useEffect } from "react";
import Select from "react-select";
import { AsyncPaginate } from "react-select-async-paginate";

const Default = ({
  label,
  type,
  onChange,
  value,
  placeholder,
  errorMessage,
  isError,
  name,
  disabled,
  containerClassName,
  labelClassName,
  inputClassName,
  useLabel = true,
  ...rest
}) => {
  return (
    <div className={containerClassName ? containerClassName : "row mb-3"}>
      {useLabel && (
        <label
          htmlFor={label}
          className={`col-sm-3 col-form-label ${labelClassName}`}
        >
          {label}
        </label>
      )}
      <div
        className={useLabel ? "col-sm-9" : "col-sm-12"}
        style={{ position: "relative" }}
      >
        <input
          disabled={disabled}
          type={type}
          name={name}
          className={`form-control ${inputClassName} ${
            isError && "border border-danger"
          }`}
          value={value}
          onChange={(event) => {
            onChange(event);
          }}
          placeholder={placeholder}
          {...rest}
        />
        {isError && (
          <p
            className="text-danger"
            style={{ fontSize: "11px", position: "absolute" }}
          >
            {errorMessage}
          </p>
        )}
      </div>
    </div>
  );
};

const SelectInput = ({
  label,
  id,
  onChange,
  value,
  options,
  errorMessage,
  isError,
  name,
  placeholder,
  disabled,
  useLabel = true,
  containerClassName,
}) => {
  return (
    <div className={containerClassName ? containerClassName : "row mb-3"}>
      {useLabel && (
        <label htmlFor={id} className="col-sm-3 col-form-label">
          {label}
        </label>
      )}
      <div className={useLabel ? "col-sm-9" : "col-sm-12"}>
        <Select
          value={value}
          name={name}
          options={options}
          className={`basic-multi-select ${
            isError && "border border-danger rounded"
          }`}
          isClearable={true}
          isDisabled={disabled}
          onChange={(event) => {
            const newEvent = {
              target: {
                value: event,
                name: name,
              },
              key: "onChange",
            };
            onChange(newEvent);
          }}
          placeholder={placeholder}
        />
        {isError && (
          <p
            className="text-danger"
            style={{ fontSize: "11px", position: "absolute" }}
          >
            {errorMessage}
          </p>
        )}
      </div>
    </div>
  );
};

const SelectAPI = ({
  label,
  id,
  onChange,
  value,
  options,
  errorMessage,
  isError,
  name,
  placeholder,
  disabled,
  useLabel = true,
  api,
  handleSetOptions,
  additionalParams,
  containerClassName,
}) => {
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    setReloadKey((prevKey) => prevKey + 1);
  }, [additionalParams, value]);

  async function loadOptions(search, loadedOptions, { page }) {
    try {
      const response = await api({
        pageIndex: page,
        pageSize: 10,
        keyword: search,
        ...additionalParams,
      });

      return {
        options: response.data.data.map((item) => handleSetOptions(item)),
        hasMore: response.data.totalCount > (page + 1) * 10,
        additional: {
          page: page + 1,
        },
      };
    } catch (ex) {
      return {
        options: [],
        hasMore: false,
        additional: {
          page: 0,
        },
      };
    }
  }

  return (
    <div className={containerClassName ? containerClassName : "row mb-3"}>
      {useLabel && (
        <label htmlFor={id} className="col-sm-3 col-form-label">
          {label}
        </label>
      )}
      <div className={useLabel ? "col-sm-9" : "col-sm-12"}>
        <AsyncPaginate
          key={reloadKey}
          id={name}
          loadOptions={loadOptions}
          value={value}
          name={name}
          options={options}
          className={`basic-multi-select ${
            isError && "border border-danger rounded"
          }`}
          additional={{
            page: 0,
          }}
          isDisabled={disabled}
          onChange={(e) => {
            const newEvent = {
              target: {
                value: e,
                name: name,
              },
              key: "onChange",
            };
            onChange(newEvent);
          }}
          placeholder={placeholder}
        />
        {isError && (
          <p
            className="text-danger"
            style={{ fontSize: "11px", position: "absolute" }}
          >
            {errorMessage}
          </p>
        )}
      </div>
    </div>
  );
};

const CheckboxInput = ({
  label,
  options,
  value,
  onChange,
  name,
  isError,
  errorMessage,
  useLabel = true,
  containerClassName,
}) => {
  return (
    <div className={containerClassName ? containerClassName : "row mb-3"}>
      {useLabel && <label className="col-sm-3 col-form-label">{label}</label>}
      <div className={useLabel ? "col-sm-9" : "col-sm-12"}>
        {options.map((item, index) => {
          return (
            <div className="form-check" key={index}>
              <input
                className="form-check-input"
                type="radio"
                name={name}
                id={`gridRadios${index}`}
                value={item}
                checked={item === value}
                onChange={onChange}
              />
              <label
                className="form-check-label"
                htmlFor={`gridRadios${index}`}
              >
                {item}
              </label>
            </div>
          );
        })}
        {isError && (
          <p
            className="text-danger"
            style={{ fontSize: "11px", position: "absolute" }}
          >
            {errorMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default function Input(props) {
  if (props.type === "select") {
    return SelectInput(props);
  }
  if (props.type === "select-api") {
    return SelectAPI(props);
  }
  if (props.type === "checkbox") {
    return CheckboxInput(props);
  }
  return Default(props);
}
