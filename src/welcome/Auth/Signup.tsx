import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Link, useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Camera,
  AlertCircle,
} from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [districts, setDistricts] = useState<any[]>([]);
  const [counties, setCounties] = useState<any[]>([]);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingCounties, setLoadingCounties] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    // Step 1
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",

    // Step 2
    region: "",
    district: "",
    county: "",
    occupation: "",
    interests: [] as string[],

    // Step 3
    bio: "",
    profileImage: null as File | null,
    politicalInterest: "",
    communityRole: "",

    // Step 4
    notifications: { email: true, sms: false, push: true },
    privacyLevel: "public",
    agreeToTerms: false,
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const ugandaRegions = [
    "Central Region",
    "Eastern Region",
    "Northern Region",
    "Western Region",
  ];

  const interestOptions = [
    "Politics",
    "Education",
    "Healthcare",
    "Environment",
    "Technology",
    "Business",
    "Agriculture",
    "Youth Development",
    "Women's Rights",
    "Infrastructure",
    "Tourism",
    "Sports",
  ];

  // Fetch districts on mount
  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        setLoadingDistricts(true);
        const response = await axios.get(
          "https://api.civ-con.org/auth/locations/districts"
        );
        setDistricts(response.data || []);
      } catch {
        setError("Failed to load districts");
      } finally {
        setLoadingDistricts(false);
      }
    };
    fetchDistricts();
  }, []);

  // Fetch counties when district changes
  useEffect(() => {
    if (!formData.district) {
      setCounties([]);
      return;
    }

    const selectedDistrict = districts.find(
      (d) => d.id.toString() === formData.district
    );

    const fetchCounties = async () => {
      try {
        setLoadingCounties(true);
        const response = await axios.get(
          `https://api.civ-con.org/auth/locations/counties/${formData.district}`
        );
        const countiesData = response.data || [];
        setCounties(countiesData);
      } catch {
        setError("Failed to load counties");
      } finally {
        setLoadingCounties(false);
      }
    };

    fetchCounties();
  }, [formData.district, districts]);

  // Handle field updates
  const handleInputChange = useCallback((field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field === "profileImage" && value) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(value);
    }
  }, []);

  // Handle interest toggle
  const handleInterestToggle = useCallback((interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  }, []);

  // Next step validation
  const nextStep = useCallback(() => {
    if (currentStep === 1) {
      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.username ||
        !formData.email ||
        !formData.password ||
        !formData.confirmPassword
      ) {
        setError("Please fill in all required fields.");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match!");
        return;
      }
    }

    setError(null);
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  }, [currentStep, formData, totalSteps]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  }, [currentStep]);

  // Final submit
  const handleSubmit = async () => {
    if (!formData.agreeToTerms) {
      setError("Please agree to the terms before continuing.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const selectedDistrict = districts.find(
        (d) => d.id.toString() === formData.district
      );
      const selectedCounty = counties.find(
        (c) => c.id.toString() === formData.county
      );

      const data = new FormData();
      data.append("first_name", formData.firstName);
      data.append("last_name", formData.lastName);
      data.append("username", formData.username || "");
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("confirm_password", formData.confirmPassword);
      data.append("region", formData.region || "");

      // ✅ Append names instead of IDs
      data.append("district", selectedDistrict?.name || "");
      data.append("county", selectedCounty?.name || "");

      data.append("occupation", formData.occupation || "");
      data.append("bio", formData.bio || "");
      data.append("political_interest", formData.politicalInterest || "");
      data.append("community_role", formData.communityRole || "");
      data.append("interests", JSON.stringify(formData.interests || []));
      data.append("privacy_level", formData.privacyLevel);
      data.append("notifications", JSON.stringify(formData.notifications));

      if (formData.profileImage) {
        data.append("profile_image", formData.profileImage);
      }

      await axios.post("https://api.civ-con.org/auth/signup", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/signin", { replace: true });
    } catch (err: any) {
      console.error("Signup error:", err);
      setError(
        err.response?.data?.detail ||
          "Signup failed. Please check your details and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center justify-center w-40 h-8 bg-gradient-primary rounded-xl">
              <span className="text-white font-bold text-lg">CIV-CON</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gradient mb-2">
            Join Uganda Connects
          </h1>
          <p className="text-muted-foreground">
            Connect with fellow citizens and shape Uganda's future
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Card */}
        <Card className="shadow-xl border-0 bg-card/95 backdrop-blur">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-xl">
              {currentStep === 1 && "Create Your Account"}
              {currentStep === 2 && "Tell Us About Yourself"}
              {currentStep === 3 && "Complete Your Profile"}
              {currentStep === 4 && "Final Steps"}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1 */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>First Name</Label>
                    <Input
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <Label>Last Name</Label>
                    <Input
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <Label>Username</Label>
                <Input
                  value={formData.username}
                  onChange={(e) =>
                    handleInputChange("username", e.target.value)
                  }
                  placeholder="Choose a username"
                />

                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="your.email@example.com"
                />

                <Label>Password</Label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  placeholder="Create a strong password"
                />

                <Label>Confirm Password</Label>
                <Input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  placeholder="Confirm your password"
                />
              </div>
            )}

            {/* Step 2 */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Region</Label>
                    <Select
                      value={formData.region}
                      onValueChange={(v) => handleInputChange("region", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your region" />
                      </SelectTrigger>
                      <SelectContent>
                        {ugandaRegions.map((r) => (
                          <SelectItem key={r} value={r}>
                            {r}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>District</Label>
                    <Select
                      value={formData.district}
                      onValueChange={(v) => handleInputChange("district", v)}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            loadingDistricts
                              ? "Loading districts..."
                              : "Select your district"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {districts.map((d) => (
                          <SelectItem key={d.id} value={d.id.toString()}>
                            {d.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>County</Label>
                    <Select
                      value={formData.county}
                      onValueChange={(v) => handleInputChange("county", v)}
                      disabled={!formData.district || loadingCounties}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            loadingCounties
                              ? "Loading counties..."
                              : !formData.district
                              ? "Select district first"
                              : "Select your county"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {counties.map((c) => (
                          <SelectItem key={c.id} value={c.id.toString()}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Occupation</Label>
                    <Input
                      value={formData.occupation}
                      onChange={(e) =>
                        handleInputChange("occupation", e.target.value)
                      }
                      placeholder="What do you do for work?"
                    />
                  </div>
                </div>

                <div>
                  <Label>Areas of Interest</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {interestOptions.map((interest) => (
                      <Button
                        key={interest}
                        variant={
                          formData.interests.includes(interest)
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => handleInterestToggle(interest)}
                      >
                        {interest}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center bg-muted overflow-hidden">
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Profile Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Camera className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      document.getElementById("profileImage")?.click()
                    }
                  >
                    {previewImage ? "Change Photo" : "Upload Profile Photo"}
                  </Button>
                  <input
                    type="file"
                    id="profileImage"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) =>
                      e.target.files &&
                      handleInputChange("profileImage", e.target.files[0])
                    }
                  />
                </div>

                <Label>Bio</Label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  placeholder="Tell us about yourself..."
                />

                <Label>Political Interest</Label>
                <Select
                  value={formData.politicalInterest}
                  onValueChange={(v) =>
                    handleInputChange("politicalInterest", v)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="very-active">Very Active</SelectItem>
                    <SelectItem value="somewhat-active">
                      Somewhat Active
                    </SelectItem>
                    <SelectItem value="interested">
                      Interested Observer
                    </SelectItem>
                    <SelectItem value="casual">Casual Interest</SelectItem>
                  </SelectContent>
                </Select>

                <Label>Community Role</Label>
                <Select
                  value={formData.communityRole}
                  onValueChange={(v) => handleInputChange("communityRole", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="citizen">Concerned Citizen</SelectItem>
                    <SelectItem value="leader">Community Leader</SelectItem>
                    <SelectItem value="official">
                      Government Official
                    </SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="educator">Educator</SelectItem>
                    <SelectItem value="business">Business Owner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Step 4 */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <Label>Notification Preferences</Label>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={formData.notifications.email}
                        onCheckedChange={(c) =>
                          handleInputChange("notifications", {
                            ...formData.notifications,
                            email: c,
                          })
                        }
                      />
                      <span>Email notifications</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={formData.notifications.sms}
                        onCheckedChange={(c) =>
                          handleInputChange("notifications", {
                            ...formData.notifications,
                            sms: c,
                          })
                        }
                      />
                      <span>SMS alerts</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={formData.notifications.push}
                        onCheckedChange={(c) =>
                          handleInputChange("notifications", {
                            ...formData.notifications,
                            push: c,
                          })
                        }
                      />
                      <span>Push notifications</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Privacy Level</Label>
                  <Select
                    value={formData.privacyLevel}
                    onValueChange={(v) =>
                      handleInputChange("privacyLevel", v)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose privacy level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="friends">Friends Only</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-accent/10 p-4 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      checked={formData.agreeToTerms}
                      onCheckedChange={(c) =>
                        handleInputChange("agreeToTerms", c)
                      }
                    />
                    <Label className="text-sm">
                      I agree to the{" "}
                      <Link
                        to="/terms"
                        className="text-primary hover:underline"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        to="/privacy"
                        className="text-primary hover:underline"
                      >
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="h-4 w-4 mr-2" /> Previous
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  onClick={nextStep}
                  className="bg-primary hover:bg-primary/90"
                  disabled={loading}
                >
                  Next <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={loading || !formData.agreeToTerms}
                  className="bg-gradient-primary hover:opacity-90"
                >
                  {loading ? (
                    "Creating..."
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" /> Create Account
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="text-primary hover:underline font-medium"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
