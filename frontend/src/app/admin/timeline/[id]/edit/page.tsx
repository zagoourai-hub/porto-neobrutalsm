import { notFound } from "next/navigation";
import { prisma } from "@/server/db";
import { TimelineForm } from "../../timeline-form";

export default async function EditTimelineItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await prisma.timelineItem.findUnique({
    where: { id },
  });

  if (!item) {
    notFound();
  }

  const initialData = {
    year: item.year,
    title: item.title,
    description: item.description,
    icon: item.icon,
    accentColor: item.accentColor,
    sortOrder: item.sortOrder,
  };

  return <TimelineForm initialData={initialData} id={id} />;
}
