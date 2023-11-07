import { SmoothSailClient } from "./SmoothSailClient";
import crypto from "crypto";

export class SmoothSailConfig {
  constructor(sdkKey, serverAddress) {
    this.sdkKey = this.parseAndEncryptSDK(sdkKey);
    this.serverAddress = serverAddress;
  }

  async connect() {
    const client = new SmoothSailClient(this);
    try {
      client.openSSEConnection();
      return client;
    } catch (error) {
      console.log("SmoothSail Server Client: Connection failed.");
      return client;
    }
  }

  parseAndEncryptSDK(key) {
    try {
      let sdkKey = this.parseSdkKey(key);
      let iv = this.parseIV(key);
      return this.encryptSdk(sdkKey, iv);
    } catch (error) {
      console.log("Invalid Credentials. Check SmoothSail App for SDK Key.");
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
