 // app/blog/[id]/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchBlogById } from '~/libs/action';

// Utility function for date formatting
const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateString));
};

export default async function BlogDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const blog = await fetchBlogById(params.id);

  if (!blog) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <article className="shadow-lg rounded-lg overflow-hidden bg-white dark:bg-gray-900">
        {/* Cover Image */}
        <h1 className="text-3xl font-bold mb-4 text-center text-black dark:text-white">
          {blog.title}
        </h1>
        <div className="relative w-full h-96 bg-gray-200"> {/* Added bg-gray-200 for placeholder */}
          {/* Loading spinner */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
          
          <Image
            src={blog.cover_image ? `${process.env.ADMIN_PANEL_URL}/${blog.cover_image}` : "https://kilometrehacker.com/wp-content/uploads/2025/01/AdobeStock_116699042-2048x1393.jpeg"}
            alt={blog.title}
            fill
            className="object-cover"
            priority
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAEDgJhQUqCMgAAAABJRU5ErkJggg=="
          />
        </div>

        {/* Blog Content */}
        <div className="p-8">
          {/* Meta Information */}
          <div className="flex items-center mb-6">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Yayınlanma Tarihi: {formatDate(blog.created_at)}
            </span>
          </div>

          {/* Content */}
          <div
            className="prose prose-invert max-w-none text-gray-900 dark:text-gray-100 
            prose-headings:text-black dark:prose-headings:text-white
            prose-p:text-gray-800 dark:prose-p:text-gray-200
            prose-a:text-blue-600 dark:prose-a:text-blue-400
            prose-strong:text-gray-900 dark:prose-strong:text-white
            prose-code:text-gray-800 dark:prose-code:text-gray-200
            prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Back to Blog List */}
          <div className="mt-8 border-t pt-4">
            <Link 
              href="/blog" 
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              ← Tüm Blog Yazılarına Dön
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}

// Metadata generation
export async function generateMetadata({ params }: { params: { id: string } }) {
  const blog = await fetchBlogById(params.id);

  if (!blog) {
    return {
      title: 'Blog Bulunamadı',
      description: 'İstenen blog yazısı bulunamadı',
    };
  }

  return {
    title: blog.title,
    description: blog.meta_description || blog.title,
  };
}