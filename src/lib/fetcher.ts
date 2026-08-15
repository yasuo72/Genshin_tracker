export class FetchError extends Error {
  info: unknown;
  status: number;

  constructor(message: string, info: unknown, status: number) {
    super(message);
    this.info = info;
    this.status = status;
    this.name = "FetchError";
  }
}

export const fetcher = async <T = unknown>(url: string): Promise<T> => {
  const res = await fetch(url);

  if (!res.ok) {
    let errorData: unknown;
    try {
      errorData = await res.json();
    } catch {
      errorData = { error: "UNKNOWN_ERROR" };
    }
    throw new FetchError(
      `An error occurred while fetching the data. Status: ${res.status}`,
      errorData,
      res.status
    );
  }

  return res.json();
};
