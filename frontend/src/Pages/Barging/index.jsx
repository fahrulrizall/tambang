import { PagedSearchBarging, DeleteBarging } from "../../API";
import { useState } from "react";
import Form from "./Form";
import { useApplicationStoreContext } from "../../Hook/UserHook";
import moment from "moment";
import { Row, Col } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { ModalPopUp, DataTable, Input } from "../../Components";
import DetailList from "./ListDetail";

export default function PlantTable() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const uuid = searchParams.get("uuid");
  const {
    isShowModal,
    setIsShowModal,
    lastDataModificationTimestamp,
    setLastDataModificationTimestamp,
    setToastInfo,
    setIsShowToast,
  } = useApplicationStoreContext();
  const [company, setCompany] = useState();

  const tableHeaders = [
    {
      name: "No Shipment",
    },
    {
      name: "Date",
    },
    {
      name: "Supply To MV",
    },
    {
      name: "Company",
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
      name: "date",
      view: (data) => moment(data.date).format("DD/MMM/YYYY"),
    },
    {
      name: "mv",
    },
    {
      name: "company",
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
          <button
            className="btn btn-sm btn-primary"
            onClick={() => {
              setSelected(data);
              setSearchParams({ uuid: data.uuid });
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
    DeleteBarging(selected.uuid)
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
    <main id="main" className="main">
      <section className="section">
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <h5 className="card-title fw-bold">Barging List</h5>
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
                  api={PagedSearchBarging}
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
                />
              </div>
            </div>
            {uuid && <DetailList />}
          </div>
          <Form isOpen={isOpen} selected={selected} toggle={setIsOpen} />
          <ModalPopUp
            component={component}
            isOpen={isShowModal}
            setIsOpen={setIsShowModal}
          />
        </div>
      </section>
    </main>
  );
}
