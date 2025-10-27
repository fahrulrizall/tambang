import { debounce } from "lodash";
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import Spinner from "react-bootstrap/Spinner";
import Table from "react-bootstrap/Table";

export default function DataTable({
  data,
  api,
  size,
  params,
  tableHeader,
  tableBody,
  dependencies,
  activeClassName,
  conditionalLoad = true,
  isSearch = false,
  isAdd = true,
  onAdd,
  usePagination = true,
}) {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(size || 10);
  const [result, setResult] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (conditionalLoad) {
      setIsLoading(true);
      api &&
        api({ pageIndex, pageSize, ...(params || {}) }).then((response) => {
          setResult(response.data.data);
          setTotalCount(response.data.totalCount);
          setIsLoading(false);
        });
    }
  }, [pageIndex, ...(dependencies || [])]);

  const handlePageChange = (e) => {
    setPageIndex(e.selected);
  };

  useEffect(() => {
    setPageCount(Math.ceil(totalCount / pageSize));
  }, [totalCount]);

  useEffect(() => {
    if (data) {
      setResult(data);
      setIsLoading(false);
    }
  }, [data]);

  const handleDebouncedChange = debounce((value) => {
    setIsLoading(true);
    api({
      pageIndex,
      pageSize,
      keyword: value,
      ...(params || {}),
    }).then((response) => {
      setResult(response.data.data);
      setTotalCount(response.data.totalCount);
      setIsLoading(false);
    });
  }, 300);

  return (
    <>
      {isSearch && (
        <div className="mb-2 row">
          <div className="col-sm-4 col-md-3">
            <input
              className="form-control search-box me-2 mb-2 d-inline-block"
              placeholder="Search..."
              onChange={(e) => handleDebouncedChange(e.target.value)}
            />
          </div>

          <div className="col-sm-8 col-md-9 d-flex justify-content-end align-items-center">
            <button
              className="btn btn-primary"
              onClick={(e) => {
                e.preventDefault();
                onAdd();
              }}
            >
              <i className="bi bi-plus"></i>
              Create New
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="d-flex align-items-center justify-content-center mt-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <Table className="table" striped bordered size="md">
          <thead>
            <tr>
              {tableHeader &&
                tableHeader.map((item, index) => {
                  return (
                    <th scope="col" key={index} style={item?.style}>
                      {item.name}
                    </th>
                  );
                })}
            </tr>
          </thead>
          <tbody>
            {result.map((item, index) => {
              return (
                <tr
                  key={index}
                  className={activeClassName && activeClassName(item)}
                >
                  {tableBody &&
                    tableBody.map((row, idx) => {
                      return (
                        <td key={idx}>
                          {row.view
                            ? row.view({ ...item, index })
                            : item[row.name]}
                        </td>
                      );
                    })}
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}

      {usePagination && (
        <nav className="d-flex justify-content-between">
          <div>
            <small className="mb-0">
              Showing {pageIndex + 1} to {pageSize} of {totalCount} entries
            </small>
          </div>
          <ReactPaginate
            activeClassName="active"
            breakLabel={"..."}
            breakLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            previousLabel={"Previous"}
            nextLabel={"Next"}
            nextClassName="page-item"
            nextLinkClassName="page-link"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            pageCount={pageCount}
            renderOnZeroPageCount={null}
            marginPagesDisplayed={2}
            breakClassName="page-item"
            className="pagination justify-content-end"
            onPageChange={handlePageChange}
            hrefBuilder={(page, pageCount, selected) => "#"}
            hrefAllControls={true}
          />
        </nav>
      )}
    </>
  );
}
