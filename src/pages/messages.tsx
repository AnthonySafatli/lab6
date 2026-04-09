import { useState, useEffect } from "react";

import MessageCard from "../components/message-card/message-card";
import type FormMessage from "../models/form-message";

type PageState = "prompt" | "loading" | "loaded" | "error";

export default function Messages() {
  const [pageState, setPageState] = useState<PageState>("prompt");
  const [password, setPassword] = useState("");
  const [messages, setMessages] = useState<FormMessage[]>([]);
  const [errorMsg, setErrorMsg] = useState("");

  // Re-authenticate from session so a refresh doesn't kick you out
  useEffect(() => {
    const saved = sessionStorage.getItem("msg_auth");
    if (saved) fetchMessages(saved);
  }, []);

  const fetchMessages = async (pw: string) => {
    setPageState("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/get-messages", {
        headers: { Authorization: `Bearer ${pw}` },
      });

      if (res.status === 401) {
        setErrorMsg("Incorrect password.");
        setPageState("prompt");
        return;
      }

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data: FormMessage[] = await res.json();
      sessionStorage.setItem("msg_auth", pw);
      setMessages(data);
      setPageState("loaded");
    } catch {
      setErrorMsg("Could not load messages. Please try again.");
      setPageState("error");
    }
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim()) fetchMessages(password.trim());
  };

  const handleLogout = () => {
    sessionStorage.removeItem("msg_auth");
    setPassword("");
    setMessages([]);
    setPageState("prompt");
  };

  // Password prompt 
  if (pageState === "prompt" || pageState === "error") {
    return (
      <section className="container text-light py-5 page-fade">
        <h1>Messages</h1>
        <p className="lead" style={{ maxWidth: "480px" }}>
          Enter the admin password to view submissions.
        </p>

        <div className="mt-5 pb-5">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-5">
                <div className="card p-4 p-md-5">
                  <form onSubmit={handleUnlock} noValidate>
                    <label htmlFor="msg-password" className="contact-label">
                      Password
                    </label>
                    <input
                      id="msg-password"
                      type="password"
                      className="contact-input mb-3"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      required
                      aria-describedby={errorMsg ? "msg-error" : undefined}
                    />
                    {errorMsg && (
                      <p
                        id="msg-error"
                        className="contact-field-error mb-3"
                        role="alert"
                      >
                        {errorMsg}
                      </p>
                    )}
                    <button
                      type="submit"
                      className="btn btn-outline-info neon-btn w-100"
                      disabled={!password.trim()}
                    >
                      Unlock
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Loading 
  if (pageState === "loading") {
    return (
      <section className="container text-light py-5 page-fade">
        <h1>Messages</h1>
        <p
          className="lead mt-4"
          aria-live="polite"
          style={{ maxWidth: "480px" }}
        >
          Loading…
        </p>
      </section>
    );
  }

  // Loaded 
  return (
    <section className="container text-light py-5 page-fade">
      <div className="d-flex justify-content-between align-items-start mb-2 flex-wrap gap-2">
        <div>
          <h1>Messages</h1>
          <p className="lead" style={{ maxWidth: "480px" }}>
            {messages.length} message{messages.length !== 1 ? "s" : ""}{" "}
            received.
          </p>
        </div>
        <button
          className="btn btn-outline-secondary btn-sm mt-2"
          onClick={handleLogout}
          aria-label="Log out of messages view"
        >
          Log out
        </button>
      </div>

      <div className="mt-5 pb-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              {messages.length === 0 ? (
                <p className="message-empty">No messages yet.</p>
              ) : (
                messages.map((msg) => (
                  <MessageCard key={msg.id} message={msg} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
