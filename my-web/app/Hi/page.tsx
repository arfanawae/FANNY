"use client";
import Greet from "@/components/Greeting";

export default function Home() {
  return (
    <div className="rounded-xl bg-white p-6 text-slate-900 shadow dark:bg-slate-800 dark:text-white">
      <Greet name="Fan" />
    </div>
  );
}