import React from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import backend from '../backend'


const SimpleHistogram = () => {
    const data = [
        { rating: "1 ★, ", ratings: 5 },
        { rating: "2 ★, ", ratings: 6 },
        { rating: "3 ★, ", ratings: 8 },
        { rating: "4 ★, ", ratings: 7 },
        { rating: "5 ★, ", ratings: 1 },
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
