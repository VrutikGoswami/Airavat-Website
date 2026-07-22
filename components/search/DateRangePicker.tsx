"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  startDate: string;
  endDate?: string;
  onChange: (startDate: string, endDate: string) => void;
  mode?: "single" | "range";
  label?: string;
  helper?: string;
  error?: string;
};

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function iso(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parse(value?: string): Date | null {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function monthStart(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function formatShort(value?: string): string {
  const date = parse(value);
  return date
    ? date.toLocaleDateString("en-GB", { day: "numeric", month: "short" })
    : "Add date";
}

function Month({
  month,
  startDate,
  endDate,
  selectingEnd,
  mode,
  onPick,
}: {
  month: Date;
  startDate: string;
  endDate: string;
  selectingEnd: boolean;
  mode: "single" | "range";
  onPick: (value: string) => void;
}) {
  const firstDay = month.getDay();
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const today = iso(new Date());
  const cells = Array.from({ length: firstDay + daysInMonth }, (_, index) =>
    index < firstDay ? null : new Date(month.getFullYear(), month.getMonth(), index - firstDay + 1),
  );

  return (
    <section className="min-w-0">
      <h3 className="mb-4 text-center text-base font-bold text-ink">
        {month.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
      </h3>
      <div className="grid grid-cols-7 text-center text-[11px] font-semibold text-stone">
        {weekdays.map((day) => (
          <span key={day} className="py-1">{day.slice(0, 1)}</span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-y-1">
        {cells.map((date, index) => {
          if (!date) return <span key={`blank-${index}`} className="aspect-square" aria-hidden />;
          const value = iso(date);
          const disabled = value < today;
          const selected = value === startDate || value === endDate;
          const inRange = mode === "range" && Boolean(startDate && endDate && value > startDate && value < endDate);
          return (
            <button
              key={value}
              type="button"
              disabled={disabled}
              onClick={() => onPick(value)}
              aria-label={`${date.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}${selected ? ", selected" : ""}`}
              className={`aspect-square min-h-9 text-sm font-semibold transition-colors ${
                selected
                  ? "rounded-[3px] bg-ochre text-cream"
                  : inRange
                    ? "bg-ochre/15 text-clay"
                    : "rounded-[3px] text-ink hover:bg-ochre/10"
              } disabled:cursor-not-allowed disabled:text-stone/35 disabled:hover:bg-transparent ${
                selectingEnd && value === startDate ? "ring-2 ring-ochre ring-offset-2" : ""
              }`}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export function DateRangePicker({
  startDate,
  endDate = "",
  onChange,
  mode = "range",
  label = "Select dates",
  helper,
  error,
}: Props) {
  const [open, setOpen] = useState(false);
  const [selectingEnd, setSelectingEnd] = useState(false);
  const initialMonth = useMemo(() => monthStart(parse(startDate) ?? new Date()), [startDate]);
  const [visibleMonth, setVisibleMonth] = useState(initialMonth);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function close(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  function pick(value: string) {
    if (mode === "single") {
      onChange(value, "");
      setOpen(false);
      return;
    }
    if (!startDate || selectingEnd === false || value <= startDate) {
      onChange(value, "");
      setSelectingEnd(true);
      return;
    }
    onChange(startDate, value);
    setSelectingEnd(false);
    setOpen(false);
  }

  return (
    <div ref={rootRef} className="relative min-w-0">
      <button
        type="button"
        onClick={() => {
          setVisibleMonth(initialMonth);
          setSelectingEnd(mode === "range" && Boolean(startDate && !endDate));
          setOpen((value) => !value);
        }}
        aria-expanded={open}
        aria-haspopup="dialog"
        className={`flex min-h-16 w-full items-center gap-3 bg-white px-4 text-left outline-none transition-colors hover:bg-ochre/5 ${error ? "ring-2 ring-clay" : ""}`}
      >
        <CalendarDays aria-hidden className="size-5 shrink-0 text-ochre" />
        <span className="min-w-0">
          <span className="block text-[11px] font-semibold text-stone">{label}</span>
          <span className="block truncate text-sm font-bold text-ink">
            {mode === "range"
              ? `${formatShort(startDate)} - ${formatShort(endDate)}`
              : formatShort(startDate)}
          </span>
          {helper ? <span className="block text-[10px] font-semibold text-clay">{helper}</span> : null}
        </span>
      </button>
      {open ? (
        <div
          role="dialog"
          aria-label={mode === "range" ? "Choose departure and return dates" : "Choose departure date"}
          className="absolute right-0 z-50 mt-2 w-[min(42rem,calc(100vw-2.5rem))] border border-parchment bg-white p-4 shadow-2xl sm:p-6"
        >
          <div className="mb-5 flex items-center justify-between border-b border-parchment pb-4">
            <div>
              <p className="text-sm font-bold text-ink">
                {mode === "range" ? (selectingEnd ? "Select return date" : "Select departure date") : "Select departure date"}
              </p>
              <p className="mt-0.5 text-xs text-ink-soft">
                {mode === "range" ? "Choose a start and end date." : "One-way trip: only one date is needed."}
              </p>
            </div>
            <div className="flex gap-1">
              <button type="button" onClick={() => setVisibleMonth((month) => addMonths(month, -1))} className="inline-flex size-9 items-center justify-center text-ink hover:bg-ochre/10" aria-label="Previous month">
                <ChevronLeft aria-hidden className="size-5" />
              </button>
              <button type="button" onClick={() => setVisibleMonth((month) => addMonths(month, 1))} className="inline-flex size-9 items-center justify-center text-ink hover:bg-ochre/10" aria-label="Next month">
                <ChevronRight aria-hidden className="size-5" />
              </button>
            </div>
          </div>
          <div className="grid gap-8 sm:grid-cols-2">
            <Month month={visibleMonth} startDate={startDate} endDate={endDate} selectingEnd={selectingEnd} mode={mode} onPick={pick} />
            <div className="hidden sm:block">
              <Month month={addMonths(visibleMonth, 1)} startDate={startDate} endDate={endDate} selectingEnd={selectingEnd} mode={mode} onPick={pick} />
            </div>
          </div>
        </div>
      ) : null}
      {error ? <p className="mt-1 text-xs font-semibold text-clay">{error}</p> : null}
    </div>
  );
}
