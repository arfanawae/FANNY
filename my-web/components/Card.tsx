type CardProps = {
  title: string;
  body: string;
};

export default function Card({ title, body }: CardProps) {
  return (
    <div className="rounded-xl bg-gradient-to-r from-green-500 to-teal-500 p-6 text-slate-950 shadow-xl shadow-black/50 dark:from-green-700 dark:to-teal-800 dark:text-slate-100">
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="mt-2 text-slate-700 dark:text-slate-200">{body}</p>
    </div>
  );
}