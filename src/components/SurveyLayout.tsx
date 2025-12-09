import { Header } from "./Header";

export function SurveyLayout({
  title,
  instructions,
  children,
  className,
}: {
  title: string;
  instructions: string;
  children: React.ReactNode;
  className: string
}) {
  return (
    <div className={className}>
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/bg.png')" }}
      />

      {/* Header / Sidebar */}
      <div
        className="
    w-full           /* mobile */
    sm:w-full        /* small screens: full width */
    md:w-[45%]       /* medium screens */
    lg:w-[50%]       /* large screens */
    xl:w-[50%]       /* extra-large screens */
    2xl:w-[45%]      /* 2xl screens */
    md:sticky md:top-0 md:h-screen md:overflow-hidden

    md:min-h-screen
    mt-5 md:mt-0     /* top margin on mobile/small screens */
    mr-5 md:ml-8  
    px-5   /* left margin on mobile/small screens */
  "
      >
        <Header title={title} instructions={instructions} />
      </div>

      {/* Main Content */}
      <main
        className="
        z-10
        flex-1 overflow-hidden
    w-full           /* mobile */
    sm:w-full        /* small screens */
    md:w-[55%]       /* medium screens */
    lg:w-[50%]       /* large screens */
    xl:w-[50%]       /* extra-large screens */
    2xl:w-[55%]      /* 2xl screens */
     p-4 md:p-6
  "
      >
        <div className=" h-full mx-0 sm:mx-2 md:mx-4 lg:mx-6 xl:mx-8 2xl:mx-10">
          <div className="relative bg-white rounded-2xl shadow-lg h-full p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
