import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthShell, { Field } from "../components/AuthShell.jsx";
import { PrimaryButton } from "../components/Buttons.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useAlert } from "../context/AlertContext.jsx";

export default function Register() {
  const { register } = useAuth();
  const { notify, notifyError } = useAlert();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", roomNumber: "", password: "" });
  const [loading, setLoading] = useState(false);

  function update(key) {
    return (e) => setForm({ ...form, [key]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      notify("Account created. Waiting for verification.");
      navigate("/waiting");
    } catch (err) {
      notifyError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Set up your room account"
      subtitle="You'll start unverified — an existing member of your room (or an admin, for a brand-new room) approves you."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="text-moss-700 font-medium hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <Field label="Full name" required placeholder="Asha Menon" value={form.name} onChange={update("name")} />
        <Field
          label="Email"
          type="email"
          required
          placeholder="you@example.com"
          value={form.email}
          onChange={update("email")}
        />
        <Field
          label="Room number"
          required
          placeholder="e.g. 214"
          value={form.roomNumber}
          onChange={update("roomNumber")}
        />
        <Field
          label="Password"
          type="password"
          required
          minLength={6}
          placeholder="At least 6 characters"
          value={form.password}
          onChange={update("password")}
        />
        <PrimaryButton type="submit" disabled={loading} className="w-full mt-2">
          {loading ? "Creating account…" : "Create account"}
        </PrimaryButton>
      </form>
    </AuthShell>
  );
}
