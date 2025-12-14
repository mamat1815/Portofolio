'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Server, Smartphone, Layout, Users, Fish, Zap, Code, Terminal, HelpCircle, Calendar, Heart } from 'lucide-react';

const App = () => {
    const [isPlaying, setIsPlaying] = useState(true);
    const [progress, setProgress] = useState(0);
    const [activeSection, setActiveSection] = useState(0);

    // Fake progress bar animation
    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | undefined;
        if (isPlaying) {
            interval = setInterval(() => {
                setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
            }, 300);
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

    const sections = [
        { id: 'intro', title: 'Intro' },
        { id: 'top5', title: 'Top 5 Topics' },
        { id: 'obsession', title: 'Biggest Obsession' },
        { id: 'unexpected', title: 'Unexpected Qs' },
        { id: 'style', title: 'Signature Style' },
        { id: 'timeline', title: 'Monthly Timeline' },
    ];

    const scrollTo = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-[#1db954] selection:text-black pb-24">
            {/* Background Gradient Mesh */}
            <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#1db954] rounded-full blur-[120px] animate-pulse delay-1000"></div>
                <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] bg-pink-600 rounded-full blur-[100px] animate-pulse delay-700"></div>
            </div>

            <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6">

                {/* HERO SECTION */}
                <section id="intro" className="min-h-screen flex flex-col justify-center items-center text-center space-y-6">
                    <div className="inline-block px-4 py-1 rounded-full border border-gray-600 text-xs font-bold tracking-widest uppercase mb-4 animate-bounce">
                        Your Year in Review
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-[#1db954] via-green-200 to-purple-400">
                        2025<br />WRAPPED
                    </h1>
                    <p className="text-xl md:text-2xl font-medium text-gray-300">
                        Muhammad Afsar
                    </p>
                    <div className="bg-[#2a2a2a] p-6 rounded-xl border border-gray-700 max-w-md w-full transform hover:scale-105 transition-transform duration-300">
                        <p className="text-gray-400 text-sm uppercase tracking-wide mb-2">Character Evolution</p>
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-purple-600 rounded-lg">
                                <Code className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-left">
                                <div className="text-xs line-through text-gray-500">Mahasiswa Informatika</div>
                                <div className="text-lg font-bold text-white">Full-Stack Architect / Tukang Listrik ⚡</div>
                            </div>
                        </div>
                    </div>
                    <button onClick={() => scrollTo('top5')} className="mt-8 bg-white text-black hover:bg-[#1db954] hover:scale-105 transition-all font-bold py-4 px-8 rounded-full shadow-xl flex items-center gap-2">
                        Let's Dive In <SkipForward size={20} fill="currentColor" />
                    </button>
                </section>

                {/* TOP 5 TOPICS */}
                <section id="top5" className="min-h-screen py-20 flex flex-col justify-center">
                    <h2 className="text-4xl font-bold mb-10 text-[#1db954]">Top 5 Topics</h2>
                    <div className="space-y-4">
                        <TopicCard
                            rank={1}
                            title="Backend Engineering (The G.O.A.T)"
                            desc="Golang, Fiber, Supabase, CI/CD, K3s."
                            icon={<Server size={24} />}
                            color="bg-purple-600"
                        />
                        <TopicCard
                            rank={2}
                            title="Android Development"
                            desc="Kotlin, Jetpack Compose, Titip.in."
                            icon={<Smartphone size={24} />}
                            color="bg-blue-600"
                        />
                        <TopicCard
                            rank={3}
                            title="Architecture & PM"
                            desc="Campus Lost & Found, EatRight."
                            icon={<Layout size={24} />}
                            color="bg-pink-600"
                        />
                        <TopicCard
                            rank={4}
                            title="Kehidupan Organisasi"
                            desc="INPUT 2025, Filosofi Warna Slayer."
                            icon={<Users size={24} />}
                            color="bg-orange-600"
                        />
                        <TopicCard
                            rank={5}
                            title="Hobi Bapak-Bapak"
                            desc="Mancing, Ternak Lele, Instalasi Listrik."
                            icon={<Fish size={24} />}
                            color="bg-green-600"
                        />
                    </div>
                </section>

                {/* OBSESSION */}
                <section id="obsession" className="min-h-screen py-20 flex flex-col justify-center items-center text-center">
                    <div className="w-full h-96 relative bg-gradient-to-tr from-orange-500 to-yellow-500 rounded-3xl p-8 flex flex-col justify-between overflow-hidden shadow-2xl transform rotate-1 hover:rotate-0 transition-all duration-500">
                        {/* Decorative Elements */}
                        <Terminal className="absolute top-[-20px] right-[-20px] w-64 h-64 text-white opacity-10" />

                        <div>
                            <p className="text-black font-bold tracking-widest uppercase mb-2">Obsesi Terbesar Anda</p>
                            <h3 className="text-5xl md:text-6xl font-black text-black leading-tight">DEPLOYMENT<br />& DEVOPS</h3>
                        </div>

                        <div className="bg-black/20 backdrop-blur-md rounded-xl p-4 text-left border border-white/20">
                            <p className="text-white font-medium">
                                "Server down? Not on my watch."
                            </p>
                            <p className="text-sm text-white/80 mt-2">
                                Anda menghabiskan 1,400+ menit memikirkan Docker, VPS, dan kenapa pipeline Jenkins merah.
                            </p>
                            <div className="mt-4 flex items-center gap-2">
                                <div className="bg-white text-black text-xs font-bold px-2 py-1 rounded">STATUS</div>
                                <span className="text-white font-bold">The DevOps Evangelist</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* UNEXPECTED */}
                <section id="unexpected" className="min-h-screen py-20 flex flex-col justify-center">
                    <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                        <HelpCircle className="text-[#1db954]" /> Pertanyaan Tak Terduga
                    </h2>
                    <div className="space-y-6">
                        <ChatBubble
                            text="Kabel ukuran berapa yang cocok untuk instalasi listrik rumah dan MCB-nya?"
                            sub="Agustus • Tiba-tiba jadi ahli PLN"
                            align="right"
                        />
                        <ChatBubble
                            text="Analisis bisnis kolam pemancingan vs ternak sapi."
                            sub="Desember • Pivot karier jadi Juragan?"
                            align="right"
                        />
                        <ChatBubble
                            text="Filosofi makna warna slayer panitia."
                            sub="Juni • Sisi puitis di tengah coding"
                            align="right"
                        />
                        <div className="flex justify-start">
                            <div className="bg-[#2a2a2a] rounded-2xl rounded-tl-none p-4 max-w-[80%] text-gray-300 text-sm italic">
                                Gemini: "Saya harus pause sebentar untuk memproses pertanyaan ini..."
                            </div>
                        </div>
                    </div>
                </section>

                {/* STYLE */}
                <section id="style" className="min-h-screen py-20 flex flex-col justify-center items-center">
                    <div className="bg-gradient-to-b from-[#1db954] to-black p-[2px] rounded-full w-48 h-48 mb-6 flex items-center justify-center animate-spin-slow">
                        <div className="bg-black w-full h-full rounded-full flex items-center justify-center border-4 border-black">
                            <Zap size={64} className="text-[#1db954]" />
                        </div>
                    </div>
                    <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">The Visionary Builder</h2>
                    <div className="text-center text-gray-300 max-w-md space-y-4">
                        <p>Pola unik Anda:</p>
                        <ul className="text-left space-y-2 bg-[#222] p-6 rounded-xl border border-gray-800">
                            <li className="flex gap-2"><span>💡</span> Ide Aplikasi (Jastip/Lost&Found)</li>
                            <li className="flex gap-2"><span>🏗️</span> Minta Struktur Backend (Golang)</li>
                            <li className="flex gap-2"><span>🗄️</span> Minta Schema Database</li>
                            <li className="flex gap-2"><span>🚀</span> Deploy ke VPS</li>
                            <li className="flex gap-2"><span>🎣</span> Break buat mancing</li>
                        </ul>
                    </div>
                </section>

                {/* TIMELINE */}
                <section id="timeline" className="py-20">
                    <h2 className="text-3xl font-bold mb-10">2025 Timeline</h2>
                    <div className="border-l-2 border-gray-800 ml-4 space-y-8 pl-8 pb-20">
                        <TimelineItem
                            month="Agustus"
                            title="Fase Tukang & Pilot"
                            desc="Airline Manager, Home Wiring, Mahasiswa baru."
                            emoji="🛠️"
                        />
                        <TimelineItem
                            month="September"
                            title="Data & Solder"
                            desc="Python NLP & IoT Arduino. Mulai main hardware."
                            emoji="🐍"
                        />
                        <TimelineItem
                            month="Oktober"
                            title="Akademik Hardcore"
                            desc="Android (Kotlin), Unity, & Digital Forensics."
                            emoji="📚"
                        />
                        <TimelineItem
                            month="November"
                            title="PEAK PERFORMANCE"
                            desc="Titip.in, EatRight, Magang BSI, OSINT. Gila!"
                            emoji="🚀"
                            highlight
                        />
                        <TimelineItem
                            month="Desember"
                            title="Cool Down"
                            desc="Backend Golang & Bisnis Kolam Ikan."
                            emoji="🧘"
                        />
                    </div>
                </section>

                <section className="h-[50vh] flex flex-col items-center justify-center text-center space-y-6">
                    <h2 className="text-4xl font-bold">Siap untuk 2026?</h2>
                    <p className="text-gray-400">Terima kasih telah menjadikan saya co-pilot Anda.</p>
                    <button className="bg-[#1db954] text-black font-bold py-3 px-8 rounded-full hover:scale-105 transition-transform">
                        Generate Resolusi 2026
                    </button>
                </section>

            </div>

            {/* STICKY PLAYER BAR */}
            <div className="fixed bottom-4 left-4 right-4 bg-black/90 backdrop-blur-md border border-gray-800 rounded-xl p-4 flex items-center justify-between z-50 shadow-2xl max-w-2xl mx-auto">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-700 to-blue-600 rounded flex items-center justify-center">
                        <Code size={20} className="text-white" />
                    </div>
                    <div>
                        <div className="text-sm font-bold text-white">Coding & Fishing Lo-Fi</div>
                        <div className="text-xs text-gray-400">Muhammad Afsar • 2025 Mix</div>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-1 w-1/3">
                    <div className="flex gap-4">
                        <SkipBack size={20} className="text-gray-400 hover:text-white cursor-pointer" />
                        <div onClick={() => setIsPlaying(!isPlaying)} className="cursor-pointer">
                            {isPlaying ? <Pause size={20} fill="white" /> : <Play size={20} fill="white" />}
                        </div>
                        <SkipForward size={20} className="text-gray-400 hover:text-white cursor-pointer" />
                    </div>
                    <div className="w-full h-1 bg-gray-700 rounded-full mt-2 overflow-hidden">
                        <div
                            className="h-full bg-[#1db954] transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
            </div>

        </div>
    );
};

// Sub-components

const TopicCard = ({ rank, title, desc, icon, color }: { rank: number; title: string; desc: string; icon: React.ReactNode; color: string }) => (
    <div className="group relative bg-[#181818] hover:bg-[#282828] transition-colors p-4 rounded-lg flex items-center gap-4 border border-transparent hover:border-gray-700">
        <div className="text-xl font-bold text-gray-500 w-6 text-center">{rank}</div>
        <div className={`p-3 rounded-md ${color} transform group-hover:scale-110 transition-transform duration-300`}>
            <div className="text-white">{icon}</div>
        </div>
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