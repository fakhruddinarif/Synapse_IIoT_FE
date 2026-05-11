import { Button } from "../Button";

export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/** Pagination controls for tables and lists. */
export const Pagination = ({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) => (
  <div className="flex items-center gap-2 text-sm text-secondary">
    <Button
      size="sm"
      variant="ghost"
      disabled={page <= 1}
      onClick={() => onPageChange(page - 1)}
    >
      Prev
    </Button>
    <span>
      Page {page} / {totalPages}
    </span>
    <Button
      size="sm"
      variant="ghost"
      disabled={page >= totalPages}
      onClick={() => onPageChange(page + 1)}
    >
      Next
    </Button>
  </div>
);
