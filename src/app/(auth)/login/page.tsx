"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const router = useRouter(); // Initialize the router

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    // Define the API route and body based on the mode
    let apiRoute = "";
    let body: any;

    if (mode === "login") {
      apiRoute = "http://localhost:3000/api/login"; // Assuming a login route
      body = { email, password };
    } else {
      // Use the path to your signup route
      apiRoute = "http://localhost:3000/api/signup"; 
      body = {
        email,
        password,
        display_name: username,
        // Add any other fields your form collects
        firstname,
        lastname,
        phone,
      };
    }

    try {
      // Use fetch to call your Route Handler
      const response = await fetch(apiRoute, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle errors from the API
        setError(data.error.message || "An unexpected error occurred.");
      } else {
        // Handle success
        if (mode === "login") {
          setSuccess("Logged in successfully! Redirecting...");
          // On successful login, redirect to the dashboard or homepage
          // router.push('/dashboard');
          // Or just refresh the page to update server components
          router.refresh(); 
        } else {
          // On sign-up, show the success message from the API
          setSuccess(data.message);
        }
      }
    } catch (error) {
      setError("Failed to connect to the server. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-8">
      {/* --- Your existing JSX remains the same --- */}
      {/* ... (form, buttons, etc.) ... */}
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
            <div className="flex flex-col gap-2">
              <input
              type="text"
              placeholder="Username"
              className="bg-background border border-input rounded-lg px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-50"
              required
              value={username}
              onChange={e => setUsername(e.target.value)}
              disabled={loading}
            />
            <input
              type="text"
              placeholder="First Name"
              className="bg-background border border-input rounded-lg px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-50"
              required
              value={firstname}
              onChange={e => setFirstname(e.target.value)}
              disabled={loading}
            />
            <input
              type="text"
              placeholder="Last Name"
              className="bg-background border border-input rounded-lg px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-50"
              required
              value={lastname}
              onChange={e => setLastname(e.target.value)}
              disabled={loading}
            />
            <input
              type="text"
              placeholder="Phone Number"
              className="bg-background border border-input rounded-lg px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-50"
              required
              value={phone}
              onChange={e => setPhone(e.target.value)}
              disabled={loading}
            />
            </div>
          )}
          <button
            type="submit"
            onClick={handleSubmit} // This is correct since there's no <form> element
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