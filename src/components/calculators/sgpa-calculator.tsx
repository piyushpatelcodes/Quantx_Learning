"use client";

import { useMemo, useState } from "react";

type Subject = {
  id: number;
  name: string;
  credits: string;
  gradePoints: string;
};

const initialSubjects: Subject[] = [
  { id: 1, name: "Mathematics", credits: "4", gradePoints: "9" },
  { id: 2, name: "Programming", credits: "4", gradePoints: "10" },
  { id: 3, name: "Physics", credits: "3", gradePoints: "8" },
];

export default function SGPACalculator() {
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
  const [nextId, setNextId] = useState(4);

  const result = useMemo(() => {
    const valid =
      subjects.length > 0 &&
      subjects.every(
        (s) =>
          s.name.trim() !== "" &&
          s.credits.trim() !== "" &&
          Number.isFinite(Number(s.credits)) &&
          Number(s.credits) > 0 &&
          Number(s.credits) <= 1000 &&
          s.gradePoints.trim() !== "" &&
          Number.isFinite(Number(s.gradePoints)) &&
          Number(s.gradePoints) >= 0 &&
          Number(s.gradePoints) <= 10
      );

    if (!valid) return null;

    const totalCredits = subjects.reduce(
      (sum, s) => sum + Number(s.credits),
      0
    );

    const weightedPoints = subjects.reduce(
      (sum, s) => sum + Number(s.credits) * Number(s.gradePoints),
      0
    );

    return {
      sgpa: weightedPoints / totalCredits,
      totalCredits,
    };
  }, [subjects]);

  function updateSubject(
    id: number,
    field: "name" | "credits" | "gradePoints",
    value: string
  ) {
    setSubjects((current) =>
      current.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  }

  function addSubject() {
    setSubjects((current) => [
      ...current,
      {
        id: nextId,
        name: "",
        credits: "3",
        gradePoints: "8",
      },
    ]);
    setNextId((id) => id + 1);
  }

  function inputClass(invalid = false) {
    return `w-full min-w-0 rounded-xl border bg-white px-3 py-2.5 text-sm outline-none transition focus:ring-2 ${
      invalid
        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
        : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-100"
    }`;
  }

  return (
    <section className="mx-auto w-full max-w-4xl rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 p-5 sm:p-7">
        <span className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
          Academic calculator
        </span>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          SGPA Calculator
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Calculate your Semester Grade Point Average using subject credits
          and grade points.
        </p>
      </div>

      <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="min-w-0 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-semibold text-slate-800">Your subjects</h3>
            <span className="text-xs text-slate-500">
              {subjects.length} subjects
            </span>
          </div>

          {subjects.map((subject, index) => {
            const creditsInvalid =
              subject.credits !== "" &&
              (!Number.isFinite(Number(subject.credits)) ||
                Number(subject.credits) <= 0 ||
                Number(subject.credits) > 1000);

            const gradeInvalid =
              subject.gradePoints !== "" &&
              (!Number.isFinite(Number(subject.gradePoints)) ||
                Number(subject.gradePoints) < 0 ||
                Number(subject.gradePoints) > 10);

            return (
              <div
                key={subject.id}
                className="rounded-2xl border border-slate-200 p-4"
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Subject {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setSubjects((current) =>
                        current.filter((s) => s.id !== subject.id)
                      )
                    }
                    className="rounded-lg px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                    aria-label={`Remove subject ${index + 1}`}
                  >
                    Remove
                  </button>
                </div>

                <label className="mb-3 block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">
                    Subject name
                  </span>
                  <input
                    value={subject.name}
                    onChange={(e) =>
                      updateSubject(subject.id, "name", e.target.value)
                    }
                    placeholder="e.g. Mathematics"
                    required
                    className={inputClass(
                      subject.name.trim() === ""
                    )}
                    aria-invalid={subject.name.trim() === ""}
                  />
                  {subject.name.trim() === "" && (
                    <span className="mt-1 block text-xs text-red-600">
                      Enter a subject name.
                    </span>
                  )}
                </label>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <label className="min-w-0">
                    <span className="mb-1.5 block text-sm font-medium text-slate-700">
                      Credits
                    </span>
                    <input
                      type="number"
                      inputMode="decimal"
                      min="0.01"
                      max="1000"
                      step="any"
                      value={subject.credits}
                      onChange={(e) =>
                        updateSubject(subject.id, "credits", e.target.value)
                      }
                      placeholder="e.g. 4"
                      aria-invalid={creditsInvalid || subject.credits === ""}
                      className={inputClass(
                        creditsInvalid || subject.credits === ""
                      )}
                    />
                    {creditsInvalid && (
                      <span className="mt-1 block text-xs text-red-600">
                        Credits must be greater than 0.
                      </span>
                    )}
                  </label>

                  <label className="min-w-0">
                    <span className="mb-1.5 block text-sm font-medium text-slate-700">
                      Grade points
                    </span>
                    <input
                      type="number"
                      inputMode="decimal"
                      min="0"
                      max="10"
                      step="any"
                      value={subject.gradePoints}
                      onChange={(e) =>
                        updateSubject(
                          subject.id,
                          "gradePoints",
                          e.target.value
                        )
                      }
                      placeholder="0–10"
                      aria-invalid={gradeInvalid || subject.gradePoints === ""}
                      className={inputClass(
                        gradeInvalid || subject.gradePoints === ""
                      )}
                    />
                    {gradeInvalid && (
                      <span className="mt-1 block text-xs text-red-600">
                        Grade points must be between 0 and 10.
                      </span>
                    )}
                  </label>
                </div>
              </div>
            );
          })}

          <button
            type="button"
            onClick={addSubject}
            className="w-full rounded-xl border border-dashed border-indigo-300 px-4 py-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50"
          >
            + Add subject
          </button>
        </div>

        <aside className="min-w-0 space-y-4 lg:sticky lg:top-6 lg:self-start">
          <div
            aria-live="polite"
            className="rounded-2xl bg-indigo-600 p-5 text-white sm:p-6"
          >
            <p className="text-sm font-medium text-indigo-100">
              Your SGPA
            </p>
            <p className="mt-3 break-words text-5xl font-bold tracking-tight">
              {result ? result.sgpa.toFixed(2) : "--"}
            </p>
            <p className="mt-3 text-sm text-indigo-100">
              {result
                ? `${result.totalCredits} total credits`
                : "Complete all subject fields to calculate"}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-4">
            <h3 className="font-semibold text-slate-800">Formula</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              SGPA = Σ (Credits × Grade Points) ÷ Σ Credits
            </p>
            <p className="mt-3 text-xs leading-5 text-slate-500">
              Uses a 10-point grading scale. Check your institution&apos;s official
              calculation rules.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
                
              setSubjects([
                { id: nextId, name: "", credits: "3", gradePoints: "8" },
              ])
            
            }
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Start over
          </button>
        </aside>
      </div>
    </section>
  );
}