import React from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

const SimpleHistogram = () => {
    const data = [
        { rating: "1 Star", ratings: 5 },
        { rating: "2 Stars", ratings: 6 },
        { rating: "3 Stars", ratings: 8 },
        { rating: "4 Stars", ratings: 7 },
        { rating: "5 Stars", ratings: 1 },
    ];

    return (
        <div style={{ width: "25%", height: "100px" }}>
            <ResponsiveContainer>
                <BarChart data={data}>
                    <XAxis dataKey="rating" />
                    <YAxis />
                    <Bar dataKey="ratings" fill="#007BFF" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SimpleHistogram;
