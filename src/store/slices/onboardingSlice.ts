// src/store/slices/onboardingSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import API, { URL_PATH } from "../../common/API";

// ============================================
// TYPES
// ============================================
export type OnboardingStep =
  | "resume"
  | "demographics"
  | "education"
  | "experience"
  | "certifications"
  | "awards"
  | "projects"
  | "skill-index-intro"
  | "paywall"
  | "job-domain"
  | "skills"
  | "assessment-intro"
  | "assessment"
  | "assessment-results"
  | "completed";

interface NavigationState {
  nextRoute: string;
  currentStep: OnboardingStep;
  completedSteps: OnboardingStep[];
  isOnboardingComplete: boolean;
  hasPayment: boolean;
}

interface OnboardingState {
  navigation: NavigationState;
  isLoading: boolean;
  error: string | null;
  isHydrated: boolean; // ✅ NEW: Track if initial fetch is done
  allowedRoutes: string[]; // ✅ NEW: Routes user can access
}

// ============================================
// ROUTE DEFINITIONS
// ============================================
const SECTION_2_ROUTES = [
  "/demographics",
  "/education",
  "/experience",
  "/certifications",
  "/awards",
  "/projects",
  "/skill-index-intro",
];

const SECTION_4_ROUTES = [
  "/job-domain",
  "/skills",
  "/assessment-intro",
  "/assessment",
  "/assessment-results",
];

const APP_ROUTES = [
  "/dashboard",
  "/recruiter-chats",
  "/case-assessments",
  "/chat",
  "/talent-ranking",
  "/experience-index",
  "/skill-index",
  "/hireability-index",
];

// ============================================
// HELPER: Calculate Allowed Routes
// ============================================
function calculateAllowedRoutes(navigation: NavigationState): string[] {
  const { currentStep, completedSteps, hasPayment, isOnboardingComplete } =
    navigation;

  // ✅ Onboarding complete - access everything
  if (isOnboardingComplete) {
    return [
      "/upload-resume",
      ...SECTION_2_ROUTES,
      "/paywall",
      ...SECTION_4_ROUTES,
      ...APP_ROUTES,
    ];
  }

  // ✅ Section 2: Free navigation (completed steps + current step)
  const section2Steps = [
    "demographics",
    "education",
    "experience",
    "certifications",
    "awards",
    "projects",
    "skill-index-intro",
  ];

  if (section2Steps.includes(currentStep)) {
    const completedSection2Routes = completedSteps
      .filter((step) => section2Steps.includes(step))
      .map((step) => `/${step}`);

    return [
      "/upload-resume",
      ...completedSection2Routes,
      `/${currentStep}`,
      "/skill-index-intro", // Always allow intro page
    ];
  }

  // ✅ Paywall: Force stay on paywall
  if (currentStep === "paywall") {
    return ["/paywall", "/payment-processing"];
  }

  // ✅ Section 4: Only if paid
  const section4Steps = [
    "job-domain",
    "skills",
    "assessment-intro",
    "assessment",
    "assessment-results",
  ];

  if (hasPayment && section4Steps.includes(currentStep)) {
    const completedSection4Routes = completedSteps
      .filter((step) => section4Steps.includes(step))
      .map((step) => `/${step}`);

    return [
      ...completedSection4Routes,
      `/${currentStep}`,
      "/assessment-intro", // Always allow intro page
    ];
  }

  // ✅ Resume step
  if (currentStep === "resume") {
    return ["/upload-resume"];
  }

  // ✅ Default: only current step
  return [`/${currentStep}`];
}

// ============================================
// ASYNC THUNK: Hydrate Navigation from API
// ============================================
export const hydrateNavigation = createAsyncThunk(
  "onboarding/hydrate",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API("GET", URL_PATH.getUserStatus);

      if (!response?.success || !response?.navigation) {
        throw new Error("Invalid navigation response");
      }

      return response.navigation;
    } catch (error: any) {
      console.error("❌ Hydration failed:", error);
      return rejectWithValue(error?.message || "Failed to load navigation");
    }
  }
);

// ============================================
// INITIAL STATE
// ============================================
const initialState: OnboardingState = {
  navigation: {
    nextRoute: "/upload-resume",
    currentStep: "resume",
    completedSteps: [],
    isOnboardingComplete: false,
    hasPayment: false,
  },
  isLoading: false,
  error: null,
  isHydrated: false, // ✅ Start as false
  allowedRoutes: ["/upload-resume"], // ✅ Default allowed routes
};

// ============================================
// SLICE
// ============================================
const onboardingSlice = createSlice({
  name: "onboarding",
  initialState,
  reducers: {
    // ✅ Set navigation from API response
    setNavigation: (state, action: PayloadAction<NavigationState>) => {
      state.navigation = action.payload;
      state.allowedRoutes = calculateAllowedRoutes(action.payload);
      state.isLoading = false;
      state.error = null;

      // If setting navigation manually, mark as hydrated
      if (!state.isHydrated) {
        state.isHydrated = true;
      }
    },

    // ✅ Mark step as complete (optimistic update)
    completeStep: (state, action: PayloadAction<OnboardingStep>) => {
      const step = action.payload;

      if (!state.navigation.completedSteps.includes(step)) {
        state.navigation.completedSteps.push(step);
      }
    },

    // ✅ Update payment status
    setPaymentStatus: (state, action: PayloadAction<boolean>) => {
      state.navigation.hasPayment = action.payload;
      state.allowedRoutes = calculateAllowedRoutes(state.navigation);
    },

    // ✅ Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // ✅ Set error
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // ✅ Reset on logout
    resetOnboarding: () => initialState,
  },

  // ============================================
  // ASYNC THUNK HANDLERS
  // ============================================
  extraReducers: (builder) => {
    builder
      // Hydration pending
      .addCase(hydrateNavigation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      // Hydration success
      .addCase(hydrateNavigation.fulfilled, (state, action) => {
        state.navigation = action.payload;
        state.allowedRoutes = calculateAllowedRoutes(action.payload);
        state.isHydrated = true;
        state.isLoading = false;
        state.error = null;
      })

      // Hydration failed
      .addCase(hydrateNavigation.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isLoading = false;
        state.isHydrated = true; // Mark as hydrated even on error to prevent infinite loading
      });
  },
});

// ============================================
// EXPORTS
// ============================================
export const {
  setNavigation,
  completeStep,
  setPaymentStatus,
  setLoading,
  setError,
  resetOnboarding,
} = onboardingSlice.actions;

// ✅ SELECTORS
export const selectNavigation = (state: { onboarding: OnboardingState }) =>
  state.onboarding.navigation;
export const selectIsHydrated = (state: { onboarding: OnboardingState }) =>
  state.onboarding.isHydrated;
export const selectIsLoading = (state: { onboarding: OnboardingState }) =>
  state.onboarding.isLoading;
export const selectAllowedRoutes = (state: { onboarding: OnboardingState }) =>
  state.onboarding.allowedRoutes;
export const selectHasPayment = (state: { onboarding: OnboardingState }) =>
  state.onboarding.navigation.hasPayment;
export const selectCurrentStep = (state: { onboarding: OnboardingState }) =>
  state.onboarding.navigation.currentStep;
export const selectIsComplete = (state: { onboarding: OnboardingState }) =>
  state.onboarding.navigation.isOnboardingComplete;
export const selectCompletedSteps = (state: { onboarding: OnboardingState }) =>
  state.onboarding.navigation.completedSteps;
export const selectNextRoute = (state: { onboarding: OnboardingState }) =>
  state.onboarding.navigation.nextRoute;

export default onboardingSlice.reducer;