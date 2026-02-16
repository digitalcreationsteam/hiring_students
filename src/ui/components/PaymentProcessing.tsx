import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API, { URL_PATH } from "src/common/API";
import { useAppDispatch } from "src/store/hooks";
import { setNavigation } from "src/store/slices/onboardingSlice";

type PaymentStatus = 'processing' | 'success' | 'failed' | 'timeout';

function PaymentProcessing() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  
  const [status, setStatus] = useState<PaymentStatus>('processing');
  const [attempts, setAttempts] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  
  const MAX_ATTEMPTS = 60; // 60 attempts × 2s = 2 minutes
  const POLL_INTERVAL = 2000; // 2 seconds

  useEffect(() => {
    // Get subscription ID from localStorage (set in Paywall component)
    const subscriptionId = localStorage.getItem("pendingSubscriptionId");
    
    if (!subscriptionId) {
      console.error("❌ No pending subscription ID found");
      navigate("/paywall");
      return;
    }

    console.log("🔍 Starting payment status polling for:", subscriptionId);

    const checkPaymentStatus = async () => {
      try {
        const response = await API(
          "GET",
          `/subscription/${subscriptionId}/status`
        );

        console.log("📊 Status check response:", response);

        if (response?.success) {
          const { isActive, isFailed } = response.data;

          if (isActive) {
            // ✅ PAYMENT SUCCESSFUL
            console.log("✅ Payment successful!");
            setStatus('success');
            
            // Clear pending subscription ID
            localStorage.removeItem("pendingSubscriptionId");
            
            // Get updated navigation status
            const statusResponse = await API("GET", URL_PATH.getUserStatus);
            
            if (statusResponse?.success) {
              dispatch(
                setNavigation({
                  nextRoute: statusResponse.navigation.nextRoute,
                  currentStep: statusResponse.navigation.currentStep,
                  completedSteps: statusResponse.navigation.completedSteps,
                  isOnboardingComplete: statusResponse.navigation.isOnboardingComplete,
                  hasPayment: true,
                })
              );
            }
            
            // Redirect to upload-resume after 1.5 seconds
            setTimeout(() => {
              navigate("/job-domain");
            }, 1500);
            
          } else if (isFailed) {
            // ❌ PAYMENT FAILED
            console.log("❌ Payment failed");
            setStatus('failed');
            setErrorMessage("Your payment could not be processed");
            
            // Clear pending subscription ID
            localStorage.removeItem("pendingSubscriptionId");
            
          } else if (attempts >= MAX_ATTEMPTS) {
            // ⏱️ TIMEOUT
            console.log("⏱️ Payment status check timed out");
            setStatus('timeout');
            setErrorMessage("Payment verification is taking longer than expected");
          }
        }
      } catch (error: any) {
        console.error('❌ Status check error:', error);
        
        if (attempts >= MAX_ATTEMPTS) {
          setStatus('timeout');
          setErrorMessage("Unable to verify payment status");
        }
      }
    };

    // Initial check immediately
    checkPaymentStatus();

    // Poll every 2 seconds
    const interval = setInterval(() => {
      setAttempts(prev => {
        const newAttempts = prev + 1;
        console.log(`🔄 Poll attempt ${newAttempts}/${MAX_ATTEMPTS}`);
        return newAttempts;
      });
      checkPaymentStatus();
    }, POLL_INTERVAL);

    // Cleanup
    return () => {
      clearInterval(interval);
    };
  }, [attempts, navigate, dispatch]);

  const handleRetry = () => {
    localStorage.removeItem("pendingSubscriptionId");
    navigate("/paywall");
  };

  const handleCheckSubscriptions = () => {
    localStorage.removeItem("pendingSubscriptionId");
    navigate("/subscriptions");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-neutral-50 px-4">
      <div className="max-w-md w-full">
        
        {/* PROCESSING STATE */}
        {status === 'processing' && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-violet-600 mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Processing Payment...
            </h2>
            <p className="text-gray-600 mb-4">
              Please wait while we confirm your payment
            </p>
            <p className="text-sm text-gray-500">
              This usually takes a few seconds
            </p>
            <div className="mt-4 flex justify-center items-center gap-2">
              <div className="w-2 h-2 bg-violet-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-violet-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-violet-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}

        {/* SUCCESS STATE */}
        {status === 'success' && (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-600 mb-4">
              Your subscription has been activated
            </p>
            <p className="text-sm text-violet-600 font-medium">
              Redirecting to upload resume...
            </p>
          </div>
        )}

        {/* FAILED STATE */}
        {status === 'failed' && (
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Failed
            </h2>
            <p className="text-gray-600 mb-6">
              {errorMessage || "Your payment could not be processed"}
            </p>
            <button
              onClick={handleRetry}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 px-6 rounded-full transition"
            >
              Try Again
            </button>
          </div>
        )}

        {/* TIMEOUT STATE */}
        {status === 'timeout' && (
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Status Pending
            </h2>
            <p className="text-gray-600 mb-6">
              {errorMessage || "We're still processing your payment. Please check your subscriptions page."}
            </p>
            <div className="space-y-3">
              <button
                onClick={handleCheckSubscriptions}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 px-6 rounded-full transition"
              >
                Check My Subscriptions
              </button>
              <button
                onClick={handleRetry}
                className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-full border-2 border-gray-200 transition"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentProcessing;