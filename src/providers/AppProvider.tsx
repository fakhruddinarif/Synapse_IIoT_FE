import React from "react";

export const AppProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return <>{children}</>;
};

export default AppProvider;
