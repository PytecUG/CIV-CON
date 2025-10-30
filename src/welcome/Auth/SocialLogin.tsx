import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

const SocialLogin = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = params.get("token");
    const err = params.get("error");

    if (err) {
      // Error returned from backend
      setError(
        err === "access_denied"
          ? "You cancelled the login process."
          : "Social login failed. Please try again."
      );
      // Redirect back after 3 seconds
      setTimeout(() => navigate("/signin"), 3000);
      return;
    }

    if (token) {
      try {
        localStorage.setItem("token", token);
        login(token);
        navigate("/feed", { replace: true });
      } catch {
        setError("Unable to complete login. Please try again.");
        setTimeout(() => navigate("/signin"), 3000);
      }
    } else {
      setError("Invalid login attempt.");
      setTimeout(() => navigate("/signin"), 3000);
    }
  }, [params, login, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <Card className="w-full max-w-md text-center p-6 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            {error ? "Login Error" : "Signing You In..."}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          {error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <>
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-muted-foreground text-sm">
                Please wait while we complete your login...
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialLogin;
