import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";

/** Wrapper around TanStack Query with shared error handling. */
export const useDataQuery = <TData, TError = Error>(
  options: UseQueryOptions<TData, TError>,
) => {
  const result = useQuery(options);

  useEffect(() => {
    if (result.isError) {
      const message =
        result.error instanceof Error ? result.error.message : "Unknown error";
      toast.error("Unable to load data", { description: message });
    }
  }, [result.error, result.isError]);

  return result;
};
