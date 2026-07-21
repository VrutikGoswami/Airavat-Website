"use client";

import { useId, useMemo, useRef, useState } from "react";
import { Plane } from "lucide-react";
import { airportLabel, searchAirports, type Airport } from "@/data/airports";

const inputCls =
  "w-full rounded-[3px] border border-parchment bg-ivory px-3.5 py-3 text-base text-ink placeholder:text-stone focus-visible:outline-2 focus-visible:outline-ochre aria-[invalid=true]:border-ochre";

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
  name?: string;
};

/**
 * City / airport combobox. As the user types a city (or code), it suggests
 * matching airports with their IATA code; picking one sets the field to
 * "City (CODE)". Free text is preserved, so unlisted places still work.
 */
export function AirportAutocomplete({
  label,
  value,
  onChange,
  hint,
  error,
  required = true,
  placeholder = "City or airport",
  name,
}: Props) {
  const id = useId();
  const listId = `${id}-list`;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const suggestions = useMemo(() => searchAirports(value), [value]);
  const showList = open && suggestions.length > 0;

  function commit(airport: Airport) {
    onChange(airportLabel(airport));
    setOpen(false);
    setActive(-1);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!showList) {
      if (e.key === "ArrowDown" && suggestions.length > 0) setOpen(true);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === "Enter" && active >= 0) {
      e.preventDefault();
      commit(suggestions[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
      setActive(-1);
    }
  }

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-bold">
        {label}
        {required ? null : <span className="ml-2 font-normal text-stone">(optional)</span>}
      </label>
      {hint ? (
        <p id={`${id}-hint`} className="mb-1.5 text-xs text-ink-soft">
          {hint}
        </p>
      ) : null}
      <div className="relative">
        <input
          id={id}
          name={name}
          type="text"
          role="combobox"
          autoComplete="off"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={[hint ? `${id}-hint` : null, error ? `${id}-error` : null]
            .filter(Boolean)
            .join(" ") || undefined}
          className={inputCls}
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          onBlur={() => {
            blurTimer.current = setTimeout(() => setOpen(false), 120);
          }}
        />
        {showList ? (
          <ul
            id={listId}
            role="listbox"
            className="absolute z-30 mt-1 max-h-72 w-full overflow-auto rounded-[3px] border border-parchment bg-ivory shadow-lg"
          >
            {suggestions.map((a, i) => (
              <li
                key={`${a.code}-${a.name}`}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={i === active}
                onMouseDown={(e) => {
                  // Prevent the input blur from firing before the click.
                  e.preventDefault();
                  if (blurTimer.current) clearTimeout(blurTimer.current);
                  commit(a);
                }}
                onMouseEnter={() => setActive(i)}
                className={`flex cursor-pointer items-center gap-3 px-3 py-2.5 ${
                  i === active ? "bg-ochre/15" : "hover:bg-cream"
                }`}
              >
                <Plane aria-hidden className="size-4 shrink-0 text-stone" />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-ink">
                    {a.city} <span className="text-ochre">({a.code})</span>
                  </span>
                  <span className="block truncate text-xs text-ink-soft">
                    {a.name} · {a.country}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm font-semibold text-clay" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
