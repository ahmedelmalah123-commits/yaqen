import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Headphones, Radio, Scroll, Heart, Search } from 'lucide-react';
import { useStoryStore } from '../store/useStoryStore';

export default function LandingPage() {
  const { stories, fetchStories, isLoading } = useStoryStore();

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  return (
    <div className="min-h-screen bg-secondary dark:bg-[#0A1A14] overflow-x-hidden font-tajawal">
      {/* Hero Section */}
      <section className="relative w-full min-h-[70vh] flex items-center justify-center p-4">
        {/* Abstract shape background */}
        <div className="absolute inset-0 z-0 bg-gradient-to-tr from-primary to-primary/80 dark:from-[#0f1c2c] dark:to-black opacity-90 overflow-hidden">
          <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] bg-accent rounded-full blur-[120px] mix-blend-multiply opacity-40"></div>
          <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] bg-white rounded-full blur-[100px] mix-blend-overlay opacity-20"></div>
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center gap-8">
          <h1 className="text-4xl md:text-7xl font-bold text-white text-neon-gold drop-shadow-lg leading-tight p-2">
            ابدأ رحلتك في<br />عالم السيرة
          </h1>
          <p className="text-lg md:text-2xl text-white/90 font-amiri max-w-2xl">
            منصة اليقين تأخذك في رحلة إيمانية تفاعلية لتعيش القصص كأنك تراها
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto px-4">
            <Link to="/story/story-1" className="w-full sm:w-auto px-8 py-4 bg-accent text-white font-bold rounded-full shadow-xl hover:scale-105 transition-transform flex items-center justify-center gap-2 text-lg">
              <BookOpen size={24} />
              ابدأ القراءة
            </Link>
            <Link to="/story/story-2" className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 font-bold rounded-full shadow-xl hover:bg-white/20 transition flex items-center justify-center gap-2 text-lg">
              <Headphones size={24} />
              استمع الآن
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Stories */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-2xl md:text-4xl font-bold text-primary dark:text-accent font-tajawal">
            قصص مختارة
          </h2>
          <Link to="/stories" className="text-accent underline font-semibold">عرض الكل</Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.slice(0, 3).map((story) => (
              <Link 
                to={`/story/${story.id}`} 
                key={story.id}
                className="group relative bg-white dark:bg-[#0f1c2c] rounded-3xl overflow-hidden shadow-lg border border-black/5 dark:border-white/5 hover:-translate-y-2 transition-all duration-300"
              >
                <div className="aspect-[4/3] w-full overflow-hidden">
                  {story.images && story.images[0] ? (
                    <img 
                      src={story.images[0]} 
                      alt={story.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 dark:bg-black/40 flex items-center justify-center">
                      <BookOpen size={40} className="text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <span className="text-xs font-bold bg-accent/20 text-accent px-3 py-1 rounded-full">{story.category}</span>
                  <h3 className="text-xl font-bold mt-4 text-primary dark:text-white group-hover:text-accent transition">{story.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Existing Features Hub */}
      <section className="py-16 px-4 md:px-8 bg-gray-50 dark:bg-black/20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold text-center text-primary dark:text-accent mb-12">
            مكتبة اليقين الشاملة
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'القرآن الكريم', icon: <BookOpen />, path: '/quran', color: 'from-emerald-500 to-teal-600' },
              { title: 'الراديو', icon: <Radio />, path: '/radio', color: 'from-blue-500 to-indigo-600' },
              { title: 'نادرة التلاوات', icon: <Scroll />, path: '/reciters', color: 'from-accent to-yellow-600' },
              { title: 'المفضلة', icon: <Heart />, path: '/dashboard', color: 'from-rose-500 to-pink-600' },
            ].map((item, idx) => (
              <Link 
                to={item.path} 
                key={idx}
                className="relative overflow-hidden rounded-2xl p-6 shadow-md hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col items-center justify-center gap-4 text-white group"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-90 group-hover:opacity-100 transition`} />
                <div className="relative z-10 bg-white/20 p-4 rounded-full backdrop-blur-sm">
                  {React.cloneElement(item.icon, { size: 32 })}
                </div>
                <h3 className="relative z-10 font-bold text-xl">{item.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
