interface HeaderProps {
  title: string;
  instructions: string;
}
// interface SurveyHeader {
//     title:string
//     instructions:string
// }
export const Header = ({ title, instructions }: HeaderProps) => {
  return (
    <header className="relative bg-gray-800 px-4 after:pointer-events-none after:absolute after:inset-x-0 after:inset-y-0 after:border-y after:border-white/10">
      <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col items-center text-center">
        {/* Logo + Title */}
        <div className="flex items-center space-x-4">
          <img
            src="/eeu_logo.png" // replace with your logo path
            alt="Logo"
            className="h-12 w-auto"
          />
          <h1 className="text-3xl font-bold tracking-tight text-green-500">
            {title}
          </h1>
        </div>

        {/* Instructions below */}
        <p className="mt-2 text-yellow-300">{instructions}</p>
      </div>
    </header>
  );
};
