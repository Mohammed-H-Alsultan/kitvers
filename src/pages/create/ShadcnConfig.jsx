import AnimatedLink from "../../components/animatedComponents/AnimatedLink";
import ShadcnOptions from "../../components/createComponents/ShadcnOptions";
export default function ShadcnConfig() {
  return (
    <main>
      <div className="p-6 sticky top-0">
        <AnimatedLink to={"/create"} />
      </div>
      <ShadcnOptions />
    </main>
  );
}
