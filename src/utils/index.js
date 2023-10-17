import "dotenv/config";
import EventSource from "eventsource";

export const openSSEConnection = (endpoint) => {
  const eventSource = new EventSource(endpoint);

  eventSource.onopen = () => {
    console.log(`connection to ${endpoint} opened!`);
  };

  eventSource.onmessage = (e) => {
    console.log(JSON.parse(e.data));
  };

  eventSource.onerror = (error) => {
    console.error("SSE error:", error);
  };
};

export const delay = async (time) => {
  await new Promise((resolve) => setTimeout(resolve, time));
};
