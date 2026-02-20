import AnimatedLink from "../components/animatedComponents/AnimatedLink";

export default function create() {
    return(
        <main className="p-6">
            <AnimatedLink to={"/"} />
            <h1>This is create page!</h1>
        </main>
    )
}