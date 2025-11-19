import React, { useState } from "react";
import { PagedSearchCargo, DeleteCargo } from "../../../API";
import { DataTable, ModalPopUp } from "../../../Components";
import Form from "./Form";
import { useApplicationStoreContext } from "../../../Hook/UserHook";

export default function ListRemarks({ transhipmentUuid }) {
  const [selected, setSelected] = useState(null);
  const [isShowModal, setIsShowModal] = useState(false);
  const [isShowModalRemarks, setIsShowModalRemarks] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const { setToastInfo, setIsShowToast } = useApplicationStoreContext();
  const [length, setLength] = useState(1);

  const tableHeaders = [
    {
      name: "No",
    },
    {
      name: "KJB",
    },
    {
      name: "HAA",
    },
    {
      name: "Total",
    },
    {
      name: "Action",
    },
  ];

  const tableBody = [
    {
      name: "no",
    },
    {
      name: "kjb",
    },
    {
      name: "haa",
    },
    {
      name: "end",
      view: (data) => {
        const start = Number(data.kjb) + Number(data.haa);
        return start;
      },
    },
    {
      view: (data) => (
        <div className="d-flex gap-2">
          <button
            className="btn btn-sm btn-warning"
            onClick={() => {
              setSelected(data);
              setIsShowModalRemarks(true);
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
              setSelected(data);
              setIsShowModal(true);
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

  const component = () => {
    return (
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Delete Remarks</h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        <div className="modal-body">Are you sure delete this Remarks?</div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setIsShowModal(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => deleteData()}
          >
            Delete
          </button>
        </div>
      </div>
    );
  };

  const deleteData = () => {
    DeleteCargo(selected.uuid)
      .then(() => {
        setToastInfo({
          message: "Barging successfully deleted",
          background: "success",
        });
        setIsShowToast(true);
        setIsShowModal(false);
        setRefresh(!refresh);
      })
      .catch((err) => {
        setToastInfo({
          message:
            err.response.status === 403
              ? err.response?.data?.message
              : "Barging failed deleted",
          background: "danger",
        });
        setIsShowToast(true);
      });
  };

  return (
    <div>
      <DataTable
        title="Cargo Per Hold"
        api={PagedSearchCargo}
        tableHeader={tableHeaders}
        tableBody={tableBody}
        isSearch={false}
        dependencies={[transhipmentUuid, refresh]}
        params={{
          orderByFieldName: "createdDateTime",
          sortOrder: "asc",
          transhipmentUuid,
        }}
        isAdd={true}
        onAdd={() => {
          setIsShowModalRemarks(true);
        }}
        usePagination={false}
        activeClassName={(item) => {
          if (item.uuid == selected?.uuid) {
            return "active";
          }
        }}
        callback={(response) => {
          setLength(response.data.data?.length || 1);
        }}
      />
      <Form
        setSelected={setSelected}
        isOpen={isShowModalRemarks}
        toggle={setIsShowModalRemarks}
        transhipmentUuid={transhipmentUuid}
        selected={selected}
        callback={() => setRefresh(!refresh)}
        length={length}
      />
      <ModalPopUp
        component={component}
        isOpen={isShowModal}
        setIsOpen={setIsShowModal}
      />
    </div>
  );
}
