import { Json } from "../types/common";

export interface PaginationParameters {
  offset?: number;
  limit?: number;
  filter?: Json;
  orderby?: string;
  direction?: "ASC" | "DESC";
}

export interface RequestConfig {
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
}
