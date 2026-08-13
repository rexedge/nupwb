import Image from "next/image";
import { AnkaraPattern } from "@/components/site/AnkaraPattern";
import { LoginForm } from "./LoginForm";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#E7DDC8] px-4 py-10">
      <AnkaraPattern opacity={0.05} className="fixed" />
      <div className="relative z-10 flex w-full max-w-sm flex-col items-center gap-6">
        <Image
          src="/assets/nupwb-logo.jpeg"
          alt="Nwoke Udi Palm Wine Bar"
          width={72}
          height={60}
          className="h-14 w-auto mix-blend-multiply"
        />
        <div className="w-full rounded-2xl bg-[#FFFDF8] p-7 shadow-lg">
          <div className="mb-6 text-center">
            <h1 className="font-display text-[26px] font-bold text-[#1E1B16]">Admin sign in</h1>
            <p className="mt-1 text-[15px] text-[#6E6455]">Nwoke Udi Palm Wine Bar</p>
          </div>
          <LoginForm next={next ?? "/admin"} />
        </div>
      </div>
    </div>
  );
}
