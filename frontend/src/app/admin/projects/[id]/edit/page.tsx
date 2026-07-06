import { notFound } from "next/navigation";
import { prisma } from "@/server/db";
import { ProjectForm } from "../../project-form";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id },
  });

  if (!project) {
    notFound();
  }

  // Map to match type expected by ProjectForm
  const initialData = {
    title: project.title,
    slug: project.slug,
    description: project.description,
    content: project.content,
    thumbnailUrl: project.thumbnailUrl,
    category: project.category,
    tags: project.tags,
    demoUrl: project.demoUrl,
    repositoryUrl: project.repositoryUrl,
    status: project.status as "DRAFT" | "PUBLISHED" | "ARCHIVED",
    isFeatured: project.isFeatured,
    sortOrder: project.sortOrder,
  };

  return <ProjectForm initialData={initialData} id={id} />;
}
