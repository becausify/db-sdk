import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { getResource, resources } from "@/app/_lib/resources";
import { Article } from "../_components/article";
import { resourceContent } from "../_content";

type Params = { slug: string };

export function generateStaticParams() {
  return resources.map((resource) => ({ slug: resource.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const resource = getResource(slug);
  if (!resource) return {};

  return {
    title: resource.title,
    description: resource.description,
  };
}

export default async function ResourcePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const resource = getResource(slug);

  if (!resource) {
    notFound();
  }

  if (resource.href) {
    redirect(resource.href);
  }

  const content = resourceContent[slug];
  if (!content) {
    notFound();
  }

  return <Article resource={resource}>{content}</Article>;
}
