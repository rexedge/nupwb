import { ImagePlaceholder } from "./ImagePlaceholder";

export function AboutTeaser() {
  return (
    <section className="bg-card-alt px-5 pt-8.5 pb-7.5 lg:px-10 lg:py-18">
      <div className="grid grid-cols-1 gap-4 lg:mx-auto lg:max-w-[1240px] lg:grid-cols-2 lg:items-center lg:gap-16">
        <div className="flex flex-col gap-4 lg:col-start-2 lg:row-start-1 lg:gap-5">
          <h2 className="font-display text-[30px] font-bold leading-[1.14] text-ink text-balance lg:text-[46px] lg:leading-[1.1]">
            A place to sit,
            <br className="hidden lg:block" /> and stay a while
          </h2>
          <div className="flex items-center gap-2.5 lg:w-70">
            <span className="h-px w-full bg-gold lg:w-auto lg:flex-1" />
            <span
              aria-hidden
              className="h-4 w-4 flex-none border border-gold"
              style={{ borderRadius: "50% 0 50% 0" }}
            />
            <span
              className="h-px flex-1"
              style={{ background: "linear-gradient(90deg,#D4A32C,rgba(212,163,44,0))" }}
            />
          </div>
        </div>

        <div className="relative h-47.5 border border-[#E0CD98] bg-card p-1.25 lg:col-start-1 lg:row-start-1 lg:row-span-2 lg:h-95 lg:p-1.75">
          <ImagePlaceholder label="Room / guests at a table" className="absolute inset-1.25 lg:inset-1.75" />
        </div>

        <div className="flex flex-col gap-4 lg:col-start-2 lg:row-start-2 lg:gap-5">
          <p className="text-[16px] leading-[1.62] text-muted lg:max-w-135 lg:text-[19px] lg:leading-[1.7]">
            Nwoke Udi has poured palm wine on Ogui Road for years, from the same tappers and the same
            kitchen. Nothing here is rushed — the gourd comes to the table, the isi ewu comes hot, and
            the evening goes where it goes.
          </p>
          <a
            href="/about"
            className="w-fit border-b border-gold pb-0.75 text-[16px] font-semibold text-palm! lg:text-[18px]"
          >
            Our Story →
          </a>
        </div>
      </div>
    </section>
  );
}
