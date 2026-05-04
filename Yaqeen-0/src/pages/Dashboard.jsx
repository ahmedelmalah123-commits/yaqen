import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { supabase } from '../lib/supabase';
import { LogIn, LogOut, Bookmark, Activity, Mail, Sparkles, Smile, CloudRain, Heart, Compass } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

const fetchBookmarks = async (userId) => {
  const { data, error } = await supabase
    .from('bookmarks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

const Dashboard = () => {
  const { theme, user } = useAppStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [authError, setAuthError] = useState('');
  const [activeMood, setActiveMood] = useState(null);

  const { data: bookmarks = [], isLoading: loadingBookmarks } = useQuery({
    queryKey: ['bookmarks', user?.id],
    queryFn: () => fetchBookmarks(user.id),
    enabled: !!user,
  });

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAuthError('');
    
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setAuthError('تم إنشاء الحساب بنجاح! راجع بريدك الإلكتروني للتأكيد (إن لزم).');
      }
    } catch (error) {
       if (error.message.includes("Failed to fetch")) {
         setAuthError("تعذر الاتصال بالخادم. يرجى مراجعة إعدادات (Supabase) الخاصة بك.");
       } else {
         setAuthError(error.message);
       }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 font-tajawal">
        <div className={`p-8 md:p-12 w-full max-w-md rounded-3xl border shadow-2xl transition-all ${theme === 'dark' ? 'bg-[#0c1622] border-[#d6a54a]/20' : 'bg-white border-[#0f1c2c]/20'}`}>
           <div className="text-center mb-8">
             <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${theme === 'dark' ? 'bg-[#d6a54a] text-[#0c1622]' : 'bg-[#0f1c2c] text-white'}`}>
               <Mail size={32} />
             </div>
             <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-[#d6a54a]' : 'text-[#0f1c2c]'}`}>{isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}</h2>
             <p className={`mt-2 text-sm opacity-70 ${theme === 'dark' ? 'text-[#F5F5DC]' : 'text-gray-600'}`}>انضم لمنصة يقين لحفظ تلاواتك المفضلة</p>
           </div>

           <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <input type="email" placeholder="البريد الإلكتروني" value={email} onChange={e => setEmail(e.target.value)} required dir="ltr"
                 className={`w-full p-4 rounded-xl outline-none border transition-all ${theme === 'dark' ? 'bg-[#0A1A14] border-[#d6a54a]/20 focus:border-[#d6a54a] text-white' : 'bg-[#F5F5DC]/50 border-gray-200 focus:border-[#0f1c2c] text-[#0f1c2c]'}`}
                />
              </div>
              <div>
                <input type="password" placeholder="كلمة المرور" value={password} onChange={e => setPassword(e.target.value)} required dir="ltr"
                 className={`w-full p-4 rounded-xl outline-none border transition-all ${theme === 'dark' ? 'bg-[#0A1A14] border-[#d6a54a]/20 focus:border-[#d6a54a] text-white' : 'bg-[#F5F5DC]/50 border-gray-200 focus:border-[#0f1c2c] text-[#0f1c2c]'}`}
                />
              </div>

              {authError && <p className="text-sm text-red-500 font-bold text-center mt-2">{authError}</p>}

              <button type="submit" disabled={loading} className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 mt-6 transition-all ${theme === 'dark' ? 'bg-[#d6a54a] text-[#0c1622] hover:bg-white disabled:opacity-50' : 'bg-[#0f1c2c] text-white hover:bg-black disabled:opacity-50'}`}>
                {loading ? <div className="w-5 h-5 border-2 border-current border-t-transparent animate-spin rounded-full" /> : <LogIn size={20} />}
                {isLogin ? 'دخول' : 'إنشاء حساب'}
              </button>
           </form>

           <div className="mt-6 text-center">
             <button onClick={() => { setIsLogin(!isLogin); setAuthError(''); }} className={`text-sm font-bold opacity-70 hover:opacity-100 ${theme === 'dark' ? 'text-[#d6a54a]' : 'text-[#0f1c2c]'}`}>
               {isLogin ? 'لا تملك حساباً؟ أنشئ حساباً جديداً' : 'لديك حساب بالفعل؟ سجل دخولك'}
             </button>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 px-4 max-w-6xl mx-auto font-tajawal pb-32" dir="rtl">
      
      <div className={`p-8 md:p-12 rounded-[2rem] border shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 mb-10 ${theme === 'dark' ? 'bg-gradient-to-r from-[#0c1622] to-[#0A1A14] border-[#d6a54a]/20' : 'bg-white border-[#0f1c2c]/10'}`}>
         <div className="flex items-center gap-6 text-center md:text-right">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center border-4 ${theme === 'dark' ? 'bg-[#d6a54a] text-[#0c1622] border-[#d6a54a]/30' : 'bg-[#0f1c2c] text-white border-[#0f1c2c]/20'}`}>
              <span className="text-3xl font-black">{user.email.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <h1 className={`text-2xl md:text-4xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-[#0f1c2c]'}`}>أهلاً بك، {user.email.split('@')[0]}</h1>
              <p className={`opacity-70 flex items-center justify-center md:justify-start gap-2 ${theme === 'dark' ? 'text-[#F5F5DC]' : 'text-gray-600'}`}>
                 <Activity size={16} /> نشط الآن
              </p>
            </div>
         </div>
         <button onClick={logout} className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 border transition-all ${theme === 'dark' ? 'border-red-500/50 text-red-400 hover:bg-red-500/10' : 'border-red-500/30 text-red-600 hover:bg-red-50'}`}>
           <LogOut size={18} /> تسجيل الخروج
         </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className={`text-2xl font-bold mb-6 flex items-center gap-3 ${theme === 'dark' ? 'text-[#d6a54a]' : 'text-[#0f1c2c]'}`}>
            <Bookmark /> الآيات المحفوظة
          </h2>
          
          {loadingBookmarks ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-current opacity-50 text-[#d6a54a]" />
            </div>
          ) : bookmarks.length === 0 ? (
            <div className={`text-center py-16 rounded-3xl border border-dashed ${theme === 'dark' ? 'bg-[#0A1A14]/30 border-[#d6a54a]/20' : 'bg-gray-50 border-gray-200'}`}>
               <p className={`text-lg opacity-70 ${theme === 'dark' ? 'text-[#F5F5DC]' : 'text-gray-600'}`}>لم تقم بحفظ أي آية حتى الآن.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
               {bookmarks.map((b) => (
                  <Link key={b.id} to={`/surah/${b.surah_id}`} className={`p-6 rounded-2xl border transition-all block ${theme === 'dark' ? 'bg-[#0c1622]/50 border-[#d6a54a]/20 hover:border-[#d6a54a]' : 'bg-white border-[#0f1c2c]/10 hover:shadow-md'}`}>
                     <p className={`text-2xl font-amiri leading-loose mb-4 ${theme === 'dark' ? 'text-white' : 'text-[#0f1c2c]'}`}>{b.ayah_text}</p>
                     <div className={`text-sm font-bold opacity-80 flex items-center justify-between ${theme === 'dark' ? 'text-[#d6a54a]' : 'text-gray-500'}`}>
                        <span>سورة {b.surah_name} • الآية {b.ayah_num}</span>
                        <span className="text-xs border px-2 py-1 rounded-full opacity-60">متابعة القراءة</span>
                     </div>
                  </Link>
               ))}
            </div>
          )}
        </div>

        {/* Playback History */}
        <div>
           <h2 className={`text-2xl font-bold mb-6 flex items-center gap-3 ${theme === 'dark' ? 'text-[#d6a54a]' : 'text-[#0f1c2c]'}`}>
             <Activity /> سجل الاستماع الأخير
           </h2>
           {useAppStore().playbackHistory.length === 0 ? (
             <div className={`text-center py-16 rounded-3xl border border-dashed ${theme === 'dark' ? 'bg-[#0A1A14]/30 border-[#d6a54a]/20' : 'bg-gray-50 border-gray-200'}`}>
                <p className={`text-lg opacity-70 ${theme === 'dark' ? 'text-[#F5F5DC]' : 'text-gray-600'}`}>لا يوجد سجل استماع بعد.</p>
             </div>
           ) : (
             <div className="flex flex-col gap-3">
               {useAppStore().playbackHistory.map((item, idx) => (
                 <div key={idx} className={`p-4 rounded-xl border flex justify-between items-center ${theme === 'dark' ? 'bg-[#0c1622]/30 border-[#d6a54a]/10' : 'bg-white border-[#0f1c2c]/10'}`}>
                    <span className="font-bold text-lg">{item.text.replace('سُورَةُ ', 'سورة ')}</span>
                    <span className="text-sm opacity-50">آية {item.ayah + 1}</span>
                 </div>
               ))}
             </div>
           )}
        </div>
      </div>

      <div className="mb-12">
        <h2 className={`text-2xl font-bold mb-6 flex items-center gap-3 ${theme === 'dark' ? 'text-[#d6a54a]' : 'text-[#0f1c2c]'}`}>
          <Sparkles /> الموجه الذكي لحالتك الشعورية
        </h2>
        
        <div className={`p-8 rounded-[2rem] border shadow-lg ${theme === 'dark' ? 'bg-[#0A1A14]/80 border-[#d6a54a]/20' : 'bg-[#f8faf9] border-[#0f1c2c]/10'}`}>
          <p className={`text-lg mb-6 ${theme === 'dark' ? 'text-white' : 'text-[#0f1c2c]'}`}>كيف تشعر الآن؟</p>
          <div className="flex flex-wrap gap-4 mb-8">
            {[
              { id: 'anxious', label: 'قلق أو خائف', icon: <CloudRain size={18} />, surah: 67, surahName: 'الملك', desc: 'تذكرك بعظمة الخالق وحفظه.' },
              { id: 'sad', label: 'حزين أو مهموم', icon: <Heart size={18} />, surah: 94, surahName: 'الشرح', desc: 'تطمئن القلب وتبشر باليسر.' },
              { id: 'lost', label: 'تائه أو متردد', icon: <Compass size={18} />, surah: 18, surahName: 'الكهف', desc: 'نور يضيء لك الطريق.' },
              { id: 'grateful', label: 'سعيد وممتن', icon: <Smile size={18} />, surah: 55, surahName: 'الرحمن', desc: 'تذكير بنعم الله الممتدة.' }
            ].map(mood => (
              <button
                key={mood.id}
                onClick={() => setActiveMood(mood)}
                className={`px-5 py-3 rounded-full flex items-center gap-2 font-bold transition-all border
                  ${activeMood?.id === mood.id 
                    ? (theme === 'dark' ? 'bg-[#d6a54a] text-[#0c1622] border-[#d6a54a]' : 'bg-[#0f1c2c] text-white border-[#0f1c2c]') 
                    : (theme === 'dark' ? 'bg-transparent text-[#F5F5DC] border-[#d6a54a]/30 hover:border-[#d6a54a]' : 'bg-white text-[#0f1c2c] border-[#0f1c2c]/20 hover:border-[#0f1c2c]')
                  }
                `}
              >
                {mood.icon} {mood.label}
              </button>
            ))}
          </div>

          {activeMood && (
             <div className={`p-6 rounded-2xl border transition-all animate-fade-in ${theme === 'dark' ? 'bg-[#0c1622] border-[#d6a54a]/40' : 'bg-white border-[#0f1c2c]/20'}`}>
                <h3 className={`text-xl font-bold mb-3 ${theme === 'dark' ? 'text-[#d6a54a]' : 'text-[#0f1c2c]'}`}>نقترح لك سورة {activeMood.surahName}</h3>
                <p className={`mb-6 text-lg ${theme === 'dark' ? 'text-[#F5F5DC]' : 'text-gray-700'}`}>{activeMood.desc}</p>
                <Link to={`/surah/${activeMood.surah}`} className={`inline-flex px-6 py-2 rounded-xl font-bold transition-all shadow-md ${theme === 'dark' ? 'bg-[#d6a54a] text-[#0c1622] hover:bg-white' : 'bg-[#0f1c2c] text-white hover:bg-black'}`}>
                   استمع الآن للسورة
                </Link>
             </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
