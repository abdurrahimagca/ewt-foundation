import { z } from "zod";

export const StrapiRequestBody = z.object({
  productId: z.string(),
  parentProductId: z.string().nullable(),
  isChildCanUseThisResource: z.boolean().default(true),
  productName: z.string().optional(),
  productCreatedAt: z.string().datetime().default(new Date().toISOString()),
});

export type StrapiRequestBody = z.infer<typeof StrapiRequestBody>;
export type StrapiCreateResponseBody = {
  data: {
    documentId: string;
    id: number;
    productId: string;

    isChildCanUseThisResource: null;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
  meta: unknown;
};

export type StrapiFindResponseBody = {
  data: Array<{
    documentId: string;
    id: number;
    productId: string;
    isChildCanUseThisResource: null;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  }>;
};

export type StrapiServiceResponse = {
  success: boolean;
  data: {
    documentId: string;
    strapiUrl: string;
  } | null;
  error: string | null;
};
