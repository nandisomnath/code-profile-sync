
import Commons from "./commons";
import { Environment } from "./environmentPath";
import { IExtensionState } from "./models/state.model";

export const state: IExtensionState = {
  instanceID: Math.random().toString(),
  environment: new Environment(),
  commons: new Commons(),
  context: null
};
