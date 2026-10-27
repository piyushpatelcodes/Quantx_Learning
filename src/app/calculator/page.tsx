
"use client";

import { useEffect, useState } from "react";

import CGPACalculator from "@/components/calculators/cgpa-calculator";
import PercentageCalculator from "@/components/calculators/percentage-calc";
import SGPACalculator from "@/components/calculators/sgpa-calculator";

type CalculatorType = "sgpa" | "cgpa" | "percentage";

const calculators: {
  value: CalculatorType;
  label: string;
  description: string;
}[] = [
  {
    value: "sgpa",
    label: "SGPA Calculator",
    description: "Calculate your semester grade point average.",
  },
  {
    value: "cgpa",
    label: "CGPA Calculator",
    description: "Calculate your cumulative grade point average.",
  },
  {
    value: "percentage",
    label: "Percentage Calculator",
    description: "Calculate your marks percentage.",
  },
];

const STORAGE_KEY = "selected-calculator";

export default function CalculatorPage() {
  const [selectedCalculator, setSelectedCalculator] =
    useState<CalculatorType>("sgpa");

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedCalculator = localStorage.getItem(STORAGE_KEY);

    if (
      savedCalculator === "sgpa" ||
      savedCalculator === "cgpa" ||
      savedCalculator === "percentage"
    ) {
      setSelectedCalculator(savedCalculator);
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, selectedCalculator);
    }
  }, [selectedCalculator, isLoaded]);

  const selected = calculators.find(
    (calculator) => calculator.value === selectedCalculator
  );

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 sm:py-12">
      <header className="mx-auto mb-10 max-w-4xl text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
         Quant X Learning - Student toolkit
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Your academics, simplified.
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
          Calculate your SGPA, CGPA, percentage, and attendance
          instantly. Free to use, with no sign-up required.
        </p>
      </header>

      <div className="mx-auto max-w-4xl">
        {/* Calculator selector */}
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <label
            htmlFor="calculator-select"
            className="mb-2 block text-sm font-semibold text-slate-800"
          >
            Choose a calculator
          </label>

          <select
            id="calculator-select"
            value={selectedCalculator}
            onChange={(event) =>
              setSelectedCalculator(
                event.target.value as CalculatorType
              )
            }
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          >
            {calculators.map((calculator) => (
              <option key={calculator.value} value={calculator.value}>
                {calculator.label}
              </option>
            ))}
          </select>

          <p className="mt-3 text-sm text-slate-500">
            {selected?.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {calculators.map((calculator) => (
              <button
                key={calculator.value}
                type="button"
                onClick={() =>
                  setSelectedCalculator(calculator.value)
                }
                aria-pressed={
                  selectedCalculator === calculator.value
                }
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  selectedCalculator === calculator.value
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {calculator.label}
              </button>
            ))}
          </div>
        </section>

        {/* Keep every calculator mounted to preserve its React state */}
        <div
          className={selectedCalculator === "sgpa" ? "block" : "hidden"}
          aria-hidden={selectedCalculator !== "sgpa"}
        >
          <SGPACalculator />
        </div>

        <div
          className={selectedCalculator === "cgpa" ? "block" : "hidden"}
          aria-hidden={selectedCalculator !== "cgpa"}
        >
          <CGPACalculator />
        </div>

        <div
          className={
            selectedCalculator === "percentage" ? "block" : "hidden"
          }
          aria-hidden={selectedCalculator !== "percentage"}
        >
          <PercentageCalculator />
        </div>
      </div>

      <footer className="mx-auto mt-10 max-w-4xl text-center text-xs text-slate-500">
        Your calculations run locally in your browser.
      </footer>
    </main>
  );
}
