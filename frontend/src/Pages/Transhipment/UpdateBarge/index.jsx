import DataTable from "../../../Components/DataTable";
import { useApplicationStoreContext } from "../../../Hook/UserHook";
import { PagedSearchBargingDetailByNoMV } from "../../../API";
import { useSearchParams } from "react-router-dom";

export default function PlantTable({ setUpdateBargeList }) {
  const { lastDataModificationTimestamp } = useApplicationStoreContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const noBarging = searchParams.get("no");
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
      api={PagedSearchBargingDetailByNoMV}
      tableHeader={tableHeaders}
      tableBody={tableBody}
      isSearch={false}
      dependencies={[lastDataModificationTimestamp]}
      params={{
        orderByFieldName: "no",
        sortOrder: "asc",
        noBarging,
      }}
      isAdd={false}
      usePagination={false}
      callback={(response) => setUpdateBargeList(response.data.data)}
    />
  );
}
