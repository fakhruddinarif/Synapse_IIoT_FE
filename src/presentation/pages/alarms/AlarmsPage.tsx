import { useMemo } from "react";
import { Table, Button } from "@ui/components";
import type { ColumnDef } from "@tanstack/react-table";
import type { Alarm } from "@core/domain/entities";
import { AlarmLevel } from "@core/domain/enums";

const alarms: Alarm[] = [
  {
    id: "alarm-01",
    deviceId: "dev-02",
    level: AlarmLevel.CRITICAL,
    message: "Pressure exceeded threshold",
    acknowledged: false,
    createdAt: "2026-05-11 10:31",
  },
];

const AlarmsPage = () => {
  const columns = useMemo<ColumnDef<Alarm>[]>(
    () => [
      { header: "Device", accessorKey: "deviceId" },
      { header: "Level", accessorKey: "level" },
      { header: "Message", accessorKey: "message" },
      { header: "Time", accessorKey: "createdAt" },
      {
        header: "Action",
        cell: () => <Button size="xs">Acknowledge</Button>,
      },
    ],
    [],
  );

  return <Table data={alarms} columns={columns} />;
};

export default AlarmsPage;
