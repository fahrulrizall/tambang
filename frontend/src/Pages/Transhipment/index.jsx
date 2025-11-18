import { PagedSearchTranshipment, DeleteTranshipment } from "../../API";
import { useState } from "react";
import Form from "./Form";
import { useApplicationStoreContext } from "../../Hook/UserHook";
import { Input, ModalPopUp, DataTable } from "../../Components";
import { Row, Col } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import DetailList from "./ListDetail";

export default function PlantTable() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const {
    lastDataModificationTimestamp,
    setLastDataModificationTimestamp,
    setToastInfo,
    setIsShowToast,
  } = useApplicationStoreContext();
  const [company, setCompany] = useState();
  const [params, setParams] = useSearchParams();

  const uuid = params.get("uuid");

  const tableHeaders = [
    {
      name: "No Shipment",
    },
    {
      name: "Vessel",
    },
    {
      name: "Stowage Plan",
    },
    {
      name: "Loading Port",
    },
    {
      name: "Discharging Port",
    },
    {
      name: "Consignee",
    },
    {
      name: "Buyer",
    },
    {
      name: "Surveyor",
    },
    {
      name: "Notify",
    },
    {
      name: "Blending",
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
      name: "mv",
    },
    {
      name: "stowagePlan",
    },
    {
      name: "loadingPort",
    },
    {
      name: "dischargingPort",
    },
    {
      name: "consigne",
    },
    {
      name: "client",
    },
    {
      name: "surveyor",
    },
    {
      name: "notify",
    },
    {
      name: "blending",
      view: (data) => (data.blending ? "Yes" : "No"),
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
              setModalDelete(true);
            }}
            style={{
              fontSize: "10px",
            }}
          >
            <i className="bi bi-trash"></i>
          </button>
          <button
            className="btn btn-sm btn-primary"
            onClick={() => {
              setSelected(data);
              setParams({
                uuid: data.uuid,
                no: data.noBarging,
              });
            }}
            style={{
              fontSize: "10px",
            }}
          >
            <i className="bi bi-eye"></i>
          </button>
        </div>
      ),
    },
  ];

  const options = [
    {
      value: "KJB",
      label: "PT. KALTIM JAYA BARA",
    },
    {
      value: "HAA",
      label: "PT. HAMPARAN ANUGRAH ABADI",
    },
  ];

  const deleteData = () => {
    DeleteTranshipment(selected.uuid)
      .then(() => {
        setToastInfo({
          message: "Transhipment successfully deleted",
          background: "success",
        });
        setIsShowToast(true);
        setModalDelete(false);

        setLastDataModificationTimestamp(new Date().getTime());
      })
      .catch((err) => {
        setToastInfo({
          message:
            err.response.status === 403
              ? err.response?.data?.message
              : "Transhipment failed deleted",
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
            onClick={() => setModalDelete(false)}
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
    <main id="main" className="main">
      <section className="section">
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <h5 className="card-title fw-bold">Transhipment List</h5>
                </div>
                <Row>
                  <Col sm={12} md={3}>
                    <Input
                      label="Company"
                      type="select"
                      name="company"
                      onChange={(e) => {
                        setCompany(e.target.value);
                        setLastDataModificationTimestamp(new Date().getTime());
                      }}
                      value={company}
                      options={options}
                      useLabel={false}
                      placeholder="Select Company"
                    />
                  </Col>
                </Row>

                <DataTable
                  api={PagedSearchTranshipment}
                  tableHeader={tableHeaders}
                  tableBody={tableBody}
                  isSearch={true}
                  dependencies={[lastDataModificationTimestamp]}
                  params={{
                    orderByFieldName: "CreatedDateTime",
                    sortOrder: "desc",
                    company: company?.value,
                  }}
                  isAdd={true}
                  onAdd={() => {
                    setSelected();
                    setIsOpen(true);
                  }}
                  activeClassName={(item) => {
                    if (item.uuid == uuid) {
                      return "active";
                    }
                  }}
                />
              </div>
            </div>
            {uuid && (
              <DetailList selected={selected} setSelected={setSelected} />
            )}
          </div>
          <Form isOpen={isOpen} selected={selected} toggle={setIsOpen} />
          <ModalPopUp
            component={component}
            isOpen={modalDelete}
            setIsOpen={setModalDelete}
          />
        </div>
      </section>
    </main>
  );
}
