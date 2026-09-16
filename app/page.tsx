import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
        Manage tasks with <span className="text-indigo-600">TaskFlow</span>
      </h1>
      <p className="mt-4 max-w-xl text-lg text-slate-600">
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/login"
          className="rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white shadow hover:bg-indigo-700 transition"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="rounded-lg bg-white px-6 py-3 font-medium text-slate-700 shadow ring-1 ring-slate-200 hover:bg-slate-50 transition"
        >
          Create Account
        </Link>
      </div>
    </div>
  );
}