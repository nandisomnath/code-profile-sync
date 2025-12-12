import { ExtensionContext } from "vscode";
import Commons from "../commons";
import { Environment } from "../environmentPath";

export interface IExtensionState {
  context: ExtensionContext|null;
  environment: Environment|null;
  commons: Commons|null;
  instanceID: string;
}
