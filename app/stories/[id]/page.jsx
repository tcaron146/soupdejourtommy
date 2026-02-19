import StoryDetail from './StoryDetail';

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

async function fetchStory(id) {
  try {
    const res = await fetch(
      `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/stories/${id}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const data = await fetchStory(params.id);
  if (!data?.fields) return { title: 'Chronicle — SoupDeJour Tommy' };

  const title = data.fields.title?.stringValue || 'Chronicle';
  const content = data.fields.content?.stringValue || '';
  const description = content.replace(/\s+/g, ' ').trim().slice(0, 155);
  const mediaValues = data.fields.media?.arrayValue?.values || [];
  const image = mediaValues
    .find(m => m.mapValue?.fields?.type?.stringValue === 'image')
    ?.mapValue?.fields?.url?.stringValue;

  return {
    title: `${title} — SoupDeJour Tommy`,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      siteName: 'SoupDeJour Tommy',
      ...(image && { images: [{ url: image, width: 1200, height: 630 }] }),
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
      description,
      ...(image && { images: [image] }),
    },
  };
}

export default function StoryPage() {
  return <StoryDetail />;
}
