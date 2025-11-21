'use client';

import { CV_DATA } from '@/data/cv';
import { Briefcase, GraduationCap, Code2, Database, Wrench } from 'lucide-react';

export default function ResumeSection() {
  return (
    <section id="resume" className="py-20 bg-zinc-50 border-t border-zinc-200">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="mb-16 max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight mb-4">Experience & Skills</h2>
          <p className="text-zinc-500 leading-relaxed">
            {CV_DATA.about.summary}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          
          {/* KOLOM KIRI: Experience & Education (Timeline) */}
          <div className="md:col-span-2 space-y-12">
            
            {/* Experience */}
            <div>
              <div className="flex items-center gap-2 mb-6 text-zinc-900 font-semibold">
                <Briefcase size={20} />
                <h3>Work Experience</h3>
              </div>
              
              <div className="space-y-8 border-l-2 border-zinc-200 ml-2 pl-8 relative">
                {CV_DATA.experience.map((exp, idx) => (
                  <div key={idx} className="relative">
                    {/* Dot Timeline */}
                    <span className="absolute -left-[39px] top-1 w-4 h-4 bg-zinc-100 border-2 border-zinc-300 rounded-full"></span>
                    
                    <h4 className="text-lg font-bold text-zinc-900">{exp.role}</h4>
                    <div className="text-zinc-600 font-medium mb-1">{exp.company}</div>
                    <div className="text-xs text-zinc-400 uppercase tracking-wider mb-3">{exp.period}</div>
                    
                    <ul className="list-disc list-outside ml-4 space-y-1 text-zinc-500 text-sm leading-relaxed marker:text-zinc-300">
                      {exp.description.map((desc, i) => (
                        <li key={i}>{desc}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div>
              <div className="flex items-center gap-2 mb-6 text-zinc-900 font-semibold">
                <GraduationCap size={20} />
                <h3>Education</h3>
              </div>
              
              <div className="space-y-8 border-l-2 border-zinc-200 ml-2 pl-8 relative">
                {CV_DATA.education.map((edu, idx) => (
                  <div key={idx} className="relative">
                    <span className="absolute -left-[39px] top-1 w-4 h-4 bg-zinc-100 border-2 border-zinc-300 rounded-full"></span>
                    <h4 className="text-lg font-bold text-zinc-900">{edu.institution}</h4>
                    <div className="text-zinc-600 font-medium">{edu.degree}</div>
                    <div className="text-xs text-zinc-400 uppercase tracking-wider mt-1">{edu.period}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* KOLOM KANAN: Skills (Sticky) */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-2xl border border-zinc-100 sticky top-24 shadow-sm">
              <h3 className="font-bold text-zinc-900 mb-6 flex items-center gap-2">
                <Code2 size={20}/> Technical Skills
              </h3>

              <div className="space-y-6">
                {/* Languages */}
                <div>
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Languages</h4>
                  <div className="flex flex-wrap gap-2">
                    {CV_DATA.skills.languages.map(skill => (
                      <span key={skill} className="px-3 py-1 bg-zinc-50 text-zinc-700 text-xs font-medium rounded-md border border-zinc-200">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Frameworks */}
                <div>
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Frameworks</h4>
                  <div className="flex flex-wrap gap-2">
                    {CV_DATA.skills.frameworks.map(skill => (
                      <span key={skill} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-md border border-blue-100">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tools */}
                <div>
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Tools & Cloud</h4>
                  <div className="flex flex-wrap gap-2">
                    {CV_DATA.skills.tools.map(skill => (
                      <span key={skill} className="px-3 py-1 bg-zinc-50 text-zinc-700 text-xs font-medium rounded-md border border-zinc-200">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}