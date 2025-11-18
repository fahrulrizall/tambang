import React, { useEffect, useState } from "react";
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
  PagedSearchBargingDetailByNoMV,
  UpdateTranshipment,
} from "../../API";
import { useApplicationStoreContext } from "../../Hook/UserHook";
import FormDetail from "./FormDetail";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { convertUtcUser } from "../../helpers";
import moment from "moment";

export default function DetailList({
  selected: headerSelected,
  setSelected: setSelectedHeader,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selected, setSelected] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const uuid = searchParams.get("uuid");
  const noBarging = searchParams.get("no");
  const [isShowModal, setIsShowModal] = useState(false);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState([]);
  const [updateBarge, setUpdateBarge] = useState([]);
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
      name: "Remarks",
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
      name: "cargoOnb",
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

  useEffect(() => {
    PagedSearchBargingDetailByNoMV({
      pageIndex: 0,
      pageSize: 1000,
      noBarging,
    }).then((res) => {
      const bargeList = new Set(data.map((x) => x.barge.toLowerCase()));
      const alldata = res.data.data;

      const updated = alldata.filter(
        (a) => !bargeList.has(a.barge.toLowerCase())
      );
      setUpdateBarge(updated);
    });
  }, [data]);

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
                  <div>
                    <button
                      className="btn btn-primary me-2"
                      onClick={() => {
                        UpdateTranshipment(uuid, headerSelected)
                          .then((response) => {
                            setToastInfo({
                              message: "Barging successfully update",
                              background: "success",
                            });
                            setIsShowToast(true);
                            setLastDataModificationTimestamp(
                              new Date().getTime()
                            );
                          })
                          .catch((err) => {
                            setToastInfo({
                              message:
                                err.response.status === 403
                                  ? err.response?.data?.message
                                  : "Barging failed update",
                              background: "danger",
                            });
                            setIsShowToast(true);
                          });
                      }}
                    >
                      Save
                    </button>
                    <CopySummaryButton data={data} header={headerSelected} />
                  </div>
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
                        <td>{headerSelected?.tendered} :</td>
                        <td>
                          {moment(headerSelected?.norTendered).format(
                            "DD-MM-YYYY HH:mm"
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>Previous Cargo :</td>
                        <td className="d-flex">
                          <input
                            type="text"
                            className="form-control w-50"
                            value={headerSelected?.prevCargo}
                            onChange={(e) =>
                              setSelectedHeader((prev) => ({
                                ...prev,
                                prevCargo: e.target.value,
                              }))
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Cargo Onboard :</td>
                        <td>{total}</td>
                      </tr>
                      <tr>
                        <td>Balance Cargo :</td>
                        <td>{headerSelected?.stowagePlan - total}</td>
                      </tr>
                      <tr>
                        <td>Loading Rate DTD :</td>
                        <td className="d-flex">
                          <input
                            type="number"
                            className="form-control w-50"
                            value={headerSelected?.loadingRateDTD}
                            onChange={(e) =>
                              setSelectedHeader((prev) => ({
                                ...prev,
                                loadingRateDTD: e.target.value,
                              }))
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Loading Rate PTD :</td>
                        <td className="d-flex">
                          <input
                            type="number"
                            className="form-control w-50"
                            value={headerSelected?.loadingRatePTD}
                            onChange={(e) =>
                              setSelectedHeader((prev) => ({
                                ...prev,
                                loadingRatePTD: e.target.value,
                              }))
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>TPH :</td>
                        <td className="d-flex gap-2">
                          <p className="fs-5">{total || 0}/</p>
                          <input
                            type="number"
                            className="form-control w-50"
                            value={headerSelected?.tph}
                            onChange={(e) =>
                              setSelectedHeader((prev) => ({
                                ...prev,
                                tph: e.target.value,
                              }))
                            }
                          />
                          <p className="fs-5">
                            {" "}
                            ={(total || 0) / Number(headerSelected?.tph || 0)}
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td>Commenced Loading :</td>
                        <td>
                          {moment(data[0]?.commanced).format(
                            "DD-MM-YYYY HH:mm"
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>Est Completed Loading :</td>
                        <td>
                          <input
                            type="datetime-local"
                            className="form-control w-50"
                            value={moment(
                              headerSelected?.completedLoading
                            ).format("yyyy-MM-DD HH:mm")}
                            onChange={(e) =>
                              setSelectedHeader((prev) => ({
                                ...prev,
                                completedLoading: e.target.value,
                              }))
                            }
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div>
                  <div class="section-title">Remarks :</div>
                  {/* <table class="table table-bordered table-sm align-middle">
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
                  </table> */}
                </div>

                <div>
                  <div class="section-title">Cargo per Barge :</div>
                  <table class="table table-borderless table-sm">
                    <tbody>
                      {data.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td>{item.barge}</td>
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
                      {/* <strong>H1</strong> */}
                      <br />
                      {/* KJB : <br />
                      HAA : <br />
                      Total :{" "} */}
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
                      {updateBarge.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td>{item?.no}</td>
                            <td>{item?.name}</td>
                            <td>{item?.barge}</td>
                            <td>{item?.cargo}</td>
                            <td>{item?.remarks}</td>
                          </tr>
                        );
                      })}
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
        toggle={(val) => {
          setSelected();
          setIsOpen(val);
        }}
        selected={selected}
        nextNo={data?.length + 1}
      />
      <ModalPopUp
        component={component}
        isOpen={isShowModal}
        setIsOpen={setIsShowModal}
      />
    </div>
  );
}
