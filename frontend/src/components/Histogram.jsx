import React from "react";
import { BarChart, Bar, XAxis, YAxis, Legend, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import styles from "../assets/css/components/Histogram.module.css"

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

const SimpleHistogram = () => {

  const data = [
    { rating: "1 ★", ratings: 5 },
    { rating: "2 ★", ratings: 6 },
    { rating: "3 ★", ratings: 8 },
    { rating: "4 ★", ratings: 7 },
    { rating: "5 ★", ratings: 1 },
    { rating: "6 ★", ratings: 5 },
    { rating: "7 ★", ratings: 6 },
    { rating: "8 ★", ratings: 8 },
    { rating: "9 ★", ratings: 7 },
    { rating: "10 ★", ratings: 1 },
  ];

  return (
    <div className={styles["histogram-container"]}>
      <ResponsiveContainer width="25%" height={100}>
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 123, 255, 0.1)' }} />
          <Bar dataKey="ratings" fill="#007BFF" className={styles["bar-chart"]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SimpleHistogram;
