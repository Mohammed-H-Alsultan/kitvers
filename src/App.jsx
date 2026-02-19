function App() {
  return (
    <>
      <div className="flex flex-col justify-center items-center h-[80vh]">
        <h1 className="font-jetbrains font-extrabold text-9xl text-white">
          Kit
          <span className="font-jetbrains font-light text-9xl text-gray-600">
            Vers
          </span>
        </h1>
        <p className="font-mono font-light mt-4">description...</p>

        <div>
          <button
            className="btn mt-20 bg-white text-black mr-9 
              shadow-[0px_0px_0px_0px_#ffffff] 
              hover:shadow-[0px_0px_20px_1px_#ffffff4d]
              transition-shadow duration-300 ease-in-out"
          >
            Create new project +
          </button>
          <button
            className="btn mt-20 bg-[#727272] text-white
              shadow-[0px_0px_0px_0px_#ffffff] 
              hover:shadow-[0px_0px_20px_1px_#ffffff4d]
              transition-shadow duration-300 ease-in-out
              w-45
            "
          >
            Old projects
          </button>
        </div>
      </div>
      <div className="grid-lines"></div>
    </>
  );
}

export default App;
