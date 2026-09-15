import { redirect } from "next/navigation";

// Writing Beyond Prisons is not a standalone program — it is a sub-project of
// The Hundred Stories Project. Redirect traffic there.
export default function WritingPage() {
  redirect("/programs/hundred-stories");
}
