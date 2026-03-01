export default function Header() {
  return (
    <header className="bg-black/40 p-5 flex items-center border-b border-white/15 z-1">
      <h1 className="font-ibm mr-3 font-bold text-2xl">KitVers</h1>
      <p className="font-ibm text-[#474747] ">v0.0.1</p>
      <div className="ml-auto font-mono">
        <div className="inline-grid *:[grid-area:1/1]">
          <div className="status status-info rounded-full animate-ping"></div>
          <div className="status status-info rounded-full mr-2"></div>
        </div>
        Woek in progress
      </div>
    </header>
  );
}
