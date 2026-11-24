import { notFound } from "next/navigation";
import TopicPage from "@/components/TopicPage";
import { TOPICS } from "@/lib/config";

export function generateStaticParams() {
  return Object.keys(TOPICS).map((topic) => ({ topic }));
}

export const dynamicParams = false;

export default async function Page({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params;
  const t = TOPICS[topic];
  if (!t) notFound();
  return <TopicPage topic={t} />;
}
