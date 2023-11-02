import { SmoothSailClient } from "./SmoothSailClient";

export class SmoothSailConfig {
  constructor(sdkKey, serverAddress) {
    this.sdkKey = sdkKey;
    this.serverAddress = serverAddress;
  }

  async connect() {
    const client = new SmoothSailClient(this);
    try {
      client.openSSEConnection();
      return client;
    } catch (error) {
      console.log("SmoothSail Server Client: connection failed");
      return client;
    }
  }
}
