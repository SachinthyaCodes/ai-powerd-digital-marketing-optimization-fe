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

interface Props {
  params: { tenantId: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: 'Smart Assistant',
    description: `Chat with the AI assistant for store ${params.tenantId}`,
  };
}

export default function PublicChatPage({ params }: Props) {
  return <PublicChatPageClient tenantId={params.tenantId} />;
}
