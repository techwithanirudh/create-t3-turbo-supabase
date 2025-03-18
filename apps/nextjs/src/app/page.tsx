import { FAQ, Features, Footer, Header, Hero } from "./_components/landing";

export default function HomePage() {
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Features />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}