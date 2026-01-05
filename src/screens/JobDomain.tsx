"use client";

import React, { useState, useEffect } from "react";
import { Button } from "../ui/components/Button";
import { IconButton } from "../ui/components/IconButton";
import { FeatherArrowLeft, FeatherChevronDown } from "@subframe/core";
import { useNavigate } from "react-router-dom";
import * as SubframeCore from "@subframe/core";
import API, { URL_PATH } from "src/common/API";

const notify = (msg: string) => {
  console.warn(msg);
};

function JobDomain() {
  const navigate = useNavigate();
  const userId = React.useMemo(() => localStorage.getItem("userId"), []);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Domain
  const [domain, setDomain] = useState<{ id: string; name: string } | null>(
    null
  );
  const [domains, setDomains] = useState<{ _id: string; name: string }[]>([]);

  // SubDomain
  const [subDomain, setSubDomain] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [subDomains, setSubDomains] = useState<{ _id: string; name: string }[]>(
    []
  );

  // -------------------- SAVE DOMAIN + SUBDOMAIN --------------------
  const handleContinue = async () => {
    if (!domain || !subDomain) {
      notify("Please select both domain and sub domain.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      notify("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    try {
      setIsSubmitting(true);

      await API(
        "POST",
        URL_PATH.jobDomain,
        {
          userId,
          domainId: domain.id,
          subDomainId: subDomain.id,
        },
        {
          Authorization: `Bearer ${token}`,
        }
      );

      localStorage.setItem("domainId", domain.id);
      localStorage.setItem("subDomainId", subDomain.id);

      localStorage.setItem("jobDomain", domain.name);
      localStorage.setItem("subDomain", subDomain.name);

      navigate("/skills");
    } catch (err: any) {
      console.error(err);
      notify(err?.response?.data?.message || "Failed to save job domain");
    } finally {
      setIsSubmitting(false);
    }
  };

  // -------------------- FETCH USER SELECTED DOMAIN --------------------
  useEffect(() => {
    const fetchUserSelectedDomain = async () => {
      if (!userId) return;

      try {
        const res = await API("GET", URL_PATH.getUserDomainSkils, undefined, {
          "user-id": userId,
        });

        // API returns array
        if (Array.isArray(res) && res.length > 0) {
          const item = res[0];

          if (item.domainId) {
            setDomain({
              id: item.domainId._id,
              name: item.domainId.name,
            });
          }

          if (item.subDomainId) {
            setSubDomain({
              id: item.subDomainId._id,
              name: item.subDomainId.name,
            });
          }
        }
      } catch (err) {
        console.error("Failed to fetch job domain", err);
      }
    };

    fetchUserSelectedDomain();
  }, [userId]);

  // -------------------- FETCH ALL DOMAINS --------------------
  useEffect(() => {
    const fetchAvailableDomains = async () => {
      try {
        const res = await API("GET", URL_PATH.getJobDomain);

        const activeDomains = res.map((d: any) => ({
          _id: d._id,
          name: d.name,
        }));

        setDomains(activeDomains);
      } catch (err) {
        console.error("Failed to load domains", err);
        notify("Unable to load job domains");
      }
    };

    fetchAvailableDomains();
  }, []);

  // -------------------- FETCH SUBDOMAINS BY DOMAIN --------------------
  useEffect(() => {
    if (!domain) {
      setSubDomains([]);
      setSubDomain(null);
      return;
    }

    const fetchSubDomains = async () => {
      try {
        const res = await API(
          "GET",
          `${URL_PATH.getSubDomain}?domainId=${domain.id}`
        );

        setSubDomains(
          res.data.map((item: any) => ({
            _id: item._id,
            name: item.name,
          }))
        );
      } catch (err) {
        console.error("Failed to fetch sub domains", err);
        notify("Unable to load sub domains");
      }
    };

    fetchSubDomains();
  }, [domain]);

  // -------------------- UI --------------------
  return (
    <div className="min-h-screen bg-neutral-50 px-8 py-10 flex items-center justify-center">
      <div className="flex max-w-[660px] w-full mx-auto">
        <div className="flex w-full flex-col gap-8 rounded-3xl border border-neutral-300 bg-white px-10 py-8 shadow-lg">
          {/* Header */}
          <div className="flex items-center gap-4">
            <IconButton
              size="small"
              icon={<FeatherArrowLeft />}
              onClick={() => navigate(-1)}
            />

            <div className="flex flex-1 gap-2">
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className="h-1 flex-1 rounded-full bg-violet-700"
                />
              ))}
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-1 flex-1 rounded-full bg-gray-300" />
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <h2 className="text-[22 px] text-neutral-900">
              Choose your job domain
            </h2>
            <p className="text-xs text-neutral-500">
              Your domain and skills will decide your assessment and rankings
            </p>
          </div>

          {/* Domain Dropdown */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-neutral-900">
              Job Domain <span className="text-red-500">*</span>
            </label>

            <SubframeCore.DropdownMenu.Root>
              <SubframeCore.DropdownMenu.Trigger asChild>
                <div className="flex h-10 items-center justify-between rounded-3xl border border-neutral-300 px-4 bg-neutral-50 cursor-pointer">
                  <span
                    className={domain ? "text-neutral-600" : "text-neutral-400"}
                  >
                    {domain?.name || "Select your domain"}
                  </span>
                  <FeatherChevronDown />
                </div>
              </SubframeCore.DropdownMenu.Trigger>

              <SubframeCore.DropdownMenu.Content
                asChild
                align="start"
                sideOffset={4}
              >
                <div className="bg-white rounded-2xl shadow-lg py-2 max-h-[260px] overflow-y-auto">
                  {domains.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => {
                        setDomain({ id: item._id, name: item.name });
                        setSubDomain(null); // reset subdomain when domain changes
                      }}
                      className={`px-4 py-2 cursor-pointer text-sm hover:bg-violet-50 ${
                        domain?.id === item._id
                          ? "bg-violet-100 font-semibold"
                          : ""
                      }`}
                    >
                      {item.name}
                    </div>
                  ))}
                </div>
              </SubframeCore.DropdownMenu.Content>
            </SubframeCore.DropdownMenu.Root>
          </div>

          {/* SubDomain Dropdown */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-neutral-900">
              Sub Domain <span className="text-red-500">*</span>
            </label>

            <SubframeCore.DropdownMenu.Root>
              <SubframeCore.DropdownMenu.Trigger asChild>
                <div
                  className={`flex h-10 items-center justify-between rounded-3xl border border-neutral-300 px-4 cursor-pointer ${
                    !domain
                      ? "bg-neutral-100 cursor-not-allowed"
                      : "bg-neutral-50"
                  }`}
                >
                  <span
                    className={
                      subDomain ? "text-neutral-600" : "text-neutral-400"
                    }
                  >
                    {subDomain?.name || "Select sub domain"}
                  </span>
                  <FeatherChevronDown />
                </div>
              </SubframeCore.DropdownMenu.Trigger>

              {domain && (
                <SubframeCore.DropdownMenu.Content
                  asChild
                  align="start"
                  sideOffset={4}
                >
                  <div className="bg-white rounded-2xl shadow-lg py-2 max-h-[260px] overflow-y-auto">
                    {subDomains.map((item) => (
                      <div
                        key={item._id}
                        onClick={() =>
                          setSubDomain({ id: item._id, name: item.name })
                        }
                        className={`px-4 py-2 cursor-pointer text-sm hover:bg-violet-50 ${
                          subDomain?.id === item._id
                            ? "bg-violet-100 font-semibold"
                            : ""
                        }`}
                      >
                        {item.name}
                      </div>
                    ))}
                  </div>
                </SubframeCore.DropdownMenu.Content>
              )}
            </SubframeCore.DropdownMenu.Root>
          </div>

          {/* Footer */}
          <Button
            onClick={handleContinue}
            disabled={!domain || !subDomain || isSubmitting}
            className={`h-9 w-full rounded-2xl text-white ${
              isSubmitting
                ? "bg-violet-300"
                : "bg-violet-600 hover:bg-violet-700"
            }`}
          >
            {isSubmitting ? "Saving..." : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default JobDomain;
