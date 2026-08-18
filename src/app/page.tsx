import { Hero } from "@/components/sections/hero";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col pt-(--header-height)">
      <Hero />
    </main>
  );
}
