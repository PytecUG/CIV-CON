import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import api from "@/api/client";
import type { AxiosError } from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await api.post(
        "/auth/forgot-password",
        { email },
        { headers: { "Content-Type": "application/json" } }
      );

      setMessage(res.data?.message || "Password reset email sent successfully.");
    } catch (err: unknown) {
      console.error("Forgot Password Error:", err);

      // Safely narrow down Axios errors
      if (err && typeof err === "object" && (err as AxiosError).isAxiosError) {
        const axiosErr = err as AxiosError<{ detail?: string | { msg: string }[] }>;
        const detail = axiosErr.response?.data?.detail;

        if (Array.isArray(detail)) {
          // FastAPI validation error array
          setError(detail.map((d) => d.msg).join(", "));
        } else if (typeof detail === "string") {
          setError(detail);
        } else {
          setError("An unexpected server error occurred.");
        }
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 sm:px-6 md:px-0">
      <Card className="shadow-lg border border-border/40 bg-transparent backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-xl font-bold">
            Forgot Password
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                required
              />
            </div>

            {message && (
              <p className="text-green-600 text-sm text-center">{message}</p>
            )}
            {error && (
              <p className="text-red-500 text-sm text-center">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full font-semibold"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
