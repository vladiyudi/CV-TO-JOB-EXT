import React, { useState, useEffect } from "react";
import axios from "axios";
import { BorderBeam } from "./ui/border-beam";

export default function ShowDailyLimit({ refreshTrigger }) {
  const [dailyLimitInfo, setDailyLimitInfo] = useState(null);
  const [error, setError] = useState(null);

  const fetchDailyLimit = async () => {
    try {
      const response = await axios.get("/api/daily-limit", {
        withCredentials: true,
      });
      setDailyLimitInfo(response.data);
    } catch (err) {
      setError("Error fetching daily limit information");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDailyLimit();
  }, [refreshTrigger]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!dailyLimitInfo) {
    return (
      <div className="rajdhani-light">Loading daily limit information...</div>
    );
  }

  const { dailyLimit, generationsToday } = dailyLimitInfo;

  return (
    <div className="relative flex items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl w-[250px] h-[43px] mt-3">
      <span className="text-black-900 rajdhani-regular p-2">
        {dailyLimit === null ? (
          <p>Unlimited Generations</p>
        ) : (
          <p>
            Generations Today: {dailyLimit - generationsToday}
          </p>
        )}
      </span>
      <BorderBeam size={250} duration={12} delay={9} />
    </div>
  );
}
