import { useState, useEffect } from "react";
import { CustomAlertDialog } from "~/components/ui/alert-dialog";
import { useError } from "~/contexts/error.context";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Skeleton } from "~/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  type Device,
  type Protocol,
  type CreateDeviceDto,
  type UpdateDeviceDto,
  ProtocolLabels,
} from "~/types/device";
import { NoData } from "~/components/ui/no-data";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";

import { DeviceFormDialog } from "~/components/layouts/connectivity/DeviceFormDialog";
import { DeviceInfoDialog } from "~/components/layouts/connectivity/DeviceInfoDialog";
import { deviceService } from "~/services/device.service";

export default function ConnectivityDevice() {
  const { showError } = useError();
  // Current Protocol Tab
  const [currentProtocol, setCurrentProtocol] = useState<Protocol>(4); // HTTP as default
  const protocols = [
    { value: 4, label: "HTTP", icon: "ri-global-line" },
    { value: 2, label: "MQTT", icon: "ri-message-2-line" },
  ];

  const [devices, setDevices] = useState<Device[]>([]);
  // State for dialog delete and selected device ID
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [formDialogOpen, setFormDialogOpen] = useState<{
    open: boolean;
    device: Device | null;
  }>({ open: false, device: null });
  const [infoDialogOpen, setInfoDialogOpen] = useState<{
    open: boolean;
    device: Device | null;
  }>({ open: false, device: null });

  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 9; // Items per page

  // Fetch devices
  const fetchDevices = async () => {
    setLoading(true);
    try {
      const response = await deviceService.getAll({
        protocol: currentProtocol,
        search: searchTerm || undefined,
        page: currentPage,
        pageSize: pageSize,
      });

      if (response.data) {
        setDevices(response.data);
        if (response.pagingInfo) {
          setTotalPages(response.pagingInfo.totalPages);
        }
      }
    } catch (error) {
      console.error("Error fetching devices:", error);
      showError(
        error instanceof Error ? error.message : "Failed to fetch devices",
        "Fetch Error",
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount and when dependencies change
  useEffect(() => {
    fetchDevices();
  }, [currentProtocol, currentPage, searchTerm]);

  // Reset page when protocol or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [currentProtocol, searchTerm]);

  // Handlers
  const handleUpsertDevice = (device: Device | null = null) => {
    setFormDialogOpen({ open: true, device });
  };

  const handleShowInfo = (device: Device) => {
    setInfoDialogOpen({ open: true, device });
  };

  const handleDeleteDevice = async (deviceId: string) => {
    try {
      await deviceService.delete(deviceId);
      setDeleteDialogOpen(false);
      setSelectedDeviceId(null);
      fetchDevices();
    } catch (error) {
      console.error("Error deleting device:", error);
      showError(
        error instanceof Error ? error.message : "Failed to delete device",
        "Delete Error",
      );
    }
  };

  const handleDeleteButtonClick = (deviceId: string) => {
    setSelectedDeviceId(deviceId);
    setDeleteDialogOpen(true);
  };

  // Debounced search handler
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm !== undefined) {
        // Trigger fetch (already handled by effect above)
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleSubmitForm = async (data: CreateDeviceDto | UpdateDeviceDto) => {
    try {
      if (formDialogOpen.device) {
        await deviceService.update(formDialogOpen.device.id, data);
      } else {
        await deviceService.create(data as CreateDeviceDto);
      }
      fetchDevices();
    } catch (error) {
      console.error("Error submitting form:", error);
      throw error;
    }
  };

  return (
    <div>
      <Card className="mt-4">
        {/* Tab */}
        <Tabs
          value={currentProtocol.toString()}
          onValueChange={(value) => setCurrentProtocol(Number.parseInt(value))}
        >
          <TabsList
            variant="line"
            className="w-full justify-start rounded-none border-b-0 bg-transparent p-0"
          >
            {protocols.map((protocol) => (
              <TabsTrigger
                key={protocol.value}
                value={protocol.value.toString()}
              >
                <i className={`${protocol.icon} mr-2`}></i>
                {protocol.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {protocols.map((protocol) => (
            <TabsContent
              key={protocol.value}
              value={protocol.value.toString()}
              className="m-0"
            >
              <CardContent className="p-6">
                {/* Toolbar */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                  <Button
                    onClick={() => handleUpsertDevice()}
                    className="gap-2 w-full md:w-auto"
                  >
                    <i className="ri-add-line" /> Add Device
                  </Button>

                  <div className="relative w-full md:w-64">
                    <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    <Input
                      type="text"
                      placeholder="Search devices..."
                      onKeyUp={(e) =>
                        handleSearch((e.target as HTMLInputElement).value)
                      }
                      className="pl-10 w-full"
                      defaultValue={searchTerm}
                    />
                  </div>
                </div>

                {/* Loading */}
                {loading && (
                  <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 9 }).map((_, idx) => (
                      <Card key={`skeleton-${idx}`}>
                        <CardHeader>
                          <Skeleton className="h-6 w-3/4 mb-2" />
                          <Skeleton className="h-4 w-1/2" />
                        </CardHeader>
                        <CardContent>
                          <Skeleton className="h-4 w-full mb-2" />
                          <Skeleton className="h-4 w-2/3" />
                        </CardContent>
                        <CardFooter>
                          <Skeleton className="h-9 w-24" />
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}

                {/* No Data */}
                {!loading && devices.length === 0 && (
                  <NoData
                    title="No devices found"
                    description={
                      searchTerm
                        ? "Try adjusting your search"
                        : `No ${ProtocolLabels[currentProtocol]} devices configured yet`
                    }
                  />
                )}

                {/* Card Main Content */}
                {!loading && devices.length > 0 && (
                  <>
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {devices.map((device) => (
                        <Card key={device.id} className="flex flex-col">
                          <CardHeader>
                            <div className="flex justify-between items-start gap-2">
                              <div className="flex-1 min-w-0">
                                <CardTitle className="text-base truncate">
                                  {device.name}
                                </CardTitle>
                                {device.description && (
                                  <CardDescription className="text-xs mt-1 line-clamp-2">
                                    {device.description}
                                  </CardDescription>
                                )}
                              </div>
                              <span
                                className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                                  device.isEnabled
                                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                                    : "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-300"
                                }`}
                              >
                                {device.isEnabled ? "Enabled" : "Disabled"}
                              </span>
                            </div>
                          </CardHeader>
                          <CardContent className="flex-1">
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <i className="ri-time-line text-base"></i>
                                <span>
                                  Interval: {device.pollingInterval} ms
                                </span>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="flex justify-end gap-2 pt-4 border-t">
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-2"
                              title="Device Info"
                              onClick={() => handleShowInfo(device)}
                            >
                              <i className="ri-information-line" /> Info
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-2"
                              title="Edit Device"
                              onClick={() => handleUpsertDevice(device)}
                            >
                              <i className="ri-edit-line" /> Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="gap-2"
                              title="Delete Device"
                              onClick={() => handleDeleteButtonClick(device.id)}
                            >
                              <i className="ri-delete-bin-line" /> Delete
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <Pagination className="flex justify-end mt-6">
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
                    )}
                  </>
                )}
              </CardContent>
            </TabsContent>
          ))}
        </Tabs>
      </Card>

      {/* Dialog Form */}
      <DeviceFormDialog
        open={formDialogOpen.open}
        onOpenChange={(open) => setFormDialogOpen({ open, device: null })}
        device={formDialogOpen.device}
        protocol={currentProtocol}
        onSubmit={handleSubmitForm}
      />

      {/* Device Info Dialog */}
      <DeviceInfoDialog
        open={infoDialogOpen.open}
        onOpenChange={(open) => setInfoDialogOpen({ open, device: null })}
        device={infoDialogOpen.device}
      />

      {/* Delete Confirmation Dialog */}
      <CustomAlertDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        variant="delete"
        title="Delete Device"
        description="Are you sure you want to delete this device? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={() =>
          selectedDeviceId && handleDeleteDevice(selectedDeviceId)
        }
      />
    </div>
  );
}
