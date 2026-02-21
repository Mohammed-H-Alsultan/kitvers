export default function ProjectFooter({ onReset }) {
  return (
    <footer className="fixed bottom-0 bg-zinc-800/20 backdrop-blur-xs w-full p-3 border-t border-zinc-900">
      <div className="flex justify-center items-center">
        <button className="btn bg-white text-black w-115 rounded-lg">
          Create Project +
        </button>
        <button onClick={onReset} className="btn bg-black ml-5 rounded-lg">
          Reset
        </button>
      </div>
    </footer>
  );
}
