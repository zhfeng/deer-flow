import { afterEach, expect, test, rs } from "@rstest/core";

const original = process.env.NEXT_PUBLIC_APP_VERSION;

afterEach(() => {
  rs.resetModules();
  if (original === undefined) {
    delete process.env.NEXT_PUBLIC_APP_VERSION;
  } else {
    process.env.NEXT_PUBLIC_APP_VERSION = original;
  }
});

test("aboutMarkdown heading interpolates the app version", async () => {
  process.env.NEXT_PUBLIC_APP_VERSION = "9.9.9-test";
  const { aboutMarkdown } =
    await import("@/components/workspace/settings/about-content");
  // The heading link text carries the version stamp.
  expect(aboutMarkdown).toContain("[About DeerFlow 9.9.9-test]");
  // Milestone copy in the acknowledgments refers to the 1.0/2.0 product
  // generations and must NOT be parameterized.
  expect(aboutMarkdown).toContain("DeerFlow 1.0 and 2.0");
});

test("aboutMarkdown heading reflects the package version when env is unset", async () => {
  delete process.env.NEXT_PUBLIC_APP_VERSION;
  const { aboutMarkdown } =
    await import("@/components/workspace/settings/about-content");
  // The stale hardcoded "2.0" must be gone - the heading uses APP_VERSION.
  expect(aboutMarkdown).not.toContain("About DeerFlow 2.0]");
});
