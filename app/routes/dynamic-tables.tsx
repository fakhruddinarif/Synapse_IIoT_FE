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
import { MasterTableFormDialog } from "~/components/layouts/master-table/MasterTableFormDialog";
import { MasterTableFieldsDialog } from "~/components/layouts/master-table/MasterTableFieldsDialog";
import { masterTableService } from "~/services/master-table.service";
import type {
  MasterTable,
  CreateMasterTableDto,
  UpdateMasterTableDto,
} from "~/types/master-table";

export default function DynamicTables() {
  const [masterTables, setMasterTables] = useState<MasterTable[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const pageSize = 10;

  // Dialogs state
  const [formDialog, setFormDialog] = useState<{
    open: boolean;
    masterTable?: MasterTable;
  }>({ open: false });
  const [fieldsDialog, setFieldsDialog] = useState<{
    open: boolean;
    masterTable: MasterTable | null;
  }>({ open: false, masterTable: null });

  // Fetch master tables
  const fetchMasterTables = async () => {
    setLoading(true);
    try {
      const response = await masterTableService.getAll({
        search: searchTerm || undefined,
        page: currentPage,
        pageSize: pageSize,
      });

      if (response.data) {
        setMasterTables(response.data);
        if (response.pagingInfo) {
          setTotalPages(response.pagingInfo.totalPages);
          setTotalRecords(response.pagingInfo.totalRecords);
        }
      }
    } catch (error) {
      console.error("Error fetching master tables:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMasterTables();
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

  const handleAddTable = () => {
    setFormDialog({ open: true, masterTable: undefined });
  };

  const handleEditTable = (masterTable: MasterTable) => {
    setFormDialog({ open: true, masterTable });
  };

  const handleDeleteTable = async (tableId: string) => {
    if (!confirm("Are you sure you want to delete this table?")) return;

    try {
      await masterTableService.delete(tableId);
      fetchMasterTables();
    } catch (error) {
      console.error("Error deleting table:", error);
      alert(error instanceof Error ? error.message : "Failed to delete table");
    }
  };

  const handleSubmitForm = async (
    data: CreateMasterTableDto | UpdateMasterTableDto,
  ) => {
    try {
      if (formDialog.masterTable) {
        await masterTableService.update(formDialog.masterTable.id, data);
      } else {
        await masterTableService.create(data as CreateMasterTableDto);
      }
      fetchMasterTables();
    } catch (error) {
      console.error("Error submitting form:", error);
      throw error;
    }
  };

  const handleManageFields = (masterTable: MasterTable) => {
    setFieldsDialog({ open: true, masterTable });
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
            <BreadcrumbPage>Dynamic Tables</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Main Content */}
      <Card className="mt-4">
        <CardContent className="p-4 sm:p-6">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <Button onClick={handleAddTable} className="gap-2 w-full sm:w-auto">
              <i className="ri-add-line" /> Add Table
            </Button>

            <div className="relative w-full sm:w-64">
              <Input
                type="text"
                placeholder="Search tables..."
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
          {!loading && masterTables.length > 0 && (
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
                        Table Name
                      </th>
                      <th
                        scope="col"
                        className="px-4 sm:px-6 py-3 hidden lg:table-cell"
                      >
                        Description
                      </th>
                      <th scope="col" className="px-4 sm:px-6 py-3">
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-4 sm:px-6 py-3 hidden xl:table-cell"
                      >
                        Fields
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
                    {masterTables.map((table, index) => (
                      <tr key={table.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 sm:px-6 py-4">
                          {(currentPage - 1) * pageSize + index + 1}
                        </td>
                        <td className="px-4 sm:px-6 py-4 font-medium">
                          {table.name}
                        </td>
                        <td className="px-4 sm:px-6 py-4 hidden md:table-cell">
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {table.tableName}
                          </code>
                        </td>
                        <td className="px-4 sm:px-6 py-4 hidden lg:table-cell">
                          <span className="text-gray-600 line-clamp-2">
                            {table.description || "-"}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              table.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {table.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4 hidden xl:table-cell">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {table.fields.length} fields
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4 hidden lg:table-cell text-gray-600">
                          {formatDate(table.createdAt)}
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <div className="flex justify-center gap-2">
                            {/* Desktop Actions */}
                            <div className="hidden sm:flex gap-2">
                              <Button
                                onClick={() => handleManageFields(table)}
                                variant="ghost"
                                size="sm"
                                className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                                title="Manage Fields"
                              >
                                <i className="ri-list-settings-line" />
                              </Button>
                              <Button
                                onClick={() => handleEditTable(table)}
                                variant="ghost"
                                size="sm"
                                className="text-yellow-500 hover:text-yellow-700 hover:bg-yellow-50"
                                title="Edit"
                              >
                                <i className="ri-edit-line" />
                              </Button>
                              <Button
                                onClick={() => handleDeleteTable(table.id)}
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
                                    onClick={() => handleManageFields(table)}
                                    className="gap-2"
                                  >
                                    <i className="ri-list-settings-line" />{" "}
                                    Manage Fields
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleEditTable(table)}
                                    className="gap-2"
                                  >
                                    <i className="ri-edit-line" /> Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteTable(table.id)}
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
                    {totalRecords} tables
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
          {!loading && masterTables.length === 0 && (
            <NoData
              title="No tables found"
              description={
                searchTerm
                  ? "Try adjusting your search"
                  : "No dynamic tables configured yet"
              }
            />
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <MasterTableFormDialog
        open={formDialog.open}
        onOpenChange={(open) => setFormDialog({ open, masterTable: undefined })}
        masterTable={formDialog.masterTable}
        onSubmit={handleSubmitForm}
      />

      <MasterTableFieldsDialog
        open={fieldsDialog.open}
        onOpenChange={(open) =>
          setFieldsDialog({
            open,
            masterTable: open ? fieldsDialog.masterTable : null,
          })
        }
        masterTable={fieldsDialog.masterTable}
      />
    </div>
  );
}
