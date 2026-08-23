import { DocsCard } from "@/components/atomsComponents";
import type { DocsHomeCard } from "@/types/docs/docs-base";

const cardData: DocsHomeCard[] = [
  { id: "1", title: "React", createdAt: "2025-01-01T00:00:00.000Z", description: "A JavaScript library for building user interfaces", coverUrl: "", author: { id: "1", name: "Bamboo", handle: "bamboo" } },
  { id: "2", title: "Vue", createdAt: "2025-02-01T00:00:00.000Z", description: "A progressive JavaScript framework for building user interfaces", coverUrl: "", author: { id: "1", name: "Bamboo", handle: "bamboo" } },
];

const DocsCards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-3 md:gap-5 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
      {cardData.map((card) => (
        <DocsCard
          key={card.id}
          hoverOpen={false}
          doc={card}
          active=""
          setActiveCard={() => {}}
        />
      ))}
    </div>
  );
};
export { DocsCards };
