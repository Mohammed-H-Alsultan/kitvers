import { useNavigate } from "react-router-dom";

export default function ProjectFooter({ onReset, payload }) {
  const navigate = useNavigate();

  const canCreate =
    payload?.projectName?.length > 0 && payload?.projectPath?.length > 0;

  const handleCreate = () => {
    if (!canCreate) return;
    navigate("/create/run", { state: payload });
  };

  return (
    <footer className="fixed bottom-0 bg-zinc-800/20 backdrop-blur-xs w-full p-3 border-t border-zinc-900">
      <div className="flex justify-center items-center">
        <button
          onClick={handleCreate}
          disabled={!canCreate}
          className={`btn w-115 rounded-lg ${
            canCreate
              ? "bg-white text-black"
              : "bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed"
          }`}
        >
          Create Project +
        </button>

        <button onClick={onReset} className="btn bg-black ml-5 rounded-lg">
          Reset
        </button>
      </div>
    </footer>
  );
}
