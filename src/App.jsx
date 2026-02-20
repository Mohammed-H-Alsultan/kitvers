import Hero from "./components/Hero";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Hero />
      </main>
      <div className="grid-lines"></div>
      <Footer />
    </div>
  );
}

export default App;
