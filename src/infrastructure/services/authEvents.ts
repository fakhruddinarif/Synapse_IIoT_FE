type UnauthorizedHandler = () => void;

let unauthorizedHandler: UnauthorizedHandler | null = null;

/** Registers a handler for unauthorized responses. */
export const setAuthUnauthorizedHandler = (handler: UnauthorizedHandler) => {
  unauthorizedHandler = handler;
};

/** Invoked when the backend returns 401. */
export const handleUnauthorized = () => {
  unauthorizedHandler?.();
};
