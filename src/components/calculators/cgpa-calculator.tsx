
"use client";

import { useMemo, useState } from "react";

type Semester = {
  id: number;
  name: string;
  sgpa: string;
  credits: string;
};

export default function CGPACalculator() {
  const [semesters, setSemesters] = useState<Semester[]>([
    { id: 1, name: "Semester 1", sgpa: "8.2", credits: "22" },
    { id: 2, name: "Semester 2", sgpa: "8.6", credits: "24" },
  ]);
  const [nextId, setNextId] = useState(3);

  const result = useMemo(() => {
    const valid =
      semesters.length > 0 &&
      semesters.every(
        (s) =>
          s.name.trim() !== "" &&
          s.sgpa.trim() !== "" &&
          Number.isFinite(Number(s.sgpa)) &&
          Number(s.sgpa) >= 0 &&
          Number(s.sgpa) <= 10 &&
          s.credits.trim() !== "" &&
          Number.isFinite(Number(s.credits)) &&
          Number(s.credits) > 0 &&
          Number(s.credits) <= 1000
      );

    if (!valid) return null;

    const totalCredits = semesters.reduce(
      (sum, s) => sum + Number(s.credits),
      0
    );

    const weightedPoints = semesters.reduce(
      (sum, s) => sum + Number(s.sgpa) * Number(s.credits),
      0
    );

    return {
      cgpa: weightedPoints / totalCredits,
      totalCredits,
    };
  }, [semesters]);

  function updateSemester(
    id: number,
    field: "name" | "sgpa" | "credits",
    value: string
  ) {
    setSemesters((current) =>
      current.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  }

  function addSemester() {
    setSemesters((current) => [
      ...current,
      {
        id: nextId,
        name: `Semester ${current.length + 1}`,
        sgpa: "",
        credits: "",
      },
    ]);
    setNextId((id) => id + 1);
  }

  const inputClass =
    "w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

  return (
    <section className="mx-auto w-full max-w-4xl rounded-3xl border border-slate-200 bg-white shadow-sm">
      <header className="border-b border-slate-100 p-5 sm:p-7">
        <span className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
          Academic calculator
        </span>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          CGPA Calculator
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Calculate your overall CGPA by entering each semester&apos;s SGPA and
          total credits.
        </p>
      </header>

      <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="min-w-0 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-semibold text-slate-800">Your semesters</h3>
            <span className="text-xs text-slate-500">
              {semesters.length} semesters
            </span>
          </div>

          {semesters.map((semester, index) => {
            const sgpaInvalid =
              semester.sgpa !== "" &&
              (!Number.isFinite(Number(semester.sgpa)) ||
                Number(semester.sgpa) < 0 ||
                Number(semester.sgpa) > 10);

            const creditsInvalid =
              semester.credits !== "" &&
              (!Number.isFinite(Number(semester.credits)) ||
                Number(semester.credits) <= 0 ||
                Number(semester.credits) > 1000);

            return (
              <div
                key={semester.id}
                className="rounded-2xl border border-slate-200 p-4"
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Semester {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setSemesters((current) =>
                        current.filter((s) => s.id !== semester.id)
                      )
                    }
                    className="rounded-lg px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                    aria-label={`Remove semester ${index + 1}`}
                  >
                    Remove
                  </button>
                </div>

                <label className="mb-3 block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">
                    Semester name
                  </span>
                  <input
                    value={semester.name}
                    onChange={(e) =>
                      updateSemester(semester.id, "name", e.target.value)
                    }
                    placeholder="e.g. Semester 1"
                    className={inputClass}
                  />
                </label>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <label className="min-w-0">
                    <span className="mb-1.5 block text-sm font-medium text-slate-700">
                      SGPA
                    </span>
                    <input
                      type="number"
                      inputMode="decimal"
                      min="0"
                      max="10"
                      step="any"
                      value={semester.sgpa}
                      onChange={(e) =>
                        updateSemester(semester.id, "sgpa", e.target.value)
                      }
                      placeholder="0–10"
                      aria-invalid={sgpaInvalid || semester.sgpa === ""}
                      className={`${inputClass} ${
                        sgpaInvalid || semester.sgpa === ""
                          ? "border-red-400"
                          : ""
                      }`}
                    />
                    {sgpaInvalid && (
                      <span className="mt-1 block text-xs text-red-600">
                        SGPA must be between 0 and 10.
                      </span>
                    )}
                  </label>

                  <label className="min-w-0">
                    <span className="mb-1.5 block text-sm font-medium text-slate-700">
                      Total credits
                    </span>
                    <input
                      type="number"
                      inputMode="decimal"
                      min="0.01"
                      max="1000"
                      step="any"
                      value={semester.credits}
                      onChange={(e) =>
                        updateSemester(semester.id, "credits", e.target.value)
                      }
                      placeholder="e.g. 22"
                      aria-invalid={creditsInvalid || semester.credits === ""}
                      className={`${inputClass} ${
                        creditsInvalid || semester.credits === ""
                          ? "border-red-400"
                          : ""
                      }`}
                    />
                    {creditsInvalid && (
                      <span className="mt-1 block text-xs text-red-600">
                        Credits must be greater than 0.
                      </span>
                    )}
                  </label>
                </div>
              </div>
            );
          })}

          <button
            type="button"
            onClick={addSemester}
            className="w-full rounded-xl border border-dashed border-indigo-300 px-4 py-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50"
          >
            + Add semester
          </button>
        </div>

        <aside className="min-w-0 space-y-4 lg:sticky lg:top-6 lg:self-start">
          <div
            aria-live="polite"
            className="rounded-2xl bg-indigo-600 p-5 text-white sm:p-6"
          >
            <p className="text-sm font-medium text-indigo-100">Your CGPA</p>
            <p className="mt-3 break-words text-5xl font-bold tracking-tight">
              {result ? result.cgpa.toFixed(2) : "--"}
            </p>
            <p className="mt-3 text-sm text-indigo-100">
              {result
                ? `${result.totalCredits} total credits`
                : "Complete all semester fields to calculate"}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-4">
            <h3 className="font-semibold text-slate-800">Formula</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              CGPA = Σ (SGPA × Semester Credits) ÷ Σ Credits
            </p>
            <p className="mt-3 text-xs leading-5 text-slate-500">
              Uses a credit-weighted calculation. Use your university&apos;s
              official rules if they differ.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setSemesters([]);
            }}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Clear semesters
          </button>
        </aside>
      </div>
    </section>
  );
}
