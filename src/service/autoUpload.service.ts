import * as vscode from "vscode";
import { FSWatcher, watch } from "chokidar";
import localize from "../localize";
import lockfile from "../lockfile";
import { CustomConfig } from "../models/customConfig.model";
import { state } from "../state";
import { Util } from "../util";
import { FileService } from "./file.service";

export class AutoUploadService {
  public static GetIgnoredItems(customSettings: CustomConfig) {
    return [
      ...customSettings.ignoreUploadFolders.map(folder => `**/${folder}/**`),
      ...customSettings.ignoreUploadFiles.map(file => `**/${file}`)
    ];
  }

  public watching = false;
  private watcher: FSWatcher|null = null;

  constructor(private ignored: string[]) {

    if (state.environment === null || state.environment.USER_FOLDER === null) {
      throw new Error("state.environment.USER_FOLDER is null");
    }

    this.watcher = watch(state.environment.USER_FOLDER, {
      depth: 2,
      ignored: this.ignored
    });

    vscode.extensions.onDidChange(async () => {
      if (this.watching && vscode.window.state.focused) {
        console.log("Sync: Extensions changed");

        if (state.environment === null) {
          throw new Error("state.environment is null");
        }

        if (state.environment.FILE_SYNC_LOCK === null) {
          throw new Error("state.environment.FILE_SYNC_LOCK is null");
        }
        
        if (await lockfile.Check(state.environment.FILE_SYNC_LOCK)) {
          return;
        } else {
          await lockfile.Lock(state.environment.FILE_SYNC_LOCK);
        }

        if (state.commons === null) {
          throw new Error("state.commons is null");
        }

        const customConfig = await state.commons.GetCustomSettings();
        if (!customConfig.downloadPublicGist) {
          await this.InitiateAutoUpload();
        }

        if (state.environment.FILE_SYNC_LOCK === null) {
          throw new Error("state.environment.FILE_SYNC_LOCK is null");
        }

        await lockfile.Unlock(state.environment.FILE_SYNC_LOCK);
        return;
      }
    });
  }

  public async StartWatching() {
    this.StopWatching();

    this.watching = true;

    if (this.watcher === null) {
      throw new Error("this.watcher is null");
    }

    this.watcher.addListener("change", async (path: string) => {
      if (this.watching && vscode.window.state.focused) {
        console.log(`Sync: ${FileService.ExtractFileName(path)} changed`);

        if (state.environment === null || state.environment.FILE_SYNC_LOCK === null) {
          throw new Error("state.environment.FILE_SYNC_LOCK is null");
        }

        if (await lockfile.Check(state.environment.FILE_SYNC_LOCK)) {
          return;
        } else {
          await lockfile.Lock(state.environment.FILE_SYNC_LOCK);
        }

        if (state.commons === null) {
          throw new Error("state.commons is null");
        }

        const customConfig = await state.commons.GetCustomSettings();
        if (customConfig) {
          const fileType: string = path
            .substring(path.lastIndexOf("."), path.length)
            .slice(1);
          if (
            customConfig.supportedFileExtensions.includes(fileType) &&
            !customConfig.downloadPublicGist
          ) {
            await this.InitiateAutoUpload();
          }
        }
        await lockfile.Unlock(state.environment.FILE_SYNC_LOCK);
        return;
      }
    });
  }

  public StopWatching() {
    if (this.watcher) {
      this.watcher.removeAllListeners();
    }
    this.watching = false;
  }

  private async InitiateAutoUpload() {
    
    if (state.commons === null) {
          throw new Error("state.commons is null");
        }

    const customSettings = await state.commons.GetCustomSettings();

    vscode.window.setStatusBarMessage("").dispose();
    vscode.window.setStatusBarMessage(
      localize("common.info.initAutoUpload").replace(
        "{0}",
        String(customSettings.autoUploadDelay)
      ),
      5000
    );

    await Util.Sleep(customSettings.autoUploadDelay * 1000);

    vscode.commands.executeCommand("extension.updateSettings", "forceUpdate");
  }
}
