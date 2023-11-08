# Mock Feature Flag Consumer Application

Set up the following environmental variables in an .env file.

- PORT=<port>
- SSE_ENDPOINT=<endpoint-url>
- SDK_KEY=<sdk-key>
- SECRET_KEY=<secret>

### Instructions for initializing a SDK

```
let client;
const config = new SmoothSailConfig("important SDK key", "bearer address");

(async () => {
  client = await config.connect();
})();
```
