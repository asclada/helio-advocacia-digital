import { AreasAtuacao } from "@/components/sections/areas-atuacao";
import { FaqContato } from "@/components/sections/faq-contato";
import { Hero } from "@/components/sections/hero";
import { Sobre } from "@/components/sections/sobre";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col pt-(--header-height)">
      <Hero />
      <AreasAtuacao />
      <Sobre />
      <FaqContato />
    </main>
  );
}
