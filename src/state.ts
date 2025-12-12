import { IExtensionState } from "./models/state.model";

export const state: IExtensionState = {
  instanceID: Math.random().toString(),
  environment: null,
  commons: null,
  context: null
};
