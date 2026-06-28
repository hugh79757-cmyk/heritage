declare namespace App {
  interface Locals {
    runtime: {
      env: {
        DB: D1Database;
        ASSETS: { fetch: typeof fetch };
      };
      cf: IncomingRequestCfProperties;
      waitUntil: (promise: Promise<any>) => void;
    };
  }
}
