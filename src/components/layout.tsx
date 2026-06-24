import type { PropsWithChildren } from "react";
import { Header } from "./header";

export function Layout({ children }: PropsWithChildren) {
  return (
    <div className=" bg-gradient-to-br from-background to-muted">
      <Header />
      <main className="min-h-screen container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="border-t backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 bg-background/80">
  <div className="container mx-auto px-4">

    <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-center md:text-left">
      {/* Left Section */}
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          KLIMATE
        </h2>
        <p className="text-sm text-muted-foreground">
          Weather Forecast & Climate Intelligence
        </p>
      </div>

      {/* Center Section */}
      <div className="text-sm text-muted-foreground">
        Built with React • TypeScript • Tailwind CSS
      </div>

      {/* Right Section */}
      <div className="text-sm">
        <p className="text-foreground font-medium">
          Made with 💗 by Pooja Sharma
        </p>
        <p className="text-xs text-muted-foreground">
          For learning & portfolio purpose
        </p>
      </div>

    </div>

  </div>
</footer>
    </div>
  );
}