import type { ReactNode } from "react";

import {
  ArchitectureContent,
  CoreIdeaContent,
  ProductContent,
} from "./guides";
import {
  AiGeneratedQueriesContent,
  CrossEngineContent,
  CustomerDatabasesContent,
  RuntimeRegistryContent,
} from "./patterns";
import {
  FirestoreContent,
  PostgresContent,
  ReadOnlyRoleContent,
  ReleasingContent,
} from "./references";

export const resourceContent: Record<string, ReactNode> = {
  "core-idea": <CoreIdeaContent />,
  architecture: <ArchitectureContent />,
  product: <ProductContent />,
  "customer-databases": <CustomerDatabasesContent />,
  "cross-engine": <CrossEngineContent />,
  "ai-generated-queries": <AiGeneratedQueriesContent />,
  "runtime-registry": <RuntimeRegistryContent />,
  postgres: <PostgresContent />,
  firestore: <FirestoreContent />,
  "read-only-role": <ReadOnlyRoleContent />,
  releasing: <ReleasingContent />,
};
