export interface FolderParameters {
  name: string;
  parent?: string;
  color?: string;
}

export interface FolderUpdateParameters {
  path?: string;
  forms?: string[];
  name?: string;
  parent?: string;
  color?: string;
  [key: string]: unknown;
}
