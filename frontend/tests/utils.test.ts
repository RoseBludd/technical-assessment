import { cn, formatTimeAgo, formatTimestamp } from "../lib/utils";

describe("cn utility function", () => {
  it("merges Tailwind classes correctly", () => {
    expect(cn("text-red-500", "bg-blue-500")).toBe("text-red-500 bg-blue-500");
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
    expect(cn("hidden", false && "block")).toBe("hidden");
  });
});

describe("formatTimeAgo function", () => {
  const now = new Date();

  it("formats seconds correctly", () => {
    expect(formatTimeAgo(new Date(now.getTime() - 10 * 1000))).toBe(
      "10 secs ago",
    );
  });

  it("formats minutes correctly", () => {
    expect(formatTimeAgo(new Date(now.getTime() - 5 * 60 * 1000))).toBe(
      "5 mins ago",
    );
  });

  it("formats hours correctly", () => {
    expect(formatTimeAgo(new Date(now.getTime() - 3 * 60 * 60 * 1000))).toBe(
      "3 hours ago",
    );
  });

  it("formats days correctly", () => {
    expect(
      formatTimeAgo(new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)),
    ).toBe("2 days ago");
  });

  it("formats weeks correctly", () => {
    expect(
      formatTimeAgo(new Date(now.getTime() - 2 * 7 * 24 * 60 * 60 * 1000)),
    ).toBe("2 weeks ago");
  });

  it("formats months correctly", () => {
    expect(
      formatTimeAgo(new Date(now.getTime() - 3 * 30 * 24 * 60 * 60 * 1000)),
    ).toBe("3 months ago");
  });

  it("formats years correctly", () => {
    expect(
      formatTimeAgo(new Date(now.getTime() - 2 * 365 * 24 * 60 * 60 * 1000)),
    ).toBe("2 years ago");
  });
});

describe("formatTimestamp function", () => {
  it("formats timestamps correctly", () => {
    expect(formatTimestamp("2024-02-21T12:00:00Z", { timeZone: "UTC" })).toBe(
      "12:00 PM",
    );
  });

  it("formats timestamps with different options", () => {
    expect(
      formatTimestamp("2024-02-21T08:30:00Z", {
        hour12: false,
        timeZone: "UTC",
      }),
    ).toBe("08:30");
  });
});
