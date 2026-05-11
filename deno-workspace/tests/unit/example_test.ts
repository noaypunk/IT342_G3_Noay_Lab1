import { assertEquals } from "https://deno.land/std@0.168.0/testing/asserts.ts";

Deno.test("example test", () => {
  const expected = 1 + 1;
  const actual = 2;
  assertEquals(actual, expected);
});