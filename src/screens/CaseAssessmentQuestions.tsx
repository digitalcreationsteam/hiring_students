// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import API, { URL_PATH } from "src/common/API";
// import { Button } from "../ui/components/Button";

// /* ================= TYPES ================= */

// type Option = {
//   key: string;
//   text: string;
// };

// type Question = {
//   _id: string;
//   questionText: string;
//   contextText?: string;
//   options?: Option[];
// };

// /* ================= COMPONENT ================= */

// export default function CaseAssessmentQuestions() {
//   const navigate = useNavigate();
//   const { state } = useLocation();

//   const attemptId = state?.attemptId;

//   const [question, setQuestion] = useState<Question | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedOption, setSelectedOption] = useState<string | null>(null);

//   /* 🔒 SAFETY: if page refreshed / no state */
//   useEffect(() => {
//     if (!attemptId) {
//       navigate("/case-assessments");
//     }
//   }, [attemptId, navigate]);

//   /* ✅ FETCH CURRENT QUESTION */
//   useEffect(() => {
//     if (!attemptId) return;

//     const fetchQuestion = async () => {
//       try {
//         setLoading(true);

//         const res = await API(
//           "GET",
//           URL_PATH.getCurrentQuestion(attemptId)
//         );

//         // ✅ BACKEND RETURNS: { success, data }
//         setQuestion(res.data);
//       } catch (err) {
//         console.error("Fetch question failed:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchQuestion();
//   }, [attemptId]);

//   /* ================= UI STATES ================= */

//   if (loading) {
//     return <p className="p-6">Loading question...</p>;
//   }

//   if (!question) {
//     return <p className="p-6">No question found</p>;
//   }

//   /* ================= RENDER ================= */

//   return (
//     <div className="min-h-screen bg-neutral-50 p-6">
//       <div className="max-w-[800px] mx-auto bg-white p-6 rounded-3xl shadow-sm">

//         {/* CONTEXT (optional) */}
//         {question.contextText && (
//           <p className="text-sm text-gray-600 mb-4">
//             {question.contextText}
//           </p>
//         )}

//         {/* QUESTION */}
//         <h2 className="text-lg font-semibold mb-6">
//           {question.questionText}
//         </h2>

//         {/* OPTIONS (MCQ) */}
//         <div className="flex flex-col gap-3">
//           {question.options?.map((opt) => (
//             <button
//               key={opt.key}
//               onClick={() => setSelectedOption(opt.key)}
//               className={`border rounded-xl px-4 py-3 text-left transition
//                 ${
//                   selectedOption === opt.key
//                     ? "border-violet-600 bg-violet-50"
//                     : "hover:bg-gray-50"
//                 }
//               `}
//             >
//               <strong className="mr-2">{opt.key}.</strong>
//               {opt.text}
//             </button>
//           ))}
//         </div>

//         {/* ACTION */}
//         <div className="mt-6 flex justify-end">
//           <Button
//             className="bg-violet-600 text-white rounded-xl px-6"
//             disabled={!selectedOption}
//             onClick={() => {
//               console.log("Selected:", selectedOption);
//               // 🔜 NEXT STEP: submit answer API
//             }}
//           >
//             Submit Answer
//           </Button>
//         </div>

//       </div>
//     </div>
//   );
// }


// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import API, { URL_PATH } from "src/common/API";
// import { Button } from "../ui/components/Button";

// /* ================= TYPES ================= */

// type Option = {
//   key: string;
//   text: string;
// };

// type Question = {
//   _id: string;
//   questionText: string;
//   contextText?: string;
//   options: Option[];
// };

// /* ================= COMPONENT ================= */

// export default function CaseAssessmentQuestions() {
//   const navigate = useNavigate();
//   const { state } = useLocation();

//   const attemptId = state?.attemptId;

//   const [question, setQuestion] = useState<Question | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [selectedOption, setSelectedOption] = useState<string | null>(null);

//   /* 🔒 SAFETY */
//   useEffect(() => {
//     if (!attemptId) {
//       navigate("/case-assessments");
//     }
//   }, [attemptId, navigate]);

//   /* ================= FETCH QUESTION ================= */

//   const fetchQuestion = async () => {
//     try {
//       setLoading(true);

//       const res = await API(
//         "GET",
//         URL_PATH.getCurrentQuestion(attemptId)
//       );

//       // backend: { success, data }
//       setQuestion(res.data);
//       setSelectedOption(null);
//     } catch (err) {
//       console.error("Fetch question failed:", err);
//       setQuestion(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (attemptId) fetchQuestion();
//   }, [attemptId]);

//   /* ================= SUBMIT ANSWER ================= */

//   const handleSubmitAnswer = async () => {
//     if (!question || !selectedOption) return;

//     try {
//       setSubmitting(true);

//       const res = await API(
//         "POST",
//         URL_PATH.submitAnswer(attemptId),
//         {
//           questionId: question._id,
//           selectedOption,
//         }
//       );

//       /**
//        * POSSIBLE BACKEND RESPONSES
//        * 1️⃣ next question exists → return it
//        * 2️⃣ case completed → redirect to reveal
//        */

//       if (res?.completed) {
//         navigate("/case/reveal", {
//           state: { attemptId },
//         });
//         return;
//       }

//       if (res?.data) {
//         setQuestion(res.data);
//         setSelectedOption(null);
//         return;
//       }

//       // fallback: refetch
//       fetchQuestion();
//     } catch (err) {
//       console.error("Submit answer failed:", err);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   /* ================= UI STATES ================= */

//   if (loading) return <p className="p-6">Loading question...</p>;
//   if (!question) return <p className="p-6">No question found</p>;

//   /* ================= UI ================= */

//   return (
//     <div className="min-h-screen bg-neutral-50 p-6">
//       <div className="max-w-[800px] mx-auto bg-white p-6 rounded-3xl shadow-sm">

//         {/* Context */}
//         {question.contextText && (
//           <p className="text-sm text-gray-600 mb-4">
//             {question.contextText}
//           </p>
//         )}

//         {/* Question */}
//         <h2 className="text-lg font-semibold mb-6">
//           {question.questionText}
//         </h2>

//         {/* Options */}
//         <div className="flex flex-col gap-3">
//           {question.options.map((opt) => (
//             <button
//               key={opt.key}
//               onClick={() => setSelectedOption(opt.key)}
//               className={`border rounded-xl px-4 py-3 text-left transition
//                 ${
//                   selectedOption === opt.key
//                     ? "border-violet-600 bg-violet-50"
//                     : "hover:bg-gray-50"
//                 }
//               `}
//             >
//               <strong className="mr-2">{opt.key}.</strong>
//               {opt.text}
//             </button>
//           ))}
//         </div>

//         {/* Submit */}
//         <div className="mt-6 flex justify-end">
//           <Button
//             className="bg-violet-600 text-white rounded-xl px-6"
//             disabled={!selectedOption || submitting}
//             onClick={handleSubmitAnswer}
//           >
//             {submitting ? "Submitting..." : "Submit Answer"}
//           </Button>
//         </div>

//       </div>
//     </div>
//   );
// }


// "use client";

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API, { URL_PATH } from "src/common/API";
import { Button } from "../ui/components/Button";

type Option = {
  key: string;
  text: string;
};

type Question = {
  _id: string;
    caseId: string; 
  questionText: string;
  options: Option[];
};

export default function CaseAssessmentQuestions() {
  const navigate = useNavigate();
  const { state } = useLocation();

//   const attemptId = state?.attemptId;

  const [question, setQuestion] = useState<Question | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
//   const [caseId, setCaseId] = useState<string | null>(null);

  const { attemptId, caseId } = state || {};

  // 🔒 Safety
  useEffect(() => {
    console.log(caseId);
    if (!attemptId) {
      navigate("/case-assessments");
    }
  }, [attemptId, navigate]);

  // 🔹 Fetch current question
//   useEffect(() => {
//     if (!attemptId) return;

//     const fetchQuestion = async () => {
//       try {
//         setLoading(true);

//         const res = await API(
//           "GET",
//           URL_PATH.getCurrentQuestion(attemptId)
//         );

//         // 🔑 Your backend wraps data inside `data`
//         setQuestion(res.data);
//       } catch (err) {
//         console.error("Fetch question failed:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchQuestion();
//   }, [attemptId]);

  useEffect(() => {
  if (!attemptId) return;

  const fetchQuestion = async () => {
    try {
      setLoading(true);
      const res = await API("GET", URL_PATH.getCurrentQuestion(attemptId));
      setQuestion(res.data);

      // Store caseId from the first question
    //   if (!caseId && res.data?.caseId) {
    //     setCaseId(res.data.caseId);
    //     console.log("Case ID stored:", res.data.caseId);
    //   }
    } catch (err) {
      console.error("Fetch question failed:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchQuestion();
}, [attemptId]);

// const handleSubmit = async () => {
//   if (!selected || !question) return;

//   try {
//     setSubmitting(true);

//     // 1️⃣ Submit the current answer
//     await API(
//       "POST",
//       URL_PATH.submitAnswer(attemptId),
//       { questionId: question._id, selectedOption: selected }
//     );

//     setSelected(null);

//     // 2️⃣ Fetch the next question
//     const res = await API(
//       "GET",
//       URL_PATH.getCurrentQuestion(attemptId)
//     );

//     // 3️⃣ If all questions are completed
//     if (res?.completed || !res?.data) {
//       const finalRes = await API(
//         "POST",
//         URL_PATH.submitAttempt(attemptId)
//       );

//       navigate("/case-assessment-score", {
//         state: {
//           score: finalRes.score,
//           retryAvailable: finalRes.retryAvailable,
//           attemptId: attemptId, // pass attemptId
//           caseId: question.caseId, 
//         },
//       });
//       return;
//     }

//     // 4️⃣ Show next question
//     setQuestion(res.data);

//   } catch (err) {
//     console.error("Submit answer failed:", err);
//   } finally {
//     setSubmitting(false);
//   }
// };

const handleSubmit = async () => {
  if (!selected || !question) return;

  console.log("Submitting answer for question:", question._id);
  console.log("Selected option:", selected);
  console.log("Attempt ID:", attemptId);
  console.log("Case ID before submit:", question.caseId);

  try {
    setSubmitting(true);

    // 1️⃣ Submit the current answer
    const submitRes = await API(
      "POST",
      URL_PATH.submitAnswer(attemptId),
      { questionId: question._id, selectedOption: selected }
    );
    console.log("Submit answer response:", submitRes);

    setSelected(null);

    // 2️⃣ Fetch the next question
    const res = await API(
      "GET",
      URL_PATH.getCurrentQuestion(attemptId)
    );
    console.log("Next question response:", res);

    // 3️⃣ If all questions are completed
    if (res?.completed || !res?.data) {
      console.log("All questions completed. Submitting attempt for score...");

      const finalRes = await API(
        "POST",
        URL_PATH.submitAttempt(attemptId)
      );
      console.log("Final attempt response:", finalRes);

      console.log("Navigating to score page with caseId:", question.caseId);

      navigate("/case-assessment-score", {
        state: {
          score: finalRes.score,
          retryAvailable: finalRes.retryAvailable,
          attemptId: attemptId, // pass attemptId
          caseId: question.caseId, 
        },
      });
      return;
    }

    // 4️⃣ Show next question
    console.log("Setting next question:", res.data);
    setQuestion(res.data);

  } catch (err) {
    console.error("Submit answer failed:", err);
  } finally {
    setSubmitting(false);
  }
};



  if (loading) return <p className="p-6">Loading question...</p>;
  if (!question) return <p className="p-6">No question found</p>;

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <div className="max-w-[800px] mx-auto bg-white p-6 rounded-3xl shadow-sm">

        <h2 className="text-lg font-semibold mb-6">
          {question.questionText}
        </h2>

        <div className="flex flex-col gap-3">
          {question.options.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setSelected(opt.key)}
              className={`border rounded-xl px-4 py-3 text-left transition ${
                selected === opt.key
                  ? "bg-violet-100 border-violet-500"
                  : "hover:bg-gray-50"
              }`}
            >
              <strong>{opt.key}.</strong> {opt.text}
            </button>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            disabled={!selected || submitting}
            onClick={handleSubmit}
            className="bg-violet-600 text-white rounded-xl px-6"
          >
            {submitting ? "Submitting..." : "Submit Answer"}
          </Button>
        </div>
      </div>
    </div>
  );
}
