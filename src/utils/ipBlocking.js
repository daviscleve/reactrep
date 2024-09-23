import { IpList } from "./ipList";

export class IpBlockList {
  constructor(whitelist = [], blacklist = []) {
    this.statusid = { negative: -1, neutral: 0, positive: 1 };
    this.whitelist = new IpList(whitelist);
    this.blacklist = new IpList(blacklist);
    this.message = null;
    this.status = null;
  }

  ipPass(ip) {
    if (!this.isValidIP(ip)) throw new Error("Requires valid IPv4 address");

    if (this.whitelist.isInList(ip)) {
      this.message = `${ip} is whitelisted.`;
      this.status = this.statusid.positive;
      return true;
    } else if (this.blacklist.isInList(ip)) {
      this.message = `${ip} is blacklisted.`;
      this.status = this.statusid.negative;
      return false;
    } else {
      this.message = `${ip} is unlisted.`;
      this.status = this.statusid.neutral;
      return true;
    }
  }

  isValidIP(ip) {
    return /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/.test(
      ip
    );
  }
}
