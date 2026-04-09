import { useState } from "react";

import type { FormStatus } from "../models/form-status";

import ContactForm from "../components/contact-form/contact-form";
import ContactFormSuccessMessage from "../components/contact-form-success-message/contact-form-success-message";

export default function Contact() {
  const [status, setStatus] = useState<FormStatus>("idle");

  return (
    <section className="container text-light py-5 page-fade">
      <h1>Get in Touch</h1>
      <p>
        Have a project in mind or just want to say hello? Drop me a message and
        I'll get back to you.
      </p>

      <div className="mt-5 pb-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-7">
              <div className="card p-4 p-md-5">
                {status === "success" ? (
                  <ContactFormSuccessMessage setStatus={setStatus} />
                ) : (
                  <ContactForm status={status} setStatus={setStatus} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
