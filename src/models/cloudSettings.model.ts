import { Environment } from "../environmentPath";

export class CloudSettings {
  public lastUpload: Date|null = null;
  public extensionVersion: string = "v" + Environment.getVersion();
}
