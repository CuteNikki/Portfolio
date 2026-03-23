import prisma from '@/lib/prisma';

export default async function BlogPage() {
  const posts = await prisma.post.findMany();

  return (
    <div>
      <h1>Blog</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
}
