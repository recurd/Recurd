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
//  const { albumID } = useParams();
  const data = [
    { name: "1 Stars", ratings: 5 },
    { name: "2 Stars", ratings: 7 },
    { name: "3 Stars", ratings: 7 },
    { name: "4 Stars", ratings: 4 },
    { name: "5 Stars", ratings: 4 },
    { name: "6 Stars", ratings: 8 },
    { name: "7 Stars", ratings: 9 },
    { name: "8 Stars", ratings: 5 },
    { name: "9 Stars", ratings: 12 },
    { name: "10 Stars", ratings: 8 },
  ];

    return (
        <div style={{ width: "25%", height: "100px" }}>
            <ResponsiveContainer>
                <BarChart data={data}>
                <Tooltip />
                    <Bar dataKey="ratings" fill="#007BFF" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SimpleHistogram;