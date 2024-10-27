import React from "react";
import { AreaChart, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Area } from "recharts"; // Added Area import
import styles from "../assets/css/components/Histogram.module.css";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles["custom-tooltip"]}>
        <p className={styles["label"]}>{`${payload[0].payload.rating} Ratings: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const activity = () => {
  const data = [
    { rating: "Ten Days ago", activity: 10 },
    { rating: "Nine Days Ago", activity: 6 },
    { rating: "Eight Days Ago", activity: 8 },
    { rating: "Seven Days Ago", activity: 7 },
    { rating: "Six Days Ago", activity: 0 },
    { rating: "Five Days Ago", activity: 1 },
    { rating: "Four Days Ago", activity: 3 },
    { rating: "Three Days Ago", activity: 2 },
    { rating: "Two Days Ago", activity: 11 },
    { rating: "One Day Ago", activity: 6 },
  ];

  return (
    <div style={{ width: "25%", height: "100px" }}>
    <ResponsiveContainer>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Tooltip />
        <Area
          dataKey="activity"
          type="monotone"
          stroke="#8884d8"
          fillOpacity={1}
          fill="url(#colorUv)"
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
  
  );
};

export default activity;




/*

import React, { useState, useEffect } from "react";
import { AreaChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles["custom-tooltip"]}>
        <p className={styles["label"]}>{`${payload[0].payload.rating} activity: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const activity = ({ albumID }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/album/${albumID}/activity`);
        const activityData = await response.json();

        const formattedData = [
          { rating: "Ten Days ago", activity: activityData[1] },
          { rating: "Nine Days Ago", activity: activityData[2] },
          { rating: "Eight Days Ago", activity: activityData[3] },
          { rating: "Seven Days Ago", activity: activityData[4] },
          { rating: "Six Days Ago", activity: activityData[5] },
          { rating: "Five Days Ago★", activity: activityData[6] },
          { rating: "Four Days Ago", activity: activityData[7] },
          { rating: "Three Days Ago", activity: activityData[8] },
          { rating: "Two Days Ago", activity: activityData[9] },
          { rating: "One Day Ago", activity: activityData[10] },
        ];

        setData(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [albumID]);

  return (
    <div style={{ width: "25%", height: "100px" }}>
        <ResponsiveContainer>
            <AreaChart data={data}>
                <Bar dataKey="activity" fill="#007BFF" />
            </AreaChart>
        </ResponsiveContainer>
    </div>
);
};

export default activity;
*/