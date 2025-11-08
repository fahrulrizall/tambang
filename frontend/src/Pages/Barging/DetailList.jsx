import React, { useState } from "react";
import {
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  FormControl,
} from "react-bootstrap";
import { DataTable } from "../../Components";
import { useFormik } from "formik";
import { useSearchParams } from "react-router-dom";
import { PagedSearchBargingDetail } from "../../API";
import { useApplicationStoreContext } from "../../Hook/UserHook";
import moment from "moment";
import FormDetail from "./FormDetail";

export default function DetailList() {
  const formik = useFormik({});
  const [searchParams, setSearchParams] = useSearchParams();
  const [selected, setSelected] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const uuid = searchParams.get("uuid");
  const {
    isShowModal,
    setIsShowModal,
    lastDataModificationTimestamp,
    setLastDataModificationTimestamp,
    setToastInfo,
    setIsShowToast,
  } = useApplicationStoreContext();
  const tableHeaders = [
    {
      name: "No",
    },
    {
      name: "TugBoat",
    },
    {
      name: "Barge",
    },
    {
      name: "Cargo",
    },
    {
      name: "Arrived at Jetty",
    },
    {
      name: "Commanced",
    },
    {
      name: "Completed",
    },
    {
      name: "Casted Off",
    },
    {
      name: "Remarks",
    },
    {
      name: "Action",
      style: {
        width: 10,
      },
    },
  ];

  const tableBody = [
    {
      name: "no",
    },
    {
      name: "name",
    },
    {
      name: "barge",
    },
    {
      name: "cargo",
    },
    {
      name: "arrivedatJetty",
      view: (data) =>
        data.arrivedatJetty &&
        moment(data.arrivedatJetty).format("DD/MMM/yyyy HH:mm"),
    },
    {
      name: "commanced",
      view: (data) =>
        data.commanced && moment(data.commanced).format("DD/MMM/yyyy HH:mm"),
    },
    {
      name: "completed",
      view: (data) =>
        data.completed && moment(data.completed).format("DD/MMM/yyyy HH:mm"),
    },
    {
      name: "castedOff",
      view: (data) =>
        data.castedOff && moment(data.castedOff).format("DD/MMM/yyyy HH:mm"),
    },
    {
      name: "remarks",
    },
    {
      view: (data) => (
        <div className="d-flex gap-2">
          <button
            className="btn btn-sm btn-warning"
            onClick={() => {
              setSelected(data);
              setIsOpen(true);
            }}
            style={{
              fontSize: "10px",
            }}
          >
            <i className="bi bi-pencil"></i>
          </button>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => {
              formik.setFieldValue(
                "detail",
                formik.values.detail.filter((_, index) => index !== data.index)
              );
            }}
            style={{
              fontSize: "10px",
            }}
          >
            <i className="bi bi-trash"></i>
          </button>
        </div>
      ),
    },
  ];
  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="card-title fw-bold">Barging Detail List</h5>
          <div>
            <button
              className="btn btn-danger"
              onClick={() => {
                setSearchParams();
              }}
            >
              X
            </button>
          </div>
        </div>

        <DataTable
          api={PagedSearchBargingDetail}
          tableHeader={tableHeaders}
          tableBody={tableBody}
          isSearch={true}
          dependencies={[lastDataModificationTimestamp, uuid]}
          params={{
            orderByFieldName: "no",
            sortOrder: "asc",
            bargingUuid: uuid,
          }}
          isAdd={true}
          onAdd={() => {
            setSelected();
            setIsOpen(true);
          }}
        />
      </div>
      <FormDetail
        isOpen={isOpen}
        setSelected={setSelected}
        toggle={setIsOpen}
        selected={selected}
      />
    </div>
  );
}
