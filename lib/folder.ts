import Client from "./client";
import { FolderParameters, FolderUpdateParameters } from "./interfaces/folder";
import { JotformResponse } from "./types/response";

export default class Folder {
    
  client: Client;
  
  constructor(client: Client) {
    this.client = client;
  }

  /**
   * Get a list of forms in a folder, and other details about the form such as folder color.
   * @param folderId Folder ID.
   */
  get(folderId: string): JotformResponse {
    return this.client.get(`/folder/${folderId}`);
  }

  /**
   * Create a folder with supplied parameters
   * @param folderParameters Folder creation parameters.
   */
  create(folderParameters: FolderParameters): JotformResponse {
    return this.client.postForm('/folder', {
      ...folderParameters
    });
  }

  /**
   * Delete a folder
   * @param folderId Folder ID.
   */
  delete(folderId: string): JotformResponse {
    return this.client.delete(`/folder/${folderId}`);
  }

  /**
   * Update the supplied folder with parameters
   * @param folderParameters Folder ID.
   * @param parameters Properties to update
   */
  update(folderId: string, parameters: FolderUpdateParameters): JotformResponse {
    return this.client.put(`/folder/${folderId}`, parameters);
  }
}
