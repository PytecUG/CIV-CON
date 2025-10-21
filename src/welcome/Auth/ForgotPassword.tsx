import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import api from "@/api/client";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
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

      setMessage(res.data.message || "Password reset email sent successfully");
    } catch (err) {
      console.error("Forgot Password Error:", err.response?.data);

      const detail = err.response?.data?.detail;
      if (Array.isArray(detail)) {
        // FastAPI validation error array
        setError(detail.map((d) => d.msg).join(", "));
      } else if (typeof detail === "string") {
        setError(detail);
      } else {
        setError("Something went wrong");
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
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {message && <p className="text-green-600 text-sm">{message}</p>}
            {error && (
              <p className="text-red-500 text-sm">
                {typeof error === "string" ? error : JSON.stringify(error)}
              </p>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;

