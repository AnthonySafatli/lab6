import "./contact-form-success-message.css";

import type { FormStatus } from "../../models/form-status";

interface ContactFormSuccessMessageProps {
  setStatus: (status: FormStatus) => void;
}

export default function ContactFormSuccessMessage({
  setStatus,
}: ContactFormSuccessMessageProps) {
  return (
    <div className="text-center py-4">
      <div className="checkmark">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <polyline
            points="4,11 9,16 18,6"
            stroke="#00eaff"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h4 className="mb-2">Message sent!</h4>
      <p>I'll be in touch soon.</p>
      <button
        className="btn btn-outline-info neon-btn px-4 mt-2"
        onClick={() => setStatus("idle")}
      >
        Send another
      </button>
    </div>
  );
}
