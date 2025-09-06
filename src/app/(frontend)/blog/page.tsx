// src/app/(frontend)/blog/page.tsx
import BlogGrid from './BlogGrid';
import Footer from '../components/Footer';
export default async function BlogList() {
  let posts = [];

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/blogs?where[status][equals]=published&sort=createdAt`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) throw new Error('Failed to fetch blogs');

    const json = await res.json();
    posts = json.docs || [];
  } catch (error) {
    console.error('Fetch blogs error:', error);
    posts = [];
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-80 -right-80 w-96 h-96 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full opacity-50 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-80 -left-80 w-96 h-96 bg-gradient-to-tr from-pink-200 to-indigo-200 rounded-full opacity-50 blur-3xl animate-bounce delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-gradient-to-r from-cyan-200 to-blue-200 rounded-full opacity-30 blur-2xl animate-spin" style={{ animationDuration: '20s' }}></div>
      </div>

      {/* Hero Section */}
      <div className="relative py-24 text-center">
        <h1 className="text-7xl md:text-6xl p-2.5 font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 tracking-tight">
          Learn & Earn Blog
          </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Discover insightful articles, tips, and guides to boost your knowledge and earn rewards.
        </p>
        {/* <div className="flex flex-wrap justify-center gap-4">
          <span className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">Learning</span>
          <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">Quizzes</span>
          <span className="px-4 py-2 bg-pink-100 text-pink-800 rounded-full text-sm font-medium">Earnings</span>
          <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">Tips</span>
        </div> */}
      </div>

      {/* Blog Posts (Client Component) */}
      <div className='-mt-8'>
      <BlogGrid  posts={posts} />
      </div>
<Footer />
    </div>
  );
}