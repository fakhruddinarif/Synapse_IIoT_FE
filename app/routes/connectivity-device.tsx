import { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "~/components/ui/breadcrumb";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { NoData } from "~/components/ui/no-data";

interface Device {
  id: string;
  noTransaction: string;
  date: string;
  lotNo: string;
  pro: string;
  scales: string;
  material: string;
  codeSap: string;
  shift: string;
  operator: string;
  operatorName?: string;
  operatorPhoto?: string;
  isPassed: boolean;
  isApproved: boolean;
}

export default function ConnectivityDevice() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Dummy data - ganti dengan data real dari API
  const devices: Device[] = [];
  const totalRecords = devices.length;
  const totalPages = Math.ceil(totalRecords / itemsPerPage);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const value = (e.target as HTMLInputElement).value;
      setSearchTerm(value);
      // Implement search logic
    }
  };

  const handleAddDevice = () => {
    // Open modal or navigate to add device page
    console.log("Add device");
  };

  return (
    <div>
      {/* Breadcrumb navigation */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Devices</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Main content */}
      {/* <Card className="mt-4">
        <CardHeader>
          <div className="flex justify-between items-center mb-4">
            <Button onClick={handleAddDevice} className="gap-2">
              <i className="ri-add-line" />
              Add Device
            </Button>

            <div className="relative w-64">
              <Input
                type="text"
                placeholder="Search..."
                onKeyUp={handleSearch}
                className="pr-10"
              />
              <i className="ri-search-line absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {totalRecords > 0 ? (
            <div>
              <div className="relative overflow-x-auto rounded-lg border">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-gray-50 border-b">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        #
                      </th>
                      <th scope="col" className="px-6 py-3">
                        No Transaction
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Lot No
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Pro
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Scales
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Material
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Code SAP
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Shift
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Operator
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Passed
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Approved
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {devices.map((device, index) => (
                      <tr
                        key={index}
                        className="bg-white border-b hover:bg-gray-50"
                      >
                        <td className="px-6 py-4">
                          {index + 1 + (currentPage - 1) * itemsPerPage}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="flex justify-end mt-4">
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Button>
                      ),
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <NoData
              title="No Devices Found"
              description="There are no devices available. Start by adding your first device."
              actionLabel="Add Device"
              onAction={handleAddDevice}
            />
          )}
        </CardContent>
      </Card> */}
    </div>
  );
}
