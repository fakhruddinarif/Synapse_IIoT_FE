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
import { Spinner } from "~/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import { DeviceFormDialog } from "~/components/device/DeviceFormDialog";
import { DeviceInfoDialog } from "~/components/device/DeviceInfoDialog";
import { deviceService } from "~/services/device.service";
import { useDeviceSignalR } from "~/hooks/useDeviceSignalR";
import type {
  Device,
  Protocol,
  CreateDeviceDto,
  UpdateDeviceDto,
} from "~/types/device";
import { ProtocolLabels } from "~/types/device";

export default function ConnectivityDevice() {
  const [currentProtocol, setCurrentProtocol] = useState<Protocol>(4); // HTTP
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const pageSize = 10;

  // Dialogs state
  const [formDialog, setFormDialog] = useState<{
    open: boolean;
    device?: Device;
  }>({ open: false });
  const [infoDialog, setInfoDialog] = useState<{
    open: boolean;
    device: Device | null;
  }>({ open: false, device: null });

  // SignalR
  const {
    isConnected,
    deviceData,
    subscribeToDevice,
    unsubscribeFromDevice,
    clearDeviceData,
  } = useDeviceSignalR();

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
          setTotalRecords(response.pagingInfo.totalRecords);
        }
      }
    } catch (error) {
      console.error("Error fetching devices:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, [currentProtocol, currentPage, searchTerm]);

  // Reset page when changing protocol or search
  useEffect(() => {
    setCurrentPage(1);
  }, [currentProtocol, searchTerm]);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const value = (e.target as HTMLInputElement).value;
      setSearchTerm(value);
    }
  };

  const handleAddDevice = () => {
    setFormDialog({ open: true, device: undefined });
  };

  const handleEditDevice = (device: Device) => {
    setFormDialog({ open: true, device });
  };

  const handleDeleteDevice = async (deviceId: string) => {
    if (!confirm("Are you sure you want to delete this device?")) return;

    try {
      await deviceService.delete(deviceId);
      fetchDevices();
      clearDeviceData(deviceId);
    } catch (error) {
      console.error("Error deleting device:", error);
      alert(error instanceof Error ? error.message : "Failed to delete device");
    }
  };

  const handleSubmitForm = async (data: CreateDeviceDto | UpdateDeviceDto) => {
    try {
      if (formDialog.device) {
        await deviceService.update(formDialog.device.id, data);
      } else {
        await deviceService.create(data as CreateDeviceDto);
      }
      fetchDevices();
    } catch (error) {
      console.error("Error submitting form:", error);
      throw error;
    }
  };

  const handleOpenInfo = (device: Device) => {
    setInfoDialog({ open: true, device });
  };

  const protocols = [
    { value: 4, label: "HTTP", icon: "ri-global-line" },
    { value: 2, label: "MQTT", icon: "ri-message-2-line" },
  ];

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Connectivity Devices</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* SignalR Status */}
      <div className="mt-4 mb-2 flex items-center gap-2 text-sm">
        <div
          className={`h-2 w-2 rounded-full ${
            isConnected ? "bg-green-500" : "bg-red-500"
          }`}
        ></div>
        <span className="text-gray-600">
          {isConnected ? "Connected to real-time updates" : "Disconnected"}
        </span>
      </div>

      {/* Main Content */}
      <Card className="mt-4">
        <Tabs
          value={currentProtocol.toString()}
          onValueChange={(value) => setCurrentProtocol(Number.parseInt(value))}
        >
          <div className="border-b">
            <TabsList className="w-full justify-start rounded-none border-b-0 bg-transparent p-0">
              {protocols.map((protocol) => (
                <TabsTrigger
                  key={protocol.value}
                  value={protocol.value.toString()}
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  <i className={`${protocol.icon} mr-2`}></i>
                  {protocol.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {protocols.map((protocol) => (
            <TabsContent
              key={protocol.value}
              value={protocol.value.toString()}
              className="m-0"
            >
              <CardContent className="p-6">
                {/* Toolbar */}
                <div className="flex justify-between items-center mb-6">
                  <Button onClick={handleAddDevice} className="gap-2">
                    <i className="ri-add-line" />
                    Add Device
                  </Button>

                  <div className="relative w-64">
                    <Input
                      type="text"
                      placeholder="Search devices..."
                      onKeyUp={handleSearch}
                      className="pr-10"
                      defaultValue={searchTerm}
                    />
                    <i className="ri-search-line absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  </div>
                </div>

                {/* Loading */}
                {loading && (
                  <div className="flex justify-center items-center py-12">
                    <Spinner />
                  </div>
                )}

                {/* Table */}
                {!loading && devices.length > 0 && (
                  <div>
                    <div className="relative overflow-x-auto rounded-lg border">
                      <table className="w-full text-sm text-left">
                        <thead className="text-xs uppercase bg-gray-50 border-b">
                          <tr>
                            <th scope="col" className="px-6 py-3">
                              #
                            </th>
                            <th scope="col" className="px-6 py-3">
                              Name
                            </th>
                            <th scope="col" className="px-6 py-3">
                              Description
                            </th>
                            <th scope="col" className="px-6 py-3">
                              Status
                            </th>
                            <th scope="col" className="px-6 py-3">
                              Polling (ms)
                            </th>
                            <th scope="col" className="px-6 py-3">
                              Created At
                            </th>
                            <th scope="col" className="px-6 py-3 text-center">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {devices.map((device, index) => (
                            <tr
                              key={device.id}
                              className="border-b hover:bg-gray-50"
                            >
                              <td className="px-6 py-4">
                                {(currentPage - 1) * pageSize + index + 1}
                              </td>
                              <td className="px-6 py-4 font-medium">
                                {device.name}
                              </td>
                              <td className="px-6 py-4">
                                {device.description || "-"}
                              </td>
                              <td className="px-6 py-4">
                                {device.isEnabled ? (
                                  <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                                    Enabled
                                  </span>
                                ) : (
                                  <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full">
                                    Disabled
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4">
                                {device.pollingInterval}
                              </td>
                              <td className="px-6 py-4">
                                {new Date(
                                  device.createdAt,
                                ).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex justify-center gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleOpenInfo(device)}
                                    title="View Info"
                                  >
                                    <i className="ri-information-line"></i>
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleEditDevice(device)}
                                    title="Edit"
                                  >
                                    <i className="ri-edit-line"></i>
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      handleDeleteDevice(device.id)
                                    }
                                    title="Delete"
                                  >
                                    <i className="ri-delete-bin-line text-red-500"></i>
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="mt-4 flex justify-between items-center">
                        <p className="text-sm text-gray-600">
                          Showing {(currentPage - 1) * pageSize + 1} to{" "}
                          {Math.min(currentPage * pageSize, totalRecords)} of{" "}
                          {totalRecords} devices
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
              </CardContent>
            </TabsContent>
          ))}
        </Tabs>
      </Card>

      {/* Dialogs */}
      <DeviceFormDialog
        open={formDialog.open}
        onOpenChange={(open) => setFormDialog({ open, device: undefined })}
        device={formDialog.device}
        protocol={currentProtocol}
        onSubmit={handleSubmitForm}
      />

      <DeviceInfoDialog
        open={infoDialog.open}
        onOpenChange={(open) =>
          setInfoDialog({ open, device: open ? infoDialog.device : null })
        }
        device={infoDialog.device}
        deviceDataHistory={
          infoDialog.device ? deviceData.get(infoDialog.device.id) || [] : []
        }
        onOpen={subscribeToDevice}
        onClose={unsubscribeFromDevice}
      />
    </div>
  );
}
