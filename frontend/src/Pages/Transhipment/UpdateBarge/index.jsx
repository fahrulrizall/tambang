import DataTable from "../../../Components/DataTable";
import { useApplicationStoreContext } from "../../../Hook/UserHook";

export default function PlantTable({ data }) {
  const { lastDataModificationTimestamp } = useApplicationStoreContext();

  const tableHeaders = [
    {
      name: "No",
    },
    {
      name: "Tug Boat",
    },
    {
      name: "Cargo",
    },
    {
      name: "Remarks",
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
      name: "remarks",
    },
  ];

  return (
    <DataTable
      title="Update Barge"
      data={data}
      tableHeader={tableHeaders}
      tableBody={tableBody}
      isSearch={false}
      dependencies={[lastDataModificationTimestamp]}
      params={{
        orderByFieldName: "CreatedDateTime",
        sortOrder: "desc",
      }}
      isAdd={false}
      usePagination={false}
    />
  );
}
