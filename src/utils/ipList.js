export class IpList {
  constructor(list) {
    this.iplist = list.map((ip) => this.normal(ip));
  }

  isInList(ip) {
    for (let ipf of this.iplist) {
      if (this.ipInRange(ip, ipf)) {
        this.range = ipf;
        return true;
      }
    }
    return false;
  }

  normal(range) {
    if (!/[*\-\/]/.test(range)) {
      range += "/32";
    }
    return range.replace(/\s+/g, "");
  }

  ipInRange(ip, range) {
    if (range.includes("/")) {
      const [baseIp, netmask] = range.split("/");
      if (netmask.includes(".")) {
        const dnetmask = this.ipToLong(netmask.replace("*", "0"));
        return (
          (this.ipToLong(ip) & dnetmask) === (this.ipToLong(baseIp) & dnetmask)
        );
      } else {
        const dnetmask = ~(Math.pow(2, 32 - parseInt(netmask, 10)) - 1);
        return (
          (this.ipToLong(ip) & dnetmask) === (this.ipToLong(baseIp) & dnetmask)
        );
      }
    } else {
      if (range.includes("*")) {
        const low = range.replace("*", "0");
        const high = range.replace("*", "255");
        return this.compareRanges(ip, low, high);
      } else if (range.includes("-")) {
        const [low, high] = range.split("-");
        return this.compareRanges(ip, low, high);
      } else {
        return ip === range;
      }
    }
  }

  compareRanges(ip, low, high) {
    const dip = this.ipToLong(ip);
    const dlow = this.ipToLong(low);
    const dhigh = this.ipToLong(high);
    return dip >= dlow && dip <= dhigh;
  }

  ipToLong(ip) {
    return (
      ip
        .split(".")
        .reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0
    );
  }
}
