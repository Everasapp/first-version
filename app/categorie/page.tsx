import { redirect } from "next/navigation";
import { LEARNING_PATH } from "@/src/lib/learning-courses";

export default function CategoriesPage() {
  redirect(LEARNING_PATH);
}
