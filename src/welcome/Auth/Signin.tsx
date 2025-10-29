import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import api from "@/api/client"; 
import { useAuth } from "@/context/AuthContext";


import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Mail, Lock } from "lucide-react";

//
const Signin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  //  Redirect logged-in users automatically
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/feed"); // or "/home", 
    }
  }, [navigate]);

  //  handleSubmit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const form = new FormData();
      form.append("username", formData.email);
      form.append("password", formData.password);

      const res = await api.post("/auth/login", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const token = res.data.access_token;
      if (!token) throw new Error("No token returned from API");

      //  Trigger AuthContext login
      await login(token);

      navigate("/feed", { replace: true });
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="w-full max-w-md mx-auto px-4 sm:px-6 md:px-0">
      <Card className="shadow-lg border border-border/40 bg-transparent backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
        <CardHeader className="space-y-2 text-center">
          <div className="flex items-center justify-center w-32 sm:w-40 h-8 bg-gradient-primary rounded-lg mx-auto mb-3">
            <span className="text-white font-bold text-lg tracking-wide">
              CIV-CON
            </span>
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Sign in to your CIV Connect account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm sm:text-base">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4 sm:h-5 sm:w-5" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10 text-sm sm:text-base"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm sm:text-base">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4 sm:h-5 sm:w-5" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="pl-10 text-sm sm:text-base"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={formData.rememberMe}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, rememberMe: checked as boolean })
                  }
                />
                <Label
                  htmlFor="remember"
                  className="text-sm text-muted-foreground"
                >
                  Remember me
                </Label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:underline text-right"
              >
                Forgot password?
              </Link>
            </div>

                  
            {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
            )}


            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
                className="w-full shadow-soft text-sm sm:text-base py-2 sm:py-3"
              >
              {loading ? "Signing in..." : "Sign In"}
            </Button>


            {/* Sign Up Link */}
            <div className="text-center text-sm sm:text-base">
              <span className="text-muted-foreground">
                Don’t have an account?{" "}
                <Link
                  to="/signup"
                  className="text-primary hover:underline font-medium"
                >
                  Sign Up
                </Link>
              </span>
            </div>
          </form>

          {/* Social Login Options */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-4">
              <Button
                variant="outline"
                type="button"
                className="flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <svg
                  className="h-4 w-4 sm:h-5 sm:w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </Button>

              <Button
                variant="outline"
                type="button"
                className="flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <svg
                  className="h-4 w-4 sm:h-5 sm:w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M4.98 3.5C4.98 5 3.9 6 2.5 6S0 5 0 3.5 1.1 1 2.5 1 4.98 2 4.98 3.5zM.5 8h4V24h-4V8zm7.5 0h3.8v2.2h.1c.5-1 1.9-2.2 3.9-2.2 4.2 0 5 2.8 5 6.5V24h-4v-7.5c0-1.8 0-4-2.5-4s-2.9 2-2.9 3.9V24h-4V8z" />
                </svg>
                LinkedIn
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
 
    </div>
  );
};

export default Signin;
