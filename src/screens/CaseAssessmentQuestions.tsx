"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API, { URL_PATH } from "src/common/API";
import { Button } from "../ui/components/Button";
import { CheckboxCard } from "../ui/components/CheckboxCard";
import { FeatherAlertCircle } from "@subframe/core";
import { FeatherArrowRight } from "@subframe/core";
import { FeatherClock } from "@subframe/core";
import { FeatherSidebar } from "@subframe/core";
import { FeatherX } from "@subframe/core";
import { colors } from "src/common/Colors";
import Navbar from "src/ui/components/Navbar";
import Footer from "src/ui/components/Footer";

type Option = {
  key: string;
  text: string;
};

type Question = {
  _id: string;
  caseId: string;
  questionText: string;
  options: Option[];
  marks?: number;
};

type OptionKey = 1 | 2 | 3 | 4;

function pad2(n: number) {
  return n.toString().padStart(2, "0");
}

export default function CaseAssessmentQuestions() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [question, setQuestion] = useState<Question | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>([]);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [durationMinutes, setDurationMinutes] = useState<number | null>(null);
  const [progressPercent, setProgressPercent] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  const submitLockRef = useRef(false);
  const saveVersionRef = useRef<Record<string, number>>({});
  const saveTimeoutRef = useRef<Record<string, ReturnType<typeof setTimeout>>>(
    {}
  );

  const { attemptId } = state || {};

  // 🔒 Safety
  useEffect(() => {
    if (!attemptId) {
      navigate("/case-assessments");
    }
  }, [attemptId, navigate]);

  // Fetch initial question and total count
  useEffect(() => {
    if (!attemptId) return;

    const fetchQuestion = async () => {
      try {
        setLoading(true);
        const res = await API("GET", URL_PATH.getCurrentQuestion(attemptId));
        
        setQuestion(res.data);
        
        // If we have total questions info in response, use it
        if (res.totalQuestions) {
          setTotalQuestions(res.totalQuestions);
          setCompletedCount(res.completedCount || 0);
          
          // Calculate progress
          const percent = res.totalQuestions > 0 
            ? Math.round(((res.completedCount || 0) / res.totalQuestions) * 100)
            : 0;
          setProgressPercent(percent);
        }
        
        // Initialize timer if duration is provided
        if (res.durationMinutes) {
          setDurationMinutes(res.durationMinutes);
          const expiryTime = Date.now() + (res.durationMinutes * 60 * 1000);
          startTimer(expiryTime);
        }
        
        // Initialize answers array if needed
        setAnswers(prev => prev.length > 0 ? prev : Array(totalQuestions || 1).fill(null));
        
      } catch (err) {
        console.error("Fetch question failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [attemptId]);

  // Timer function
  const startTimer = (expiryTime: number) => {
    const tick = () => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((expiryTime - now) / 1000));
      setRemainingSeconds(diff);

      if (diff === 0 && !submitLockRef.current) {
        handleAutoSubmit();
      }
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  };

  const handleAutoSubmit = async () => {
    if (!attemptId || submitLockRef.current) return;
    
    submitLockRef.current = true;
    
    try {
      const finalRes = await API("POST", URL_PATH.submitAttempt(attemptId));
      
      navigate("/case-assessment-score", {
        state: {
          score: finalRes.score,
          retryAvailable: finalRes.retryAvailable,
          attemptId: attemptId,
          caseId: question?.caseId,
        },
      });
    } catch (err) {
      console.error("Auto-submit failed:", err);
    }
  };

  const handleSelectOption = (optionKey: string) => {
    setSelected(optionKey);
  };

  const handleSubmit = async () => {
    if (!selected || !question || !attemptId) return;

    try {
      setSubmitting(true);

      // 1️⃣ Submit the current answer
      const submitRes = await API(
        "POST",
        URL_PATH.submitAnswer(attemptId),
        { questionId: question._id, selectedOption: selected }
      );

      // Update completed count
      const newCompletedCount = (completedCount || 0) + 1;
      setCompletedCount(newCompletedCount);
      
      // Update progress
      const percent = totalQuestions > 0 
        ? Math.round((newCompletedCount / totalQuestions) * 100)
        : 0;
      setProgressPercent(percent);

      setSelected(null);

      // 2️⃣ Fetch the next question
      const res = await API("GET", URL_PATH.getCurrentQuestion(attemptId));

      // 3️⃣ If all questions are completed
      if (res?.completed || !res?.data) {
        const finalRes = await API("POST", URL_PATH.submitAttempt(attemptId));

        navigate("/case-assessment-score", {
          state: {
            score: finalRes.score,
            retryAvailable: finalRes.retryAvailable,
            attemptId: attemptId,
            caseId: question.caseId,
          },
        });
        return;
      }

      // 4️⃣ Show next question
      setQuestion(res.data);
      setCurrentIndex(prev => prev + 1);

    } catch (err) {
      console.error("Submit answer failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // For display: mm:ss
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  if (loading) return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: colors.background }}>
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="text-lg text-default-font">Loading assessment...</div>
      </div>
    </div>
  );

  if (!question) return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: colors.background }}>
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="text-lg text-default-font">No question found</div>
      </div>
    </div>
  );

  return (
    <div
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
    className="min-h-screen relative overflow-hidden">

      <div className="w-full relative" style={{ borderColor: colors.aqua }}>
          <Navbar />
        </div>
      {/* Blended background - Covers entire page */}

      {/* Header and content with z-index to stay above background */}
      <div className="relative z-10">
        <div className="min-h-screen w-full flex justify-center px-4 py-4 sm:py-6 lg:py-12">
          <div className="flex w-full max-w-[1024px] flex-col lg:flex-row items-stretch gap-4 lg:gap-6">
            {/* LEFT PANEL - Question Navigator */}
            <div
              style={{ backgroundColor: colors.white }}
              className="
                hidden lg:flex
                w-full lg:w-64
                flex-none flex-col items-start gap-4
                self-stretch rounded-2xl
                border border-neutral-border
                px-6 lg:px-8 py-6
                overflow-y-auto
              "
            >
              <div className="flex w-full items-start gap-4">
                <div className="flex grow shrink-0 basis-0 flex-col items-start gap-2">
                  <span className="text-heading-3 font-heading-3 text-default-font">
                    Question Navigator
                  </span>
                  <span className="text-sm font-caption text-subtext-color">
                    {completedCount} of {totalQuestions} answered
                  </span>
                </div>
                <FeatherSidebar className="mt-2 text-body font-body text-subtext-color cursor-pointer" />
              </div>
              
              <div className="flex items-center gap-2 flex-wrap mt-3">
                {Array.from({ length: 10 }).map((_, idx) => {
                  const isCurrent = idx === currentIndex;
                  const isAnswered = idx < completedCount;
                  
                  if (isCurrent) {
                    return (
                      <div
                        key={idx}
                        style={{ backgroundColor: colors.primaryGlow, color: "black" }}
                        onClick={() => setCurrentIndex(idx)}
                        className="flex h-10 w-10 flex-none items-center justify-center rounded-2xl cursor-pointer"
                      >
                        <span style={{ color: "white" }} className="text-body-bold font-body-bold">
                          {idx + 1}
                        </span>
                      </div>
                    );
                  }

                  if (isAnswered) {
                    return (
                      <div
                        key={idx}
                        style={{ backgroundColor: colors.secondary, color: colors.white}}
                        onClick={() => setCurrentIndex(idx)}
                        className="flex h-10 w-10 flex-none items-center justify-center rounded-2xl cursor-pointer"
                      >
                        <span className="text-body-bold font-body-bold text-success-700">
                          {idx + 1}
                        </span>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className="flex h-10 w-10 flex-none items-center justify-center rounded-2xl border-2 border-solid border-neutral-border bg-default-background cursor-pointer"
                    >
                      <span className="text-body-bold font-body-bold text-subtext-color">
                        {idx + 1}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="w-full h-[1px] bg-gray-300 my-4 flex-shrink-0" />

              <div className="flex w-full flex-col items-start gap-2">
                <div className="flex w-full items-center gap-2">
                  <div style={{ backgroundColor: colors.primaryGlow }} className="flex h-3 w-3 flex-none items-start rounded-full" />
                  <span className="text-caption font-caption text-default-font">
                    Current
                  </span>
                </div>
                <div className="flex w-full items-center gap-2">
                  <div style={{ backgroundColor: colors.secondary }} className="flex h-3 w-3 flex-none items-start rounded-full" />
                  <span className="text-caption font-caption text-default-font">
                    Answered
                  </span>
                </div>
                <div className="flex w-full items-center gap-2">
                  <div className="flex h-3 w-3 flex-none items-start rounded-full border border-solid border-neutral-border bg-default-background" />
                  <span className="text-caption font-caption text-default-font">
                    Unanswered
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="flex w-full flex-col items-start justify-start gap-4">
              {/* Warning Banner */}
              <div
                className="
                  flex w-full flex-wrap items-center gap-2
                  justify-between rounded-xl
                  border bg-yellow-50
                  px-3 py-2
                "
              >
                <div className="flex items-center gap-2">
                  <FeatherAlertCircle className="text-caption font-caption text-yellow-700" />
                  <span className="text-xs text-yellow-700">
                    Your Case Study Score contributes to your overall assessment
                  </span>
                </div>
                <FeatherX className="text-caption font-caption text-yellow-700" />
              </div>

              {/* Main Question Panel */}
              <div
                className="
                  flex w-full flex-col items-start gap-5
                  rounded-2xl border bg-white shadow-sm
                  px-4 py-5
                  sm:px-6 sm:py-6
                  lg:px-8 lg:py-8
                "
              >
                {/* Timer and Progress */}
                <div className="flex w-full items-center justify-between">
                  <span className="text-sm text-subtext-color">
                    Question {currentIndex + 1} of 10
                  </span>
                  {/* <div className="flex items-center gap-2">
                    <FeatherClock className="text-body font-body text-default-font" />
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-body-bold text-default-font">
                        {pad2(minutes)}:{pad2(seconds)}
                      </span>
                      <span className="text-sm text-default-font">remaining</span>
                    </div>
                  </div> */}
                </div>

                {/* Progress Bar */}
                <div className="flex w-full flex-col items-start gap-2">
                  <div
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={progressPercent}
                    className="w-full rounded-full bg-neutral-200 h-2 overflow-hidden"
                    title={`${progressPercent}% complete`}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${progressPercent}%`,
                        backgroundColor: colors.primary
                      }}
                    />
                  </div>
                  <span className="text-caption font-caption text-neutral-600">
                    {progressPercent}% complete
                  </span>
                </div>

                {/* Question Header */}
                <div className="w-full flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-lg sm:text-xl lg:text-heading-3 font-heading-3 text-neutral-700">
                        Case Study Assessment
                      </span>
                    </div>
                    <span
                      className="px-3 py-1 rounded-full text-xs font-bold border"
                      style={{
                        backgroundColor: colors.primary,
                        color: colors.white
                      }}
                    >
                      {question.marks || 5} Marks
                    </span>
                  </div>
                </div>

                {/* Bottom horizontal line */}
                <div className="w-full h-[1px] bg-gray-300 my-2 flex-shrink-0" />

                {/* Question Text */}
                <div className="flex w-full flex-col items-start gap-4">
                  <span className="font-['Nunito_Sans'] text-[16px] font-[500] leading-[24px] text-default-font">
                    {question.questionText}
                  </span>

                  {/* Options */}
                  <div className="flex w-full flex-col items-start gap-3">
                    {question.options.map((opt) => {
                      const isSelected = selected === opt.key;

                      return (
                        <CheckboxCard
                          key={opt.key}
                          className={`
                            h-auto w-full rounded-xl sm:rounded-2xl
                            border px-3 py-3 sm:px-4
                            transition-colors duration-200
                            ${isSelected ? "bg-[var(--primary-color)]" : "bg-white"}
                          `}
                          style={isSelected ? { backgroundColor: colors.background } : {}}
                          hideCheckbox={true}
                          checked={isSelected}
                          onCheckedChange={(checked: boolean) => {
                            if (checked) {
                              handleSelectOption(opt.key);
                            } else {
                              setSelected(null);
                            }
                          }}
                        >
                          <div className="flex flex-col items-start gap-1">
                            <span
                              className={`text-body-bold font-body-bold ${
                                isSelected ? "text-black" : "text-default-font"
                              }`}
                            >
                              {opt.key}. {opt.text}
                            </span>
                          </div>
                        </CheckboxCard>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom horizontal line */}
                <div className="w-full h-[1px] bg-gray-300 my-2 flex-shrink-0" />

                {/* Submit Button */}
                <div className="flex w-full flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-end">
                  <Button
                    disabled={!selected || submitting}
                    style={{ backgroundColor: colors.primary, color: colors.white }}
                    className="
                      h-10 px-6 rounded-full hover:opacity-90
                      shadow-[0_6px_18px_rgba(99,52,237,0.18)]
                      [&_span]:!text-white
                      [&_svg]:!text-white
                    "
                    size="large"
                    iconRight={<FeatherArrowRight style={{color: colors.white}} />}
                    onClick={handleSubmit}
                  >
                    {submitting ? "Submitting..." : "Submit Answer"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}