'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Play, Pause, SkipForward, SkipBack, Server, Smartphone, Layout, Users, Fish, Zap, Code, Terminal, HelpCircle, Calendar, Heart, Music, Volume2, BarChart2, Clock, Cpu, Layers, ArrowLeft, Lock } from 'lucide-react';

interface Song {
    id: string;
    title: string;
    artist: string;
    lyric: string;
    url: string;
}

const App = () => {
    const router = useRouter();
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentSong, setCurrentSong] = useState<Song | null>(null);
    const [activeSection, setActiveSection] = useState('intro');
    const [progress, setProgress] = useState(0);
    const [hasInteracted, setHasInteracted] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Initialize Audio only on client-side
    useEffect(() => {
        if (typeof window !== 'undefined') {
            audioRef.current = new Audio();
        }
    }, []);

    // Database Lagu Hindia (Placeholder URLs)
    const songs: Record<string, Song> = {
        intro: {
            id: 'intro',
            title: "Berdansalah",
            artist: "Hindia",
            lyric: "Perjalanan yang jauh, kau bangun untuk terjatuh...",
            url: "/music/berdansa.mp3"
        },
        stats: {
            id: 'stats',
            title: "Mata Air",
            artist: "Hindia",
            lyric: "Menjadi mata air, mata air untuk sekelilingmu...",
            url: "/music/mataair.mp3"
        },
        genre: {
            id: 'genre',
            title: "Apapun Yang Terjadi",
            artist: "Hindia",
            lyric: "Apapun yang terjadi, ku kan selalu ada untukmu...",
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3"
        },
        top5: {
            id: 'top5',
            title: "Berdansalah, Karir Ini Tidak Ada Artinya",
            artist: "Hindia",
            lyric: "Kita semua gagal, angkat gelasmu kawan...",
            url: "/music/berdansa1.mp3"
        },
        obsession: {
            id: 'obsession',
            title: "Secukupnya",
            artist: "Hindia",
            lyric: "Kapan terakhir kali kamu dapat tertidur tenang?",
            url: "/music/secukupnya.mp3"
        },
        unexpected: {
            id: 'unexpected',
            title: "Kita Kesana",
            artist: "Hindia",
            lyric: "Mari bicara tentang semua hal yang tak penting...",
            url: "/music/kesana.mp3"
        },
        style: {
            id: 'style',
            title: "Tarot",
            artist: "Feast",
            lyric: "Cukup sudah, kau lelah...",
            url: "/music/tarot.mp3"
        },
        timeline: {
            id: 'timeline',
            title: "Terbuang Dalam Waktu",
            artist: "Barasuara",
            lyric: "Menyesal tak kusampaikan, cinta monyetku ke Kanya...",
            url: "/music/terbuang.mp3"
        }
    };

    // Intersection Observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { threshold: 0.5 }
        );

        Object.keys(songs).forEach((id) => {
            const element = document.getElementById(id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, []);

    // Auto-Play Logic
    useEffect(() => {
        if (songs[activeSection]) {
            const targetSong = songs[activeSection];
            if (currentSong?.id !== targetSong.id) {
                setCurrentSong(targetSong);
                if (hasInteracted) setIsPlaying(true);
            }
        }
    }, [activeSection, hasInteracted]);

    // Audio Handler
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return; // Early return if audio not initialized

        const handleEnded = () => setIsPlaying(false);
        const handleTimeUpdate = () => {
            if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100);
        };

        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('timeupdate', handleTimeUpdate);

        if (currentSong) {
            if (audio.src !== currentSong.url) {
                audio.src = currentSong.url;
                audio.load();
                if (isPlaying) {
                    const playPromise = audio.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(error => {
                            console.log("Autoplay blocked", error);
                            setIsPlaying(false);
                        });
                    }
                }
            } else {
                if (isPlaying) audio.play();
                else audio.pause();
            }
        }

        return () => {
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('timeupdate', handleTimeUpdate);
        };
    }, [currentSong, isPlaying]);

    const handleInteraction = () => {
        if (!hasInteracted) {
            setHasInteracted(true);
            setIsPlaying(true);
            if (!currentSong) setCurrentSong(songs['intro']);
        }
    };

    const togglePlay = () => {
        handleInteraction();
        setIsPlaying(!isPlaying);
    };

    const playSpecificSong = (songKey: string) => {
        handleInteraction();
        const song = songs[songKey];
        if (currentSong?.id === song.id) {
            setIsPlaying(!isPlaying);
        } else {
            setCurrentSong(song);
            setIsPlaying(true);
        }
    };

    const scrollTo = (id: string) => {
        handleInteraction();
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    // Navigate back to main portfolio
    const goBackToPortfolio = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-[#1db954] selection:text-black pb-32" onClick={() => !hasInteracted && handleInteraction()}>

            {/* Secret Exit Button */}
            <button
                onClick={goBackToPortfolio}
                className="fixed top-6 left-6 z-50 flex items-center gap-2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 hover:bg-white/10 hover:border-white/30 transition-all group"
            >
                <ArrowLeft size={16} className="text-gray-400 group-hover:text-white" />
                <span className="text-xs font-bold text-gray-400 group-hover:text-white uppercase tracking-wider">Back to Reality</span>
            </button>

            {/* Background Ambience */}
            <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#1db954] rounded-full blur-[120px] animate-pulse delay-1000"></div>
            </div>

            <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6">

                {/* INTRO */}
                <section id="intro" className="min-h-screen flex flex-col justify-center items-center text-center space-y-6 relative">
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-500/30 bg-red-900/20 text-red-400 text-xs font-bold tracking-widest uppercase mb-4 animate-pulse">
                        <Lock size={12} /> Secret Archive Unlocked
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-[#1db954] via-green-200 to-purple-400">
                        LIFE<br />WRAPPED
                    </h1>
                    <p className="text-xl md:text-2xl font-medium text-gray-300">Muhammad Afsar</p>

                    <div className="bg-[#2a2a2a]/50 backdrop-blur p-6 rounded-xl border border-gray-700 max-w-md w-full mt-8 transform transition-all hover:scale-105">
                        <Code className="w-8 h-8 text-purple-400 mb-4 mx-auto" />
                        <p className="text-lg font-bold">"Behind the Code..."</p>
                        <p className="text-gray-400 text-sm mt-2">
                            Selamat datang di sisi lain. Ini bukan sekadar portofolio teknis, tapi rangkuman kehidupan nyata saat saya membangun semua itu.
                        </p>
                    </div>

                    <button onClick={() => scrollTo('stats')} className="mt-8 bg-white text-black hover:bg-[#1db954] transition-all font-bold py-4 px-8 rounded-full shadow-xl flex items-center gap-2 group">
                        {hasInteracted ? "Reveal the Secrets" : "Unlock Audio Experience"}
                        <SkipForward size={20} fill="currentColor" className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    {!hasInteracted && <p className="text-xs text-gray-500 mt-2 animate-pulse">Tap anywhere to enable sound</p>}
                </section>

                {/* NEW: STATS SECTION */}
                <section id="stats" className="min-h-screen py-20 flex flex-col justify-center relative">
                    <SectionSongBadge song={songs.stats} isPlaying={isPlaying && currentSong?.id === 'stats'} />

                    <h2 className="text-4xl font-bold mb-10 text-[#1db954]">Life In Numbers</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <StatBox icon={<Terminal size={24} />} value="2,543" label="Total Prompts" color="bg-purple-600" />
                        <StatBox icon={<Code size={24} />} value="45k+" label="Lines of Code" color="bg-blue-600" />
                        <StatBox icon={<Clock size={24} />} value="02:00" label="Peak Creative Hour" color="bg-orange-600" sub="Night Owl 🦉" />
                        <StatBox icon={<Fish size={24} />} value="15%" label="Discussing Lele" color="bg-green-600" />
                    </div>
                    <div className="mt-6 bg-[#2a2a2a] p-6 rounded-xl border border-gray-700 text-center">
                        <p className="text-gray-400 text-sm uppercase mb-2">Hari Paling Aktif</p>
                        <p className="text-3xl font-black text-white">SELASA</p>
                        <p className="text-xs text-gray-500 mt-1">Hari favorit untuk *deploy* (dan *debug* error).</p>
                    </div>
                </section>

                {/* NEW: GENRE MIX (TECH SANDWICH) */}
                <section id="genre" className="min-h-screen py-20 flex flex-col justify-center items-center relative">
                    <SectionSongBadge song={songs.genre} isPlaying={isPlaying && currentSong?.id === 'genre'} />

                    <h2 className="text-3xl font-bold mb-8 text-center">The "Life" Stack</h2>
                    <div className="relative w-full max-w-sm flex flex-col items-center space-y-2">
                        <GenreLayer color="bg-[#00ADD8]" text="Golang Backend" height="h-24" width="w-full" icon="🍞" />
                        <GenreLayer color="bg-[#3DDC84]" text="Android Kotlin" height="h-16" width="w-[90%]" icon="🥬" />
                        <GenreLayer color="bg-[#2496ED]" text="Docker & K3s" height="h-12" width="w-[85%]" icon="🥩" />
                        <GenreLayer color="bg-yellow-600" text="Instalasi Listrik" height="h-10" width="w-[80%]" icon="🧀" />
                        <GenreLayer color="bg-purple-500" text="Event Organizing" height="h-8" width="w-[75%]" icon="🍅" />
                    </div>
                    <p className="mt-8 text-center text-gray-400 max-w-md">
                        Campuran rasa yang unik. Dominan di *Backend*, dengan *topping* hobi bapak-bapak yang renyah.
                    </p>
                </section>

                {/* TOP 5 */}
                <section id="top5" className="min-h-screen py-20 flex flex-col justify-center relative">
                    <SectionSongBadge song={songs.top5} isPlaying={isPlaying && currentSong?.id === 'top5'} />

                    <h2 className="text-4xl font-bold mb-10 text-[#1db954]">Top 5 Focus Areas</h2>
                    <div className="space-y-4">
                        <TopicCard rank={1} title="Backend Engineering" desc="Golang, Fiber, Supabase" icon={<Server size={24} />} color="bg-purple-600" />
                        <TopicCard rank={2} title="Android Development" desc="Kotlin, Jetpack Compose" icon={<Smartphone size={24} />} color="bg-blue-600" />
                        <TopicCard rank={3} title="Architecture & PM" desc="Campus Lost & Found, EatRight" icon={<Layout size={24} />} color="bg-pink-600" />
                        <TopicCard rank={4} title="Organisasi & Event" desc="INPUT 2025, Panitia" icon={<Users size={24} />} color="bg-orange-600" />
                        <TopicCard rank={5} title="Hobi Bapak-Bapak" desc="Mancing, Listrik, Ternak" icon={<Fish size={24} />} color="bg-green-600" />
                    </div>
                </section>

                {/* OBSESSION */}
                <section id="obsession" className="min-h-screen py-20 flex flex-col justify-center items-center text-center relative">
                    <SectionSongBadge song={songs.obsession} isPlaying={isPlaying && currentSong?.id === 'obsession'} />

                    <div className="w-full h-96 relative bg-gradient-to-tr from-orange-500 to-yellow-500 rounded-3xl p-8 flex flex-col justify-between overflow-hidden shadow-2xl transform rotate-1 hover:rotate-0 transition-all duration-500">
                        <Terminal className="absolute top-[-20px] right-[-20px] w-64 h-64 text-white opacity-10" />
                        <div>
                            <p className="text-black font-bold tracking-widest uppercase mb-2">Obsesi Terbesar</p>
                            <h3 className="text-5xl md:text-6xl font-black text-black leading-tight">DEVOPS<br />& DEPLOY</h3>
                        </div>
                        <div className="bg-black/20 backdrop-blur-md rounded-xl p-4 text-left border border-white/20">
                            <p className="text-white font-medium italic">"Kapan terakhir kali kamu dapat tertidur tenang?"</p>
                            <p className="text-sm text-white/80 mt-2">Mungkin saat server Jenkins akhirnya hijau semua.</p>
                            <div className="mt-4 flex items-center gap-2">
                                <div className="bg-white text-black text-xs font-bold px-2 py-1 rounded">STATUS</div>
                                <span className="text-white font-bold">The DevOps Evangelist</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* UNEXPECTED */}
                <section id="unexpected" className="min-h-screen py-20 flex flex-col justify-center relative">
                    <SectionSongBadge song={songs.unexpected} isPlaying={isPlaying && currentSong?.id === 'unexpected'} />

                    <h2 className="text-3xl font-bold mb-8 flex items-center gap-3"><HelpCircle className="text-[#1db954]" /> Pertanyaan Tak Terduga</h2>
                    <div className="space-y-6">
                        <ChatBubble text="Kabel ukuran berapa yang cocok untuk instalasi listrik rumah?" sub="Agustus • Random Thoughts" align="right" />
                        <ChatBubble text="Analisis bisnis kolam pemancingan vs ternak sapi." sub="Desember • Business Mindset" align="right" />
                        <ChatBubble text="Filosofi makna warna slayer panitia." sub="Juni • Deep Talk" align="right" />
                    </div>
                </section>

                {/* STYLE */}
                <section id="style" className="min-h-screen py-20 flex flex-col justify-center items-center relative">
                    <SectionSongBadge song={songs.style} isPlaying={isPlaying && currentSong?.id === 'style'} />

                    <div className="bg-gradient-to-b from-[#1db954] to-black p-[2px] rounded-full w-48 h-48 mb-6 flex items-center justify-center animate-spin-slow">
                        <div className="bg-black w-full h-full rounded-full flex items-center justify-center border-4 border-black"><Zap size={64} className="text-[#1db954]" /></div>
                    </div>
                    <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">The Visionary Builder</h2>
                    <p className="text-gray-400 text-center max-w-md mb-6">"Membasuh" lelah coding dengan mancing.</p>
                    <div className="text-center text-gray-300 max-w-md space-y-4 w-full">
                        <ul className="text-left space-y-2 bg-[#222] p-6 rounded-xl border border-gray-800">
                            <li className="flex gap-2"><span>💡</span> Ide Aplikasi (Jastip/Lost&Found)</li>
                            <li className="flex gap-2"><span>🏗️</span> Minta Struktur Backend (Golang)</li>
                            <li className="flex gap-2"><span>🚀</span> Deploy ke VPS</li>
                            <li className="flex gap-2"><span>🎣</span> Break buat mancing</li>
                        </ul>
                    </div>
                </section>

                {/* TIMELINE */}
                <section id="timeline" className="py-20 relative">
                    <SectionSongBadge song={songs.timeline} isPlaying={isPlaying && currentSong?.id === 'timeline'} />

                    <h2 className="text-3xl font-bold mb-10">2025 Timeline: Rumah ke Rumah</h2>
                    <div className="border-l-2 border-gray-800 ml-4 space-y-8 pl-8 pb-20">
                        <TimelineItem month="Agustus" title="Fase Tukang & Pilot" desc="Airline Manager, Home Wiring." emoji="🛠️" />
                        <TimelineItem month="Oktober" title="Akademik Hardcore" desc="Android, Unity, Digital Forensics." emoji="📚" />
                        <TimelineItem month="November" title="PEAK PERFORMANCE" desc="Titip.in, EatRight, Magang BSI." emoji="🚀" highlight />
                        <TimelineItem month="Desember" title="Cool Down" desc="Backend Golang & Bisnis Ikan." emoji="🧘" />
                    </div>
                </section>

                <section className="h-[50vh] flex flex-col items-center justify-center text-center space-y-6">
                    <h2 className="text-4xl font-bold">Terima Kasih 2025</h2>
                    <button className="bg-[#1db954] text-black font-bold py-3 px-8 rounded-full hover:scale-105 transition-transform">
                        Generate Resolusi 2026
                    </button>
                </section>

            </div>

            {/* STICKY SMART PLAYER */}
            <div className="fixed bottom-4 left-4 right-4 bg-black/95 backdrop-blur-xl border border-gray-800 rounded-2xl p-4 shadow-2xl max-w-2xl mx-auto z-50 transition-all duration-300">
                <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${isPlaying ? 'bg-[#1db954] text-black' : 'bg-gray-800 text-gray-400'}`}>
                        <Music size={24} className={isPlaying ? 'animate-bounce' : ''} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-xs text-[#1db954] font-bold uppercase tracking-wider mb-0.5">Now Playing</div>
                        <div className="text-white font-bold truncate">{currentSong?.title || songs.intro.title}</div>
                        <div className="text-gray-400 text-xs truncate">{currentSong?.artist || songs.intro.artist}</div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={togglePlay} className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform text-black">
                            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                        </button>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800 rounded-b-2xl overflow-hidden">
                    <div className="h-full bg-[#1db954] transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>
            </div>

        </div>
    );
};

// Sub-components
const StatBox = ({ icon, value, label, color, sub }: { icon: React.ReactNode; value: string; label: string; color: string; sub?: string }) => (
    <div className="bg-[#181818] p-4 rounded-xl border border-gray-800 hover:bg-[#222] transition-colors">
        <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center text-white mb-3`}>{icon}</div>
        <div className="text-2xl font-bold text-white mb-1">{value}</div>
        <div className="text-sm text-gray-400">{label}</div>
        {sub && <div className="text-xs text-[#1db954] font-bold mt-2">{sub}</div>}
    </div>
);

const GenreLayer = ({ color, text, height, width, icon }: { color: string; text: string; height: string; width: string; icon: string }) => (
    <div className={`${color} ${height} ${width} rounded-xl flex items-center justify-between px-6 shadow-lg transform transition-transform hover:scale-105 mb-[-10px] z-10 border border-black/10`}>
        <span className="font-bold text-black/80">{text}</span>
        <span className="text-xl">{icon}</span>
    </div>
);

const SectionSongBadge = ({ song, isPlaying }: { song: Song; isPlaying: boolean }) => (
    <div className={`absolute top-0 right-0 mt-4 mr-0 sm:mr-4 flex items-center gap-3 px-4 py-2 rounded-full transition-all duration-300 border backdrop-blur-md z-20 ${isPlaying ? 'bg-[#1db954]/20 border-[#1db954] text-[#1db954]' : 'bg-white/5 border-white/10 text-gray-400 opacity-50'}`}>
        <div className="text-right hidden sm:block">
            <div className="text-[10px] uppercase tracking-wider font-bold opacity-70">Soundtrack</div>
            <div className="text-xs font-bold truncate max-w-[150px]">{song.title}</div>
        </div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isPlaying ? 'bg-[#1db954] text-black' : 'bg-white/10'}`}>
            {isPlaying ? <Volume2 size={14} /> : <Music size={14} />}
        </div>
    </div>
);

const TopicCard = ({ rank, title, desc, icon, color }: { rank: number; title: string; desc: string; icon: React.ReactNode; color: string }) => (
    <div className="group bg-[#181818] hover:bg-[#282828] transition-colors p-4 rounded-lg flex items-center gap-4 border border-transparent hover:border-gray-700">
        <div className="text-xl font-bold text-gray-500 w-6 text-center">{rank}</div>
        <div className={`p-3 rounded-md ${color} text-white`}>{icon}</div>
        <div className="flex-1">
            <h3 className="font-bold text-lg text-white group-hover:text-[#1db954] transition-colors">{title}</h3>
            <p className="text-sm text-gray-400">{desc}</p>
        </div>
    </div>
);

const ChatBubble = ({ text, sub, align }: { text: string; sub: string; align: string }) => (
    <div className={`flex flex-col ${align === 'right' ? 'items-end' : 'items-start'}`}>
        <div className={`bg-[#1db954] text-black font-medium p-4 rounded-2xl max-w-[85%] ${align === 'right' ? 'rounded-tr-none' : 'rounded-tl-none'}`}>
            {text}
        </div>
        <div className="text-xs text-gray-500 mt-2 px-1">{sub}</div>
    </div>
);

const TimelineItem = ({ month, title, desc, emoji, highlight }: { month: string; title: string; desc: string; emoji: string; highlight?: boolean }) => (
    <div className="relative">
        <div className={`absolute -left-[42px] top-0 w-8 h-8 rounded-full flex items-center justify-center border-4 border-black ${highlight ? 'bg-[#1db954]' : 'bg-gray-700'}`}>
            <span className="text-xs">{emoji}</span>
        </div>
        <div className="mb-1 text-sm font-bold text-gray-500 uppercase tracking-wider">{month}</div>
        <div className={`p-4 rounded-xl ${highlight ? 'bg-gradient-to-r from-gray-800 to-gray-900 border border-[#1db954]' : 'bg-[#181818] border border-gray-800'}`}>
            <h3 className={`text-lg font-bold mb-1 ${highlight ? 'text-[#1db954]' : 'text-white'}`}>{title}</h3>
            <p className="text-gray-400 text-sm">{desc}</p>
        </div>
    </div>
);

export default App;