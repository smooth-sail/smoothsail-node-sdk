# SmoothSail Server-Side Node SDK

Set up the following environmental variables in an `.env` file.

- SSE_ENDPOINT=endpoint-url
- SDK_KEY=sdk-key
- SECRET_KEY=secret

### Initializing the SDK

```
let client;
const config = new SmoothSailConfig("SDK key", "bearer address");

(async () => {
  client = await config.connect();
})();
```
