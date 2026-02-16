export class ApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly errors?: string[],
  ) {
    super(message);
    this.name = "ApiError";
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  static fromResponse(response: {
    message?: string;
    status?: number;
    error?: string[];
  }): ApiError {
    return new ApiError(
      response.message || "An error occurred",
      response.status,
      response.error,
    );
  }

  isUnauthorized(): boolean {
    return this.statusCode === 401;
  }

  isForbidden(): boolean {
    return this.statusCode === 403;
  }

  isValidationError(): boolean {
    return this.statusCode === 400 && !!this.errors?.length;
  }
}

export class NetworkError extends Error {
  constructor(message: string = "Network error occurred") {
    super(message);
    this.name = "NetworkError";
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}
