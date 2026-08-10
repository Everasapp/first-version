import {
  Baby,
  BriefcaseBusiness,
  Drama,
  Dumbbell,
  GraduationCap,
  Music,
  Palette,
  ShoppingBag,
  Sparkles,
  Utensils,
  Wine,
} from "lucide-react";

import CelebrazioniIcon from "@/src/components/icons/CelebrazioniIcon";

export type Category = {
  id: number;
  slug: string;
  name: string;
  icon: any;
  gradient: string;
};

export const categories: Category[] = [
    {
      id: 1,
      slug: "musica-concerti",
      name: "Musica e concerti",
      icon: Music,
      gradient: "from-blue-600 to-indigo-700",
    },
    {
      id: 2,
      slug: "sagre-tradizioni",
      name: "Sagre e tradizioni",
      icon: Wine,
      gradient: "from-orange-500 to-red-600",
    },
    {
      id: 3,
      slug: "spettacoli",
      name: "Spettacoli",
      icon: Drama,
      gradient: "from-violet-600 to-fuchsia-600",
    },
    {
      id: 4,
      slug: "sport-competizioni",
      name: "Sport e competizioni",
      icon: Dumbbell,
      gradient: "from-emerald-500 to-green-700",
    },
    {
      id: 5,
      slug: "fiere-mercatini",
      name: "Fiere e mercatini",
      icon: ShoppingBag,
      gradient: "from-amber-500 to-orange-600",
    },
    {
      id: 6,
      slug: "arte-cultura",
      name: "Arte e cultura",
      icon: Palette,
      gradient: "from-cyan-500 to-sky-700",
    },
    {
      id: 7,
      slug: "workshop-corsi",
      name: "Workshop e corsi",
      icon: GraduationCap,
      gradient: "from-slate-500 to-blue-700",
    },
    {
      id: 8,
      slug: "celebrazioni",
      name: "Celebrazioni",
      icon: CelebrazioniIcon,
      gradient: "from-green-600 to-lime-600",
    },
    {
      id: 9,
      slug: "food-drink",
      name: "Food & Drink",
      icon: Utensils,
      gradient: "from-rose-500 to-orange-600",
    },
    {
      id: 10,
      slug: "famiglie-bambini",
      name: "Famiglie e bambini",
      icon: Baby,
      gradient: "from-sky-500 to-blue-600",
    },
    {
      id: 11,
      slug: "benessere",
      name: "Benessere",
      icon: Sparkles,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      id: 12,
      slug: "business-networking",
      name: "Business e networking",
      icon: BriefcaseBusiness,
      gradient: "from-slate-700 to-slate-900",
    },
  ];