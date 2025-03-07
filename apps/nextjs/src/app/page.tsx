import { FAQ, Features, Footer, Header, Hero } from "./_components/landing";
// import SmoothScroll from "./_components/smooth-scroll";

export default function HomePage() {
  return (
    // <SmoothScroll>
    <div className="flex min-h-[100dvh] flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Features />
        <FAQ />
      </main>
      <Footer />
    </div>
    // </SmoothScroll>
  );
}