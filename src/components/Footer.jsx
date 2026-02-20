import FooterCards from "./animatedComponents/FooterCards";

export default function Footer() {
    return(
        <footer className="bg-black/20 p-5 flex items-center border-t border-white/10">
            <div>
                <FooterCards />
            </div>
            <p className="ml-auto text-[#474747] hidden lg:block"> created by Mohammed Alsultan ©2026</p>
        </footer>
    )
}