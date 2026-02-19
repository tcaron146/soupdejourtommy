import ReviewDetail from './ReviewDetail';

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

async function fetchReview(id) {
  try {
    const res = await fetch(
      `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/reviews/${id}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const data = await fetchReview(params.id);
  if (!data?.fields) return { title: 'Review — SoupDeJour Tommy' };

  const name = data.fields.businessName?.stringValue || 'Review';
  const comment = data.fields.comment?.stringValue || '';
  const description = comment.replace(/\s+/g, ' ').trim().slice(0, 155);
  const rating = data.fields.rating?.integerValue || data.fields.rating?.doubleValue || '';
  const stars = rating ? `${'★'.repeat(Number(rating))} · ` : '';
  const mediaValues = data.fields.media?.arrayValue?.values || [];
  const image = mediaValues
    .find(m => m.mapValue?.fields?.type?.stringValue === 'image')
    ?.mapValue?.fields?.url?.stringValue;

  return {
    title: `${name} — SoupDeJour Tommy`,
    description: `${stars}${description}`,
    openGraph: {
      title: name,
      description: `${stars}${description}`,
      type: 'article',
      siteName: 'SoupDeJour Tommy',
      ...(image && { images: [{ url: image, width: 1200, height: 630 }] }),
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title: name,
      description: `${stars}${description}`,
      ...(image && { images: [image] }),
    },
  };
}

export default function ReviewPage() {
  return <ReviewDetail />;
}
