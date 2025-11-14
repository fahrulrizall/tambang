import React, { useState } from "react";
import { Row, Col } from "react-bootstrap";
import { DataTable, Input, ModalPopUp } from "../../Components";
import { useSearchParams } from "react-router-dom";
import { PagedSearchBargingDetail, DeleteBargingDetail } from "../../API";
import { useApplicationStoreContext } from "../../Hook/UserHook";
import FormDetail from "./FormDetail";
import { convertUtc, convertUtcUser } from "../../helpers";

export default function DetailList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selected, setSelected] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const uuid = searchParams.get("uuid");
  const [isShowModal, setIsShowModal] = useState(false);
  const {
    lastDataModificationTimestamp,
    setLastDataModificationTimestamp,
    setToastInfo,
    setIsShowToast,
  } = useApplicationStoreContext();
  const [total, setTotal] = useState(0);
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
      name: "Alongside",
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
      view: (data) => convertUtcUser(data.arrivedatJetty),
    },
    {
      name: "alongside",
      view: (data) => convertUtcUser(data.alongside),
    },
    {
      name: "commanced",
      view: (data) => convertUtcUser(data.commanced),
    },
    {
      name: "completed",
      view: (data) => convertUtcUser(data.completed),
    },
    {
      name: "castedOff",
      view: (data) => convertUtcUser(data.castedOff),
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

  const deleteData = () => {
    DeleteBargingDetail(selected.uuid)
      .then(() => {
        setToastInfo({
          message: "Barging successfully deleted",
          background: "success",
        });
        setIsShowToast(true);
        setIsShowModal(false);

        setLastDataModificationTimestamp(new Date().getTime());
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

  const component = () => {
    return (
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Delete Barging</h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        <div className="modal-body">Are you sure delete this Barging?</div>
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

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="card-title fw-bold">Barging Detail List</h5>
          <div>
            <button
              className="btn btn-danger btn-sm"
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
          callback={(response) => {
            setTotal(response.data.totalWeight);
          }}
          usePagination={false}
          activeClassName={(item) => {
            if (item.uuid == selected?.uuid) {
              return "active";
            }
          }}
        />
        <Row>
          <Col md={5}>
            <Input type="number" label="Total" disabled={true} value={total} />
          </Col>
        </Row>
      </div>
      <FormDetail
        isOpen={isOpen}
        setSelected={setSelected}
        toggle={(val) => {
          setSelected();
          setIsOpen(val);
        }}
        selected={selected}
      />
      <ModalPopUp
        component={component}
        isOpen={isShowModal}
        setIsOpen={setIsShowModal}
      />
    </div>
  );
}
