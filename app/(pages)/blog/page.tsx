import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Blog, fetchBlogs } from '~/libs/action';

export const metadata: Metadata = {
  title: 'Blog',
};

const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(dateString));
};

export default async function BlogPage() {
  const posts = await fetchBlogs();
  return (
    <section className="mx-auto max-w-3xl px-6 py-12 sm:px-6 sm:py-16 lg:py-20">
      <header>
        <h1 className="leading-tighter font-heading mb-8 text-center text-4xl font-bold tracking-tighter md:mb-16 md:text-5xl">
          Blog
        </h1>
      </header>
      <div className="grid grid-cols-1 gap-6 p-4 md:p-0 lg:grid-cols-2">
        {posts.map((post: Blog) => (
          <div 
            key={post.id} 
            className="flex flex-col overflow-hidden rounded-xl border border-gray-200 shadow-lg"
          >
            <Link href={`/blog/${post.id}`} className="block">
              <div className="relative w-full h-[250px] bg-gray-200"> {/* Added bg-gray-200 for placeholder */}
                {/* Loading spinner */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
                
                <Image 
                  fill
                  style={{ objectFit: 'cover' }}
                  alt={post.title} 
                  src={post.cover_image 
                    ? `${process.env.ADMIN_PANEL_URL}/${post.cover_image}` 
                    : "https://kilometrehacker.com/wp-content/uploads/2025/01/AdobeStock_116699042-2048x1393.jpeg"
                  }
                  className="absolute inset-0 w-full h-full"
                  priority={posts.indexOf(post) < 4} // Prioritize loading first 4 images
                  placeholder="blur" 
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAEDgJhQUqCMgAAAABJRU5ErkJggg=="
                />
              </div>
              <div className="p-4 pb-6">
                <h2 className="font-bold line-clamp-2 min-h-[60px]">{post.title}</h2>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}