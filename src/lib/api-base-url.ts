const FALLBACK_API_BASE_URL = "http://localhost:3030";

const normalizeBaseUrl = (value: string | undefined) => {
  if (!value) {
    return null;
  }

  const trimmedValue = value.trim();

  if (!trimmedValue || trimmedValue === "undefined" || trimmedValue === "null") {
    return null;
  }

  return trimmedValue;
};

export const getApiBaseUrl = () => {
  if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
    return FALLBACK_API_BASE_URL;
  }

  return (
    normalizeBaseUrl(process.env.NEXT_PUBLIC_BASE_API_URL) ||
    normalizeBaseUrl(process.env.NEXT_PUBLIC_BASE_API) ||
    FALLBACK_API_BASE_URL
  );
};