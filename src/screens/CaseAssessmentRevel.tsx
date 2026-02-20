"use client";

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API, { URL_PATH } from "src/common/API";
import { Button } from "../ui/components/Button";
import { FeatherEye, FeatherHome } from "@subframe/core";
import { colors } from "src/common/Colors";

export default function CaseAssessmentReveal() {
  const navigate = useNavigate();
  const { caseId } = useParams();

  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState<number | null>(null);
  const [revealImageUrl, setRevealImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchReveal = async () => {
      try {
        setLoading(true);
        const res = await API("GET", URL_PATH.getCaseReveal(caseId));

        // Check if reveal has already been viewed
        if (res.message === "Reveal already viewed") {
          setRevealImageUrl(null);
          alert("You have already viewed the reveal for this case.");
          return;
        }

        setScore(res.score || null);

        if (res.revealImageUrl) {
          // Convert Google Drive share link to preview URL
          const match = res.revealImageUrl.match(/\/d\/(.*?)\//);
          const previewUrl = res.revealImageUrl.replace("/view?usp=sharing", "/preview");
          setRevealImageUrl(previewUrl);
        }
      } catch (err) {
        console.error("Failed to fetch reveal:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReveal();
  }, [caseId]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading reveal...
      </div>
    );

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center px-4 py-8">
      {/* Score Card */}
      <div className="bg-white rounded-2xl border p-6 text-center mb-6 w-full max-w-[600px]">
        <h2 className="text-2xl font-bold">Your Score</h2>
        <p className="text-5xl font-bold mt-2">{score}</p>
      </div>

      {/* Reveal Image inside iframe */}
      {revealImageUrl && (
        <iframe
          src={revealImageUrl}
          width="100%"
          height="500"
          allow="autoplay"
          className="rounded-2xl border border-neutral-200 max-w-[800px]"
        />
      )}

      {/* Buttons */}
      <div className="flex flex-col gap-4 mt-6 w-full max-w-[400px]">
        <Button
          style={{ backgroundColor: colors.primaryGlow, color: colors.white }}
          icon={<FeatherEye />}
          className="w-full"
          onClick={() => navigate("/case-assessments")}
        >
          Explore More Cases
        </Button>

        <Button
          style={{ backgroundColor: colors.primary, color: colors.white }}
          icon={<FeatherHome />}
          className="w-full"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}

