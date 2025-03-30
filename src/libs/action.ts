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
      method: "GET",
      headers: { "Content-Type": "application/json" },
   //   cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error('Failed to fetch blogs');
    }
    
    const data = await response.json();
    console.log("Fetched blogs:", data); // Log after parsing JSON
    
    return data.blogs || []; // Return the blogs array
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
          method: "GET",
          headers: { "Content-Type": "application/json" },  
   //       cache: 'no-store'

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
