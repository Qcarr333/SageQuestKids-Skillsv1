import Link from 'next/link';

type GameCardProps = {
  title: string;
  description: string;
  skills: string[];
  grades: string;
  href?: string;
  comingSoon?: boolean;
};

export function GameCard({ title, description, skills, grades, href = '#', comingSoon = false }: GameCardProps) {
  return (
    <article className="flex h-full flex-col rounded-2xl bg-white p-5 shadow-lg ring-1 ring-slate-100">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="text-xl font-bold text-slate-900">{title}</h3>
        {comingSoon && <span className="rounded-full bg-lime-100 px-3 py-1 text-xs font-bold text-lime-800">Coming Soon</span>}
      </div>
      <p className="text-sm text-slate-700">{description}</p>
      <p className="mt-3 text-sm font-semibold text-slate-900">Skills:</p>
      <p className="text-sm text-slate-700">{skills.join(', ')}</p>
      <p className="mt-3 text-sm font-semibold text-slate-900">Recommended grades:</p>
      <p className="text-sm text-slate-700">{grades}</p>
      <p className="mt-4 rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700">Progress: 0% complete (placeholder)</p>
      <div className="mt-5">
        <Link
          href={href}
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-gradient-to-r from-teal-500 to-sky-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
        >
          {comingSoon ? 'Preview' : 'Start'}
        </Link>
      </div>
    </article>
  );
}
