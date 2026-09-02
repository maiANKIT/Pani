import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthShell, { Field } from "../components/AuthShell.jsx";
import { PrimaryButton } from "../components/Buttons.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useAlert } from "../context/AlertContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const { notify, notifyError } = useAlert();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      notify(`Welcome back, ${data.name.split(" ")[0]}.`);
      navigate(data.isVerified ? "/app" : "/waiting");
    } catch (err) {
      notifyError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to see your room's water log."
      footer={
        <>
          New to Aquora?{" "}
          <Link to="/register" className="text-moss-700 font-medium hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <Field
          label="Email"
          type="email"
          required
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <Field
          label="Password"
          type="password"
          required
          placeholder="••••••••"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <PrimaryButton type="submit" disabled={loading} className="w-full mt-2">
          {loading ? "Signing in…" : "Sign in"}
        </PrimaryButton>
      </form>
    </AuthShell>
  );
}
