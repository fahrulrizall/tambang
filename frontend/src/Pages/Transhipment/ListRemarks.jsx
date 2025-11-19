import React, { useState } from "react";
import { PagedSearchRemarks, DeleteRemarks } from "../../API";
import { convertUtcUser } from "../../helpers";
import { DataTable, ModalPopUp } from "../../Components";
import FormRemarks from "./FormRemarks";
import { useApplicationStoreContext } from "../../Hook/UserHook";

export default function ListRemarks({ transhipmentUuid }) {
  const [selected, setSelected] = useState(null);
  const [isShowModal, setIsShowModal] = useState(false);
  const [isShowModalRemarks, setIsShowModalRemarks] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const { setToastInfo, setIsShowToast } = useApplicationStoreContext();

  const tableHeaders = [
    {
      name: "Descriptions",
    },
    {
      name: "Start",
    },
    {
      name: "End",
    },
    {
      name: "Net",
    },
    {
      name: "Action",
    },
  ];

  const tableBody = [
    {
      name: "descriptions",
    },
    {
      name: "start",
      view: (data) => convertUtcUser(data.start),
    },
    {
      name: "end",
      view: (data) => convertUtcUser(data.end),
    },
    {
      name: "end",
      view: (data) => {
        const start = new Date(data.start);
        const end = new Date(data.end);

        const diffMs = end - start;
        const diffHours = diffMs / (1000 * 60 * 60);

        return diffHours + " Hours";
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
    DeleteRemarks(selected.uuid)
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
        title="Remarks"
        api={PagedSearchRemarks}
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
      />
      <FormRemarks
        setSelected={setSelected}
        isOpen={isShowModalRemarks}
        toggle={setIsShowModalRemarks}
        transhipmentUuid={transhipmentUuid}
        selected={selected}
        callback={() => setRefresh(!refresh)}
      />
      <ModalPopUp
        component={component}
        isOpen={isShowModal}
        setIsOpen={setIsShowModal}
      />
    </div>
  );
}
