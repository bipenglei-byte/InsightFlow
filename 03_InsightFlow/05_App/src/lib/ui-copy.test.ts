import assert from "node:assert/strict";
import test from "node:test";

import {
  categoryLabel,
  modeLabel,
  sentimentLabel,
  severityLabel,
  statusLabel,
} from "./ui-copy.ts";

test("maps domain values to Chinese display labels", () => {
  assert.equal(sentimentLabel("negative"), "负面");
  assert.equal(severityLabel("critical"), "致命");
  assert.equal(statusLabel("processing"), "处理中");
  assert.equal(modeLabel("demo"), "演示模式");
});

test("preserves unknown dynamic labels", () => {
  assert.equal(categoryLabel("Custom category"), "Custom category");
});
