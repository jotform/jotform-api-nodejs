import { ReportType } from "../enums/report";

export interface ReportFields {
  ip?: boolean;
  submissionDate?: boolean;
  questionIds?: string[];
}

export interface ReportParameters {
  title: string;
  type: ReportType;
  fields?: ReportFields;
}
