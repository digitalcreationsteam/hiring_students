import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FeatherCheck, FeatherArrowRight } from "@subframe/core";
import API, { URL_PATH } from "src/common/API";

interface PaymentSuccessProps { }

export default function PaymentSuccess({ }: PaymentSuccessProps) {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(true);
    const [paymentStatus, setPaymentStatus] = useState<string>("verifying");

    // Get subscriptionId from URL or localStorage
    const urlSubscriptionId = searchParams.get("subscriptionId");
    const storedSubscriptionId = localStorage.getItem("pendingSubscriptionId");
    const subscriptionId = urlSubscriptionId || storedSubscriptionId;

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                if (!subscriptionId) {
                    console.error("❌ No subscriptionId in URL or localStorage");
                    setPaymentStatus("error");
                    setIsLoading(false);
                    return;
                }

                console.log("🔍 Verifying subscription payment...", subscriptionId);

                // Check subscription status
                const statusResponse = await API(
                    "GET",
                    `${URL_PATH.subscriptionStatus}${subscriptionId}`
                );

                console.log("📊 Subscription status response:", statusResponse);

                if (statusResponse?.success) {
                    const { paymentStatus: subPaymentStatus } = statusResponse.data;

                    // If payment is still pending in test mode, mark it as paid
                    if (subPaymentStatus === "pending") {
                        console.log("⏳ Payment pending - marking as paid in test mode...");


                        
                    } else if (subPaymentStatus === "success") {
                        console.log("✅ Payment already marked as success");
                        setPaymentStatus("success");
                        // Clear localStorage after successful payment
                        localStorage.removeItem("pendingSubscriptionId");
                    } else {
                        setPaymentStatus("failed");
                    }
                } else {
                    console.error("❌ Failed to check subscription status");
                    setPaymentStatus("error");
                }

                setIsLoading(false);
            } catch (error) {
                console.error("❌ Error verifying payment:", error);
                setPaymentStatus("error");
                setIsLoading(false);
            }
        };

        // Small delay to ensure DODO completes processing
        const timer = setTimeout(verifyPayment, 1500);

        return () => clearTimeout(timer);
    }, [subscriptionId]);

    const handleDashboard = () => {
        navigate("/dashboard");
    };

    const handleExploreSkills = () => {
        navigate("/skill-index");
    };

    const handleViewProfile = () => {
        navigate("/complete-profile");
    };

    if (isLoading || paymentStatus === "verifying") {
        return (
            <div className="min-h-screen w-full flex items-center justify-center relative">
                {/* 🎨 Linear gradient background */}
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
                <div className="text-center">
                    <div className="animate-spin mb-4">
                        <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full mx-auto"></div>
                    </div>
                    <p className="text-gray-700 font-medium">Verifying your payment...</p>
                </div>
            </div>
        );
    }

    if (paymentStatus === "failed" || paymentStatus === "error") {
        return (
            <div className="min-h-screen w-full flex items-center justify-center p-4 relative">
                {/* 🎨 Linear gradient background */}
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
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full text-center">
                    <h1 className="text-3xl font-bold text-red-600 mb-4">Payment Failed</h1>
                    <p className="text-gray-600 mb-6">
                        We were unable to process your payment. Please try again or contact support.
                    </p>
                    <button
                        onClick={() => navigate("/paywall")}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 relative">
            {/* 🎨 Linear gradient background */}
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
            
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
                {/* Success Icon */}
                <div className="flex justify-center mb-8">
                    <div className="relative">
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                            <FeatherCheck className="w-12 h-12 text-green-600" />
                        </div>
                        <div className="absolute inset-0 w-24 h-24 bg-green-200 rounded-full animate-ping opacity-20"></div>
                    </div>
                </div>

                {/* Success Message */}
                <h1 className="text-4xl font-bold text-gray-900 mb-3 text-center">
                    Payment Successful! 🎉
                </h1>

                <p className="text-gray-600 text-center mb-2 text-lg">
                    Thank you for subscribing to our premium service.
                </p>

                <p className="text-sm text-gray-500 text-center mb-8">
                    Your subscription is now active and you can access all premium features.
                </p>

                {/* Subscription ID (if available) */}
                {subscriptionId && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-8 text-left border border-gray-200">
                        <p className="text-xs text-gray-500 mb-2 font-semibold">
                            SUBSCRIPTION ID
                        </p>
                        <p className="font-mono text-sm text-gray-700 break-all bg-white p-2 rounded border border-gray-100">
                            {subscriptionId}
                        </p>
                    </div>
                )}

                {/* CTA Buttons */}
                <div className="space-y-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <button
                        onClick={handleDashboard}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                        <FeatherArrowRight className="w-4 h-4" />
                        Dashboard
                    </button>

                    <button
                        onClick={handleExploreSkills}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                        <FeatherArrowRight className="w-4 h-4" />
                        Explore Skills
                    </button>

                    <button
                        onClick={handleViewProfile}
                        className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 md:col-span-2"
                    >
                        <FeatherArrowRight className="w-4 h-4" />
                        Complete Profile
                    </button>
                </div>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-xs text-gray-500 text-center">
                        ✓ Invoice has been sent to your email
                    </p>
                    <p className="text-xs text-gray-500 text-center mt-2">
                        ✓ You can manage your subscription anytime
                    </p>
                </div>
            </div>
        </div>
    );
}