import React, { useState } from "react";
import { Row, Col } from "react-bootstrap";
import {
  DataTable,
  Input,
  ModalPopUp,
  CopySummaryButton,
} from "../../Components";
import { useSearchParams } from "react-router-dom";
import {
  PagedSearchTranshipmentDetail,
  DeleteTranshipmentDetail,
} from "../../API";
import { useApplicationStoreContext } from "../../Hook/UserHook";
import moment from "moment";
import FormDetail from "./FormDetail";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

export default function DetailList({ selected: headerSelected }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selected, setSelected] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const uuid = searchParams.get("uuid");
  const [isShowModal, setIsShowModal] = useState(false);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState([]);
  const {
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
      name: "Arrived",
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
      name: "Cargo Onb",
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
      name: "name",
    },
    {
      name: "barge",
    },
    {
      name: "arrivedatJetty",
      view: (data) =>
        data.arrivedatJetty &&
        moment(data.arrivedatJetty).format("DD-MM-yyyy HH:mm"),
    },
    {
      name: "alongside",
      view: (data) =>
        data.alongside && moment(data.alongside).format("DD-MM-yyyy HH:mm"),
    },
    {
      name: "commanced",
      view: (data) =>
        data.commanced && moment(data.commanced).format("DD-MM-yyyy HH:mm"),
    },
    {
      name: "completed",
      view: (data) =>
        data.completed && moment(data.completed).format("DD-MM-yyyy HH:mm"),
    },
    {
      name: "castedOff",
      view: (data) =>
        data.castedOff && moment(data.castedOff).format("DD-MM-yyyy HH:mm"),
    },
    {
      name: "cargoOnb",
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
    DeleteTranshipmentDetail(selected.uuid)
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
          <h5 className="modal-title">Delete Transhipment</h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        <div className="modal-body">Are you sure delete this Transhipment?</div>
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
          <h5 className="card-title fw-bold">Transhipment Detail List</h5>
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
        <Tabs
          defaultActiveKey="home"
          id="uncontrolled-tab-example"
          className="mb-3"
        >
          <Tab eventKey="home" title="Detail">
            <DataTable
              api={PagedSearchTranshipmentDetail}
              tableHeader={tableHeaders}
              tableBody={tableBody}
              isSearch={true}
              dependencies={[lastDataModificationTimestamp, uuid]}
              params={{
                orderByFieldName: "no",
                sortOrder: "asc",
                transhipmentUuid: uuid,
              }}
              isAdd={true}
              onAdd={() => {
                setSelected();
                setIsOpen(true);
              }}
              callback={(response) => {
                setData(response.data.data);
                setTotal(
                  response.data.data.reduce(
                    (sum, item) => sum + Number(item.cargoOnb),
                    0
                  )
                );
              }}
            />
            <Row>
              <Col md={5}>
                <Input
                  type="number"
                  label="Total"
                  disabled={true}
                  value={total}
                />
              </Col>
            </Row>
          </Tab>
          <Tab eventKey="profile" title="Summarize">
            <div className="row">
              <div className="col-md-8">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <h5 class="fw-bold">SUMMARY</h5>
                  <CopySummaryButton data={data} header={headerSelected} />
                </div>
                <div>
                  <div class="section-title">
                    Discharge, {headerSelected?.dischargingPort}
                  </div>
                  <table class="table table-borderless summary-table">
                    <tbody>
                      <tr>
                        <td>Stowage Plan :</td>
                        <td>{headerSelected?.stowagePlan}</td>
                      </tr>
                      <tr>
                        <td>NOR Tendered :</td>
                        <td>{headerSelected?.norTendered}</td>
                      </tr>
                      <tr>
                        <td>Previous Cargo :</td>
                        <td>-</td>
                      </tr>
                      <tr>
                        <td>Cargo Onboard :</td>
                        <td>
                          {data.reduce((acc, item) => acc + item.cargoOnb, 0)}
                        </td>
                      </tr>
                      <tr>
                        <td>Balance Cargo :</td>
                        <td>
                          {headerSelected?.stowagePlan -
                            data.reduce((acc, item) => acc + item.cargoOnb, 0)}
                        </td>
                      </tr>
                      <tr>
                        <td>Loading Rate DTD :</td>
                        <td>-</td>
                      </tr>
                      <tr>
                        <td>Loading Rate PTD :</td>
                        <td>
                          {(data.reduce((acc, item) => acc + item.cargoOnb, 0) *
                            24) /
                            12}
                        </td>
                      </tr>
                      <tr>
                        <td>TPH :</td>
                        <td>982</td>
                      </tr>
                      <tr>
                        <td>Commenced Loading :</td>
                        <td>211025 19:00</td>
                      </tr>
                      <tr>
                        <td>Est Completed Loading :</td>
                        <td>261025 19:00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div>
                  <div class="section-title">Remarks :</div>
                  <table class="table table-bordered table-sm align-middle">
                    <thead class="table-light">
                      <tr>
                        <th>Description</th>
                        <th>Start</th>
                        <th>End</th>
                        <th>Nett</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Heavy Rain</td>
                        <td>201025 19:45</td>
                        <td>201025 20:45</td>
                        <td>00:01:00</td>
                      </tr>
                      <tr>
                        <td>Waiting Barge</td>
                        <td>201025 23:45</td>
                        <td>211025 08:45</td>
                        <td>00:09:00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div>
                  <div class="section-title">Cargo per Barge :</div>
                  <table class="table table-borderless table-sm">
                    <tbody>
                      {data.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td>{item.name}</td>
                            <td>{item.cargoOnb}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div class="section-title">Cargo per Hold :</div>
                <div class="row">
                  <div class="col-md-4">
                    <p>
                      <strong>H1</strong>
                      <br />
                      KJB : <br />
                      HAA : <br />
                      Total :{" "}
                    </p>
                  </div>
                </div>

                <div>
                  <div class="section-title">Update Barge :</div>
                  <table class="table table-bordered table-sm align-middle">
                    <thead class="table-light">
                      <tr>
                        <th>No</th>
                        <th>Tug Boat</th>
                        <th>Barge</th>
                        <th>Cargo</th>
                        <th>Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>5</td>
                        <td>TB Prima Star 64</td>
                        <td>BG Prima Sakti 22</td>
                        <td>5,890.260</td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>6</td>
                        <td>TB Prima Star 65</td>
                        <td>BG Prima Sakti 23</td>
                        <td>5,890.261</td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Tab>
        </Tabs>
      </div>
      <FormDetail
        isOpen={isOpen}
        setSelected={setSelected}
        toggle={setIsOpen}
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
