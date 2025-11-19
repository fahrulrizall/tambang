import DataTable from "../../../Components/DataTable";
import { useApplicationStoreContext } from "../../../Hook/UserHook";

export default function PlantTable({ data }) {
  const { lastDataModificationTimestamp } = useApplicationStoreContext();

  const tableHeaders = [
    {
      name: "Barge",
    },
    {
      name: "Total",
    },
  ];

  const tableBody = [
    {
      name: "barge",
    },
    {
      name: "cargoOnb",
    },
  ];

  return (
    <DataTable
      title="Cargo per Barge"
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
