import { ArrowRight, ChevronLeftIcon } from "lucide-react";
import { usePagination } from "../hooks/use-pagination";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink } from "./ui/pagination";
import { cn } from "../lib/utils";
import { buttonVariants } from "./ui/button";

type PaginationProps = {
  meta?: {
    first_page_url?: null | string;
    prev_page_url?: null | string;
    next_page_url?: null | string;
    last_page_url?: null | string;
    path: string;
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    per_page: number;
    total: number;
  };
  currentPage: number;
  totalPages: number;
  paginationItemsToDisplay?: number;
  onClickPage: (page: number) => void;
  onClickPrev: (page: number) => void;
  onClickNext: (page: number) => void;
  onPerPageChange?: (perPage: number) => void;
};

export default function AppPagination({
  // meta,
  currentPage,
  totalPages,
  paginationItemsToDisplay = 5,
  onClickPage,
  onClickPrev,
  onClickNext,
  // onPerPageChange,
}: PaginationProps) {
  const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
    currentPage,
    totalPages,
    paginationItemsToDisplay: paginationItemsToDisplay || 5,
  });

  // Don't render if no pages
  if (totalPages <= 0) {
    return null;
  }

  return (
    <Pagination className="justify-end">
      <PaginationContent className="flex flex-row items-center gap-3">
        {/* Previous page button - only show if not on first page */}
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationLink
              className="rounded-md border-none shadow-none text-muted-foreground hover:text-foreground"
              aria-label="Go to previous page"
              onClick={() => onClickPrev(currentPage)}
              size="default"
            >
              <ChevronLeftIcon size={16} aria-hidden="true" />
              <span className="ml-1 hidden sm:block">Previous</span>
            </PaginationLink>
          </PaginationItem>
        )}

        <div className="flex items-center gap-1">
          {/* Left ellipsis (...) */}
          {showLeftEllipsis && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {/* Page number links */}
          {pages.map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                className={cn(
                  "rounded-md w-9 h-9 transition-all duration-200",
                  page === currentPage
                    ? "bg-card text-foreground shadow-sm ring-1 ring-border/50 hover:bg-card"
                    : "text-muted-foreground hover:bg-transparent hover:text-foreground"
                )}
                isActive={page === currentPage}
                onClick={() => onClickPage(page)}
                size="icon"
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

          {/* Right ellipsis (...) */}
          {showRightEllipsis && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
        </div>

        {/* Next page button - only show if not on last page */}
        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationLink
              className={cn(
                buttonVariants({
                  variant: "customGradient",
                }),
                "rounded-md shadow-sm gap-2 px-4"
              )}
              onClick={() => onClickNext(currentPage)}
              aria-label="Go to next page"
              size="default"
            >
              <span>Next</span>
              <ArrowRight size={16} aria-hidden="true" />
            </PaginationLink>
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}