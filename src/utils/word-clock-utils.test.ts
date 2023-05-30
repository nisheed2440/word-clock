import { describe, expect, test } from "vitest";
import { WordClock } from "./word-clock-utils";
import { DEFAULT_MATRIX_MAPPED_DATA, DEFAULT_INPUT_MATRIX } from "./constants";

describe("WordClock", () => {
  const wordClock = new WordClock(
    DEFAULT_INPUT_MATRIX,
    DEFAULT_MATRIX_MAPPED_DATA
  );

  test("should set the correct rounded hour and minutes", () => {
    expect(wordClock.ogHour).toBe(0);
    expect(wordClock.roundedMinutes).toBe(0);
  });

  test("should return the correct time phrases", () => {
    wordClock.getTimePhrase("2021-01-01T10:22:00");
    expect(
      wordClock.debugTime(wordClock.getTimePhrase("2021-01-01T00:01:00"))
    ).toEqual(["IT", "IS", "JUST", "AFTER", "0"]);
    expect(
      wordClock.debugTime(wordClock.getTimePhrase("2021-01-01T23:57:00"))
    ).toEqual(["IT", "IS", "ALMOST", "0"]);
    expect(
      wordClock.debugTime(wordClock.getTimePhrase("2021-01-01T23:00:00"))
    ).toEqual(["IT", "IS", "11", "O'CLOCK"]);
    expect(
      wordClock.debugTime(wordClock.getTimePhrase("2021-01-01T23:05:00"))
    ).toEqual(["IT", "IS", "FIVE", "MINUTES", "PAST", "11", "O'CLOCK"]);
    expect(
      wordClock.debugTime(wordClock.getTimePhrase("2021-01-01T23:10:00"))
    ).toEqual(["IT", "IS", "TEN", "MINUTES", "PAST", "11", "O'CLOCK"]);
    expect(
      wordClock.debugTime(wordClock.getTimePhrase("2021-01-01T23:15:00"))
    ).toEqual(["IT", "IS", "QUARTER", "PAST", "11"]);
    expect(
      wordClock.debugTime(wordClock.getTimePhrase("2021-01-01T23:20:00"))
    ).toEqual(["IT", "IS", "TWENTY", "MINUTES", "PAST", "11", "O'CLOCK"]);
    expect(
      wordClock.debugTime(wordClock.getTimePhrase("2021-01-01T23:25:00"))
    ).toEqual([
      "IT",
      "IS",
      "TWENTY",
      "FIVE",
      "MINUTES",
      "PAST",
      "11",
      "O'CLOCK",
    ]);
    expect(
      wordClock.debugTime(wordClock.getTimePhrase("2021-01-01T23:30:00"))
    ).toEqual(["IT", "IS", "HALF", "PAST", "11"]);
    expect(
      wordClock.debugTime(wordClock.getTimePhrase("2021-01-01T23:35:00"))
    ).toEqual(["IT", "IS", "TWENTY", "FIVE", "MINUTES", "TO", "0"]);
    expect(
      wordClock.debugTime(wordClock.getTimePhrase("2021-01-01T23:40:00"))
    ).toEqual(["IT", "IS", "TWENTY", "MINUTES", "TO", "0"]);
    expect(
      wordClock.debugTime(wordClock.getTimePhrase("2021-01-01T12:45:00"))
    ).toEqual(["IT", "IS", "QUARTER", "TO", "1"]);
    expect(
      wordClock.debugTime(wordClock.getTimePhrase("2021-01-01T12:45:00"))
    ).toEqual(["IT", "IS", "QUARTER", "TO", "1"]);
    expect(
      wordClock.debugTime(wordClock.getTimePhrase("2021-01-01T10:13:00"))
    ).toEqual(["IT", "IS", "TEN", "MINUTES", "PAST", "10", "O'CLOCK"]);
  });

  test("should return a new grid with the items set to true", () => {
    expect(wordClock.getTimePhraseGrid("2021-01-01T23:20:00")).toBeTruthy();
  });
});
