"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import { Button } from "../ui/components/Button";
import { CheckboxCard } from "../ui/components/CheckboxCard";
import { Progress } from "../ui/components/Progress";
import { FeatherAlertCircle } from "@subframe/core";
import { FeatherArrowRight } from "@subframe/core";
import { FeatherClock } from "@subframe/core";
import { FeatherSidebar } from "@subframe/core";
import { FeatherX } from "@subframe/core";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import API, { URL_PATH } from "src/common/API";

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

function pad2(n: number) {
  return n.toString().padStart(2, "0");
}

function AssessmentPage() {
  const navigate = useNavigate();
  const submitLockRef = useRef(false);

  const saveVersionRef = useRef<Record<string, number>>({});

  const location = useLocation();
  const userId = useMemo(() => localStorage.getItem("userId"), []);

  const [attemptId, setAttemptId] = useState<string | null>(
    location.state?.attemptId ?? null
  );

  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<(OptionKey | null)[]>([]);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // --- TIMER EFFECT FOR BACKEND ---
  useEffect(() => {
    if (!location.state?.expiresAt) return;

    const expiresAt = new Date(location.state.expiresAt).getTime();

    const tick = () => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((expiresAt - now) / 1000));

      setRemainingSeconds(diff);

      if (diff === 0) {
        handleSubmit();
      }
    };

    tick();
    const id = setInterval(tick, 1000);

    return () => clearInterval(id);
  }, [location.state?.expiresAt]);

  //============ SAVE ANSWERS ON REFRESH / CRASH =================//
  useEffect(() => {
    if (!attemptId) return;

    sessionStorage.setItem(
      `attempt-${attemptId}`,
      JSON.stringify({
        answers,
        currentIndex,
      })
    );
  }, [answers, currentIndex, attemptId]);

  useEffect(() => {
    if (!attemptId) return;

    const saved = sessionStorage.getItem(`attempt-${attemptId}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      setAnswers(parsed.answers);
      setCurrentIndex(parsed.currentIndex);
    }
  }, [attemptId]);

  //====== USE EFFECT TO PREVENT ACCIDENTAL REFRESH / TAB CLOSE ====//
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  // --- COMPUTED VALUES ---
  const answeredCount = useMemo(
    () => answers.filter((a) => a !== null).length,
    [answers]
  );
  const progressPercent = Math.round((answeredCount / questions.length) * 100);

  // --- HANDLERS ---
  const selectOption = (key: OptionKey) => {
    const question = questions[currentIndex];
    if (!question) return;

    setAnswers((prev) => {
      const copy = [...prev];
      copy[currentIndex] = key;
      return copy;
    });

    saveAnswerToServer(question.id, key);
  };

  const clearAnswer = (index: number) => {
    setAnswers((prev) => {
      const copy = [...prev];
      copy[index] = null;
      return copy;
    });
  };

  const goToQuestion = (index: number) => {
    if (index < 0 || index >= questions.length) return;
    setCurrentIndex(index);
  };

  const skipQuestion = () => {
    // leave current question unanswered and move forward
    const next = Math.min(currentIndex + 1, questions.length - 1);
    setCurrentIndex(next);
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i: number) => i + 1);
    } else {
      // last question -> submit
      handleSubmit();
    }
  };

  //=============== POST API FOR START ASSESSMENT============//
  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }
    if (attemptId) return;
    const startAssessment = async () => {
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
    };

    startAssessment();
  }, [attemptId, userId, navigate]);

  //=============== GET API FOR TO FETCH QUESTIONS============//
  useEffect(() => {
    if (!attemptId || !userId) return;

    const fetchQuestions = async () => {
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
      setLoading(false);
    };

    fetchQuestions();
  }, [attemptId, userId]);

  //=============== POST API FOR SAVE Q OPTION ==============//
  const saveAnswerToServer = async (
    questionId: string,
    selectedOption: OptionKey
  ) => {
    if (!attemptId || !userId) return;

    const version = (saveVersionRef.current[questionId] || 0) + 1;
    saveVersionRef.current[questionId] = version;

    try {
      await API(
        "POST",
        URL_PATH.saveAnswer,
        { attemptId, questionId, selectedOption, version },
        { "user-id": userId }
      );
    } catch (err) {
      console.warn("Save answer failed", err);
    }
  };

  //=============== GET API FOR SUBMIT ASSESSMENT============//
  const handleSubmit = async () => {
  if (!attemptId || submitLockRef.current) return;

  submitLockRef.current = true; 
  setSaving(true);

  try {
    await API(
      "POST",
      URL_PATH.submitAssessment,
      { attemptId }, 
      { "user-id": userId }
    );

    navigate("/assessment-results", { state: { attemptId } });
  } catch (err) {
    submitLockRef.current = false; 
    console.error("Submit failed", err);
  }
};


  // --- RENDER NAVIGATOR NUMBERS (keeps UI markup/style) ---
  const renderNavigatorItem = (qIndex: number) => {
    const isCurrent = qIndex === currentIndex;
    const isAnswered = answers[qIndex] !== null;
    // replicate the same class names used in UI for each visual state
    if (isCurrent) {
      return (
        <div
          key={qIndex}
          onClick={() => goToQuestion(qIndex)}
          className="flex h-10 w-10 flex-none items-center justify-center rounded-2xl border-2 border-solid border-violet-600 bg-violet-100 cursor-pointer"
        >
          <span className="text-body-bold font-body-bold text-brand-600">
            {qIndex + 1}
          </span>
        </div>
      );
    }

    if (isAnswered) {
      return (
        <div
          key={qIndex}
          onClick={() => goToQuestion(qIndex)}
          className="flex h-10 w-10 flex-none items-center justify-center rounded-2xl bg-green-100 cursor-pointer"
        >
          <span className="text-body-bold font-body-bold text-success-700">
            {qIndex + 1}
          </span>
        </div>
      );
    }

    // unanswered default
    return (
      <div
        key={qIndex}
        onClick={() => goToQuestion(qIndex)}
        className="flex h-10 w-10 flex-none items-center justify-center rounded-2xl border-2 border-solid border-neutral-border bg-default-background cursor-pointer"
      >
        <span className="text-body-bold font-body-bold text-subtext-color">
          {qIndex + 1}
        </span>
      </div>
    );
  };

  // For display: mm:ss
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  // Current question to show
  const currentQuestion = questions[currentIndex];

  //Sidebar
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (loading) return <div>Loading assessment...</div>;

  return (
    <div className="w-screen h-screen bg-neutral-50 flex justify-center py-12">
      <div className="flex w-full max-w-[1024px] h-full items-stretch gap-6">
        <div className="flex w-64 flex-none flex-col items-start gap-4 self-stretch h-full rounded-2xl border border-solid border-neutral-border bg-white px-8 py-8 overflow-y-auto">
          <div className="flex w-full items-start gap-4">
            <div className="flex grow shrink-0 basis-0 flex-col items-start gap-2">
              <span className="text-heading-3 font-heading-3 text-default-font">
                Question Navigator
              </span>
              <span className="text-sm font-caption text-subtext-color">
                {answeredCount} of {questions.length} answered
              </span>
            </div>
            <FeatherSidebar
              className="mt-2 text-body font-body text-subtext-color cursor-pointer"
              onClick={() => setSidebarOpen((prev) => !prev)}
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap mt-3">
            {questions.map((_, idx) => renderNavigatorItem(idx))}
          </div>

          {/* Bottom horizontal line */}
          <div className="w-full h-[1px] bg-gray-300 my-4 flex-shrink-0" />

          <div className="flex w-full flex-col items-start gap-2">
            <div className="flex w-full items-center gap-2">
              <div className="flex h-3 w-3 flex-none items-start rounded-full bg-violet-600" />
              <span className="text-caption font-caption text-default-font">
                Current
              </span>
            </div>
            <div className="flex w-full items-center gap-2">
              <div className="flex h-3 w-3 flex-none items-start rounded-full bg-green-200" />
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

        <div className="flex grow shrink-0 basis-0 flex-col items-start justify-start gap-4 h-full">
          <div className="flex w-full items-center justify-between rounded-full border bg-yellow-50 px-3 py-1">
            <div className="flex items-center gap-2">
              <FeatherAlertCircle className="text-caption font-caption text-yellow-700" />
              <span className="text-xs text-yellow-700">
                Your Skill Index is built from this score
              </span>
            </div>
            <FeatherX className="text-caption font-caption text-yellow-700" />
          </div>

          <div className="flex w-full flex-col items-start gap-6 rounded-2xl border border-solid border-neutral-border bg-white px-8 py-8 shadow-sm">
            <div className="flex w-full items-center justify-between">
              <span className="text-sm text-subtext-color">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <div className="flex items-center gap-2">
                <FeatherClock className="text-body font-body text-default-font" />
                <div className="flex items-center gap-1">
                  <span className="text-sm font-body-bold text-default-font">
                    {pad2(minutes)}:{pad2(seconds)}
                  </span>
                  <span className="text-sm text-default-font">remaining</span>
                </div>
              </div>
            </div>

            {/* progress bar (custom accessible) */}
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
                  className="h-full rounded-full bg-violet-600"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <span className="text-caption font-caption text-neutral-600">
                {progressPercent}% complete
              </span>
            </div>

            <span className="w-full text-heading-3 font-heading-3 text-neutral-700">
              Product Management Fundamentals Assessment
            </span>

            {/* Bottom horizontal line */}
            <div className="w-full h-[1px] bg-gray-300 my-2 flex-shrink-0" />

            <div className="flex w-full flex-col items-start gap-4">
              <span className="font-['Nunito_Sans'] text-[16px] font-[500] leading-[24px] text-default-font">
                {currentQuestion.prompt}
              </span>

              <div className="flex w-full flex-col items-start gap-3">
                {currentQuestion.options.map((opt) => (
                  <CheckboxCard
                    key={opt.key}
                    className={`h-auto w-full flex-none rounded-2xl border px-4 py-3 
    ${
      answers[currentIndex] === opt.key
        ? "border-violet-600 bg-violet-50"
        : "border-neutral-200 bg-white"
    }
  `}
                    hideCheckbox={true}
                    checked={answers[currentIndex] === opt.key}
                    onCheckedChange={(checked: boolean) => {
                      // CheckboxCard's onCheckedChange passes boolean;
                      // treat any truthy as selection
                      if (checked) selectOption(opt.key);
                      else {
                        // uncheck (if the component allows toggling)
                        setAnswers((prev) => {
                          const copy = [...prev];
                          // only clear if the same option being toggled off
                          if (copy[currentIndex] === opt.key)
                            copy[currentIndex] = null;
                          return copy;
                        });
                      }
                    }}
                  >
                    <div className="flex flex-col items-start gap-1">
                      <span className="text-body-bold font-body-bold text-default-font">
                        {opt.title}
                      </span>

                      <span className="text-xs font-body text-subtext-color">
                        {opt.description}
                      </span>
                    </div>
                  </CheckboxCard>
                ))}
              </div>
            </div>

            {/* Bottom horizontal line */}
            <div className="w-full h-[1px] bg-gray-300 my-2 flex-shrink-0" />

            <div className="flex w-full rounded-full items-center justify-between">
              <Button
                disabled={saving}
                className="w-10px h-10 rounded-full text-white]"
                variant="neutral-secondary"
                size="large"
                onClick={() => skipQuestion()}
              >
                Skip Question
              </Button>

              <Button
                disabled={saving}
                className="w-10px h-10 rounded-full bg-gradient-to-r from-violet-600 to-violet-600
    hovur:from-violet-600 hover:to-violet-800
    text-white shadow-[0_6px_18px_rgba(99,52,237,0.18)]"
                size="large"
                iconRight={<FeatherArrowRight />}
                onClick={() => nextQuestion()}
              >
                {currentIndex < questions.length - 1
                  ? "Next Question"
                  : "Submit"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssessmentPage;