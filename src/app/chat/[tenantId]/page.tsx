/**
 * Public customer-facing chat page.
 *
 * Route: /chat/[tenantId]
 *
 * - No authentication required — accessible by any customer.
 * - Embeds the PublicChatWidget which calls POST /api/chat with the tenantId.
 * - The tenantId is fetched client-side to also resolve the store display name.
 *
 * Embed HTML shown in the admin dashboard so admins can link customers here.
 */

import type { Metadata } from 'next';
import PublicChatPageClient from './PublicChatPageClient';

// Next.js 15+: params is a Promise and must be awaited before accessing properties.
interface Props {
  params: Promise<{ tenantId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tenantId } = await params;
  return {
    title: 'Smart Assistant',
    description: `Chat with the AI assistant for store ${tenantId}`,
  };
}

export default async function PublicChatPage({ params }: Props) {
  const { tenantId } = await params;
  return <PublicChatPageClient tenantId={tenantId} />;
}
