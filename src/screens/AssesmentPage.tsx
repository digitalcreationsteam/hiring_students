"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button } from "../ui/components/Button";
import { CheckboxCard } from "../ui/components/CheckboxCard";
import {
  FeatherArrowRight,
  FeatherClock,
  FeatherSidebar,
} from "@subframe/core";
import { useNavigate, useLocation } from "react-router-dom";
import API, { URL_PATH } from "src/common/API";

/* ================= TYPES ================= */

type OptionKey = 1 | 2 | 3 | 4;

type Question = {
  id: string;
  prompt: string;
  options: {
    key: OptionKey;
    title: string;
    description: string;
  }[];
};

/* ================= UTILS ================= */

const pad2 = (n: number) => n.toString().padStart(2, "0");

/* ================= COMPONENT ================= */

function AssessmentPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const userId = useMemo(() => localStorage.getItem("userId"), []);

  /* ================= STATE ================= */

  const [attemptId, setAttemptId] = useState<string | null>(
    location.state?.attemptId ?? null
  );

  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<(OptionKey | null)[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [saving, setSaving] = useState(false);

  /* ================= AUTO START ASSESSMENT ================= */

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    const startAssessment = async () => {
      if (attemptId) return;

      try {
        const res = await API(
          "POST",
          URL_PATH.startAssessment,
          {},
          { "user-id": userId }
        );

        setAttemptId(res.attemptId);

        navigate("/assessment", {
          replace: true,
          state: {
            attemptId: res.attemptId,
            expiresAt: res.expiresAt,
          },
        });
      } catch (err) {
        console.error("Start assessment failed", err);
      }
    };

    startAssessment();
  }, [attemptId, userId, navigate]);

  /* ================= FETCH QUESTIONS ================= */

  useEffect(() => {
    if (!attemptId || !userId) return;

    const fetchQuestions = async () => {
      try {
        const res = await API(
          "GET",
          `${URL_PATH.getAttemptQuestions}/${attemptId}`,
          undefined,
          { "user-id": userId }
        );

        const mapped: Question[] = res.questions.map((q: any) => ({
          id: q._id,
          prompt: q.question,
          options: q.options.map((opt: string, i: number) => ({
            key: (i + 1) as OptionKey,
            title: `${["A", "B", "C", "D"][i]}. ${opt}`,
            description: "",
          })),
        }));

        setQuestions(mapped);
        setAnswers(Array(mapped.length).fill(null));
        setRemainingSeconds(res.durationMinutes * 60);
      } catch (err) {
        console.error("Fetch questions failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [attemptId, userId]);

  /* ================= TIMER ================= */

  useEffect(() => {
    if (!remainingSeconds) return;

    const timer = setInterval(() => {
      setRemainingSeconds((s) => {
        if (s <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingSeconds]);

  /* ================= DERIVED ================= */

  const answeredCount = answers.filter(Boolean).length;
  const progressPercent = questions.length
    ? Math.round((answeredCount / questions.length) * 100)
    : 0;

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const currentQuestion = questions[currentIndex];

  /* ================= API: SAVE ANSWER ================= */

  const saveAnswerToServer = async (
  questionId: string,
  selectedOption: OptionKey
) => {
  if (!attemptId || !userId) return;

  await API(
    "POST",
    URL_PATH.saveAnswer,
    {
      attemptId,
      questionId,
      selectedOption, // ✅ now 1 | 2 | 3 | 4
    },
    { "user-id": userId }
  );
};


  /* ================= HANDLERS ================= */

  const selectOption = (key: OptionKey) => {
    const question = questions[currentIndex];
    if (!question) return;

    // update UI instantly
    setAnswers((prev) => {
      const copy = [...prev];
      copy[currentIndex] = key;
      return copy;
    });

    // save to backend
    saveAnswerToServer(question.id, key);
  };

  const skipQuestion = () => {
    setCurrentIndex((i) => Math.min(i + 1, questions.length - 1));
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!attemptId) return;
    navigate("/assessment-results", { state: { attemptId } });
  };

  /* ================= RENDER ================= */

  if (loading) return null;

  return (
    <div className="w-screen h-screen bg-neutral-50 flex justify-center py-12">
      <div className="flex w-full max-w-[1024px] h-full gap-6">
        {/* ===== SIDEBAR ===== */}
        {sidebarOpen && (
          <div className="w-64 rounded-2xl border bg-white px-8 py-8 overflow-y-auto">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-heading-3">Question Navigator</span>
                <p className="text-sm text-subtext-color">
                  {answeredCount} of {questions.length} answered
                </p>
              </div>
              <FeatherSidebar
                className="cursor-pointer"
                onClick={() => setSidebarOpen(false)}
              />
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {questions.map((_, idx) => (
                <div
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-10 w-10 flex items-center justify-center rounded-2xl cursor-pointer
                    ${
                      idx === currentIndex
                        ? "bg-violet-100 border-2 border-violet-600"
                        : answers[idx]
                        ? "bg-green-100"
                        : "border"
                    }
                  `}
                >
                  {idx + 1}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== MAIN ===== */}
        <div className="flex-1 bg-white rounded-2xl border px-8 py-8">
          <div className="flex justify-between items-center mb-4">
            <span>
              Question {currentIndex + 1} of {questions.length}
            </span>
            <div className="flex items-center gap-2">
              <FeatherClock />
              {pad2(minutes)}:{pad2(seconds)}
            </div>
          </div>

          <div className="h-2 bg-neutral-200 rounded-full mb-4">
            <div
              className="h-full bg-violet-600 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <h3 className="text-heading-3 mb-4">{currentQuestion?.prompt}</h3>

          <div className="flex flex-col gap-3">
            {currentQuestion?.options.map((opt) => (
              <CheckboxCard
                key={opt.key}
                checked={answers[currentIndex] === opt.key}
                hideCheckbox
                disabled={saving}
                onCheckedChange={(v) => v && selectOption(opt.key)}
                className={`rounded-2xl px-4 py-3 ${
                  answers[currentIndex] === opt.key
                    ? "border-violet-600 bg-violet-50"
                    : "border"
                }`}
              >
                {opt.title}
              </CheckboxCard>
            ))}
          </div>

          <div className="flex justify-between mt-6">
            <Button variant="neutral-secondary" onClick={skipQuestion}>
              Skip
            </Button>
            <Button iconRight={<FeatherArrowRight />} onClick={nextQuestion}>
              {currentIndex < questions.length - 1 ? "Next" : "Submit"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssessmentPage;
