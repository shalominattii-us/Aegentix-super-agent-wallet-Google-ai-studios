/**
 * Coinbase Wallet Error Handler Hook
 * Comprehensive error handling for Coinbase CDP integration
 */

import { useCallback } from "react";

export type CoinbaseErrorType =
  | "NETWORK_ERROR"
  | "AUTH_ERROR"
  | "INSUFFICIENT_FUNDS"
  | "INVALID_ADDRESS"
  | "TRANSACTION_FAILED"
  | "SESSION_EXPIRED"
  | "SPENDING_LIMIT_EXCEEDED"
  | "SERVICE_UNAVAILABLE"
  | "UNKNOWN_ERROR";

export interface CoinbaseError {
  type: CoinbaseErrorType;
  message: string;
  details?: string;
  code?: string;
  retryable: boolean;
}

const ERROR_MESSAGES: Record<CoinbaseErrorType, string> = {
  NETWORK_ERROR: "Network connection failed. Please check your internet connection.",
  AUTH_ERROR: "Authentication failed. Please log in again.",
  INSUFFICIENT_FUNDS: "Insufficient funds for this transaction.",
  INVALID_ADDRESS: "Invalid wallet address provided.",
  TRANSACTION_FAILED: "Transaction failed. Please try again.",
  SESSION_EXPIRED: "Your session has expired. Please refresh and try again.",
  SPENDING_LIMIT_EXCEEDED: "Transaction exceeds your spending limit.",
  SERVICE_UNAVAILABLE: "Coinbase service is temporarily unavailable.",
  UNKNOWN_ERROR: "An unexpected error occurred.",
};

/**
 * Simple toast notification system
 */
function showToast(message: string, type: "error" | "warning" | "success" | "info" = "info") {
  const bgColor = {
    error: "bg-red-900",
    warning: "bg-yellow-900",
    success: "bg-green-900",
    info: "bg-blue-900",
  }[type];

  const textColor = {
    error: "text-red-100",
    warning: "text-yellow-100",
    success: "text-green-100",
    info: "text-blue-100",
  }[type];

  const toast = document.createElement("div");
  toast.className = `fixed bottom-4 right-4 ${bgColor} ${textColor} px-4 py-3 rounded-lg shadow-lg max-w-sm z-50 animate-in fade-in slide-in-from-bottom-4 duration-300`;
  toast.textContent = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("animate-out", "fade-out", "slide-out-to-bottom-4");
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

export function useCoinbaseErrorHandler() {
  const parseCoinbaseError = useCallback((error: unknown): CoinbaseError => {
    // Handle string errors
    if (typeof error === "string") {
      if (error.includes("insufficient") || error.includes("balance")) {
        return {
          type: "INSUFFICIENT_FUNDS",
          message: ERROR_MESSAGES.INSUFFICIENT_FUNDS,
          details: error,
          retryable: false,
        };
      }

      if (error.includes("address")) {
        return {
          type: "INVALID_ADDRESS",
          message: ERROR_MESSAGES.INVALID_ADDRESS,
          details: error,
          retryable: false,
        };
      }

      if (error.includes("spending") || error.includes("limit")) {
        return {
          type: "SPENDING_LIMIT_EXCEEDED",
          message: ERROR_MESSAGES.SPENDING_LIMIT_EXCEEDED,
          details: error,
          retryable: false,
        };
      }

      if (error.includes("session") || error.includes("expired")) {
        return {
          type: "SESSION_EXPIRED",
          message: ERROR_MESSAGES.SESSION_EXPIRED,
          details: error,
          retryable: true,
        };
      }

      if (error.includes("network") || error.includes("connection")) {
        return {
          type: "NETWORK_ERROR",
          message: ERROR_MESSAGES.NETWORK_ERROR,
          details: error,
          retryable: true,
        };
      }

      if (error.includes("auth") || error.includes("unauthorized")) {
        return {
          type: "AUTH_ERROR",
          message: ERROR_MESSAGES.AUTH_ERROR,
          details: error,
          retryable: true,
        };
      }

      if (error.includes("unavailable") || error.includes("service")) {
        return {
          type: "SERVICE_UNAVAILABLE",
          message: ERROR_MESSAGES.SERVICE_UNAVAILABLE,
          details: error,
          retryable: true,
        };
      }

      return {
        type: "UNKNOWN_ERROR",
        message: ERROR_MESSAGES.UNKNOWN_ERROR,
        details: error,
        retryable: true,
      };
    }

    // Handle Error objects
    if (error instanceof Error) {
      const message = error.message;

      if (message.includes("insufficient") || message.includes("balance")) {
        return {
          type: "INSUFFICIENT_FUNDS",
          message: ERROR_MESSAGES.INSUFFICIENT_FUNDS,
          details: message,
          code: "ERR_INSUFFICIENT_FUNDS",
          retryable: false,
        };
      }

      if (message.includes("address")) {
        return {
          type: "INVALID_ADDRESS",
          message: ERROR_MESSAGES.INVALID_ADDRESS,
          details: message,
          code: "ERR_INVALID_ADDRESS",
          retryable: false,
        };
      }

      if (message.includes("spending") || message.includes("limit")) {
        return {
          type: "SPENDING_LIMIT_EXCEEDED",
          message: ERROR_MESSAGES.SPENDING_LIMIT_EXCEEDED,
          details: message,
          code: "ERR_SPENDING_LIMIT",
          retryable: false,
        };
      }

      if (message.includes("session") || message.includes("expired")) {
        return {
          type: "SESSION_EXPIRED",
          message: ERROR_MESSAGES.SESSION_EXPIRED,
          details: message,
          code: "ERR_SESSION_EXPIRED",
          retryable: true,
        };
      }

      if (message.includes("network") || message.includes("connection")) {
        return {
          type: "NETWORK_ERROR",
          message: ERROR_MESSAGES.NETWORK_ERROR,
          details: message,
          code: "ERR_NETWORK",
          retryable: true,
        };
      }

      if (message.includes("auth") || message.includes("unauthorized")) {
        return {
          type: "AUTH_ERROR",
          message: ERROR_MESSAGES.AUTH_ERROR,
          details: message,
          code: "ERR_AUTH",
          retryable: true,
        };
      }

      if (message.includes("unavailable") || message.includes("service")) {
        return {
          type: "SERVICE_UNAVAILABLE",
          message: ERROR_MESSAGES.SERVICE_UNAVAILABLE,
          details: message,
          code: "ERR_SERVICE_UNAVAILABLE",
          retryable: true,
        };
      }

      return {
        type: "UNKNOWN_ERROR",
        message: ERROR_MESSAGES.UNKNOWN_ERROR,
        details: message,
        code: error.name,
        retryable: true,
      };
    }

    // Handle object errors
    if (typeof error === "object" && error !== null) {
      const errorObj = error as Record<string, unknown>;

      if (errorObj.message) {
        return parseCoinbaseError(errorObj.message);
      }

      if (errorObj.error) {
        return parseCoinbaseError(errorObj.error);
      }
    }

    return {
      type: "UNKNOWN_ERROR",
      message: ERROR_MESSAGES.UNKNOWN_ERROR,
      details: JSON.stringify(error),
      retryable: true,
    };
  }, []);

  const showError = useCallback(
    (error: unknown, title?: string) => {
      const parsedError = parseCoinbaseError(error);

      showToast(`${title || "Error"}: ${parsedError.message}`, "error");

      console.error("[COINBASE-ERROR]", {
        type: parsedError.type,
        message: parsedError.message,
        details: parsedError.details,
        code: parsedError.code,
        retryable: parsedError.retryable,
      });

      return parsedError;
    },
    [parseCoinbaseError]
  );

  const showWarning = useCallback((message: string, title?: string) => {
    showToast(`${title || "Warning"}: ${message}`, "warning");
  }, []);

  const showSuccess = useCallback((message: string, title?: string) => {
    showToast(`${title || "Success"}: ${message}`, "success");
  }, []);

  const showInfo = useCallback((message: string, title?: string) => {
    showToast(`${title || "Info"}: ${message}`, "info");
  }, []);

  return {
    parseCoinbaseError,
    showError,
    showWarning,
    showSuccess,
    showInfo,
    ERROR_MESSAGES,
  };
}
