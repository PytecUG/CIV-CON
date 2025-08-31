import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft, CheckCircle, Star, Users, MapPin, Camera } from "lucide-react";

const Signup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    
    // Step 2: Location & Interests
    region: "",
    district: "",
    interests: [] as string[],
    occupation: "",
    
    // Step 3: Profile Setup
    bio: "",
    profileImage: null as File | null,
    politicalInterest: "",
    communityRole: "",
    
    // Step 4: Preferences
    notifications: {
      email: true,
      sms: false,
      push: true
    },
    privacyLevel: "public",
    agreeToTerms: false
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const ugandaRegions = [
    "Central Region", "Eastern Region", "Northern Region", "Western Region"
  ];

  const interestOptions = [
    "Politics", "Education", "Healthcare", "Environment", "Technology", 
    "Business", "Agriculture", "Youth Development", "Women's Rights", 
    "Infrastructure", "Tourism", "Sports"
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
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
    // Handle registration logic here
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
          <h1 className="text-3xl font-bold text-gradient mb-2">Join Uganda Connects</h1>
          <p className="text-muted-foreground">Connect with fellow citizens and shape Uganda's future</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

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
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      placeholder="Enter your first name"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      placeholder="Enter your last name"
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="your.email@example.com"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    placeholder="Create a strong password"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    placeholder="Confirm your password"
                    className="mt-1"
                  />
                </div>

                <div className="bg-primary/5 p-4 rounded-lg">
                  <h4 className="font-medium text-primary mb-2">Why Join Uganda Connects?</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Connect with leaders and fellow citizens</li>
                    <li>• Participate in meaningful discussions</li>
                    <li>• Stay informed about important issues</li>
                    <li>• Make your voice heard in Uganda's future</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Step 2: Location & Interests */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="region">Region</Label>
                    <Select value={formData.region} onValueChange={(value) => handleInputChange("region", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select your region" />
                      </SelectTrigger>
                      <SelectContent>
                        {ugandaRegions.map((region) => (
                          <SelectItem key={region} value={region}>{region}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                  <Label htmlFor="region">District</Label>
                  <Select value={formData.region} onValueChange={(value) => handleInputChange("region", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select your District" />
                    </SelectTrigger>
                    <SelectContent>
                      {ugandaRegions.map((region) => (
                        <SelectItem key={region} value={region}>{region}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="region">Sub-County</Label>
                    <Select value={formData.region} onValueChange={(value) => handleInputChange("region", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select your Subcounty" />
                      </SelectTrigger>
                      <SelectContent>
                        {ugandaRegions.map((region) => (
                          <SelectItem key={region} value={region}>{region}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="district">Address</Label>
                    <Input
                      id="district"
                      value={formData.district}
                      onChange={(e) => handleInputChange("district", e.target.value)}
                      placeholder="Enter your district"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input
                    id="occupation"
                    value={formData.occupation}
                    onChange={(e) => handleInputChange("occupation", e.target.value)}
                    placeholder="What do you do for work?"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Areas of Interest</Label>
                  <p className="text-sm text-muted-foreground mb-3">Select topics you're passionate about (choose at least 3)</p>
                  <div className="grid grid-cols-3 gap-2">
                    {interestOptions.map((interest) => (
                      <Button
                        key={interest}
                        variant={formData.interests.includes(interest) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleInterestToggle(interest)}
                        className="justify-start"
                      >
                        {interest}
                      </Button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Selected: {formData.interests.length} interests
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Profile Setup */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                    <Camera className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <Button variant="outline" size="sm">
                    Upload Profile Photo
                  </Button>
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    placeholder="Tell us about yourself, your goals, and what you hope to achieve on Uganda Connects..."
                    className="mt-1 min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="politicalInterest">Political Interest Level</Label>
                  <Select value={formData.politicalInterest} onValueChange={(value) => handleInputChange("politicalInterest", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="How politically active are you?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="very-active">Very Active</SelectItem>
                      <SelectItem value="somewhat-active">Somewhat Active</SelectItem>
                      <SelectItem value="interested">Interested Observer</SelectItem>
                      <SelectItem value="casual">Casual Interest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="communityRole">Community Role</Label>
                  <Select value={formData.communityRole} onValueChange={(value) => handleInputChange("communityRole", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="What's your role in the community?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="citizen">Concerned Citizen</SelectItem>
                      <SelectItem value="activist">Community Activist</SelectItem>
                      <SelectItem value="leader">Community Leader</SelectItem>
                      <SelectItem value="official">Government Official</SelectItem>
                      <SelectItem value="journalist">Journalist/Media</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="educator">Educator</SelectItem>
                      <SelectItem value="business">Business Owner</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 4: Final Steps */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium">Notification Preferences</Label>
                  <div className="space-y-3 mt-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="email-notifications"
                        checked={formData.notifications.email}
                        onCheckedChange={(checked) => 
                          handleInputChange("notifications", {...formData.notifications, email: checked})
                        }
                      />
                      <Label htmlFor="email-notifications" className="text-sm">Email notifications for important updates</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="sms-notifications"
                        checked={formData.notifications.sms}
                        onCheckedChange={(checked) => 
                          handleInputChange("notifications", {...formData.notifications, sms: checked})
                        }
                      />
                      <Label htmlFor="sms-notifications" className="text-sm">SMS alerts for urgent matters</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="push-notifications"
                        checked={formData.notifications.push}
                        onCheckedChange={(checked) => 
                          handleInputChange("notifications", {...formData.notifications, push: checked})
                        }
                      />
                      <Label htmlFor="push-notifications" className="text-sm">Push notifications for discussions</Label>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="privacy">Privacy Level</Label>
                  <Select value={formData.privacyLevel} onValueChange={(value) => handleInputChange("privacyLevel", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Choose your privacy level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public - Anyone can see your profile</SelectItem>
                      <SelectItem value="friends">Friends Only - Only connections can see details</SelectItem>
                      <SelectItem value="private">Private - Minimal information visible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-accent/10 p-4 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Checkbox 
                      id="terms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked)}
                    />
                    <div className="flex-1">
                      <Label htmlFor="terms" className="text-sm cursor-pointer">
                        I agree to the{" "}
                        <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>
                        {" "}and{" "}
                        <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        By creating an account, you agree to participate respectfully in discussions and follow our community guidelines.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-primary/5 p-4 rounded-lg">
                  <h4 className="font-medium text-primary mb-2 flex items-center">
                    <Star className="h-4 w-4 mr-2" />
                    You're Ready to Get Started!
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Join thousands of Ugandans already making their voices heard. Your journey to meaningful civic engagement starts now.
                  </p>
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
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              {currentStep < totalSteps ? (
                <Button onClick={nextStep} className="bg-primary hover:bg-primary/90">
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit} 
                  disabled={!formData.agreeToTerms}
                  className="bg-gradient-primary hover:opacity-90"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Create Account
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/signin" className="text-primary hover:underline font-medium">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
