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
    <div className="min-h-screen flex flex-col">
      <Header title={title} instructions={instructions} />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
