import { useState, useEffect } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "~/components/ui/breadcrumb";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { NoData } from "~/components/ui/no-data";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { StorageFlowFormDialog } from "~/components/layouts/storage-flow/StorageFlowFormDialog";
import { storageFlowService } from "~/services/storage-flow.service";
import { useError } from "~/contexts/error.context";
import type {
  StorageFlow,
  CreateStorageFlowDto,
  UpdateStorageFlowDto,
} from "~/types/storage-flow";

export default function StorageFlows() {
  const { showError } = useError();
  const [storageFlows, setStorageFlows] = useState<StorageFlow[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const pageSize = 10;

  // Dialogs state
  const [formDialog, setFormDialog] = useState<{
    open: boolean;
    storageFlow?: StorageFlow;
  }>({ open: false });

  // Fetch storage flows
  const fetchStorageFlows = async () => {
    setLoading(true);
    try {
      const response = await storageFlowService.getAll({
        search: searchTerm || undefined,
        page: currentPage,
        pageSize: pageSize,
      });

      if (response.data) {
        setStorageFlows(response.data);
        if (response.pagingInfo) {
          setTotalPages(response.pagingInfo.totalPages);
          setTotalRecords(response.pagingInfo.totalRecords);
        }
      }
    } catch (error) {
      console.error("Error fetching storage flows:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStorageFlows();
  }, [currentPage, searchTerm]);

  // Reset page when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const value = (e.target as HTMLInputElement).value;
      setSearchTerm(value);
    }
  };

  const handleAddFlow = () => {
    setFormDialog({ open: true, storageFlow: undefined });
  };

  const handleEditFlow = (storageFlow: StorageFlow) => {
    setFormDialog({ open: true, storageFlow });
  };

  const handleDeleteFlow = async (flowId: string) => {
    if (!confirm("Are you sure you want to delete this storage flow?")) return;

    try {
      await storageFlowService.delete(flowId);
      fetchStorageFlows();
    } catch (error) {
      console.error("Error deleting flow:", error);
      showError(
        error instanceof Error ? error.message : "Failed to delete flow",
        "Delete Error",
      );
    }
  };

  const handleSubmitForm = async (
    data: CreateStorageFlowDto | UpdateStorageFlowDto,
  ) => {
    try {
      if (formDialog.storageFlow) {
        await storageFlowService.update(formDialog.storageFlow.id, data);
      } else {
        await storageFlowService.create(data as CreateStorageFlowDto);
      }
      fetchStorageFlows();
    } catch (error) {
      console.error("Error submitting form:", error);
      throw error;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Storage Flows</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Main Content */}
      <Card className="mt-4">
        <CardContent className="p-4 sm:p-6">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <Button onClick={handleAddFlow} className="gap-2 w-full sm:w-auto">
              <i className="ri-add-line" /> Add Storage Flow
            </Button>

            <div className="relative w-full sm:w-64">
              <Input
                type="text"
                placeholder="Search flows..."
                onKeyUp={handleSearch}
                className="pr-10"
                defaultValue={searchTerm}
              />
              <i className="ri-search-line absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="relative overflow-x-auto rounded-lg border">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-gray-50 border-b">
                  <tr>
                    <th scope="col" className="px-4 sm:px-6 py-3">
                      #
                    </th>
                    <th scope="col" className="px-4 sm:px-6 py-3">
                      Device
                    </th>
                    <th
                      scope="col"
                      className="px-4 sm:px-6 py-3 hidden md:table-cell"
                    >
                      Master Table
                    </th>
                    <th
                      scope="col"
                      className="px-4 sm:px-6 py-3 hidden lg:table-cell"
                    >
                      Mappings
                    </th>
                    <th scope="col" className="px-4 sm:px-6 py-3">
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-4 sm:px-6 py-3 hidden lg:table-cell"
                    >
                      Created At
                    </th>
                    <th scope="col" className="px-4 sm:px-6 py-3 text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <tr key={`skeleton-${index}`} className="border-b">
                      <td className="px-4 sm:px-6 py-4">
                        <Skeleton className="h-4 w-8" />
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <Skeleton className="h-4 w-32" />
                      </td>
                      <td className="px-4 sm:px-6 py-4 hidden md:table-cell">
                        <Skeleton className="h-4 w-32" />
                      </td>
                      <td className="px-4 sm:px-6 py-4 hidden lg:table-cell">
                        <Skeleton className="h-6 w-20" />
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <Skeleton className="h-6 w-16" />
                      </td>
                      <td className="px-4 sm:px-6 py-4 hidden lg:table-cell">
                        <Skeleton className="h-4 w-28" />
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <Skeleton className="h-8 w-8" />
                          <Skeleton className="h-8 w-8" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Table */}
          {!loading && storageFlows.length > 0 && (
            <div>
              <div className="relative overflow-x-auto rounded-lg border">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-gray-50 border-b">
                    <tr>
                      <th scope="col" className="px-4 sm:px-6 py-3">
                        #
                      </th>
                      <th scope="col" className="px-4 sm:px-6 py-3">
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-4 sm:px-6 py-3 hidden md:table-cell"
                      >
                        Devices
                      </th>
                      <th
                        scope="col"
                        className="px-4 sm:px-6 py-3 hidden lg:table-cell"
                      >
                        Master Table
                      </th>
                      <th
                        scope="col"
                        className="px-4 sm:px-6 py-3 hidden lg:table-cell"
                      >
                        Mappings
                      </th>
                      <th scope="col" className="px-4 sm:px-6 py-3">
                        Interval
                      </th>
                      <th scope="col" className="px-4 sm:px-6 py-3">
                        Status
                      </th>
                      <th scope="col" className="px-4 sm:px-6 py-3 text-center">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {storageFlows.map((flow, index) => (
                      <tr key={flow.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 sm:px-6 py-4">
                          {(currentPage - 1) * pageSize + index + 1}
                        </td>
                        <td className="px-4 sm:px-6 py-4 font-medium">
                          <div>
                            <div className="font-semibold">{flow.name}</div>
                            {flow.description && (
                              <div className="text-xs text-gray-500 line-clamp-1">
                                {flow.description}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 hidden md:table-cell">
                          <div className="flex flex-wrap gap-1">
                            {flow.devices.slice(0, 2).map((device) => (
                              <span
                                key={device.deviceId}
                                className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs"
                              >
                                <i className="ri-device-line" />
                                {device.deviceName || device.deviceId}
                              </span>
                            ))}
                            {flow.devices.length > 2 && (
                              <span className="text-xs text-gray-500">
                                +{flow.devices.length - 2} more
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 hidden lg:table-cell">
                          <div className="flex items-center gap-2">
                            <i className="ri-table-line text-green-500" />
                            {flow.masterTableName || flow.masterTableId}
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 hidden lg:table-cell">
                          <div className="space-y-1">
                            {flow.mappings.slice(0, 2).map((mapping, idx) => (
                              <div
                                key={`${flow.id}-mapping-${idx}`}
                                className="text-xs bg-blue-50 px-2 py-1 rounded inline-block mr-1"
                              >
                                <code className="text-blue-700">
                                  {mapping.sourcePath}
                                </code>
                                <i className="ri-arrow-right-line mx-1 text-blue-400" />
                                <code className="text-green-700">
                                  {mapping.masterTableFieldName}
                                </code>
                              </div>
                            ))}
                            {flow.mappings.length > 2 && (
                              <span className="text-xs text-gray-500">
                                +{flow.mappings.length - 2} more
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <span className="text-xs text-gray-600">
                            {flow.storageInterval / 1000}s
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              flow.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {flow.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <div className="flex justify-center gap-2">
                            {/* Desktop Actions */}
                            <div className="hidden sm:flex gap-2">
                              <Button
                                onClick={() => handleEditFlow(flow)}
                                variant="ghost"
                                size="sm"
                                className="text-yellow-500 hover:text-yellow-700 hover:bg-yellow-50"
                                title="Edit"
                              >
                                <i className="ri-edit-line" />
                              </Button>
                              <Button
                                onClick={() => handleDeleteFlow(flow.id)}
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                title="Delete"
                              >
                                <i className="ri-delete-bin-line" />
                              </Button>
                            </div>

                            {/* Mobile Dropdown */}
                            <div className="sm:hidden">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <i className="ri-more-2-fill" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => handleEditFlow(flow)}
                                    className="gap-2"
                                  >
                                    <i className="ri-edit-line" /> Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteFlow(flow.id)}
                                    className="gap-2 text-red-500"
                                  >
                                    <i className="ri-delete-bin-line" /> Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <p className="text-sm text-gray-600">
                    Showing {(currentPage - 1) * pageSize + 1} to{" "}
                    {Math.min(currentPage * pageSize, totalRecords)} of{" "}
                    {totalRecords} flows
                  </p>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() =>
                            setCurrentPage(Math.max(1, currentPage - 1))
                          }
                          className={
                            currentPage === 1
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(
                          (page) =>
                            page === 1 ||
                            page === totalPages ||
                            Math.abs(page - currentPage) <= 1,
                        )
                        .map((page, i, arr) => (
                          <>
                            {i > 0 && arr[i - 1] !== page - 1 && (
                              <PaginationItem key={`ellipsis-${page}`}>
                                <span className="px-4">...</span>
                              </PaginationItem>
                            )}
                            <PaginationItem key={page}>
                              <PaginationLink
                                onClick={() => setCurrentPage(page)}
                                isActive={currentPage === page}
                                className="cursor-pointer"
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          </>
                        ))}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() =>
                            setCurrentPage(
                              Math.min(totalPages, currentPage + 1),
                            )
                          }
                          className={
                            currentPage === totalPages
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>
          )}

          {/* No Data */}
          {!loading && storageFlows.length === 0 && (
            <NoData
              title="No storage flows found"
              description={
                searchTerm
                  ? "Try adjusting your search"
                  : "No storage flows configured yet. Create one to start mapping device data to tables."
              }
            />
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <StorageFlowFormDialog
        open={formDialog.open}
        onOpenChange={(open) => setFormDialog({ open, storageFlow: undefined })}
        storageFlow={formDialog.storageFlow}
        onSubmit={handleSubmitForm}
      />
    </div>
  );
}
