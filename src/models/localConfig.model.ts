import { CustomConfig } from "./customConfig.model";
import { ExtensionConfig } from "./extensionConfig.model";

export class LocalConfig {
  public publicGist: boolean = false;
  public userName: string|null = null;
  public name: string|null = null;
  public extConfig = new ExtensionConfig();
  public customConfig = new CustomConfig();
}
