"use client";

import { useState, FormEvent } from "react";

export default function Home() {
  const [formData, setFormData] = useState({
    yourName: "",
    companyName: "",
    offering: "",
    targetCompany: "",
    targetRole: "",
  });
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setEmail("");
    setCopied(false);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setEmail(data.email);
    } catch {
      setError("Failed to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 font-[family-name:var(--font-geist-sans)]">
      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            Cold Email Generator
          </h1>
          <p className="text-lg text-slate-500">
            AI-powered personalized emails in seconds
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <label
                htmlFor="yourName"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Your name
              </label>
              <input
                id="yourName"
                name="yourName"
                type="text"
                required
                value={formData.yourName}
                onChange={handleChange}
                placeholder="Jane Smith"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            <div>
              <label
                htmlFor="companyName"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Your company
              </label>
              <input
                id="companyName"
                name="companyName"
                type="text"
                required
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Acme Inc."
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </div>

          <div className="mb-5">
            <label
              htmlFor="offering"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              What you offer / sell
            </label>
            <textarea
              id="offering"
              name="offering"
              required
              value={formData.offering}
              onChange={handleChange}
              rows={2}
              placeholder="AI-powered analytics platform that helps SaaS companies reduce churn by 30%"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            <div>
              <label
                htmlFor="targetCompany"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Target company
              </label>
              <input
                id="targetCompany"
                name="targetCompany"
                type="text"
                required
                value={formData.targetCompany}
                onChange={handleChange}
                placeholder="Stripe"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            <div>
              <label
                htmlFor="targetRole"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Target person&apos;s role
              </label>
              <input
                id="targetRole"
                name="targetRole"
                type="text"
                required
                value={formData.targetRole}
                onChange={handleChange}
                placeholder="VP of Engineering"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Generating...
              </span>
            ) : (
              "Generate Email"
            )}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-8">
            {error}
          </div>
        )}

        {/* Result */}
        {email && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">
                Your Email
              </h2>
              <button
                onClick={copyToClipboard}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 transition cursor-pointer"
              >
                {copied ? "Copied!" : "Copy to clipboard"}
              </button>
            </div>
            <div className="whitespace-pre-wrap text-slate-700 leading-relaxed bg-slate-50 rounded-lg p-6 font-[family-name:var(--font-geist-mono)] text-sm">
              {email}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
