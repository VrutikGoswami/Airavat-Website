"use client";

import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { forwardRef, useId } from "react";

/** Shared styling for the quote flow's inputs. */
const inputCls =
  "w-full rounded-[3px] border border-parchment bg-ivory px-3.5 py-3 text-base text-ink placeholder:text-stone focus-visible:outline-2 focus-visible:outline-ochre aria-[invalid=true]:border-ochre";

type FieldShellProps = {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  id: string;
  children: ReactNode;
};

function FieldShell({ label, hint, error, required, id, children }: FieldShellProps) {
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
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm font-semibold text-clay" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function describedBy(id: string, hint?: string, error?: string): string | undefined {
  const ids = [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean);
  return ids.length ? ids.join(" ") : undefined;
}

type TextFieldProps = {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
} & ComponentPropsWithoutRef<"input">;

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField({ label, hint, error, required = true, ...rest }, ref) {
    const id = useId();
    return (
      <FieldShell label={label} hint={hint} error={error} required={required} id={id}>
        <input
          ref={ref}
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, hint, error)}
          className={inputCls}
          {...rest}
        />
      </FieldShell>
    );
  },
);

type TextAreaFieldProps = {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
} & ComponentPropsWithoutRef<"textarea">;

export const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(
  function TextAreaField({ label, hint, error, required = false, ...rest }, ref) {
    const id = useId();
    return (
      <FieldShell label={label} hint={hint} error={error} required={required} id={id}>
        <textarea
          ref={ref}
          id={id}
          rows={4}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, hint, error)}
          className={inputCls}
          {...rest}
        />
      </FieldShell>
    );
  },
);

type SelectFieldProps = {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
} & ComponentPropsWithoutRef<"select">;

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  function SelectField({ label, hint, error, required = true, children, ...rest }, ref) {
    const id = useId();
    return (
      <FieldShell label={label} hint={hint} error={error} required={required} id={id}>
        <select
          ref={ref}
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, hint, error)}
          className={inputCls}
          {...rest}
        >
          {children}
        </select>
      </FieldShell>
    );
  },
);

type CheckboxFieldProps = {
  label: string;
  error?: string;
} & ComponentPropsWithoutRef<"input">;

export const CheckboxField = forwardRef<HTMLInputElement, CheckboxFieldProps>(
  function CheckboxField({ label, error, ...rest }, ref) {
    const id = useId();
    return (
      <div>
        <label htmlFor={id} className="flex cursor-pointer items-start gap-3">
          <input
            ref={ref}
            id={id}
            type="checkbox"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${id}-error` : undefined}
            className="mt-0.5 size-5 shrink-0 accent-ochre"
            {...rest}
          />
          <span className="text-sm leading-relaxed">{label}</span>
        </label>
        {error ? (
          <p id={`${id}-error`} className="mt-1.5 text-sm font-semibold text-clay" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);

/** Big tappable option used for single-choice steps. */
export function OptionTile({
  selected,
  title,
  description,
  onSelect,
}: {
  selected: boolean;
  title: string;
  description?: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={`w-full rounded-[3px] border px-4 py-3.5 text-left transition-colors ${
        selected
          ? "border-ochre bg-ochre/10"
          : "border-parchment bg-ivory hover:border-stone"
      }`}
    >
      <span className={`block font-bold ${selected ? "text-clay" : "text-ink"}`}>{title}</span>
      {description ? (
        <span className="mt-0.5 block text-xs leading-relaxed text-ink-soft">{description}</span>
      ) : null}
    </button>
  );
}
