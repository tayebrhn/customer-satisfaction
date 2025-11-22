import { Header } from "./Header";
import Footer from "./Footer";

export function SurveyLayout({
  title,
  instructions,
  children,
}: {
  title: string;
  instructions: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-lime-600">
      {/* Header / Sidebar */}
      <div
        className="
    w-full           /* mobile */
    sm:w-full        /* small screens: full width */
    md:w-[60%]       /* medium screens */
    lg:w-[55%]       /* large screens */
    xl:w-[50%]       /* extra-large screens */
    2xl:w-[45%]      /* 2xl screens */
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
    w-full           /* mobile */
    sm:w-full        /* small screens */
    md:w-[40%]       /* medium screens */
    lg:w-[45%]       /* large screens */
    xl:w-[50%]       /* extra-large screens */
    2xl:w-[55%]      /* 2xl screens */
    flex-1 p-4 md:p-6
  "
      >
        <div className="h-full mx-0 sm:mx-2 md:mx-4 lg:mx-6 xl:mx-8 2xl:mx-10">
          <div className="bg-white rounded-2xl shadow-lg h-full overflow-auto p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
