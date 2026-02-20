import AnimatedLink from "../components/animatedComponents/AnimatedLink";
import ProjectInfo from "../components/createComponents/ProjectInfo";

export default function create() {
  return (
    <main className="p-6">
      <AnimatedLink to={"/"} />
      <div className="p-5 mt-3">
        <h1 className="text-4xl font-jetbrains font-bold">
          KitVers Create Project...
        </h1>
      </div>
      <ProjectInfo />
    </main>
  );
}
