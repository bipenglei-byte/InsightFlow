import assert from "node:assert/strict";
import test from "node:test";

import { GET } from "./route.ts";

test("health route reports the service and a non-sensitive runtime mode", async () => {
  const response = await GET();
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.status, "ok");
  assert.equal(body.service, "insightflow");
  assert.match(body.mode, /^(demo|live)$/);
  assert.equal("apiKey" in body, false);
});
