import React, { useEffect } from "react";
import ReactPaginate from "react-paginate";

export default function Pagination({
  pageSize,
  totalCount,
  pageOffset,
  pageCount,
  setPageCount,
  setPageIndex,
  setPageOffset,
}) {
  useEffect(() => {
    setPageCount(Math.ceil(totalCount / pageSize));
  }, [totalCount]);

  const handlePageChange = (e) => {
    setPageOffset(e.selected);
    setPageIndex(e.selected);
  };

  return (
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
      forcePage={pageOffset}
      hrefBuilder={(page, pageCount, selected) => "#"}
      hrefAllControls={true}
    />
  );
}
