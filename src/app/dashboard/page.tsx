import { getSession } from "@shared/lib/auth/auth";
import connectDB from "@shared/lib/db";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/sign-in");
  }

  await connectDB();

  return <div>{session.user.name}</div>;
}
