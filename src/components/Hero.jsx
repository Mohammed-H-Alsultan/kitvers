import { MdCreateNewFolder } from "react-icons/md";
import { FaFolderOpen } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <div className="flex flex-col justify-center items-center h-[70vh]">
      {/* title */}
      <p className="font-mono text-[#474747] text-start mr-79 mb-5">
        // Project workspace
      </p>
      <h1 className="font-jetbrains font-extrabold text-9xl text-white">
        Kit
        <span className="font-jetbrains font-light text-9xl text-[#474747]">
          Vers
        </span>
      </h1>
      {/* des */}
      <div className="mt-10 w-110 mr-5 border-l border-white/30 p-3">
        <p className="font-mono font-light ">
          Stop wiring up the same stack twice.
          <span className="font-extrabold text-[#888]"> KitVers</span> scaffolds
          your React project pre-loaded with the libraries you actually use
          <span className="font-extrabold text-[#888]">
            {" "}
            icons, charts, routing, DaisyUI, and more
          </span>{" "}
          — fully configured and ready to ship. Pick your kit. Build what
          matters.
        </p>
      </div>

      {/* Buttons */}
      <div className="mt-10">
        <Link
          to={"/create"}
          className="btn bg-white text-black mr-9 
              shadow-[0px_0px_0px_0px_#ffffff] 
              hover:shadow-[0px_0px_20px_1px_#ffffff4d]
              transition-shadow duration-300 ease-in-out"
        >
          <MdCreateNewFolder size={20} className="mr-1" />
          New project +
        </Link>
        <button
          className="btn bg-[#474747] text-white
              shadow-[0px_0px_0px_0px_#ffffff] 
              hover:shadow-[0px_0px_20px_1px_#ffffff4d]
              transition-shadow duration-300 ease-in-out pr-6
            "
        >
          <FaFolderOpen size={20} className="mr-2" />
          Old projects
        </button>
      </div>
    </div>
  );
}
