import { auth } from "@/lib/auth/auth";
import HomeView from "@/components/home/HomeView";

export default async function Home() {
  const session = await auth();
  const isLoggedIn = Boolean(session?.user);
  const primaryHref = isLoggedIn ? "/vehicle-numerology" : "/login";

  return <HomeView isLoggedIn={isLoggedIn} primaryHref={primaryHref} />;
}
