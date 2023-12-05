# Using the Node SDK

1. Install the SmoothSail Node SDK in your project by running `npm i smoothsail-node-sdk` .
2. Import the `SmoothSailConfig` file into whichever files you will be evaluating flags in.

`import { SmoothSailConfig } from "smoothsail-node-sdk";`

3. Set up an environment variable for the `SECRET_KEY`. This should be the same secret used for SmoothSail's Manager.

4. Use the `SmoothSailConfig` class constructor to instantiate a `config` object. The constructor takes two arguments:

- (string) SDK Key, from SmoothSail's dashboard UI
- (string) Address of SmoothSail's SDK Service

```
// shown as hard-coded but recommend having these as environment variables

const config = new SmoothSailConfig("SDK key", "SDK Service address");
```

5. Instantiate a `SmoothSailClient` by calling `config.connect()`. Note that this is an asynchronous action so you will need to use `async/await` to perform this step.

```
const config = new SmoothSailConfig("SDK key", "bearer address");

let client;

// instantiate SmoothSailClient

(async () => {
  client = await config.connect();
})();
```

6. Use the `SmoothSailClient.prototype.evaluateFlag()` method to evaluate flags. `SmoothSailClient.prototype.evaluateFlag()` takes 3 arguments:

- (string) Flag Key, `fKey` from SmoothSail's dashboard UI
- (object) User Context object
- (boolean) Default value for flag evaluation, optional argument

```
let testUserContext = {
  user_name: "John Smith",
  "beta-tester": true,
};

router.get("/", async (req, res) => {
  if (client.evaluateFlag("flag-1", testUserContext, true)) {
    // execute process for beta tester
  } else {
    // execute stable process
  }
})

```
