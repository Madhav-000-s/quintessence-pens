
"use client"

import { useState } from "react";
import { supabase } from "@/supabase-client";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
      } else {
        setSuccess("Logged in successfully!");
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { display_name: username } },
      });
      if (error) {
        setError(error.message);
      } else {
        setSuccess("Signup successful! Please check your email to confirm.");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-8">
      <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-md p-8">
        <div className="flex justify-center mb-6">
          <button
            className={`px-4 py-2 font-semibold rounded-l-lg transition-colors ${
              mode === "login"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
            onClick={() => setMode("login")}
            disabled={loading}
          >
            Login
          </button>
          <button
            className={`px-4 py-2 font-semibold rounded-r-lg transition-colors ${
              mode === "signup"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
            onClick={() => setMode("signup")}
            disabled={loading}
          >
            Signup
          </button>
        </div>
        
        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="bg-background border border-input rounded-lg px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-50"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            className="bg-background border border-input rounded-lg px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-50"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={loading}
          />
          {mode === "signup" && (
            <input
              type="text"
              placeholder="Username"
              className="bg-background border border-input rounded-lg px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-50"
              required
              value={username}
              onChange={e => setUsername(e.target.value)}
              disabled={loading}
            />
          )}
          <button
            type="submit"
            onClick={handleSubmit}
            className="bg-primary text-primary-foreground font-semibold py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading
              ? mode === "login"
                ? "Logging in..."
                : "Signing up..."
              : mode === "login"
              ? "Login"
              : "Signup"}
          </button>
        </div>
        
        {error && (
          <div className="mt-4 text-destructive text-center text-sm font-medium bg-destructive/10 border border-destructive/20 rounded-lg p-3">
            {error}
          </div>
        )}
        {success && (
          <div className="mt-4 text-primary text-center text-sm font-medium bg-primary/10 border border-primary/20 rounded-lg p-3">
            {success}
          </div>
        )}
        
        {mode === "login" && (
          <div className="mt-6 text-sm text-center text-muted-foreground">
            Don't have an account?{" "}
            <button
              className="text-primary hover:text-primary/80 hover:underline font-medium transition-colors"
              onClick={() => setMode("signup")}
              type="button"
              disabled={loading}
            >
              Sign up
            </button>
          </div>
        )}
        {mode === "signup" && (
          <div className="mt-6 text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <button
              className="text-primary hover:text-primary/80 hover:underline font-medium transition-colors"
              onClick={() => setMode("login")}
              type="button"
              disabled={loading}
            >
              Log in
            </button>
          </div>
        )}
      </div>
    </div>
  );
}