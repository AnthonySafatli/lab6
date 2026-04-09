import "./message-card.css";

import type FormMessage from "../../models/form-message";

interface MessageCardProps {
  message: FormMessage;
}

export default function MessageCard({ message }: MessageCardProps) {
  return (
    <div className="card mb-3 p-4">
      <div className="d-flex justify-content-between align-items-start mb-2">
        <div>
          <h5 className="card-title mb-0">{message.subject}</h5>
          <p className="mb-0 mt-1 mail-link">
            {message.name} -{" "}
            <a href={`mailto:${message.email}`} className="mail-link">
              {message.email}
            </a>
          </p>
        </div>
        <span className="message-date">{message.date}</span>
      </div>

      <hr className="message-card-hr" />

      <p className="card-text mb-0 message">{message.message}</p>
    </div>
  );
}
