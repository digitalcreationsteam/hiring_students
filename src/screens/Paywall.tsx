import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "src/store/hooks";
import { setNavigation } from "src/store/slices/onboardingSlice";
import { Button } from "../ui/components/Button";
import { FeatherCheck, FeatherStar, FeatherArrowLeft } from "@subframe/core";
import API, { URL_PATH } from "src/common/API";
import { colors } from "src/common/Colors";
import Navbar from "src/ui/components/Navbar";
import Footer from "../ui/components/Footer";

// Type definitions
interface SubscriptionPlan {
  _id: string;
  id?: string;
  planName: string;
  description: string;
  price: number;
  currency: string;
  billingPeriod: string;
  features: string[];
  maxAssessments: number;
  maxCandidates: number;
  skillIndexAccess: boolean;
  advancedAnalytics: boolean;
  prioritySupport: boolean;
  trialPeriod: number;
  isActive: boolean;
}

interface ApiError {
  success?: boolean;
  message?: string;
  status?: number;
}

function Paywall() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingPlans, setIsLoadingPlans] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Fetch plans from backend
  useEffect(() => {
    const fetchPlans = async (): Promise<void> => {
      try {
        setIsLoadingPlans(true);
        setError("");
        console.log("📋 Fetching subscription plans...");

        const response = await API("GET", URL_PATH.getPlans);

        if (response?.success && Array.isArray(response.data)) {
          const plansData = response.data.filter((plan: any) => plan.isActive);
          console.log("✅ Plans fetched:", plansData);

          setPlans(plansData);

          // Auto-select first plan
          if (plansData.length > 0) {
            setSelectedPlanId(plansData[0]._id);
          }
        } else {
          setError("Failed to load subscription plans");
          console.error("❌ Invalid response format:", response);
        }
      } catch (err: any) {
        console.error("❌ Error fetching plans:", err);
        setError(err?.message || "Failed to load subscription plans");
      } finally {
        setIsLoadingPlans(false);
      }
    };

    fetchPlans();
  }, []);

  // Get selected plan details
  const getSelectedPlan = (): SubscriptionPlan | undefined => {
    return plans.find((plan) => plan._id === selectedPlanId);
  };

  const handleContinue = async (): Promise<void> => {
    // Validate
    if (!selectedPlanId) {
      setError("Please select a plan");
      return;
    }

    setError("");
    setIsLoading(true);

    const selectedPlan = getSelectedPlan();

    if (!selectedPlan) {
      setError("Selected plan not found");
      setIsLoading(false);
      return;
    }

    try {
      console.log("🚀 Creating subscription for plan:", selectedPlan.planName);

      // Step 1: Create subscription
      const subscriptionResponse = await API(
        "POST",
        URL_PATH.createSubscription,
        {
          planId: selectedPlanId,
        },
      );

      console.log("📦 Subscription response:", subscriptionResponse);

      if (!subscriptionResponse?.success) {
        setError(
          subscriptionResponse?.message || "Failed to create subscription",
        );
        setIsLoading(false);
        return;
      }

      // Step 2: Initiate Dodo payment
      const subscriptionId = subscriptionResponse.data.subscriptionId;

      const paymentResponse = await API("POST", URL_PATH.initiateDodoPayment, {
        subscriptionId,
      });

      console.log("💳 Dodo payment response:", paymentResponse);

      if (!paymentResponse?.success || !paymentResponse?.paymentUrl) {
        setError("Failed to initiate payment");
        setIsLoading(false);
        return;
      }

      // Step 3: Store subscriptionId in localStorage before redirect
      localStorage.setItem("pendingSubscriptionId", subscriptionId);
      console.log("💾 Stored subscriptionId in localStorage:", subscriptionId);
      window.location.href = paymentResponse.paymentUrl;
      return;
    } catch (err: any) {
      console.error("❌ Error processing subscription:", err);
      setError(err?.message || "Failed to process subscription");
    } finally {
      setIsLoading(false);
    }
  };

  // Format price display
  // Format price display
  const formatPrice = (plan: SubscriptionPlan | undefined): string => {
    if (!plan) return "";

    if (plan.price === 0) return "Free";

    // Show appropriate period label based on billingPeriod from backend
    if (plan.billingPeriod === "yearly") {
      return `$${plan.price}/year`;
    } else if (plan.billingPeriod === "oneTime") {
      return `$${plan.price} one-time`;
    } else {
      // Fallback for any other cases (monthly, etc.)
      return `$${plan.price}/${plan.billingPeriod}`;
    }
  };

  // Check if plan is popular
  const isPopularPlan = (plan: SubscriptionPlan): boolean => {
    return plan?.planName?.toLowerCase() === "premium";
  };

  // Get plan features (handle array format)
  const getPlanFeatures = (plan: SubscriptionPlan): string[] => {
    if (!plan?.features || !Array.isArray(plan.features)) {
      return ["No features listed"];
    }
    return plan.features.map((feature: any) => {
      if (typeof feature === "string") return feature;
      if (typeof feature === "object" && feature.name) return feature.name;
      return "Feature";
    });
  };

  if (isLoadingPlans) {
    return (
      <div className="min-h-screen bg-neutral-50 relative overflow-hidden flex flex-col">
        {/* Background Gradient Effects for Glass */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl opacity-20"
            style={{ backgroundColor: colors.primary }}
          />
          <div
            className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl opacity-20"
            style={{ backgroundColor: colors.secondary || colors.primary }}
          />
        </div>
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div
              className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto"
              style={{ borderColor: colors.primary }}
            ></div>
            <p className="mt-4 text-sm" style={{ color: colors.neutral[600] }}>
              Loading plans...
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 relative overflow-hidden flex flex-col">
      {/* Background Gradient Effects for Glass */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: colors.primary }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: colors.secondary || colors.primary }}
        />
      </div>

      <Navbar />

      <div className="flex-1 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 w-full">
        {/* Simple header with back button */}
        <div className="flex items-center gap-3 mb-8 max-w-[760px] mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-600 hover:text-neutral-900 bg-white/50 backdrop-blur-sm border border-white/20 transition-all hover:scale-110"
          >
            <FeatherArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex-1 flex items-center gap-1">
            <div className="h-1 flex-1 bg-neutral-200/50 backdrop-blur-sm rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: "100%", backgroundColor: colors.primary }}
              />
            </div>
            <span className="text-xs text-neutral-500 ml-2 bg-white/30 backdrop-blur-sm px-2 py-1 rounded-full">
              Payment
            </span>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="w-full max-w-[760px]">
            {/* Glass Card */}
            <div
              className="backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden"
              style={{
                backgroundColor: `${colors.white}CC`,
                border: `1px solid ${colors.white}`,
                boxShadow: "0 20px 40px -15px rgba(0,0,0,0.2)",
              }}
            >
              {/* Inner Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent pointer-events-none" />

              {/* Content */}
              <div className="relative z-10">
                {/* Heading */}
                <div className="flex flex-col items-center gap-2 text-center mb-8">
                  <h1 className="text-2xl sm:text-3xl font-light text-neutral-900">
                    Pick your plan
                  </h1>
                  <p className="text-sm text-neutral-500 max-w-md backdrop-blur-sm bg-white/30 px-4 py-2 rounded-full">
                    Choose how you want to use the platform. You can switch
                    later.
                  </p>
                </div>

                {/* Plans Grid */}
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6">
                  {plans.map((plan: SubscriptionPlan) => {
                    const isSelected = selectedPlanId === plan._id;

                    return (
                      <div
                        key={plan._id}
                        onClick={() => setSelectedPlanId(plan._id)}
                        className="group cursor-pointer w-full rounded-2xl p-6 flex flex-col gap-4 transition-all duration-300 backdrop-blur-sm hover:scale-[1.02] hover:shadow-lg"
                        style={{
                          backgroundColor: isSelected
                            ? `${colors.primary}15`
                            : "rgba(255,255,255,0.3)",
                          border: `2px solid ${
                            isSelected
                              ? colors.primary
                              : "rgba(255,255,255,0.5)"
                          }`,
                          boxShadow: isSelected
                            ? `0 8px 25px ${colors.primary}30`
                            : "0 4px 10px rgba(0,0,0,0.05)",
                        }}
                      >
                        {/* Plan Header */}
                        <div>
                          <div className="flex items-start justify-between">
                            <div>
                              <h2
                                className="text-xl font-semibold"
                                style={{ color: colors.accent }}
                              >
                                {plan.planName}
                              </h2>
                              <p
                                className="text-xs mt-1"
                                style={{ color: colors.neutral[600] }}
                              >
                                {plan.description}
                              </p>
                            </div>

                            {isPopularPlan(plan) && (
                              <div
                                className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full"
                                style={{
                                  backgroundColor: `${colors.primary}30`,
                                  color: colors.primary,
                                }}
                              >
                                <FeatherStar className="w-3 h-3" />
                                <span>Popular</span>
                              </div>
                            )}
                          </div>

                          {/* Price */}
                          <p
                            className="text-2xl font-bold mt-4"
                            style={{ color: colors.accent }}
                          >
                            {formatPrice(plan)}
                          </p>

                          {/* Trial period */}
                          {plan.trialPeriod > 0 && (
                            <p
                              className="text-xs mt-1"
                              style={{ color: colors.accent }}
                            >
                              {plan.trialPeriod}-day free trial
                            </p>
                          )}
                        </div>

                        {/* Features */}
                        <div className="flex flex-col gap-2">
                          {getPlanFeatures(plan).map(
                            (feature: string, featureIndex: number) => (
                              <div
                                key={featureIndex}
                                className="flex items-start gap-2"
                              >
                                <div
                                  className="w-5 h-5 rounded-full flex items-center justify-center mt-0.5 shrink-0"
                                  style={{
                                    backgroundColor: isSelected
                                      ? `${colors.primary}30`
                                      : "rgba(255,255,255,0.5)",
                                  }}
                                >
                                  <FeatherCheck
                                    className="w-3 h-3"
                                    style={{
                                      color: isSelected
                                        ? colors.primary
                                        : colors.neutral[600],
                                    }}
                                  />
                                </div>
                                <span
                                  className="text-xs"
                                  style={{ color: colors.neutral[600] }}
                                >
                                  {feature}
                                </span>
                              </div>
                            ),
                          )}
                        </div>

                        {/* Limits */}
                        <div
                          className="pt-3 border-t"
                          style={{ borderColor: "rgba(255,255,255,0.3)" }}
                        >
                          {plan.maxAssessments > 0 && (
                            <p
                              className="text-xs"
                              style={{ color: colors.neutral[600] }}
                            >
                              <span
                                className="font-medium"
                                style={{ color: colors.accent }}
                              >
                                {plan.maxAssessments}
                              </span>{" "}
                              assessments/month
                            </p>
                          )}
                          {plan.maxCandidates > 0 && (
                            <p
                              className="text-xs mt-1"
                              style={{ color: colors.neutral[600] }}
                            >
                              <span
                                className="font-medium"
                                style={{ color: colors.accent }}
                              >
                                {plan.maxCandidates}
                              </span>{" "}
                              candidates
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Error Message */}
                {error && (
                  <div
                    className="w-full p-4 rounded-xl mb-6 text-sm backdrop-blur-md"
                    style={{
                      backgroundColor: `${colors.status.absent}20`,
                      border: `1px solid ${colors.status.absent}40`,
                      color: colors.accent,
                    }}
                  >
                    {error}
                  </div>
                )}

                {/* Continue Button */}
                <button
                  disabled={isLoading || !selectedPlanId}
                  onClick={handleContinue}
                  className="group relative w-full h-12 sm:h-14 rounded-2xl font-medium text-sm sm:text-base transition-all duration-300 overflow-hidden"
                  style={{
                    cursor:
                      isLoading || !selectedPlanId ? "not-allowed" : "pointer",
                    opacity: isLoading || !selectedPlanId ? 0.75 : 1,
                  }}
                >
                  {/* Button Background with Glass Effect */}
                  <div
                    className="absolute inset-0 transition-all duration-300 group-hover:scale-105"
                    style={{
                      background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary || colors.primary})`,
                      opacity: isLoading || !selectedPlanId ? 0.5 : 1,
                    }}
                  />

                  {/* Button Content */}
                  <div className="relative z-10 flex items-center justify-center gap-2 text-white">
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white" />
                        Processing...
                      </>
                    ) : selectedPlanId ? (
                      getSelectedPlan()?.price === 0 ? (
                        "Continue with Free Plan"
                      ) : (
                        `Subscribe to ${getSelectedPlan()?.planName}`
                      )
                    ) : (
                      "Select a Plan to Continue"
                    )}
                  </div>

                  {/* Simple Hover Effect */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: "rgba(255,255,255,0.1)",
                    }}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Paywall;
