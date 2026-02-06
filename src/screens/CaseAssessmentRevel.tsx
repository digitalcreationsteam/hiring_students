"use client";

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import API, { URL_PATH } from "src/common/API";
import { Button } from "../ui/components/Button";

type Reveal = {
  instructions?: string;
  solution?: string;
  [key: string]: any;
};

export default function CaseAssessmentReveal() {
  const navigate = useNavigate();
  const { state } = useLocation();
//   const { caseId, attemptId } = state || {};
const { caseId } = useParams();

  const [score, setScore] = useState<number | null>(null);
  const [reveal, setReveal] = useState<Reveal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // if (!caseId) {
    //   navigate("/case-assessments");
    //   return;
    // }

    const fetchReveal = async () => {
      try {
        setLoading(true);

        const res = await API(
          "GET",
          URL_PATH.getCaseReveal(caseId)
        );

        setScore(res.score);
        setReveal(res.reveal);
      } catch (err) {
        console.error("Fetch reveal failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReveal();
  }, [caseId, navigate]);

  if (loading) return <p className="p-6">Loading reveal...</p>;

  if (!reveal)
    return (
      <p className="p-6 text-center text-red-500">
        Reveal not available. Complete the case first.
      </p>
    );

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <div className="max-w-[800px] mx-auto bg-white p-6 rounded-3xl shadow-sm">

        <h2 className="text-2xl font-semibold mb-4 text-center">
          Case Reveal
        </h2>

        <div className="mb-6 text-center">
          <p className="text-lg font-medium">
            Your Score: <span className="text-violet-600">{score}</span>
          </p>
        </div>

        <div className="space-y-4">
          {reveal.instructions && (
            <div className="p-4 border rounded-xl bg-violet-50">
              <h3 className="font-semibold mb-2">Instructions:</h3>
              <p>{reveal.instructions}</p>
            </div>
          )}

          {reveal.solution && (
            <div className="p-4 border rounded-xl bg-green-50">
              <h3 className="font-semibold mb-2">Solution:</h3>
              <p>{reveal.solution}</p>
            </div>
          )}

          {Object.keys(reveal).map((key) => {
  if (key === "instructions" || key === "solution") return null;

  const value = reveal[key];

  return (
    <div key={key} className="p-4 border rounded-xl bg-gray-50">
      <h3 className="font-semibold mb-2">{key}:</h3>

      {Array.isArray(value) ? (
        value.map((item: any, idx: number) => (
          <div
            key={item._id || idx}
            className="p-3 mb-2 border rounded-lg bg-gray-100"
          >
            {Object.entries(item).map(([k, v]) => (
              <p key={k}>
                <strong>{k}:</strong> {v as string}
              </p>
            ))}
          </div>
        ))
      ) : typeof value === "object" ? (
        <pre className="whitespace-pre-wrap">{JSON.stringify(value, null, 2)}</pre>
      ) : (
        <p>{value}</p>
      )}
    </div>
  );
})}


        </div>

        <div className="mt-6 flex justify-center">
          <Button
            onClick={() => navigate("/case-assessments")}
            className="bg-violet-600 text-white rounded-xl px-6"
          >
            Back to Case Assessments
          </Button>
        </div>
      </div>
    </div>
  );
}
