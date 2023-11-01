import { SmoothSailClient } from "./SmoothSailClient";

export class SmoothSailConfig {
  constructor(sdkKey, serverAddress) {
    this.sdkKey = sdkKey;
    // could we authenticate here?
    this.serverAddress = serverAddress;
    this.developmentAddress = "http://localhost:3001/api/flags";
  }

  async connect() {
    const client = new SmoothSailClient(this);
    try {
      await client.fetchFeatureFlags();
      client.openSSEConnection();
      return client;
    } catch (error) {
      console.log("SmoothSail Server Client: connection failed");
      return client;
    }
  }
}
