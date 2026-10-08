import test from "node:test";
import assert from "node:assert/strict";
import { getFilmProgress, getFilmTime } from "../src/components/filmTimeline.ts";

test("film stays on the first frame before the sticky scene starts", () => {
  assert.equal(getFilmProgress(900, 2800, 720, 80), 0);
  assert.equal(getFilmProgress(80, 2800, 720, 80), 0);
});

test("forward and reverse scroll map to forward and reverse film time", () => {
  const early = getFilmTime(getFilmProgress(-400, 2800, 720, 80), 10);
  const late = getFilmTime(getFilmProgress(-1200, 2800, 720, 80), 10);
  assert.ok(late > early);
  assert.ok(early > 0 && late < 10);
  assert.equal(getFilmTime(getFilmProgress(-400, 2800, 720, 80), 10), early);
});

test("film reaches its last frame with eight percent of sticky travel remaining", () => {
  const finalBeatTop = 80 - (2800 - 720) * 0.92;
  assert.equal(getFilmProgress(finalBeatTop, 2800, 720, 80), 1);
});
