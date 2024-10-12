import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface PaginationProps {
  limit: number;
  page: number;
  all: number;
  onChangePage: (p: number) => void;
}
const Pagination = ({ limit, page, all, onChangePage }: PaginationProps) => {
  const start = (page - 1) * limit + 1;
  const end = page * limit > all ? all : page * limit;
  const countPages = Math.ceil(all / limit);
  const pagination = [];

  // Logic to handle the display of pagination buttons
  if (countPages < 5) {
    // Show all pages if count is less than or equal to 5
    for (let i = 1; i <= countPages; i++) {
      pagination.push(i);
    }
  } else if (page < 4) {
    // Show first 4 pages and last page (1, 2, 3, 4, ..., end)
    pagination.push(1, 2, 3, 4, "...", countPages);
  } else if (page >= 4 && page <= countPages - 3) {
    // Show middle range of pages (1, ..., page-1, page, page+1, ..., end)
    pagination.push(1, "...", page - 1, page, page + 1, "...", countPages);
  } else {
    // Show the last few pages (1, ..., end-3, end-2, end-1, end)
    pagination.push(
      1,
      "...",
      countPages - 3,
      countPages - 2,
      countPages - 1,
      countPages
    );
  }

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white py-2 gap-5 flex-col-reverse sm:flex-row">
      <p className="text-sm text-gray-400">
        แสดง [{start}-{end}] จาก {all} รายการ
      </p>
      <div>
        <nav className="inline-flex rounded-md" aria-label="Pagination">
          <a
            href="#"
            className="relative inline-flex items-center rounded-l-md p-2 text-gray-400 ring-1 ring-inset ring-gray-300"
            onClick={() => onChangePage(Math.max(1, page - 1))}
          >
            <span className="sr-only">Previous</span>
            <FontAwesomeIcon icon={faChevronLeft} />
          </a>

          {pagination.map((pageNum, index) => (
            <a
              key={`paginate_${index}`}
              href="#"
              aria-current={page === pageNum ? "page" : undefined}
              onClick={() => {
                if (typeof pageNum === "number") onChangePage(pageNum);
              }}
              className={`relative inline-flex items-center justify-center size-[2.5rem] text-sm ${
                page === pageNum
                  ? "font-semibold text-white bg-indigo-600"
                  : pageNum === "..."
                  ? "text-gray-500 pointer-events-none"
                  : "text-gray-900 ring-1 ring-inset ring-gray-300"
              }`}
            >
              {pageNum}
            </a>
          ))}

          <a
            href="#"
            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300"
            onClick={() => onChangePage(Math.min(countPages, page + 1))}
          >
            <span className="sr-only">Next</span>
            <FontAwesomeIcon icon={faChevronRight} />
          </a>
        </nav>
      </div>
    </div>
  );
};

export default Pagination;
