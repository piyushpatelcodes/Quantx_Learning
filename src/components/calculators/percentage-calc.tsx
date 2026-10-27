
"use client";

import { useMemo, useState } from "react";

type Mode = "marks" | "required" | "change";

export default function PercentageCalculator() {
  const [mode, setMode] = useState<Mode>("marks");
  const [obtained, setObtained] = useState("425");
  const [total, setTotal] = useState("500");
  const [target, setTarget] = useState("75");
  const [original, setOriginal] = useState("80");
  const [current, setCurrent] = useState("100");

  const result = useMemo(() => {
    if (mode === "marks") {
      if (
        obtained.trim() === "" ||
        total.trim() === "" ||
        !Number.isFinite(Number(obtained)) ||
        !Number.isFinite(Number(total)) ||
        Number(obtained) < 0 ||
        Number(total) <= 0 ||
        Number(obtained) > Number(total)
      )
        return null;

      return {
        value: (Number(obtained) / Number(total)) * 100,
        suffix: "%",
        label: "Your percentage",
        detail: `${obtained} out of ${total} marks`,
      };
    }

    if (mode === "required") {
      if (
        target.trim() === "" ||
        total.trim() === "" ||
        !Number.isFinite(Number(target)) ||
        !Number.isFinite(Number(total)) ||
        Number(target) < 0 ||
        Number(target) > 100 ||
        Number(total) <= 0
      )
        return null;

      return {
        value: (Number(target) / 100) * Number(total),
        suffix: "",
        label: "Marks required",
        detail: `${target}% of ${total} total marks`,
      };
    }

    if (
      original.trim() === "" ||
      current.trim() === "" ||
      !Number.isFinite(Number(original)) ||
      !Number.isFinite(Number(current)) ||
      Number(original) <= 0 ||
      Number(current) < 0
    )
      return null;

    const change =
      ((Number(current) - Number(original)) / Number(original)) * 100;

    return {
      value: change,
      suffix: "%",
      label:
        change > 0
          ? "Percentage increase"
          : change < 0
            ? "Percentage decrease"
            : "No percentage change",
      detail: `${original} → ${current}`,
    };
  }, [mode, obtained, total, target, original, current]);

  const inputClass =
    "w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

  const modes: { id: Mode; title: string; description: string }[] = [
    {
      id: "marks",
      title: "Marks %",
      description: "Calculate your score",
    },
    {
      id: "required",
      title: "Find marks",
      description: "Plan your target",
    },
    {
      id: "change",
      title: "% Change",
      description: "Compare two values",
    },
  ];

  return (
    <section className="mx-auto w-full max-w-4xl rounded-3xl border border-slate-200 bg-white shadow-sm">
      <header className="border-b border-slate-100 p-5 sm:p-7">
        <span className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
          Academic calculator
        </span>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Percentage Calculator
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Calculate your marks percentage, find required marks, or compare
          percentage changes.
        </p>
      </header>

      <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="min-w-0 space-y-5">
          <h3 className="font-semibold text-slate-800">
            Select calculation
          </h3>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {modes.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => setMode(item.id)}
                aria-pressed={mode === item.id}
                className={`rounded-2xl border p-3 text-left transition sm:p-4 ${
                  mode === item.id
                    ? "border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600"
                    : "border-slate-200 hover:border-indigo-300"
                }`}
              >
                <span
                  className={`block text-sm font-semibold ${
                    mode === item.id
                      ? "text-indigo-700"
                      : "text-slate-800"
                  }`}
                >
                  {item.title}
                </span>
                <span className="mt-1 block text-xs text-slate-500">
                  {item.description}
                </span>
              </button>
            ))}
          </div>

          {mode === "marks" && (
            <div className="space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">
                  Marks obtained
                </span>
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  max={total || undefined}
                  step="any"
                  value={obtained}
                  onChange={(e) => setObtained(e.target.value)}
                  placeholder="e.g. 425"
                  aria-invalid={
                    obtained !== "" &&
                    Number(obtained) > Number(total)
                  }
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">
                  Total marks
                </span>
                <input
                  type="number"
                  inputMode="decimal"
                  min="0.000001"
                  step="any"
                  value={total}
                  onChange={(e) => setTotal(e.target.value)}
                  placeholder="e.g. 500"
                  className={inputClass}
                />
              </label>
              {obtained !== "" &&
                total !== "" &&
                Number(obtained) > Number(total) && (
                  <p role="alert" className="text-sm text-red-600">
                    Marks obtained cannot exceed total marks.
                  </p>
                )}
            </div>
          )}

          {mode === "required" && (
            <div className="space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">
                  Target percentage (%)
                </span>
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  max="100"
                  step="any"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder="e.g. 75"
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">
                  Total marks
                </span>
                <input
                  type="number"
                  inputMode="decimal"
                  min="0.000001"
                  step="any"
                  value={total}
                  onChange={(e) => setTotal(e.target.value)}
                  placeholder="e.g. 500"
                  className={inputClass}
                />
              </label>
              <p className="text-xs leading-5 text-slate-500">
                The result may be fractional. Round up if your exam requires
                whole marks.
              </p>
            </div>
          )}

          {mode === "change" && (
            <div className="space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">
                  Original value
                </span>
                <input
                  type="number"
                  inputMode="decimal"
                  min="0.000001"
                  step="any"
                  value={original}
                  onChange={(e) => setOriginal(e.target.value)}
                  placeholder="e.g. 80"
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">
                  New value
                </span>
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="any"
                  value={current}
                  onChange={(e) => setCurrent(e.target.value)}
                  placeholder="e.g. 100"
                  className={inputClass}
                />
              </label>
            </div>
          )}
        </div>

        <aside className="min-w-0 space-y-4 lg:sticky lg:top-6 lg:self-start">
          <div
            aria-live="polite"
            className="rounded-2xl bg-indigo-600 p-5 text-white sm:p-6"
          >
            <p className="text-sm font-medium text-indigo-100">
              {result?.label ?? "Your result"}
            </p>
            <p className="mt-3 break-words text-4xl font-bold tracking-tight sm:text-5xl">
              {result
                ? `${result.value > 0 && mode === "change" ? "+" : ""}${result.value.toLocaleString(
                    undefined,
                    { maximumFractionDigits: 2 }
                  )}${result.suffix}`
                : "--"}
            </p>
            <p className="mt-3 text-sm text-indigo-100">
              {result?.detail ?? "Enter valid values to see your result."}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-4">
            <h3 className="font-semibold text-slate-800">Formula</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {mode === "marks"
                ? "Percentage = (Obtained ÷ Total) × 100"
                : mode === "required"
                  ? "Required marks = (Target % ÷ 100) × Total"
                  : "Change % = ((New − Original) ÷ Original) × 100"}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setObtained("");
              setTotal("");
              setTarget("");
              setOriginal("");
              setCurrent("");
            }}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Clear inputs
          </button>
        </aside>
      </div>
    </section>
  );
}
