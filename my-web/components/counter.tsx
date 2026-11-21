"use client";
import { useState } from "react";

export default function Counter() {
    const [count, setCount] = useState(0);

    return (
        <div className="flex flex-col items-center gap-4 p-8 ">
            <div className="flex items-center gap-4 ">
                <button onClick={() => setCount(count - 1)}
                    className="rounded bg-slate-200 px-4 py-2 text-black dark:bg-slate-700 dark:text-slate-100">-</button>
                <p className="text-3xl font-bold">{count}</p>
                <button onClick={() => setCount(count + 1)}
                    className="rounded bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-2 text-white">+</button>
            </div>
            <button onClick={() => setCount(0)}
                className="rounded-3xl bg-red-500 px-4 py-2 text-white">Reset</button>
        </div>
    );
}
