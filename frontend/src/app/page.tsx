'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import ResumeSection from '@/components/sections/Resume'; // Import Komponen Baru
import { Github, ExternalLink, Code, Download } from 'lucide-react';
import api from '@/lib/api';
import { Project } from '@/types';
import { CV_DATA } from '@/data/cv'; // Import data untuk Hero

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/projects');
        setProjects(res.data);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white">
      <Navbar />
      
      <main className="pt-32">
        {/* HERO SECTION */}
        <section className="px-6 max-w-5xl mx-auto mb-20">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
            Backend Developer<br />
            <span className="text-zinc-400">& Software Engineer.</span>
          </h1>
          <p className="text-xl text-zinc-600 mb-10 max-w-2xl leading-relaxed">
            Halo, saya <span className="font-semibold text-zinc-900">{CV_DATA.about.name}</span>. 
            Seorang mahasiswa Informatika yang berfokus pada pengembangan software, IoT, dan AI dengan spesialisasi di Golang & React.
          </p>
          <div className="flex gap-4">
            <Button onClick={() => document.getElementById('projects')?.scrollIntoView({behavior: 'smooth'})}>
              Lihat Projek
            </Button>
            {/* Tombol baru untuk scroll ke Resume */}
            <Button variant="outline" onClick={() => document.getElementById('resume')?.scrollIntoView({behavior: 'smooth'})}>
              Lihat CV
            </Button>
          </div>
        </section>

        {/* NEW: RESUME / CV SECTION */}
        <ResumeSection />

        {/* PROJECTS SECTION */}
        <section id="projects" className="px-6 max-w-5xl mx-auto py-20">
          <div className="flex items-baseline justify-between mb-12 border-b border-zinc-100 pb-4">
            <h2 className="text-2xl font-bold tracking-tight">Selected Works</h2>
            <span className="text-sm text-zinc-400">{projects.length} Projects</span>
          </div>

          {loading ? (
            <div className="text-center py-20 text-zinc-400 animate-pulse">Loading projects...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {projects.map((project) => (
                <div key={project.id} className="group cursor-pointer">
                  <div className="aspect-video bg-zinc-100 rounded-xl overflow-hidden mb-6 border border-zinc-200 relative">
                     {project.image_url ? (
                       <img src={project.image_url} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                     ) : (
                       <div className="flex items-center justify-center h-full text-zinc-300"><Code size={40} /></div>
                     )}
                  </div>
                  
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold group-hover:text-blue-600 transition-colors">
                      {project.title}
                    </h3>
                    <div className="flex gap-2">
                      {project.repo_url && (
                        <a href={project.repo_url} target="_blank" className="text-zinc-400 hover:text-zinc-900"><Github size={18}/></a>
                      )}
                      {project.demo_url && (
                         <a href={project.demo_url} target="_blank" className="text-zinc-400 hover:text-zinc-900"><ExternalLink size={18}/></a>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-zinc-500 mb-4 leading-relaxed text-sm line-clamp-2">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {project.tags.split(',').map((tag, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-zinc-50 text-zinc-600 text-xs font-medium rounded-full border border-zinc-100">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="py-10 border-t border-zinc-100 mt-20 text-center text-zinc-400 text-sm">
        <p>© 2024 {CV_DATA.about.name}.</p>
        <div className="flex justify-center gap-4 mt-4">
            <a href={CV_DATA.about.contact.github} target="_blank" className="hover:text-zinc-900">GitHub</a>
            <a href={CV_DATA.about.contact.linkedin} target="_blank" className="hover:text-zinc-900">LinkedIn</a>
        </div>
      </footer>
    </div>
  );
}