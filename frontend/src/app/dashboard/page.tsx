'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';
import { Project } from '@/types';
import { Trash2, Plus, LogOut } from 'lucide-react';

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
    image_url: '',
    repo_url: '',
    demo_url: ''
  });

  // 1. Cek Auth & Load Data
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/portal-rahasia');
      return;
    }
    loadProjects();
  }, [router]);

  const loadProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin hapus project ini?')) return;
    try {
      await api.delete(`/admin/projects/${id}`);
      loadProjects(); // Reload data
    } catch (error) {
      alert('Gagal menghapus project');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/admin/projects', formData);
      setIsModalOpen(false);
      setFormData({ title: '', description: '', tags: '', image_url: '', repo_url: '', demo_url: '' });
      loadProjects();
    } catch (error) {
      alert('Gagal upload project');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-zinc-900">Admin Dashboard</h1>
          <div className="flex gap-3">
            <Button onClick={() => setIsModalOpen(true)}><Plus size={16}/> Add Project</Button>
            <Button variant="outline" onClick={handleLogout}><LogOut size={16}/> Logout</Button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-zinc-50 border-b border-zinc-200">
              <tr>
                <th className="p-4 text-sm font-semibold text-zinc-500">Title</th>
                <th className="p-4 text-sm font-semibold text-zinc-500">Tags</th>
                <th className="p-4 text-sm font-semibold text-zinc-500 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {projects.map((p) => (
                <tr key={p.id} className="hover:bg-zinc-50">
                  <td className="p-4 font-medium">{p.title}</td>
                  <td className="p-4 text-zinc-500 text-sm">{p.tags}</td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => handleDelete(p.id)}
                      className="text-red-500 hover:bg-red-50 p-2 rounded-md transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form Sederhana */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Add New Project</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input placeholder="Title" className="w-full p-2 border rounded" 
                value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
              
              <textarea placeholder="Description" className="w-full p-2 border rounded" 
                value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              
              <input placeholder="Tags (e.g. Go, React)" className="w-full p-2 border rounded" 
                value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} />
              
              <input placeholder="Image URL" className="w-full p-2 border rounded" 
                value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} />
                
              <div className="flex justify-end gap-2 mt-4">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}