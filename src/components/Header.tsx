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
    <header className="relative h-full w-full flex flex-col items-center justify-center text-center px-4">
      {/* Title */}
      <h2
        className="
      font-bold
      tracking-tight
      text-shadow-gray-950
      line-clamp-2
      text-center
      min-h-[2.4em]
    "
        style={{
          fontSize: "clamp(1.5rem, 2vw, 3.5rem)",
          lineHeight: 1.2,
        }}
      >
        {title}
      </h2>

      {/* Instructions */}
      <p
        className="
      mt-2
      text-shadow-gray-800
      line-clamp-3
      max-w-2xl
    "
        // style={{
        //   fontSize: "clamp(0.875rem, 1.8vw, 1.25rem)",
        //   lineHeight: 1.3,
        // }}
      >
        {instructions}
      </p>
    </header>
  );
};
