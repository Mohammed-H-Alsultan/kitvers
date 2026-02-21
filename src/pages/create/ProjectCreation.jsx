import RunProgress from "../../components/RunProgress";
import AnimatedLink from "../../components/animatedComponents/AnimatedLink";

export default function RunProject() {
  return (
    <main>
      <div className="p-6">
        <AnimatedLink to={"/create"} />
      </div>
      <RunProgress />
    </main>
  );
}


