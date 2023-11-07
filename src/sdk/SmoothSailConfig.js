import { SmoothSailClient } from "./SmoothSailClient";
import crypto from "crypto";

export class SmoothSailConfig {
  constructor(sdkKey, serverAddress) {
    this.sdkKey = this.encryptSdk(
      this.parseSdkKey(sdkKey),
      this.parseIV(sdkKey)
    );
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

  createCipher(iv) {
    const ivInBytes = Buffer.from(iv, "hex");
    return crypto.createCipheriv(
      "aes-256-cbc",
      process.env.SECRET_KEY,
      ivInBytes
    );
  }

  encryptSdk(key, iv) {
    const cipher = this.createCipher(iv);
    let encryptedString = cipher.update(key, "utf8", "hex");
    encryptedString += cipher.final("hex");
    return encryptedString;
  }

  parseSdkKey(inputKey) {
    return inputKey.split(":")[1];
  }

  parseIV(inputKey) {
    return inputKey.split(":")[0];
  }
}
