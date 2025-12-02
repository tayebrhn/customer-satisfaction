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
    <header
      className={` relative h-full w-full flex flex-col items-center justify-center text-center`}
    >
      {/* Logo + Title */}
      <div className="flex md:flex-col items-center md:space-x-0 md:space-y-4 space-x-4 w-full md:max-w-xs">
        <img
          src="/eeu_logo.png"
          alt="Logo"
          className="w-auto h-12 md:h-16 lg:h-20 xl:h-24"
          style={{ maxHeight: "clamp(3rem, 10vw, 6rem)" }}
        />
        <h2
          className="font-bold tracking-tight text-shadow-gray-950 lg:text-nowrap"
          style={{ fontSize: "clamp(1.5rem, 2vw, 3.5rem)", lineHeight: 1 }}
        >
          {title}
        </h2>
      </div>

      {/* Instructions */}
      <p
        className="mt-2 text-shadow-gray-800"
        style={{ fontSize: "clamp(0.875rem, 1.8vw, 1.25rem)", lineHeight: 1.3 }}
      >
        {instructions}
      </p>
    </header>
  );
};
