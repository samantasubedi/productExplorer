import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useDebouncedValue } from "../debounceHook";

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe("useDebouncedValue", () => {
  it("returns initial value immediately", () => {
    const { result } = renderHook(() => useDebouncedValue("hello", 400));
    expect(result.current).toBe("hello");
  });

  it("updates only after delay", () => {
    const { result, rerender } = renderHook(
      ({ v }) => useDebouncedValue(v, 400),
      { initialProps: { v: "a" } }
    );
    rerender({ v: "ab" });
    expect(result.current).toBe("a"); 
    act(() => vi.advanceTimersByTime(400));
    expect(result.current).toBe("ab");
  });

  it("only keeps last value on rapid changes", () => {
    const { result, rerender } = renderHook(
      ({ v }) => useDebouncedValue(v, 400),
      { initialProps: { v: "a" } }
    );
    rerender({ v: "ab" });
    act(() => vi.advanceTimersByTime(200));
    rerender({ v: "abc" });
    act(() => vi.advanceTimersByTime(400));
    expect(result.current).toBe("abc");
  });
});
