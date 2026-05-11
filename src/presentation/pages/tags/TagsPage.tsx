import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Table } from "@ui/components";
import type { Tag } from "@core/domain/entities";
import { DataType } from "@core/domain/enums";

const tags: Tag[] = [
  {
    id: "tag-01",
    deviceId: "dev-01",
    name: "Inlet Pressure",
    address: "40001",
    dataType: DataType.FLOAT,
    unit: "psi",
  },
];

const TagsPage = () => {
  const columns = useMemo<ColumnDef<Tag>[]>(
    () => [
      { header: "Tag", accessorKey: "name" },
      { header: "Address", accessorKey: "address" },
      { header: "Type", accessorKey: "dataType" },
      { header: "Unit", accessorKey: "unit" },
    ],
    [],
  );

  return <Table data={tags} columns={columns} />;
};

export default TagsPage;
