/** Base URL backend, tanpa `/api` — SignalR hub berada di luar prefix itu. */
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5009'

export const API_URL = `${API_BASE_URL}/api`

/** Path hub SignalR sesuai `app.MapHub<DeviceDataHub>` di Program.cs. */
export const HUB_URL = `${API_BASE_URL}/signalr/device-hub`
