function Pagination({
  paginationData,
  getProduct
}) {
  const { current_page, total_pages, has_pre, has_next } = paginationData;
  const handlePageChange = (method) => {
    if (method === "next") {
      getProduct(current_page + 1);
    } else {
      getProduct(current_page - 1);
    };

  }
  return (
    <>
      <nav aria-label="Page navigation example" className="d-flex justify-content-center">
        <ul className="pagination">
          <li className="page-item">
            <button className={`page-link ${!has_pre && 'disabled'}`} href="#" aria-label="Previous" onClick={() => handlePageChange("Previous")}>
              <span aria-hidden="true">&laquo;</span>
            </button>
          </li>
          {
            [...Array(total_pages).keys()].map((num) => {
              return (
                <li className={`page-item ${num + 1 == current_page && 'active'}`} key={num + 1} ><button className="page-link" href="#" onClick={() => getProduct(num + 1)}>{num + 1}</button></li>
              )
            })
          }
          <li className="page-item">
            <button className={`page-link ${!has_next && 'disabled'}`} href="#" aria-label="Next" onClick={() => handlePageChange("next")}>
              <span aria-hidden="true">&raquo;</span>
            </button>
          </li>
        </ul>
      </nav>
    </>
  )
}

export default Pagination