import "dotenv/config";
import axios from "axios";
import EventSource from "eventsource";
import TEST_FLAGS from "../data/testFlags";
import { Flag } from "./classes/Flag";

const GET_ALL_FLAGS = "http://localhost:3001/api/flags";

export class SDKClient {
  constructor() {
    this.flagData = {};
    this.last_updated;
    this.fetchFeatureFlags();
    this.openSSEConnection();
    this.updatedLastUpdated();
  }

  async fetchFeatureFlags() {
    try {
      const { data } = await axios.get(GET_ALL_FLAGS);
      this.setFlags(data.payload);
      console.log("flag data", this.flagData);

      // with test data
      // let featureFlags = TEST_FLAGS.payload;
      // for (let flag in featureFlags) {
      //   this.flagData[flag] = new Flag(featureFlags[flag]);
      //   console.log(this.flagData);
      // }
    } catch (error) {
      throw error;
    }
  }

  setFlags(flags) {
    this.flagData = {};
    for (let flag in flags) {
      this.flagData[flag] = new Flag(flags[flag]);
    }
  }

  evaluateFlag(flagKey, userContext) {
    const flag = this.flagData[flagKey];
    return flag && flag.evaluateFlag(userContext);
  }

  updatedLastUpdated() {
    // update the last_updated
    // will this be sent with the flag data or
    // should this be to time now when SSE notification received?
  }

  openSSEConnection() {
    const eventSource = new EventSource(process.env.SSE_ENDPOINT);

    eventSource.onopen = () => {
      console.log(`connection to ${process.env.SSE_ENDPOINT} opened!`);
    };

    eventSource.onmessage = (e) => {
      const notification = JSON.parse(e.data);
      console.log(notification);
      this.setFlags(notification);
    };

    eventSource.onerror = (error) => {
      console.error("SSE error:", error);
    };
  }
}
