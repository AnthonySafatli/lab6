import "./contact-form.css";

import { useState, useEffect, useCallback } from "react";
import type { ChangeEvent } from "react";

import type FormMessage from "../../models/form-message";
import type { FormStatus } from "../../models/form-status";

const DRAFT_KEY = "contact_form_draft";

const INITIAL: FormMessage = {
  id: 0,
  name: "",
  email: "",
  subject: "",
  message: "",
  date: "",
};

// Sanitization
function sanitizeText(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

// Validators
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const ALPHA_RE = /^[a-zA-Z\s\-']+$/;
const LETTERS_RE = /^[a-zA-Z\s]+$/;

type FieldErrors = Partial<Record<keyof FormMessage, string>>;

function validateField(name: keyof FormMessage, value: string): string {
  if (!value.trim()) return "This field is required.";
  switch (name) {
    case "name":
      return ALPHA_RE.test(value)
        ? ""
        : "Name may only contain letters, spaces, hyphens, or apostrophes.";
    case "email":
      return EMAIL_RE.test(value) ? "" : "Please enter a valid email address.";
    case "subject":
      return LETTERS_RE.test(value)
        ? ""
        : "Subject may only contain letters and spaces.";
    default:
      return "";
  }
}

function validateAll(form: FormMessage): FieldErrors {
  const fields: (keyof FormMessage)[] = ["name", "email", "subject", "message"];
  const errors: FieldErrors = {};
  for (const field of fields) {
    const err = validateField(field, form[field] as string);
    if (err) errors[field] = err;
  }
  return errors;
}

// Types
interface ContactFormProps {
  status: FormStatus;
  setStatus: (status: FormStatus) => void;
}

// Component
export default function ContactForm({ status, setStatus }: ContactFormProps) {
  const [form, setForm] = useState<FormMessage>(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      return saved ? { ...INITIAL, ...JSON.parse(saved) } : INITIAL;
    } catch {
      return INITIAL;
    }
  });

  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof FormMessage, boolean>>
  >({});
  const [consent, setConsent] = useState(false);

  // Persist draft on every change (excluding id/date)
  useEffect(() => {
    const { id, date, ...draft } = form;
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  }, [form]);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      const key = name as keyof FormMessage;

      // Sanitize message field on input; others accept raw and validate shape
      const sanitized = key === "message" ? sanitizeText(value) : value;

      setForm((prev) => ({ ...prev, [key]: sanitized }));

      // Live-validate once the field has been touched
      setTouched((prev) => ({ ...prev, [key]: true }));
      const err = validateField(key, sanitized);
      setErrors((prev) => ({ ...prev, [key]: err }));
    },
    [],
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const key = e.target.name as keyof FormMessage;
      setTouched((prev) => ({ ...prev, [key]: true }));
      const err = validateField(key, (form[key] as string) ?? "");
      setErrors((prev) => ({ ...prev, [key]: err }));
    },
    [form],
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Mark all fields as touched and run full validation
    const allTouched = {
      name: true,
      email: true,
      subject: true,
      message: true,
    };
    setTouched(allTouched);
    const allErrors = validateAll(form);
    setErrors(allErrors);
    if (Object.values(allErrors).some(Boolean) || !consent) return;

    setStatus("sending");
    try {
      await new Promise((res) => setTimeout(res, 1200));
      setStatus("success");
      setForm(INITIAL);
      setTouched({});
      setErrors({});
      setConsent(false);
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      setStatus("error");
    }
  };

  const fieldClass = (name: keyof FormMessage) => {
    const base = "contact-input";
    if (!touched[name]) return base;
    return errors[name]
      ? `${base} contact-input--error`
      : `${base} contact-input--valid`;
  };

  const isSending = status === "sending";
  const isDisabled = isSending || !consent;

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Name & Email */}
      <div className="row g-3 mb-3">
        <div className="col-sm-6">
          <label className="contact-label" htmlFor="cf-name">
            Name
          </label>
          <input
            id="cf-name"
            type="text"
            name="name"
            className={fieldClass("name")}
            placeholder="Jane Smith"
            value={form.name}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            autoComplete="name"
          />
          {touched.name && errors.name && (
            <p className="contact-field-error">{errors.name}</p>
          )}
        </div>
        <div className="col-sm-6">
          <label className="contact-label" htmlFor="cf-email">
            Email
          </label>
          <input
            id="cf-email"
            type="email"
            name="email"
            className={fieldClass("email")}
            placeholder="jane@example.com"
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            autoComplete="email"
          />
          {touched.email && errors.email && (
            <p className="contact-field-error">{errors.email}</p>
          )}
        </div>
      </div>

      {/* Subject */}
      <div className="mb-3">
        <label className="contact-label" htmlFor="cf-subject">
          Subject
        </label>
        <input
          id="cf-subject"
          type="text"
          name="subject"
          className={fieldClass("subject")}
          placeholder="Letters only please"
          value={form.subject}
          onChange={handleChange}
          onBlur={handleBlur}
          required
        />
        {touched.subject && errors.subject && (
          <p className="contact-field-error">{errors.subject}</p>
        )}
      </div>

      {/* Message */}
      <div className="mb-4">
        <label className="contact-label" htmlFor="cf-message">
          Message
        </label>
        <textarea
          id="cf-message"
          name="message"
          className={fieldClass("message")}
          rows={6}
          placeholder="Tell me more..."
          value={form.message}
          onChange={handleChange}
          onBlur={handleBlur}
          required
        />
        {touched.message && errors.message && (
          <p className="contact-field-error">{errors.message}</p>
        )}
      </div>

      {/* Consent */}
      <div className="mb-3 d-flex align-items-start gap-2">
        <input
          id="cf-consent"
          type="checkbox"
          className="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
        />
        <label htmlFor="cf-consent" className="checkbox-label">
          I agree that this information may be used to respond to my enquiry.
        </label>
      </div>

      {/* Status messages */}
      {status === "error" && (
        <p className="contact-field-error mb-3">
          Something went wrong. Please try again.
        </p>
      )}

      <button
        type="submit"
        className="btn btn-outline-info neon-btn w-100"
        disabled={isDisabled}
        aria-disabled={isDisabled}
      >
        {isSending ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
