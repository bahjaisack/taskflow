import { signIn } from "@/auth";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md">
        <h2 className="text-2xl font-bold text-slate-900 text-center">
          Login
        </h2>
        <p className="mt-2 text-sm text-center text-slate-600">
          Choose a provider to access your dashboard
        </p>

        <div className="mt-6 space-y-3">
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/dashboard" });
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white py-2.5 text-sm font-medium text-indigo-700 hover:bg-indigo-50 transition"
            >
              Sign in with Google
            </button>
          </form>

          <form
            action={async () => {
              "use server";
              await signIn("github", { redirectTo: "/dashboard" });
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-900 py-2.5 text-sm font-medium text-white hover:bg-indigo-800 transition"
            >
              Sign in with GitHub
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}