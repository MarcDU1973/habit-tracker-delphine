import { cookies } from "next/headers"
import HabitClient from "./HabitClient"

export default async function HabitPage() {
  const cookieStore = await cookies()
  const user = cookieStore.get("user")?.value || "Gast"

  return <HabitClient user={user} />
}