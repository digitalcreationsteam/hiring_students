"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import { Button } from "../ui/components/Button";
import { CheckboxCard } from "../ui/components/CheckboxCard";
import { FeatherAlertCircle } from "@subframe/core";
import { FeatherArrowRight } from "@subframe/core";
import { FeatherClock } from "@subframe/core";
import { FeatherSidebar } from "@subframe/core";
import { FeatherX } from "@subframe/core";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import API, { URL_PATH } from "src/common/API";
import { colors } from "src/common/Colors";
  // import API from "@/utils/API"; // or axios/fetch wrapper

type OptionKey = 1 | 2 | 3 | 4;

type Question = {
  id: string;
  prompt: string;
  marks: number;
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
  const saveTimeoutRef = useRef<Record<string, ReturnType<typeof setTimeout>>>(
    {}
  );
  const [durationMinutes, setDurationMinutes] = useState<number | null>(null);
  const [expiryReady, setExpiryReady] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const [warningOpen, setWarningOpen] = useState(false);
const [warningMsg, setWarningMsg] = useState("");
const [violations, setViolations] = useState(0);
const [isLocked, setIsLocked] = useState(false);


const violationLockRef = useRef(false);

const registerViolation = (msg: string) => {
  // prevent spamming multiple triggers in same moment
  if (violationLockRef.current) return;
  violationLockRef.current = true;

  setViolations((v) => v + 1);
  setWarningMsg(msg);
  setWarningOpen(true);
    setIsLocked(true);


  // unlock after a short delay so next real violation counts
  setTimeout(() => {
    violationLockRef.current = false;
  }, 800);
};


  //   // --- TIMER EFFECT FOR BACKEND ---
  //   useEffect(() => {
  //     if (!location.state?.expiresAt) return;

  //     const expiresAt = new Date(location.state.expiresAt).getTime();

  //     const tick = () => {
  //       const now = Date.now();
  //       const diff = Math.max(0, Math.floor((expiresAt - now) / 1000));

  //       setRemainingSeconds(diff);

  //      if (diff === 0 && !submitLockRef.current) {
  //   handleSubmit();
  // }

  //     };

  //     tick();
  //     const id = setInterval(tick, 1000);

  //     return () => clearInterval(id);
  //   }, [location.state?.expiresAt]);




const reportViolation = async (type: string) => {
  if (!attemptId) return;

  try {
    const res = await API(
      "POST",
      URL_PATH.reportViolation + `/${attemptId}`,
      { type },
      {
        "user-id": localStorage.getItem("userId"),
      }
    );

    console.log("Integrity Update:", res);

    // Update violations count from backend response
    if (res.totalViolations !== undefined) {
      setViolations(res.totalViolations);
      
      // Auto-submit if violations reach 4
      if (res.totalViolations >= 4) {
        setWarningMsg("⚠️ Maximum violations reached! Your exam is being auto-submitted.");
        setWarningOpen(true);
        
        // Auto-submit after 2 seconds
        setTimeout(() => {
          handleSubmit();
        }, 2000);
      }
    }

    // If cheating alert triggered, update warning message
    if (res.cheatAlert) {
      setWarningMsg("⚠️ Multiple violations detected! This attempt may be flagged for review.");
    }

    return res;

  } catch (err) {
    console.error("Violation report failed", err);
  }
};
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




useEffect(() => {
  const reportTabSwitch = async () => {
    if (attemptId) {
      await reportViolation("TAB_SWITCH");
    }
  };

  const reportCopy = async () => {
    if (attemptId) {
      await reportViolation("COPY");
    }
  };

  const reportPaste = async () => {
    if (attemptId) {
      await reportViolation("PASTE");
    }
  };

  // -------- Tab switch / leaving page detection ----------
  const onVisibilityChange = () => {
    if (document.hidden) {
      registerViolation("Warning: You switched tabs / minimized the exam window. Otherwise the exam will be auto-submitted after 4 violations.");
      reportTabSwitch();
    }
  };

  const onBlur = () => {
    registerViolation("Warning: You moved away from the exam window. Otherwise the exam will be auto-submitted after 4 violations.");
    reportTabSwitch();
  };

  // -------- Block copy/cut/paste/right click ----------
  const onCopy = (e: ClipboardEvent) => {
    e.preventDefault();
    registerViolation("Copy is disabled during the exam. Otherwise the exam will be auto-submitted after 4 violations.");
    reportCopy();
  };

  const onCut = (e: ClipboardEvent) => {
    e.preventDefault();
    registerViolation("Cut is disabled during the exam. Otherwise the exam will be auto-submitted after 4 violations.");
    reportCopy();
  };

  const onPaste = (e: ClipboardEvent) => {
    e.preventDefault();
    registerViolation("Paste is disabled during the exam. Otherwise the exam will be auto-submitted after 4 violations.");
    reportPaste();
  };

  // ... rest of your event listeners
   const onKeyDown = (e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    const ctrlOrCmd = e.ctrlKey || e.metaKey;

    // Block DevTools shortcuts too (not perfect, but helps)
    const blocked =
      (ctrlOrCmd && ["c", "x", "v", "a", "p", "s", "u"].includes(key)) || // copy/cut/paste/select all/print/save/view source
      (e.key === "F12") ||
      (ctrlOrCmd && e.shiftKey && ["i", "j", "c"].includes(key)); // devtools

    if (blocked) {
      e.preventDefault();
      registerViolation("That action is not allowed during the exam.");
    }
  };

  document.addEventListener("visibilitychange", onVisibilityChange);
  window.addEventListener("blur", onBlur);

  document.addEventListener("copy", onCopy);
  document.addEventListener("cut", onCut);
  document.addEventListener("paste", onPaste);
  document.addEventListener("keydown", onKeyDown);

  return () => {
    document.removeEventListener("visibilitychange", onVisibilityChange);
    window.removeEventListener("blur", onBlur);

    document.removeEventListener("copy", onCopy);
    document.removeEventListener("cut", onCut);
    document.removeEventListener("paste", onPaste);
    document.removeEventListener("keydown", onKeyDown);
  };
}, [violations, attemptId]); // Add attemptId to dependencies

  // --- COMPUTED VALUES ---
  const answeredCount = useMemo(
    () => answers.filter((a) => a !== null).length,
    [answers]
  );
  const progressPercent = questions.length
    ? Math.round((answeredCount / questions.length) * 100)
    : 0;

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
    const question = questions[index];
    if (!question) return;

    setAnswers((prev) => {
      const copy = [...prev];
      copy[index] = null;
      return copy;
    });

    saveAnswerToServer(question.id, null);
  };

  const goToQuestion = (index: number) => {
    if (index < 0 || index >= questions.length) return;
    setCurrentIndex(index);
  };

  const skipQuestion = () => {
    const next = Math.min(currentIndex + 1, questions.length - 1);
    setCurrentIndex(next);
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i: number) => i + 1);
    } else {
      handleSubmit();
    }
  };

  const prevQuestion = () => {
  if (currentIndex > 0) {
    setCurrentIndex((i) => i - 1);
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

      // ✅ ADD THIS
  sessionStorage.setItem(`startedAt-${res.attemptId}`, Date.now().toString());
  sessionStorage.setItem("attemptId", res.attemptId);

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

  const startTimer = (expiryTime: number) => {
    const tick = () => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((expiryTime - now) / 1000));

      setRemainingSeconds(diff);

      if (diff === 0 && !submitLockRef.current) {
        handleSubmit();
      }
    };

    tick();
    const id = setInterval(tick, 1000);

    return () => clearInterval(id);
  };

  useEffect(() => {
    if (!attemptId || !expiryReady) return;

    let expiry: number | null = null;

    if (location.state?.expiresAt) {
      expiry = new Date(location.state.expiresAt).getTime();
    }

    if (!expiry) {
      const saved = sessionStorage.getItem(`expiresAt-${attemptId}`);
      if (saved) expiry = Number(saved);
    }

    if (!expiry) return;

    return startTimer(expiry);
  }, [attemptId, expiryReady]);

  

  useEffect(() => {
    if (!attemptId || !userId) return;

      // ✅ ADD THIS (store start time only once per attempt)
  const startedKey = `startedAt-${attemptId}`;
  if (!sessionStorage.getItem(startedKey)) {
    sessionStorage.setItem(startedKey, Date.now().toString());
  }
  // optional safety
  sessionStorage.setItem("attemptId", attemptId);

    const fetchQuestions = async () => {
      const res = await API(
        "GET",
        `${URL_PATH.getAttemptQuestions}/${attemptId}`,
        undefined,
        { "user-id": userId }
      );

      setDurationMinutes(res.durationMinutes);

      // ✅ Create expiresAt if not coming from route state
      if (!location.state?.expiresAt) {
        const expiry = Date.now() + res.durationMinutes * 60 * 1000;

        sessionStorage.setItem(`expiresAt-${attemptId}`, expiry.toString());
      }
      setExpiryReady(true);

      // const mapped: Question[] = res.questions.map((q: any) => ({
      //   id: q._id,
      //   prompt: q.question,
      //   options: q.options.map((opt: string, i: number) => ({
      //     key: (i + 1) as OptionKey,
      //     title: `${["A", "B", "C", "D"][i]}. ${opt}`,
      //     description: "",
      //   })),
      // }));

      const mapped: Question[] = res.questions.map((q: any, idx: number) => ({
  id: q._id,
  prompt: q.question,

  // ✅ 1st priority: backend sends marks
  // common keys: marks / points / score
  // ✅ fallback: 5 marks default (you can change)
  marks: Number(q.marks ?? q.points ?? q.score ?? 5),

  options: q.options.map((opt: string, i: number) => ({
    key: (i + 1) as OptionKey,
    title: `${["A", "B", "C", "D"][i]}. ${opt}`,
    description: "",
  })),
}));


      setQuestions(mapped);
      setAnswers((prev) =>
        prev.length ? prev : Array(mapped.length).fill(null)
      );
      setLoading(false);
    };

    fetchQuestions();
  }, [attemptId, userId, location.state?.expiresAt]);

  //=============== POST API FOR SAVE Q OPTION ==============//
  const saveAnswerToServer = (
    questionId: string,
    selectedOption: OptionKey | null
  ) => {
    if (!attemptId || !userId) return;

    if (saveTimeoutRef.current[questionId]) {
      clearTimeout(saveTimeoutRef.current[questionId]);
    }

    saveTimeoutRef.current[questionId] = setTimeout(async () => {
      const version = (saveVersionRef.current[questionId] || 0) + 1;
      saveVersionRef.current[questionId] = version;

      try {
        await API(
          "POST",
          URL_PATH.saveAnswer,
          { attemptId, questionId, selectedOption, version },
          { "user-id": userId }
        );

        if (saveVersionRef.current[questionId] !== version) return;
      } catch (err) {
        console.warn("Save answer failed", err);
      }
    }, 400);
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
    localStorage.setItem("assessmentCompleted", "true");
    localStorage.setItem("attemptId", attemptId);
    sessionStorage.setItem("attemptId", attemptId);

    sessionStorage.setItem(`submittedAt-${attemptId}`, Date.now().toString());
  
    navigate("/assessment-results", { state: { attemptId } });
  } catch (err) {
    submitLockRef.current = false;
    console.error("Submit failed", err);
  } finally {
    setSaving(false);
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
          style={{backgroundColor: colors.accent, color: "white"}}
          key={qIndex}
          onClick={() => {
            if (!saving) goToQuestion(qIndex);
          }}
          className="flex h-10 w-10 flex-none items-center justify-center rounded-2xl cursor-pointer"
        >
          <span style={{color: "white"}} className="text-body-bold font-body-bold text-brand-600">
            {qIndex + 1}
          </span>
        </div>
      );
    }

    if (isAnswered) {
      return (
        <div
        style={{backgroundColor: colors.primary, color: "black"}}
          key={qIndex}
          onClick={() => {
            if (!saving) goToQuestion(qIndex);
          }}
          className="flex h-10 w-10 flex-none items-center justify-center rounded-2xl cursor-pointer"
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
        onClick={() => {
          if (!saving) goToQuestion(qIndex);
        }}
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

  const currentMarks = currentQuestion?.marks ?? 0;

const totalMarks = useMemo(() => {
  return questions.reduce((sum, q) => sum + (q.marks ?? 0), 0);
}, [questions]);



  if (loading) return <div>Loading assessment...</div>;

    return (
  <div className="min-h-screen relative overflow-hidden">
    {/* Blended background - Covers entire page */}
    <div className="pointer-events-none absolute inset-0">
      <div
        className="absolute inset-0"
        style={{ backgroundColor: colors.background }}
      />

      <div
        className="absolute -top-40 -left-40 h-[560px] w-[560px] rounded-full blur-3xl opacity-55"
        style={{
          background: `radial-gradient(circle at 60% 60%, ${colors.primary}AA, transparent 52%)`,
        }}
      />

      <div
        className="absolute -top-48 right-[-220px] h-[680px] w-[680px] rounded-full blur-3xl opacity-35"
        style={{
          background: `radial-gradient(circle at 50% 30%, ${colors.secondary}99, transparent 62%)`,
        }}
      />

      <div
        className="absolute bottom-[-260px] left-[15%] h-[760px] w-[760px] rounded-full blur-3xl opacity-20"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${colors.accent}44, transparent 62%)`,
        }}
      />
    </div>

    {/* Header and content with z-index to stay above background */}
    <div className="relative z-10">
      <div className="min-h-screen w-full flex justify-center px-4 py-4 sm:py-6 lg:py-12">
        <div className="flex w-full max-w-[1024px] flex-col lg:flex-row items-stretch gap-4 lg:gap-6">
          <div
            style={{backgroundColor: colors.white}}
            className="
  hidden lg:flex
  w-full lg:w-64
  flex-none flex-col items-start gap-4
  self-stretch rounded-2xl
  border border-neutral-border
  0 px-6 lg:px-8 py-6
  overflow-y-auto
"
          >
            <div className="flex w-full items-start gap-4">
              <div className="flex grow shrink-0 basis-0 flex-col items-start gap-2">
                <span className="text-heading-3 font-heading-3 text-default-font">
                  Question Navigator
                </span>
                <span className="text-sm font-caption text-subtext-color">
                  {answeredCount} of {questions.length} answered
                </span>
              </div>
              <FeatherSidebar className="mt-2 text-body font-body text-subtext-color cursor-pointer" />
            </div>
            <div style={{border: "2px solod black"}} className="flex items-center gap-2 flex-wrap mt-3">
              {questions.map((_, idx) => renderNavigatorItem(idx))}
            </div>

            {/* Bottom horizontal line */}
            <div className="w-full h-[1px] bg-gray-300 my-4 flex-shrink-0" />

            <div className="flex w-full flex-col items-start gap-2">
              <div className="flex w-full items-center gap-2">
                <div style={{backgroundColor: colors.accent}} className="flex h-3 w-3 flex-none items-start rounded-full" />
                <span className="text-caption font-caption text-default-font">
                  Current
                </span>
              </div>
              <div className="flex w-full items-center gap-2">
                <div style={{backgroundColor: colors.primary}} className="flex h-3 w-3 flex-none items-start rounded-full" />
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

          {/* RIGHT PANNEL */}

          <div className="flex w-full flex-col items-start justify-start gap-4">
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
                  Your Skill Index is built from this score
                </span>
              </div>
              <FeatherX className="text-caption font-caption text-yellow-700" />
            </div>

            <div
              className="
  flex w-full flex-col items-start gap-5
  rounded-2xl border bg-white shadow-sm
  px-4 py-5
  sm:px-6 sm:py-6
  lg:px-8 lg:py-8
"
            >
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

              <div className="w-full flex flex-col gap-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    {/* ✅ Title */}
                    <span className="text-lg sm:text-xl lg:text-heading-3 font-heading-3 text-neutral-700">
                      Product Management Fundamentals Assessment
                    </span>
                  </div>
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-bold border"
                    style={{
                      backgroundColor: colors.primary,
                      color: "black"
                    }}
                  >
                    {currentMarks} Marks
                  </span>
                </div>
              </div>

              {/* Bottom horizontal line */}
              <div className="w-full h-[1px] bg-gray-300 my-2 flex-shrink-0" />

              <div className="flex w-full flex-col items-start gap-4">
                <span className="font-['Nunito_Sans'] text-[16px] font-[500] leading-[24px] text-default-font">
                  {currentQuestion.prompt}
                </span>

                {/* <div className="flex w-full flex-col items-start gap-3">
                  {currentQuestion.options.map((opt) => (
                    <CheckboxCard
                      key={opt.key}
                      className={` h-auto w-full rounded-xl sm:rounded-2xl
                      border px-3 py-3 sm:px-4 
                        ${
                          answers[currentIndex] === opt.key
                            ? "bg-[#E9EAE9]"
                            : " bg-white"
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
                </div> */}

                <div className="flex w-full flex-col items-start gap-3">
  {currentQuestion.options.map((opt) => {
    const isSelected = answers[currentIndex] === opt.key;

    return (
      <CheckboxCard
        key={opt.key}
        className={`
          h-auto w-full rounded-xl sm:rounded-2xl
          border px-3 py-3 sm:px-4
          transition-colors duration-200
          ${isSelected ? "bg-[var(--primary-color)]" : "bg-white"}
        `}
        style={isSelected ? { backgroundColor: colors.primary } : {}}
        hideCheckbox={true}
        checked={isSelected}
        onCheckedChange={(checked: boolean) => {
          if (checked) selectOption(opt.key);
          else {
            setAnswers((prev) => {
              const copy = [...prev];
              if (copy[currentIndex] === opt.key)
                copy[currentIndex] = null;
              return copy;
            });
          }
        }}
      >
        <div className="flex flex-col items-start gap-1">
          <span
            className={`text-body-bold font-body-bold ${
              isSelected ? "text-black" : "text-default-font"
            }`}
          >
            {opt.title}
          </span>

          <span
            className={`text-xs font-body ${
              isSelected ? "text-black" : "text-subtext-color"
            }`}
          >
            {opt.description}
          </span>
        </div>
      </CheckboxCard>
    );
  })}
</div>

              </div>

              {/* Bottom horizontal line */}
              <div className="w-full h-[1px] bg-gray-300 my-2 flex-shrink-0" />
              <div className="flex w-full flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between">
                <div className="flex gap-3 w-full sm:w-auto">
                  <Button
                  disabled={saving || currentIndex === 0}
                  style={{ backgroundColor: colors.primary }}
                  className="
                    h-10 px-6 rounded-full hover:opacity-90
                    shadow-[0_6px_18px_rgba(99,52,237,0.18)]
                    [&_span]:!text-black
                  "
                  size="large"
                  onClick={prevQuestion}
                >
                  Previous
                </Button>

                  <Button
                    disabled={saving}
                    className="h-10 px-6 rounded-full"
                    variant="neutral-secondary"
                    size="large"
                    onClick={skipQuestion}
                  >
                    Skip Question
                  </Button>
                </div>
                <Button
                  disabled={saving}
                  style={{ backgroundColor: colors.primary }}
                  className="
                    h-10 px-6 rounded-full hover:opacity-90
                    shadow-[0_6px_18px_rgba(99,52,237,0.18)]
                    [&_span]:!text-black
                    [&_svg]:!text-black
                  "
                  size="large"
                  iconRight={<FeatherArrowRight />}
                  onClick={nextQuestion}
                >
                  {currentIndex < questions.length - 1 ? "Next Question" : "Submit"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {warningOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-[360px] rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-neutral-900">
                Exam Warning
              </h3>
            </div>

            <p className="text-sm text-neutral-600 mb-2">
              {warningMsg}
            </p>

            <p className="text-xs text-neutral-500 mb-6">
              Violations: <b>{violations}</b> / 4  
              <br />
              Switching tabs or copying may auto-submit your exam.
            </p>

            <div className="flex gap-3">
              <Button
                variant="neutral-secondary"
                className="flex-1"
                onClick={async () => {
                  // Unlock the exam
                  setIsLocked(false);
                  
                  // You could also send an acknowledgment to backend if needed
                  // await API("POST", `/api/test-attempts/${attemptId}/warning-ack`, {}, {
                  //   "user-id": localStorage.getItem("userId"),
                  // });
                  
                  setWarningOpen(false);
                }}
              >
                Continue Exam
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);
}

export default AssessmentPage;