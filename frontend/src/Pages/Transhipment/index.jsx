import { PagedSearchTranshipment } from "../../API";
import DataTable from "../../Components/DataTable";
import { useState } from "react";
import Form from "./Form";
import { useApplicationStoreContext } from "../../Hook/UserHook";
import moment from "moment";
import { Input } from "../../Components";
import { Row, Col } from "react-bootstrap";

export default function PlantTable() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(false);
  const { lastDataModificationTimestamp, setLastDataModificationTimestamp } =
    useApplicationStoreContext();
  const [company, setCompany] = useState();

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
      view: (data) => data.blending?.toString(),
    },
    {
      view: (data) => (
        <button
          className="btn btn-sm btn-primary"
          onClick={() => {
            setSelected(data);
            setIsOpen(true);
          }}
          style={{
            fontSize: "10px",
          }}
        >
          <i className="bi bi-eye"></i>
        </button>
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
                />
              </div>
            </div>
          </div>
          <Form isOpen={isOpen} selected={selected} toggle={setIsOpen} />
        </div>
      </section>
    </main>
  );
}
