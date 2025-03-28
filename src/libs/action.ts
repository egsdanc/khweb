 // src/lib/actions.ts
'use server'

export interface Blog {
  image: string;
  id: number;
  title: string;
  content: string;
  cover_image: string;
  created_at: string;
}

export async function fetchBlogs(): Promise<Blog[]> {
    try {
      const response = await fetch(`${process.env.BASE_URL}/api/get-blog`, {
        cache: 'no-store',
        next: { revalidate: 60 }
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch blogs');
      }
  
      const data = await response.json();
      return data.blogs || []; // `blogs` dizisini döndür
  
    } catch (error) {
      console.error('Error fetching blogs:', error);
      return [];
    }
  }
  



// Utility function for date formatting


// Fetch function
export async function fetchBlogById(id: string) {
    try {
        const response = await fetch(`${process.env.BASE_URL}/api/get-blog-detail/${id}`, {
          cache: 'no-store',
          next: { revalidate: 60 }
        });
    
        if (!response.ok) {
          return null;
        }
    
        const data = await response.json();
        return data.blog;
      } catch (error) {
        console.error('Error fetching blog:', error);
        return null;
      }
}