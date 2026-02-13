import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "src/store/hooks";
import { setNavigation } from "src/store/slices/onboardingSlice";
import { Button } from "../ui/components/Button";
import { FeatherCheck, FeatherStar } from "@subframe/core";
import API, { URL_PATH } from "src/common/API";
import { colors } from "src/common/Colors";

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

      // ✅ Step 2: Initiate Dodo payment
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

      // ✅ Step 3: Store subscriptionId in localStorage before redirect
      localStorage.setItem("pendingSubscriptionId", subscriptionId);
      console.log("💾 Stored subscriptionId in localStorage:", subscriptionId);
      window.location.href = paymentResponse.paymentUrl;
      return; // ⛔ stop execution here

      // ✅ Step 2: Get updated navigation status (after subscription created)
      const statusResponse = await API("GET", URL_PATH.getUserStatus);

      if (!statusResponse?.success) {
        setError("Failed to get next step");
        setIsLoading(false);
        return;
      }

      console.log("📊 Updated navigation:", statusResponse.navigation);

      // ✅ Step 3: Update Redux with new navigation
      dispatch(
        setNavigation({
          nextRoute: statusResponse.navigation.nextRoute,
          currentStep: statusResponse.navigation.currentStep,
          completedSteps: statusResponse.navigation.completedSteps,
          isOnboardingComplete: statusResponse.navigation.isOnboardingComplete,
          hasPayment: true,
        }),
      );

      // ✅ Step 4: Navigate to next step (skips intro screens automatically)
      console.log(
        "✅ Subscription complete - navigating to:",
        statusResponse.navigation.nextRoute,
      );
      // navigate(statusResponse.navigation.nextRoute);
      if (subscriptionResponse?.success) {
        navigate(statusResponse.navigation.nextRoute);
      } else {
        navigate(statusResponse.navigation.nextRoute);
      }
    } catch (err: any) {
      console.error("❌ Error processing subscription:", err);
      setError(err?.message || "Failed to process subscription");
    } finally {
      setIsLoading(false);
    }
  };

  // Format price display
  const formatPrice = (plan: SubscriptionPlan | undefined): string => {
    if (!plan) return "";

    if (plan.price === 0) return "Free";

    const period = plan.billingPeriod === "yearly" ? "year" : "month";
    return `₹${plan.price}/${period}`;
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
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: colors.background }}
      >
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
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-10 relative">
        {/* 🎨 Linear gradient background - fixed behind everything */}
    <div 
      className="pointer-events-none fixed inset-0 -z-10"
      style={{
        background: `linear-gradient(
          to bottom,
          #d9d9d9 0%,
          #cfd3d6 25%,
          #9aa6b2 55%,
          #2E4056 100%
        )`,
        width: "100%",
      }}
    />

      <div className="w-full max-w-[760px] flex flex-col items-center gap-8 sm:gap-10">
        {/* Heading */}
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Pick your plan
          </h1>
          <p className="text-sm text-gray-500 max-w-md">
            Choose how you want to use the platform. You can switch later.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {plans.map((plan: SubscriptionPlan) => {
            const isSelected = selectedPlanId === plan._id;

            return (
              <div
                key={plan._id}
                onClick={() => setSelectedPlanId(plan._id)}
                className={`cursor-pointer w-full  rounded-3xl p-6 flex flex-col gap-6 shadow-sm border-2 transition-all duration-200 ${
                  isSelected ? "scale-[1.02]" : "hover:shadow-md"
                }`}
                style={{
                  backgroundColor: colors.white,
                  borderColor: isSelected
                    ? colors.primary
                    : colors.neutral[200],
                  boxShadow: isSelected
                    ? `0 0 0 4px ${colors.primary}22`
                    : undefined,
                }}
              >
                {/* Plan Header */}
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h2
                        className="text-xl font-bold"
                        style={{ color: colors.accent }}
                      >
                        {plan.planName}
                      </h2>
                      <p
                        className="text-sm mt-1"
                        style={{ color: colors.neutral[600] }}
                      >
                        {plan.description}
                      </p>
                    </div>

                    {isPopularPlan(plan) && (
                      <div
                        className="flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full"
                        style={{
                          backgroundColor: `${colors.primary}1A`,
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
                      className="text-sm mt-1"
                      style={{ color: colors.accent }}
                    >
                      {plan.trialPeriod}-day free trial
                    </p>
                  )}
                </div>

                {/* Features */}
                <div className="flex flex-col gap-3">
                  {getPlanFeatures(plan).map(
                    (feature: string, index: number) => (
                      <div key={index} className="flex items-start gap-3">
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center mt-0.5"
                          style={{
                            backgroundColor: isSelected
                              ? `${colors.primary}1A`
                              : colors.neutral[100],
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
                          className="text-sm"
                          style={{ color: colors.neutral[800] }}
                        >
                          {feature}
                        </span>
                      </div>
                    ),
                  )}
                </div>

      {/* Limits */}
      <div
        className="pt-4 border-t"
        style={{ borderColor: colors.neutral[200] }}
      >
        {plan.maxAssessments > 0 && (
          <p className="text-xs" style={{ color: colors.neutral[600] }}>
            <span className="font-medium" style={{ color: colors.accent }}>
              {plan.maxAssessments}
            </span>{" "}
            assessments/month
          </p>
        )}
        {plan.maxCandidates > 0 && (
          <p className="text-xs mt-1" style={{ color: colors.neutral[600] }}>
            <span className="font-medium" style={{ color: colors.accent }}>
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
    className="w-full max-w-[820px] p-4 rounded-lg text-sm border"
    style={{
      backgroundColor: `${colors.status.absent}15`,
      borderColor: `${colors.status.absent}40`,
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
  className="w-full max-w-[820px] h-12 sm:h-14 rounded-2xl font-semibold text-sm sm:text-base transition-all duration-300 flex items-center justify-center gap-2"
  style={{
    backgroundColor:
      isLoading || !selectedPlanId ? colors.neutral[200] : colors.primary,
    color: colors.white,
    boxShadow:
      isLoading || !selectedPlanId ? "none" : `0 10px 25px ${colors.primary}30`,
    cursor: isLoading || !selectedPlanId ? "not-allowed" : "pointer",
    opacity: isLoading || !selectedPlanId ? 0.75 : 1,
  }}
>
  {isLoading ? (
    <>
      <div
        className="animate-spin rounded-full h-5 w-5 border-2 border-transparent"
        style={{ borderTopColor: colors.accent }}
      />
      Processing...
    </>
  ) : selectedPlanId ? (
    getSelectedPlan()?.price === 0
      ? "Continue with Free Plan"
      : `Subscribe to ${getSelectedPlan()?.planName}`
  ) : (
    "Select a Plan to Continue"
  )}
</button>


        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="text-sm transition"
          style={{ color: colors.primaryGlow }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          ← Go back
        </button>
      </div>
    </div>
  );
}

export default Paywall;
