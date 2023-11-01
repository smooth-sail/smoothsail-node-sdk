import { SmoothSailClient } from "./SmoothSailClient";

export class SmoothSailConfig {
  constructor(sdkKey, bearerAddress) {
    this.sdkKey = sdkKey;
    // could we authenticate here?
    this.bearerAddress = bearerAddress;
    this.devAddress = "http://localhost:3001/api/flags";
  }

  async connect() {
    const client = new SmoothSailClient(this);
    try {
      await client.fetchFeatureFlags();
      await client.openSSEConnection();
      return client;
    } catch (error) {
      console.log("SmoothSail Server Client: connection failed");
      return client;
    }
  }
}
