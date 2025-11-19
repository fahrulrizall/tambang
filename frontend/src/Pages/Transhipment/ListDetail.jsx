import { useState } from "react";
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
  UpdateTranshipment,
} from "../../API";
import { useApplicationStoreContext } from "../../Hook/UserHook";
import FormDetail from "./FormDetail";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { convertUtcUser } from "../../helpers";
import moment from "moment";
import ListRemarks from "./Remarks";
import CargoBarge from "./CargoBarge";
import UpdateBarge from "./UpdateBarge";
import CargoHold from "./CargoHold";

export default function DetailList({
  selected: headerSelected,
  setSelected: setSelectedHeader,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selected, setSelected] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const uuid = searchParams.get("uuid");

  const [isShowModal, setIsShowModal] = useState(false);
  const [total, setTotal] = useState(0);
  const [totalHours, setTotalHours] = useState(0);
  const [totalHoursTPH, setTotalHoursTPH] = useState(0);
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
                const data = response.data;
                setData(data.data);
                setTotal(data.totalWeight || 0);

                let totalHours = 0;

                data.data.forEach((item) => {
                  const start = new Date(item?.commanced);
                  const end = new Date(item?.completed);

                  const diffMs = end - start;
                  const diffHours = diffMs / (1000 * 60 * 60);
                  totalHours += diffHours;
                });

                setTotalHours(totalHours);
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
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold">SUMMARY</h5>
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
                  <div className="section-title">
                    Discharge, {headerSelected?.dischargingPort}
                  </div>
                  <table className="table table-borderless summary-table">
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
                        <td>
                          {parseFloat(
                            headerSelected?.stowagePlan - total
                          ).toFixed(3)}
                        </td>
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
                          {parseFloat(
                            total / (totalHours - totalHoursTPH)
                          ).toFixed(3)}
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

                <ListRemarks
                  transhipmentUuid={uuid}
                  setTotalHours={setTotalHoursTPH}
                />
                <CargoBarge data={data} />
                <CargoHold transhipmentUuid={uuid} />
                <UpdateBarge />
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
