import * as vscode from "vscode";
import { Environment } from "./environmentPath";
import { state } from "./state";
import { Sync } from "./sync";


export async function activate(context: vscode.ExtensionContext) {
  state.context = context;
  state.environment = new Environment();
  const sync = new Sync();
  sync.bootstrap();
  
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "code-profile-sync.updateSettings",
      (optArgument?: string) => {
        sync.upload.bind(sync, optArgument)();
      }
    )
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "code-profile-sync.downloadSettings",
      sync.download.bind(sync)
    )
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "code-profile-sync.resetSettings",
      sync.reset.bind(sync)
    )
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "code-profile-sync.HowSettings",
      sync.how.bind(sync)
    )
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "code-profile-sync.otherOptions",
      sync.advance.bind(sync)
    )
  );
}
