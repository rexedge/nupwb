"use client";

import { useActionState, useState } from "react";
import { loginAction, type LoginState } from "./actions";

const initialState: LoginState = { error: null };

export function LoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState(loginAction, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <input type="hidden" name="next" value={next} />

      {state.error && (
        <div className="flex items-center gap-2 rounded-md border border-[#B7202B]/40 bg-[#B7202B]/10 px-4 py-3 text-sm text-[#B7202B]">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#B7202B] text-xs font-bold text-[#FBF6EC]">
            !
          </span>
          {state.error}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-semibold text-[#1E1B16]">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="rounded-md border border-[#E0CD98] bg-[#FBF6EC] px-3.5 py-2.5 text-base text-[#1E1B16] focus:border-[#0E5C34] focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-semibold text-[#1E1B16]">
          Password
        </label>
        <div className="flex items-center rounded-md border border-[#E0CD98] bg-[#FBF6EC] px-3.5">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            className="w-full bg-transparent py-2.5 text-base text-[#1E1B16] focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="shrink-0 text-xs font-semibold text-[#0E5C34]"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="h-14 rounded-md bg-[#0E5C34] text-base font-semibold text-[#FBF6EC] transition-colors hover:bg-[#083D22] disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign In"}
      </button>

      <p className="text-center text-xs text-[#6E6455]">Single admin account. Ask Timothy for access.</p>
    </form>
  );
}
