import { PagedSearchTugBoat } from "../../API";
import DataTable from "../../Components/DataTable";
import { useState } from "react";
import Form from "./Form";
import { useApplicationStoreContext } from "../../Hook/UserHook";

export default function PlantTable() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(false);
  const { lastDataModificationTimestamp } = useApplicationStoreContext();

  const tableHeaders = [
    {
      name: "Name",
    },
    {
      name: "GT",
    },
    {
      name: "P.TB",
    },
    {
      name: "Barge",
    },
    {
      name: "GT",
    },
    {
      name: "P.BG",
    },
    {
      name: "Feet",
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
      name: "name",
    },
    {
      name: "gttb",
    },
    {
      name: "ptb",
    },
    {
      name: "barge",
    },
    {
      name: "gtbg",
    },
    {
      name: "pbg",
    },
    {
      name: "feet",
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

  return (
    <main id="main" className="main">
      {/* <div className="pagetitle">
        <h1>Tug Boat</h1>
      </div> */}
      <section className="section">
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <h5 className="card-title fw-bold">Tug Boat List</h5>
                </div>
                <DataTable
                  api={PagedSearchTugBoat}
                  tableHeader={tableHeaders}
                  tableBody={tableBody}
                  isSearch={true}
                  dependencies={[lastDataModificationTimestamp]}
                  params={{
                    orderByFieldName: "CreatedDateTime",
                    sortOrder: "desc",
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
