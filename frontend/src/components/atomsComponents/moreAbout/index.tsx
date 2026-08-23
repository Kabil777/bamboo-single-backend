import { Button } from "@/components/shadcnUI/button";
import React from "react";
const MoreAboutData = [
  { id: 1, title: "Python", count: "3.5k" },
  { id: 2, title: "JavaScript", count: "2.5k" },
  { id: 3, title: "Java", count: "1.5k" },
  { id: 4, title: "C++", count: "1.2k" },
  { id: 5, title: "Go", count: "800" },

  { id: 6, title: "Rust", count: "600" },
  { id: 7, title: "Ruby", count: "500" },
  { id: 8, title: "PHP", count: "400" },
  { id: 9, title: "Next.js", count: "300" },
  { id: 10, title: "React", count: "200" },
  { id: 11, title: "Vue", count: "150" },
  { id: 12, title: "Svelte", count: "100" },
  { id: 13, title: "Angular", count: "80" },
  { id: 14, title: "DevOps", count: "60" },
  { id: 15, title: "Cloud", count: "50" },
  { id: 16, title: "AI/ML", count: "40" },
  { id: 17, title: "Data Science", count: "30" },
  { id: 18, title: "Cybersecurity", count: "20" },
  { id: 19, title: "Blockchain", count: "10" },
  { id: 20, title: "AR/VR", count: "5" },
  { id: 21, title: "AI/ML", count: "40" },
  { id: 22, title: "Data Science", count: "30" },
  { id: 23, title: "Cybersecurity", count: "20" },
  { id: 24, title: "Blockchain", count: "10" },
  { id: 25, title: "AR/VR", count: "5" },
  { id: 26, title: "AI/ML", count: "40" },
  { id: 27, title: "Data Science", count: "30" },
  { id: 28, title: "Cybersecurity", count: "20" },
  { id: 29, title: "Blockchain", count: "10" },
  { id: 30, title: "AR/VR", count: "5" },
]
export const MoreAbout = () => {
  return <div className="flex flex-col gap-4 p-4 bg-muted/50 rounded-xl border border-border">
    <p className="font-medium">Recommended Topics</p>
    <div className="flex flex-wrap gap-2">
      {MoreAboutData.map((item) => (
        <Button key={item.id} variant={"outline"} className="flex items-center gap-2 px-3 py-2 rounded-lg w-fit">
          <span className="text-sm font-semibold">{item.title}</span>
          <span className="text-xs text-accent-foreground">{item.count}</span>
        </Button>
      ))}

    </div>
  </div>;
};
