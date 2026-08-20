import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const baseProps: IconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

const createIcon = (paths: React.ReactNode) => (props: IconProps) => (
  <svg {...baseProps} {...props}>
    {paths}
  </svg>
);

export const MenuIcon = createIcon(
  <>
    <path d="M4 6h16" />
    <path d="M4 12h16" />
    <path d="M4 18h16" />
  </>,
);

export const SparkIcon = createIcon(
  <>
    <path d="M12 2l1.8 5.5L19 9.3l-5.2 1.8L12 16l-1.8-4.9L5 9.3l5.2-1.8z" />
    <path d="M5 18l1 3 1-3 3-1-3-1-1-3-1 3-3 1z" />
  </>,
);

export const DashboardIcon = createIcon(
  <>
    <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h4A1.5 1.5 0 0 1 11 5.5v4A1.5 1.5 0 0 1 9.5 11h-4A1.5 1.5 0 0 1 4 9.5z" />
    <path d="M13 5.5A1.5 1.5 0 0 1 14.5 4h4A1.5 1.5 0 0 1 20 5.5v10a1.5 1.5 0 0 1-1.5 1.5h-4A1.5 1.5 0 0 1 13 15.5z" />
    <path d="M4 15.5A1.5 1.5 0 0 1 5.5 14h4A1.5 1.5 0 0 1 11 15.5v4A1.5 1.5 0 0 1 9.5 21h-4A1.5 1.5 0 0 1 4 19.5z" />
  </>,
);

export const DeviceIcon = createIcon(
  <>
    <rect x="6" y="4" width="12" height="16" rx="2" />
    <path d="M9 8h6" />
    <path d="M10 16h4" />
  </>,
);

export const TableIcon = createIcon(
  <>
    <rect x="4" y="5" width="16" height="14" rx="2" />
    <path d="M4 10h16" />
    <path d="M9 5v14" />
    <path d="M15 5v14" />
  </>,
);

export const FlowIcon = createIcon(
  <>
    <path d="M5 7h7a4 4 0 0 1 4 4v0a4 4 0 0 0 4 4h-4" />
    <path d="M5 17h7a4 4 0 0 0 4-4v0a4 4 0 0 1 4-4h-4" />
    <circle cx="5" cy="7" r="1.5" />
    <circle cx="19" cy="7" r="1.5" />
    <circle cx="5" cy="17" r="1.5" />
    <circle cx="19" cy="17" r="1.5" />
  </>,
);

export const TagIcon = createIcon(
  <>
    <path d="M20 13l-7 7-9-9V4h7l9 9z" />
    <circle cx="8.5" cy="8.5" r="1.2" />
  </>,
);

export const FileIcon = createIcon(
  <>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
    <path d="M14 3v5h5" />
  </>,
);

export const ShieldIcon = createIcon(
  <>
    <path d="M12 3l7 3v5c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6z" />
    <path d="M9 12l2 2 4-5" />
  </>,
);

export const ActivityIcon = createIcon(<path d="M4 12h3l2-5 4 10 2-5h5" />);

export const SearchIcon = createIcon(
  <>
    <circle cx="11" cy="11" r="6" />
    <path d="m16 16 4 4" />
  </>,
);

export const PlusIcon = createIcon(
  <>
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </>,
);

export const RefreshIcon = createIcon(
  <>
    <path d="M20 12a8 8 0 1 1-2.34-5.66" />
    <path d="M20 4v6h-6" />
  </>,
);

export const LogoutIcon = createIcon(
  <>
    <path d="M10 17l5-5-5-5" />
    <path d="M15 12H4" />
    <path d="M20 4v16" />
  </>,
);

export const CheckIcon = createIcon(<path d="m5 13 4 4L19 7" />);

export const AlertIcon = createIcon(
  <>
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
    <path d="M10.3 4.5h3.4l7.3 12.7A2 2 0 0 1 19.3 20H4.7a2 2 0 0 1-1.7-2.8z" />
  </>,
);

export const UploadIcon = createIcon(
  <>
    <path d="M12 16V4" />
    <path d="m7 9 5-5 5 5" />
    <path d="M5 20h14" />
  </>,
);

export const ConnectionIcon = createIcon(
  <>
    <path d="M8 12a4 4 0 1 1 8 0" />
    <path d="M5 12a7 7 0 1 1 14 0" />
    <path d="M12 19h.01" />
  </>,
);

export const ServerIcon = createIcon(
  <>
    <rect x="4" y="5" width="16" height="5" rx="2" />
    <rect x="4" y="14" width="16" height="5" rx="2" />
    <path d="M7 7h.01" />
    <path d="M7 16h.01" />
  </>,
);

export const UserIcon = createIcon(
  <>
    <circle cx="12" cy="8" r="3.5" />
    <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
  </>,
);

export const PlayIcon = createIcon(<path d="m8 5 11 7-11 7z" />);

export const EditIcon = createIcon(
  <>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
  </>,
);

export const TrashIcon = createIcon(
  <>
    <path d="M3 6h18" />
    <path d="M8 6V4h8v2" />
    <path d="M6 6l1 14h10l1-14" />
    <path d="M10 11v5" />
    <path d="M14 11v5" />
  </>,
);
