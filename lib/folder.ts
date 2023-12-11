import Client from "./client";
import { FolderParameters, FolderUpdateParameters } from "./interfaces/folder";
import { JotformResponse } from "./types/response";

export default class Folder {
    
  client: Client;
  
  constructor(client: Client) {
    this.client = client;
  }

  get(folderId: string): JotformResponse {
    return this.client.get(`/folder/${folderId}`);
  }

  create(folderParameters: FolderParameters): JotformResponse {
    return this.client.postForm('/folder', {
      ...folderParameters
    });
  }

  delete(folderId: string): JotformResponse {
    return this.client.delete(`/folder/${folderId}`);
  }

  update(folderId: string, parameters: FolderUpdateParameters): JotformResponse {
    return this.client.put(`/folder/${folderId}`, parameters);
  }
}
