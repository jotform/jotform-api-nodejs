export interface LoginOptions {
  appName?: string;
  access?: string;
}

export interface UserHistoryOptions {
  action?: string;
  date?: string;
  sortBy: string;
  startDate: string;
  endDate: string;
}
