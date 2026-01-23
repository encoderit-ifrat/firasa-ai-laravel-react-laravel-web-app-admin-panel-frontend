import { ArrowRight, ChevronLeftIcon } from "lucide-react";
import { usePagination } from "../hooks/use-pagination";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink } from "./ui/pagination";
import { cn } from "../lib/utils";
import { buttonVariants } from "./ui/button";



type PaginationProps = {
  currentPage: number;
  totalPages: number;
  paginationItemsToDisplay?: number;
  onClickPage: (page: number) => void;
  onClickPrev: (page: number) => void;
  onClickNext: (page: number) => void;
};

export default function AppPagination({
  currentPage,
  totalPages,
  paginationItemsToDisplay = 10,
  onClickPage,
  onClickPrev,
  onClickNext,
}: PaginationProps) {
  const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
    currentPage,
    totalPages,
    paginationItemsToDisplay,
  });

  return (
    <Pagination className="justify-end">
      <PaginationContent className="flex flex-row items-center gap-3">
        {/* Previous page button */}
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationLink
              className="rounded-md border-none shadow-none text-muted-foreground hover:text-foreground"
              aria-label="Go to previous page"
              aria-disabled={currentPage === 1 ? true : undefined}
              role={currentPage === 1 ? "link" : undefined}
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

        {/* Next page button */}
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
            aria-disabled={currentPage === totalPages ? true : undefined}
            role={currentPage === totalPages ? "link" : undefined}
            size="default"
          >
            <span>Next</span>
            <ArrowRight size={16} aria-hidden="true" />
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
