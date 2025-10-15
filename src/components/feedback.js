import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/feedback.css";
export default function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const endpoint = process.env.REACT_APP_FEEDBACK_ENDPOINT;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message }),
      });

      if (res.ok) {
        setSubmitted(true);
        setEmail("");
        setMessage("");
      } else {
        alert("Error submitting feedback. Try again later.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to send feedback.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6">
      {/* Toggle button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          Feedback
        </button>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="bg-white shadow-2xl rounded-2xl p-6 w-80 relative"
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-2 right-3 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>

            {/* Show rocket animation after submission */}
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-10">
                <motion.div
                  initial={{ y: 0 }}
                  animate={{ y: -150, opacity: 0 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                >
                  🚀
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.3 }}
                  className="text-center text-lg font-medium mt-6"
                >
                  Thank you for your feedback!
                </motion.p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                <h2 className="text-lg font-semibold">Send Feedback</h2>

                <input
                  type="email"
                  required
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <textarea
                  required
                  placeholder="Your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows="4"
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <button
                  type="submit"
                  disabled={sending}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {sending ? "Sending..." : "Submit"}
                </button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
