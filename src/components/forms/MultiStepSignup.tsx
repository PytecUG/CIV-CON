import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, User, Calendar, Phone, Mail, Lock, MapPin, Badge, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";

interface FormData {
  fullName: string;
  dateOfBirth: string;
  phone: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  region: string;
  constituency: string;
  district: string;
  subcounty: string;
  address: string;
  role: string;
  occupation: string;
  education: string;
  agreeToTerms: boolean;
}

const steps = [
  { id: 1, title: "Personal Info", icon: User },
  { id: 2, title: "Contact Details", icon: Phone },
  { id: 3, title: "Account Security", icon: Lock },
  { id: 4, title: "Location Details", icon: MapPin },
  { id: 5, title: "Role & Profile", icon: Badge }
];

const ugandaRegions = [
  "Central", "Eastern", "Northern", "Western", "West Nile", "Karamoja", 
  "Ankole", "Buganda", "Busoga", "Teso", "Acholi", "Bunyoro"
];

const roles = [
  "Citizen", "Leader", "Politician", "Journalist", "Civil Servant", 
  "Student", "Business Person", "Religious Leader", "Academic"
];

export const MultiStepSignup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    dateOfBirth: "",
    phone: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    region: "",
    constituency: "",
    district: "",
    subcounty: "",
    address: "",
    role: "",
    occupation: "",
    education: "",
    agreeToTerms: false
  });

  const updateFormData = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log("Registration data:", formData);
    navigate("/signin");
  };

  const progress = (currentStep / steps.length) * 100;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => updateFormData("fullName", e.target.value)}
                placeholder="Enter your full name"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth *</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => updateFormData("dateOfBirth", e.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="education">Education Level</Label>
              <Select onValueChange={(value) => updateFormData("education", value)}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select education level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="primary">Primary Education</SelectItem>
                  <SelectItem value="secondary">Secondary Education</SelectItem>
                  <SelectItem value="certificate">Certificate</SelectItem>
                  <SelectItem value="diploma">Diploma</SelectItem>
                  <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                  <SelectItem value="master">Master's Degree</SelectItem>
                  <SelectItem value="phd">PhD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => updateFormData("phone", e.target.value)}
                placeholder="+256 7XX XXX XXX"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData("email", e.target.value)}
                placeholder="your.email@example.com"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="occupation">Occupation</Label>
              <Input
                id="occupation"
                value={formData.occupation}
                onChange={(e) => updateFormData("occupation", e.target.value)}
                placeholder="Your current occupation"
                className="h-11"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => updateFormData("username", e.target.value)}
                placeholder="Choose a unique username"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => updateFormData("password", e.target.value)}
                placeholder="Create a strong password"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                placeholder="Confirm your password"
                className="h-11"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="region">Region *</Label>
              <Select onValueChange={(value) => updateFormData("region", value)}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select your region" />
                </SelectTrigger>
                <SelectContent>
                  {ugandaRegions.map((region) => (
                    <SelectItem key={region} value={region.toLowerCase()}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="district">District *</Label>
              <Input
                id="district"
                value={formData.district}
                onChange={(e) => updateFormData("district", e.target.value)}
                placeholder="Enter your district"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="constituency">Constituency</Label>
              <Input
                id="constituency"
                value={formData.constituency}
                onChange={(e) => updateFormData("constituency", e.target.value)}
                placeholder="Enter your constituency"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subcounty">Sub-county</Label>
              <Input
                id="subcounty"
                value={formData.subcounty}
                onChange={(e) => updateFormData("subcounty", e.target.value)}
                placeholder="Enter your sub-county"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Physical Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => updateFormData("address", e.target.value)}
                placeholder="Enter your physical address"
                className="h-11"
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select onValueChange={(value) => updateFormData("role", value)}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role.toLowerCase()}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-4 mt-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => updateFormData("agreeToTerms", checked as boolean)}
                />
                <Label htmlFor="terms" className="text-sm leading-none">
                  I agree to the{" "}
                  <Link to="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="mb-6">
          <Link 
            to="/" 
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ChevronLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
        </div>

        <Card className="shadow-strong border-0">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Join Uganda Connects
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              Step {currentStep} of {steps.length}: {steps[currentStep - 1].title}
            </p>
          </CardHeader>

          <CardContent className="p-6">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                {steps.map((step) => {
                  const StepIcon = step.icon;
                  const isActive = step.id === currentStep;
                  const isCompleted = step.id < currentStep;
                  
                  return (
                    <div
                      key={step.id}
                      className={`flex flex-col items-center space-y-1 ${
                        isActive ? "text-primary" : isCompleted ? "text-primary/80" : "text-muted-foreground"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                          isActive
                            ? "border-primary bg-primary text-primary-foreground shadow-md"
                            : isCompleted
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-muted-foreground/30 bg-background"
                        }`}
                      >
                        <StepIcon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-medium hidden sm:block">{step.title}</span>
                    </div>
                  );
                })}
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Step Content */}
            <div className="min-h-[300px]">
              {renderStepContent()}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="h-11 px-6"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {currentStep === steps.length ? (
                <Button
                  onClick={handleSubmit}
                  disabled={!formData.agreeToTerms}
                  className="h-11 px-8 bg-gradient-primary hover:bg-gradient-primary/90 shadow-md"
                >
                  Create Account
                </Button>
              ) : (
                <Button onClick={nextStep} className="h-11 px-6">
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>

            {/* Sign In Link */}
            <div className="text-center mt-6 pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/signin" className="text-primary hover:underline font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};