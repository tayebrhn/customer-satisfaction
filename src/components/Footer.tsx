export default function Footer() {
  return (
    <footer className="bg-zinc-50 text-center dark:bg-neutral-700 lg:text-left">
      <div className="bg-black/5 p-4 text-center text-surface dark:text-white">
        <p>© {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}
