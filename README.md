# Mock Feature Flag Consumer Application

Set up the following environmental variables in an .env file.

- PORT=<port>
- SSE_ENDPOINT=<endpoint-url>

### Instructions for initializing a SDK

- already done in `users.js` in routes for example app

```
let client;
const config = new SmoothSailConfig("important SDK key", "bearer address");

(async () => {
  client = await config.connect();
})();
```
