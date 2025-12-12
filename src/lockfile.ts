import * as lockfile from "lockfile";
import { Util } from "./util";

interface IOptions {
  wait: number;
  pollPeriod: number;
  stale: number;
  retries: number;
  retryWait: number;
}

export default {
  Check,
  Lock,
  Unlock
};

export function Check(
  filepath: string,
  options: IOptions = {
    wait: 0,
    pollPeriod: 0,
    stale: 0,
    retries: 0,
    retryWait: 0
  }
): Promise<boolean> {
  return Util.promisify(lockfile.check)(filepath, options);
}

export function Lock(
  filepath: string,
  options: IOptions = {
    wait: 0,
    pollPeriod: 0,
    stale: 0,
    retries: 0,
    retryWait: 0
  }
): Promise<boolean> {
  return Util.promisify(lockfile.lock)(filepath, options);
}

export function Unlock(filepath: string): Promise<boolean> {
  return Util.promisify(lockfile.unlock)(filepath);
}
