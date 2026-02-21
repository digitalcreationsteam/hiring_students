"use client";

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API, { URL_PATH } from "src/common/API";
import { Button } from "../ui/components/Button";
import { CheckboxCard } from "../ui/components/CheckboxCard";
import { FeatherAlertCircle, FeatherArrowRight, FeatherX } from "@subframe/core";
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
  questionImageUrl?: string;
  options: Option[];
  marks?: number;
};

export default function CaseAssessmentQuestions() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { attemptId, caseId } = state || {};

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const TOTAL_QUESTIONS = 10; // total questions in case

  // 🔒 Redirect if no attempt
  useEffect(() => {
    if (!attemptId) navigate("/case-assessments");
  }, [attemptId, navigate]);

  // Fetch all questions at once (or can fetch one by one using index)
  useEffect(() => {
    if (!attemptId) return;

    const fetchQuestion = async (index: number) => {
      try {
        setLoading(true);

        const res = await API("GET", URL_PATH.getCurrentQuestion(caseId, index + 1));

        if (!res) return;

        const questionObj: Question = {
          _id: res._id,
          caseId: res.caseStudyId,
          questionText: `Q${res.questionNumber}: ${res.text || "Question text"}`,
          questionImageUrl: res.questionImageUrl,
          options: res.options.map((o: any) => ({ key: o.key, text: o.text })),
          marks: res.points || 5,
        };

        setQuestions((prev) => {
          const newQuestions = [...prev];
          newQuestions[index] = questionObj;
          return newQuestions;
        });
      } catch (err) {
        console.error("Failed to fetch question:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion(currentIndex);
  }, [attemptId, caseId, currentIndex]);

  // const handleSubmit = async () => {
  //   if (!selected) return;

  //   try {
  //     setSubmitting(true);

  //     const currentQuestion = questions[currentIndex];
  //     await API("POST", URL_PATH.submitAnswer(caseId, currentQuestion._id), {
  //       selectedOption: selected,
  //     });

  //     setSelected(null);

  //     if (currentIndex + 1 >= TOTAL_QUESTIONS) {
  //       // All questions done
  //       const finalRes = await API("POST", URL_PATH.submitAttempt(attemptId));
  //       navigate("/case-assessment-score", {
  //         state: {
  //           score: finalRes.score,
  //           retryAvailable: finalRes.retryAvailable,
  //           attemptId,
  //           caseId,
  //         },
  //       });
  //       return;
  //     }

  //     // Load next question
  //     setCurrentIndex((prev) => prev + 1);
  //   } catch (err) {
  //     console.error("Submit failed:", err);
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };

//   const handleSubmit = async () => {
//   if (!selected) return;

//   try {
//     setSubmitting(true);

//     const currentQuestion = questions[currentIndex];

//     // 1️⃣ Submit current answer
//     await API("POST", URL_PATH.submitAnswer(caseId, currentQuestion._id), {
//       selectedOption: selected,
//     });

//     setSelected(null);

//     // 2️⃣ Check if this is the last question
//     if (currentIndex + 1 >= TOTAL_QUESTIONS) {
//       // Submit entire attempt and navigate to score page
//       const finalRes = await API("POST", URL_PATH.submitAttempt(attemptId));

//       navigate("/case-assessment-score", {
//         state: {
//           score: finalRes.score,
//           retryAvailable: finalRes.retryAvailable,
//           attemptId,
//           caseId,
//         },
//       });

//       return;
//     }

//     // 3️⃣ Otherwise, load next question
//     setCurrentIndex((prev) => prev + 1);
//   } catch (err) {
//     console.error("Submit failed:", err);
//   } finally {
//     setSubmitting(false);
//   }
// };

// const handleSubmit = async () => {
//   if (!selected) return;

//   try {
//     setSubmitting(true);

//     const currentQuestion = questions[currentIndex];

//     // 1️⃣ Submit current question answer
//     await API("POST", URL_PATH.submitAnswer(caseId, currentQuestion._id), {
//       selectedOption: selected,
//     });

//     setSelected(null);

//     // 2️⃣ If last question, submit attempt for score
//     if (currentIndex + 1 >= TOTAL_QUESTIONS) {
//       // ✅ Wait for submitAnswer to finish first
//       const finalRes = await API("POST", URL_PATH.submitAttempt(attemptId), {
//         // include attemptId explicitly if API needs it in body
//         attemptId,
//       });

//       navigate("/case-assessment-score", {
//         state: {
//           score: finalRes.score,
//           retryAvailable: finalRes.retryAvailable,
//           attemptId,
//           caseId,
//         },
//       });

//       return;
//     }

//     // 3️⃣ Otherwise, load next question
//     setCurrentIndex((prev) => prev + 1);
//   } catch (err) {
//     console.error("Submit failed:", err);
//   } finally {
//     setSubmitting(false);
//   }
// };


const handleSubmit = async () => {
  if (!selected) return;

  try {
    setSubmitting(true);

    const currentQuestion = questions[currentIndex];

    // 1️⃣ Submit current answer
    const response = await API("POST", URL_PATH.submitAnswer(caseId, currentQuestion._id), {
      selectedOption: selected,
    });

    setSelected(null);

    // Check if the attempt is completed from the response
    if (response?.completed) {
      // If completed, submit the attempt and go to score page
      const finalRes = await API("POST", URL_PATH.submitAttempt(attemptId));
      
      navigate("/case-assessment-score", {
        state: {
          score: finalRes.score,
          retryAvailable: finalRes.retryAvailable,
          attemptId,
          caseId,
        },
      });
      return;
    }

    // 2️⃣ If this is the last question (based on index)
    if (currentIndex + 1 >= TOTAL_QUESTIONS) {
      const finalRes = await API("POST", URL_PATH.submitAttempt(attemptId));

      navigate("/case-assessment-score", {
        state: {
          score: finalRes.score,
          retryAvailable: finalRes.retryAvailable,
          attemptId,
          caseId,
        },
      });
      return;
    }

    // 3️⃣ Otherwise, move to next question
    setCurrentIndex((prev) => prev + 1);
  } catch (err) {
    console.error("Submit failed:", err);
    
    // Handle "already submitted" error - move to next question
    // Check for the error message in different possible formats
    const errorMessage = 
      (err as any)?.message || 
      (err as any)?.response?.data?.message || 
      (err as any)?.data?.message;
    
    if (errorMessage === "Answer already submitted") {
      console.log("Answer already submitted, moving to next question...");
      
      // Clear selection
      setSelected(null);
      
      // Check if this was the last question
      if (currentIndex + 1 >= TOTAL_QUESTIONS) {
        try {
          // Submit the entire attempt
          const finalRes = await API("POST", URL_PATH.submitAttempt(attemptId));
          
          navigate("/case-assessment-score", {
            state: {
              score: finalRes.score,
              retryAvailable: finalRes.retryAvailable,
              attemptId,
              caseId,
            },
          });
        } catch (finalErr) {
          console.error("Failed to submit attempt:", finalErr);
          // If attempt submission fails, still try to move to next question
          setCurrentIndex((prev) => prev + 1);
        }
      } else {
        // Move to next question
        setCurrentIndex((prev) => prev + 1);
      }
    } else {
      // Handle other errors (optional: show error message to user)
      alert("Failed to submit answer. Please try again.");
    }
  } finally {
    setSubmitting(false);
  }
};

  const currentQuestion = questions[currentIndex];

  if (loading || !currentQuestion)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading question...
      </div>
    );

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(to bottom,#d9d9d9,#cfd3d6,#9aa6b2,#2E4056)" }}
    >
      <Navbar />

      <div className="relative z-10 flex justify-center px-4 py-8">
        <div className="w-full max-w-[1000px] flex flex-col gap-6">
          {/* Warning */}
          <div className="flex items-center justify-between rounded-xl border bg-yellow-50 px-4 py-2">
            <div className="flex items-center gap-2">
              <FeatherAlertCircle className="text-yellow-700" />
              <span className="text-xs text-yellow-700">
                Your Case Study Score contributes to your overall assessment
              </span>
            </div>
            <FeatherX className="text-yellow-700 cursor-pointer" />
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-2xl shadow-sm border p-6 flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <span>
                Question {currentIndex + 1} of {TOTAL_QUESTIONS}
              </span>
              <span
                className="px-3 py-1 rounded-full text-xs font-bold"
                style={{ backgroundColor: colors.primary, color: colors.white }}
              >
                {currentQuestion.marks || 5} Marks
              </span>
            </div>

            {/* Question Text */}
            <div className="text-[16px] font-medium">{currentQuestion.questionText}</div>

            {/* Question Image */}
            {currentQuestion.questionImageUrl && (
              <iframe
                src={currentQuestion.questionImageUrl.replace("/view?usp=sharing", "/preview")}
                width="100%"
                height="500"
                allow="autoplay"
                className="rounded-2xl border border-neutral-200"
              />
            )}

            {/* Options */}
            <div className="flex flex-col gap-3">
              {currentQuestion.options.map((opt) => {
                const isSelected = selected === opt.key;
                return (
                  <CheckboxCard
                    key={opt.key}
                    hideCheckbox
                    checked={isSelected}
                    onCheckedChange={() => setSelected(opt.key)}
                    className="rounded-xl border px-4 py-4 transition-all"
                    style={
                      isSelected
                        ? { backgroundColor: colors.primaryGlow, borderColor: colors.primary }
                        : {}
                    }
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold"
                        style={{
                          backgroundColor: isSelected ? colors.primary : colors.background,
                          color: isSelected ? colors.white : colors.primary,
                        }}
                      >
                        {opt.key}
                      </div>
                      <span>{opt.text}</span>
                    </div>
                  </CheckboxCard>
                );
              })}
            </div>

            {/* Submit */}
            <div className="flex justify-end">
              <Button
                disabled={!selected || submitting}
                style={{ backgroundColor: colors.primary, color: colors.white }}
                iconRight={<FeatherArrowRight />}
                onClick={handleSubmit}
              >
                {submitting ? "Submitting..." : "Submit Answer"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
