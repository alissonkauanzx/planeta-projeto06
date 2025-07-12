"use client"

import { upload as vercelBlobUpload } from "@vercel/blob/client"
import React, { useState, useRef, useCallback, useEffect, ChangeEvent, FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  SpaceIcon as Planet,
  Plus,
  Search,
  Eye,
  MessageCircle,
  Edit,
  Trash2,
  UploadIcon,
  ImageIcon,
  Video,
  Calendar,
  X,
  Send,
  LogOut,
  Star,
  FileText,
  Shield,
  Zap,
  Sparkles,
} from "lucide-react"

// Firebase
import { auth } from "@/lib/firebaseClient"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth"

// Supabase
import { supabase } from '@/lib/supabaseClient';

// Cloudinary
const CLOUDINARY_CLOUD_NAME = "dz0kjpcoa";
const CLOUDINARY_UPLOAD_PRESET = "projeto_planeta";

// --- Tipos e Interfaces ---
interface CurrentUserType extends FirebaseUser {
  isAdmin?: boolean;
}

interface Project {
  id: string | number;
  title: string;
  description: string;
  category: string;
  author_id: string;
  author_name?: string;
  created_at: string;
  image_url?: string | null;
  video_urls?: string[];
  pdf_urls?: string[];
  ods?: number[];
  views?: number;
  comments?: Comment[];
  [key: string]: any;
}


interface Comment {
  id: string | number;
  project_id: string | number;
  user_id: string;
  author_name?: string;
  content: string;
  created_at: string;
}

interface OptimizedCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

interface LoginViewProps {
  loginEmail: string;
  setLoginEmail: (value: string) => void;
  loginPassword: string;
  setLoginPassword: (value: string) => void;
  handleLogin: () => Promise<void>;
  setCurrentView: (view: string) => void;
  loading: boolean;
}

interface RegisterViewProps {
  registerEmail: string;
  setRegisterEmail: (value: string) => void;
  registerPassword: string;
  setRegisterPassword: (value: string) => void;
  handleRegister: () => Promise<void>;
  setCurrentView: (view: string) => void;
  loading: boolean;
}

interface ProjectsViewProps {
  currentUser: CurrentUserType | null;
  projects: Project[];
  filteredProjects: Project[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterCategory: string;
  setFilterCategory: (value: string) => void;
  categories: string[];
  handleLogout: () => Promise<void>;
  setCurrentView: (view: string) => void;
  setSelectedProject: (project: Project | null) => void;
  canEditProject: (project: Project) => boolean;
  odsOptions: any[];
}

interface CreateProjectViewProps {
  currentUser: CurrentUserType | null;
  handleLogout: () => Promise<void>;
  setCurrentView: (view: string) => void;
  uploadToCloudinary: (file: File) => Promise<string | null>;
  uploadToSupabaseStorage: (file: File, type: 'videos' | 'pdfs') => Promise<string | null>;
  loadProjectsFromSupabase: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  loading: boolean;
  odsOptions: any[];
}

interface ProjectDetailViewProps {
  selectedProject: Project | null;
  setSelectedProject: (projectOrFunction: ((prev: Project | null) => Project | null) | Project | null) => void;
  currentUser: CurrentUserType | null;
  newComment: string;
  setNewComment: (value: string) => void;
  setCurrentView: (view: string) => void;
  canEditProject: (project: Project) => boolean;
  handleEditProject: (project: Project) => Promise<void>;
  handleDeleteProject: (project: Project) => Promise<void>;
  handleAddComment: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  odsOptions: any[];
}


// --- Componentes de UI Auxiliares ---
const OptimizedSpaceBackground: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    let ticking = false;
    const handleMouseMove = (e: MouseEvent) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setMousePosition({ x: (e.clientX / window.innerWidth) * 100, y: (e.clientY / window.innerHeight) * 100 });
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);
  return ( <div className="fixed inset-0 overflow-hidden pointer-events-none"> <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 20% 20%, rgba(30, 41, 59, 0.9) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(67, 56, 202, 0.8) 0%, transparent 50%), linear-gradient(135deg, #0f172a 0%, #1e1b4b 25%, #312e81 50%, #1e1b4b 75%, #0f172a 100%)`}}/> <div className="absolute opacity-80" style={{ top: "15%", right: "10%", width: "200px", height: "200px", background: `radial-gradient(circle at center, transparent 30%, rgba(139, 92, 246, 0.2) 40%, rgba(59, 130, 246, 0.3) 50%, rgba(30, 41, 59, 0.8) 70%, transparent 90%)`, borderRadius: "50%", willChange: "transform", animation: "simpleRotate 20s linear infinite", }}> <div className="absolute top-1/2 left-1/2" style={{ width: "40px", height: "40px", background: "radial-gradient(circle, #000000 0%, rgba(0,0,0,0.8) 80%, transparent 100%)", borderRadius: "50%", transform: "translate(-50%, -50%)", }} /> </div> <div className="absolute inset-0 opacity-20" style={{ background: `radial-gradient(ellipse 600px 300px at 30% 70%, rgba(139, 92, 246, 0.3) 0%, transparent 60%), radial-gradient(ellipse 400px 200px at 70% 30%, rgba(59, 130, 246, 0.25) 0%, transparent 60%)`, willChange: "transform", animation: "gentleFloat 30s ease-in-out infinite alternate", transform: `translate3d(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px, 0)`, }} /> {[...Array(50)].map((_, i) => { const size = Math.random() * 2 + 1; const brightness = Math.random() * 0.8 + 0.2; const delay = Math.random() * 5; return <div key={i} className="absolute rounded-full" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, width: `${size}px`, height: `${size}px`, backgroundColor: "#ffffff", opacity: brightness, willChange: "opacity", animation: `gentleTwinkle ${3 + Math.random() * 2}s ease-in-out infinite`, animationDelay: `${delay}s`, }} /> })} <svg className="absolute inset-0 w-full h-full opacity-30" style={{ pointerEvents: "none" }}> <g opacity="0.6"><line x1="15%" y1="25%" x2="20%" y2="30%" stroke="rgba(59, 130, 246, 0.5)" strokeWidth="1" /><line x1="20%" y1="30%" x2="25%" y2="25%" stroke="rgba(59, 130, 246, 0.5)" strokeWidth="1" /><line x1="25%" y1="25%" x2="30%" y2="35%" stroke="rgba(59, 130, 246, 0.5)" strokeWidth="1" /><circle cx="15%" cy="25%" r="2" fill="rgba(255, 255, 255, 0.8)" /><circle cx="20%" cy="30%" r="3" fill="rgba(59, 130, 246, 0.8)" /><circle cx="25%" cy="25%" r="2" fill="rgba(255, 255, 255, 0.8)" /><circle cx="30%" cy="35%" r="2" fill="rgba(147, 51, 234, 0.8)" /></g> <g opacity="0.5"><line x1="70%" y1="20%" x2="75%" y2="15%" stroke="rgba(147, 51, 234, 0.5)" strokeWidth="1" /><line x1="75%" y1="15%" x2="80%" y2="25%" stroke="rgba(147, 51, 234, 0.5)" strokeWidth="1" /><circle cx="70%" cy="20%" r="2" fill="rgba(255, 255, 255, 0.7)" /><circle cx="75%" cy="15%" r="2" fill="rgba(147, 51, 234, 0.8)" /><circle cx="80%" cy="25%" r="2" fill="rgba(255, 255, 255, 0.7)" /></g> </svg> <div className="absolute opacity-60" style={{ left: "10%", top: "20%", willChange: "transform", animation: "simpleMeteor 12s linear infinite", }} > <div className="w-1 h-20 bg-gradient-to-b from-white via-blue-300 to-transparent" style={{ transform: "rotate(45deg)", filter: "blur(0.5px)", }} /> </div> <div className="absolute inset-0"> <div className="absolute top-32 left-16 w-32 h-32 rounded-full opacity-70" style={{ background: `radial-gradient(circle at 30% 30%, #60a5fa 0%, #3b82f6 50%, #1e40af 100%)`, willChange: "transform", animation: "slowRotate 40s linear infinite", }} > <div className="absolute rounded-full border opacity-40" style={{ width: "160%", height: "160%", top: "-30%", left: "-30%", borderColor: "rgba(59, 130, 246, 0.3)", borderWidth: "1px", transform: "rotateX(75deg)", }} /> </div> <div className="absolute bottom-40 right-32 w-20 h-20 rounded-full opacity-60" style={{ background: `radial-gradient(circle at 40% 40%, #f472b6 0%, #ec4899 50%, #be185d 100%)`, willChange: "transform", animation: "slowRotate 50s linear infinite reverse", }} /> </div> {[...Array(10)].map((_, i) => (<div key={`cosmic-${i}`} className="absolute rounded-full opacity-40" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, width: `${Math.random() * 2 + 1}px`, height: `${Math.random() * 2 + 1}px`, backgroundColor: ["#60a5fa", "#a78bfa", "#f472b6"][Math.floor(Math.random() * 3)], willChange: "transform", animation: `gentleFloat ${20 + Math.random() * 10}s ease-in-out infinite`, animationDelay: `${Math.random() * 5}s`, }} /> ))} <div className="absolute inset-0 opacity-10 transition-opacity duration-500" style={{ background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(59, 130, 246, 0.2) 0%, transparent 50%)`, }} /> <style jsx>{` @keyframes simpleRotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } @keyframes slowRotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } @keyframes gentleFloat { 0%, 100% { transform: translate3d(0, 0, 0) scale(1); } 50% {  transform: translate3d(10px, -10px, 0) scale(1.05); } } @keyframes gentleTwinkle { 0%, 100% { opacity: 0.2; transform: scale(1); } 50% { opacity: 0.8; transform: scale(1.2); } } @keyframes simpleMeteor { 0% { transform: translate3d(-50px, -50px, 0) rotate(45deg); opacity: 0; } 10% { opacity: 0.6; } 90% { opacity: 0.6; } 100% { transform: translate3d(100vw, 100vh, 0) rotate(45deg); opacity: 0; } } * { backface-visibility: hidden; perspective: 1000px; } `}</style> </div> );
};

const OptimizedCard: React.FC<OptimizedCardProps> = ({ children, className = "", onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  return ( <div className={`relative ${className} cursor-pointer transition-all duration-300 transform hover:scale-105 hover:-translate-y-2`} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} onClick={onClick} style={{ willChange: "transform", }} > {isHovered && ( <div className="absolute inset-0 rounded-lg pointer-events-none"> <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-60" /> <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-60" /> <div className="absolute left-0 top-0 w-0.5 h-full bg-gradient-to-b from-transparent via-blue-400 to-transparent opacity-60" /> <div className="absolute right-0 top-0 w-0.5 h-full bg-gradient-to-b from-transparent via-purple-400 to-transparent opacity-60" /> </div> )} {children} </div> );
};

// --- Componentes de View ---

const LoginView: React.FC<LoginViewProps> = ({ loginEmail, setLoginEmail, loginPassword, setLoginPassword, handleLogin, setCurrentView, loading }) => (
  <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", }} >
    <div style={{ width: "100%", maxWidth: "400px", backgroundColor: "rgba(15, 23, 42, 0.95)", padding: "30px", borderRadius: "15px", border: "1px solid rgba(59, 130, 246, 0.3)", backdropFilter: "blur(20px)", boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5), 0 0 50px rgba(59, 130, 246, 0.1)", }} >
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <div style={{ width: "80px", height: "80px", background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", borderRadius: "50%", margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "30px", boxShadow: "0 0 30px rgba(59, 130, 246, 0.5)", }} > 🌎 </div>
        <h1 style={{ color: "white", fontSize: "28px", margin: "0 0 10px 0", fontWeight: "bold" }}> Planeta Projeto </h1>
        <p style={{ color: "#94a3b8", margin: 0 }}>Entre na sua conta para explorar o cosmos</p>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <Label htmlFor="login-email-input" style={{ display: "block", color: "#e2e8f0", marginBottom: "8px", fontSize: "14px", fontWeight: "500", }} > Email </Label>
        <Input id="login-email-input" type="email" placeholder="seu@email.com" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} style={{ width: "100%", padding: "14px", backgroundColor: "rgba(51, 65, 85, 0.8)", border: "1px solid rgba(71, 85, 105, 0.8)", borderRadius: "8px", color: "white", fontSize: "16px", outline: "none", boxSizing: "border-box", transition: "all 0.3s ease", }} />
      </div>
      <div style={{ marginBottom: "30px" }}>
        <Label htmlFor="login-password-input" style={{ display: "block", color: "#e2e8f0", marginBottom: "8px", fontSize: "14px", fontWeight: "500", }} > Senha </Label>
        <Input id="login-password-input" type="password" placeholder="••••••••" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} style={{ width: "100%", padding: "14px", backgroundColor: "rgba(51, 65, 85, 0.8)", border: "1px solid rgba(71, 85, 105, 0.8)", borderRadius: "8px", color: "white", fontSize: "16px", outline: "none", boxSizing: "border-box", transition: "all 0.3s ease", }} />
      </div>
      <Button onClick={handleLogin} disabled={loading} style={{ width: "100%", padding: "14px", background: loading ? "#6b7280" : "linear-gradient(135deg, #3b82f6, #8b5cf6)", color: "white", border: "none", borderRadius: "8px", fontSize: "16px", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer", marginBottom: "20px", transition: "all 0.3s ease", boxShadow: loading ? "none" : "0 0 20px rgba(59, 130, 246, 0.3)", }} > {loading ? "Entrando..." : "Entrar"} </Button>
      <div style={{ textAlign: "center" }}>
        <Button variant="link" onClick={() => setCurrentView("register")} style={{ color: "#60a5fa", fontSize: "14px", textDecoration: "underline", }} > Não tem conta? Criar conta </Button>
      </div>
    </div>
  </div>
);

const RegisterView: React.FC<RegisterViewProps> = ({ registerEmail, setRegisterEmail, registerPassword, setRegisterPassword, handleRegister, setCurrentView, loading }) => (
  <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", }} >
    <div style={{ width: "100%", maxWidth: "400px", backgroundColor: "rgba(15, 23, 42, 0.95)", padding: "30px", borderRadius: "15px", border: "1px solid rgba(139, 92, 246, 0.3)", backdropFilter: "blur(20px)", boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5), 0 0 50px rgba(139, 92, 246, 0.1)", }} >
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <div style={{ width: "80px", height: "80px", background: "linear-gradient(135deg, #8b5cf6, #ec4899)", borderRadius: "50%", margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "30px", boxShadow: "0 0 30px rgba(139, 92, 246, 0.5)", }} > 👤 </div>
        <h1 style={{ color: "white", fontSize: "28px", margin: "0 0 10px 0", fontWeight: "bold" }}>Criar Conta</h1>
        <p style={{ color: "#94a3b8", margin: 0 }}>Junte-se à nossa comunidade espacial</p>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <Label htmlFor="reg-email-input" style={{ display: "block", color: "#e2e8f0", marginBottom: "8px", fontSize: "14px", fontWeight: "500", }} > Email </Label>
        <Input id="reg-email-input" type="email" placeholder="seu@email.com" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} style={{ width: "100%", padding: "14px", backgroundColor: "rgba(51, 65, 85, 0.8)", border: "1px solid rgba(71, 85, 105, 0.8)", borderRadius: "8px", color: "white", fontSize: "16px", outline: "none", boxSizing: "border-box", transition: "all 0.3s ease", }} />
      </div>
      <div style={{ marginBottom: "30px" }}>
        <Label htmlFor="reg-password-input" style={{ display: "block", color: "#e2e8f0", marginBottom: "8px", fontSize: "14px", fontWeight: "500", }} > Senha </Label>
        <Input id="reg-password-input" type="password" placeholder="••••••••" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} style={{ width: "100%", padding: "14px", backgroundColor: "rgba(51, 65, 85, 0.8)", border: "1px solid rgba(71, 85, 105, 0.8)", borderRadius: "8px", color: "white", fontSize: "16px", outline: "none", boxSizing: "border-box", transition: "all 0.3s ease", }} />
      </div>
      <Button onClick={handleRegister} disabled={loading} style={{ width: "100%", padding: "14px", background: loading ? "#6b7280" : "linear-gradient(135deg, #8b5cf6, #ec4899)", color: "white", border: "none", borderRadius: "8px", fontSize: "16px", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer", marginBottom: "20px", transition: "all 0.3s ease", boxShadow: loading ? "none" : "0 0 20px rgba(139, 92, 246, 0.3)", }} > {loading ? "Cadastrando..." : "Cadastrar"} </Button>
      <div style={{ textAlign: "center" }}>
        <Button variant="link" onClick={() => setCurrentView("login")} style={{ color: "#a78bfa", fontSize: "14px", textDecoration: "underline" }} > Já tem conta? Entrar </Button>
      </div>
    </div>
  </div>
);

const ProjectsView: React.FC<ProjectsViewProps> = ({ currentUser, projects, filteredProjects, searchTerm, setSearchTerm, filterCategory, setFilterCategory, categories, handleLogout, setCurrentView, setSelectedProject, canEditProject, odsOptions }) => (
  <div className="min-h-screen relative z-10">
      <header className="sticky top-0 z-50 relative overflow-hidden" style={{ background: "rgba(15, 23, 42, 0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(59, 130, 246, 0.3)", boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)", minHeight: "80px", }} >
        <div className="absolute inset-0 opacity-10" style={{ background: `linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent)`}} />
        <div className="container mx-auto px-4 py-4 relative">
          <div className="flex flex-wrap items-center justify-between gap-y-2 min-h-[48px]">
            <div className="flex items-center gap-4">
              <div className="relative p-3 rounded-full" style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", boxShadow: "0 0 30px rgba(59, 130, 246, 0.5)", }} >
                <Planet className="h-8 w-8 text-white animate-spin" style={{ animationDuration: "10s" }} />
                {[...Array(6)].map((_, i) => ( <div key={i} className="absolute w-2 h-2 bg-blue-300 rounded-full" style={{ top: `${Math.sin((i * Math.PI) / 3) * 25 + 50}%`, left: `${Math.cos((i * Math.PI) / 3) * 25 + 50}%`, animation: `orbit ${3 + i * 0.3}s linear infinite`, transformOrigin: "50% 50%", }} /> ))}
              </div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-white"> Planeta Projeto{" "} <span className="inline-block animate-pulse" style={{ animationDelay: "1s" }}> 🌎 </span> </h1>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Button onClick={handleLogout} variant="outline" className="relative overflow-hidden group bg-transparent h-11 px-5" style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.4)", color: "#fca5a5", boxShadow: "0 0 15px rgba(239, 68, 68, 0.2)", transition: "all 0.3s ease", minWidth: "130px", }} >
                <LogOut className="mr-2 h-4 w-4" /> Sair
              </Button>
              <Button onClick={() => setCurrentView("create")} className="relative overflow-hidden group h-11 px-5" style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", border: "none", boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)", transition: "all 0.3s ease", minWidth: "130px", }} >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <Plus className="mr-2 h-5 w-5" /> Postar Projeto
              </Button>
            </div>
          </div>
        </div>
      </header>
      <div className="p-6 pt-12"> <div className="max-w-7xl mx-auto"> <div className="text-center mb-16"> <h2 className="text-5xl font-bold text-white mb-6 relative" style={{ textShadow: "0 0 30px rgba(59, 130, 246, 0.5)", }} > Projetos Espaciais <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-300/20 to-transparent" style={{ animation: "titleShine 3s ease-in-out infinite", backgroundSize: "200% 100%", }} /> </h2> <p className="text-slate-300 text-xl">Explore as inovações da nossa galáxia</p> </div> <div className="flex flex-col md:flex-row gap-6 mb-12"> <div className="relative flex-1 group"> <Search className="absolute left-4 top-4 h-5 w-5 text-slate-400 group-focus-within:text-blue-400 transition-colors z-10" /> <Input placeholder="Buscar projetos no cosmos..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-12 h-14 text-lg relative" style={{ background: "rgba(51, 65, 85, 0.8)", border: "1px solid rgba(71, 85, 105, 0.8)", borderRadius: "12px", color: "white", backdropFilter: "blur(10px)", boxShadow: "0 0 20px rgba(59, 130, 246, 0.1)", transition: "all 0.3s ease", }} /> </div> <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="px-6 py-4 text-lg rounded-xl" style={{ background: "rgba(51, 65, 85, 0.8)", border: "1px solid rgba(71, 85, 105, 0.8)", color: "white", backdropFilter: "blur(10px)", boxShadow: "0 0 20px rgba(59, 130, 246, 0.1)", transition: "all 0.3s ease", }} > {categories.map((cat) => ( <option key={cat} value={cat} style={{ background: "#334155" }}> {cat === "all" ? "Todas as Categorias" : cat} </option> ))} </select> </div> <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"> {filteredProjects.map((project, index) => ( <OptimizedCard key={project.id} className="relative" onClick={() => { setSelectedProject(project); setCurrentView("project-detail"); }} > <Card className="relative overflow-hidden" style={{ background: "rgba(51, 65, 85, 0.8)", border: "1px solid rgba(71, 85, 105, 0.8)", borderRadius: "16px", backdropFilter: "blur(20px)", boxShadow: "0 25px 50px rgba(0, 0, 0, 0.3), 0 0 30px rgba(59, 130, 246, 0.1)", transition: "all 0.5s ease", animationDelay: `${index * 0.1}s`, animation: "fadeInUp 0.8s ease-out forwards", }} > <div className="absolute inset-0 opacity-20" style={{ background: `linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.4), transparent)`, backgroundSize: "200% 100%", animation: `scanLine ${6 + index * 0.5}s linear infinite`, }} /> <CardHeader className="relative z-10"> <div className="flex items-start justify-between mb-4"> <div className="flex flex-col gap-3"> <Badge className="w-fit relative overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.3))", border: "1px solid rgba(59, 130, 246, 0.4)", color: "#93c5fd", boxShadow: "0 0 15px rgba(59, 130, 246, 0.3)", }} > <Sparkles className="mr-1 h-3 w-3" /> {project.category} </Badge> {project.ods && project.ods.length > 0 && ( <div className="flex flex-wrap gap-2"> {project.ods.slice(0, 3).map((odsId: number) => { const ods = odsOptions.find((o) => o.id === odsId); return ods ? ( <div key={odsId} className="text-xs px-3 py-1 rounded-full text-white font-medium" style={{ backgroundColor: ods.color, boxShadow: `0 0 10px ${ods.color}40`,}} title={ods.name} > ODS {odsId} </div> ) : null; })} {project.ods.length > 3 && ( <div className="text-xs px-3 py-1 rounded-full text-white font-medium" style={{ background: "rgba(71, 85, 105, 0.8)", boxShadow: "0 0 10px rgba(71, 85, 105, 0.4)", }} > +{project.ods.length - 3} </div> )} </div> )} </div> <div className="flex flex-col items-end gap-3"> <div className="flex items-center gap-2 text-sm text-slate-300"> <Eye className="h-4 w-4" /> <span className="font-mono">{project.views || 0}</span> </div> {canEditProject(project) && ( <Badge className="text-xs" style={{ background: "linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(22, 163, 74, 0.3))", border: "1px solid rgba(34, 197, 94, 0.4)", color: "#86efac", boxShadow: "0 0 15px rgba(34, 197, 94, 0.3)", }} > Seu Projeto </Badge> )} </div> </div> <CardTitle className="text-white text-xl mb-3 group-hover:text-blue-300 transition-colors duration-300" style={{ textShadow: "0 0 10px rgba(255, 255, 255, 0.3)", }} > {project.title} </CardTitle> <CardDescription className="text-slate-300 leading-relaxed">{project.description}</CardDescription> </CardHeader> <CardContent className="relative z-10"> <div className="flex items-center justify-between"> <div className="flex items-center gap-3"> <Avatar className="h-8 w-8" style={{ border: "2px solid rgba(59, 130, 246, 0.4)", boxShadow: "0 0 15px rgba(59, 130, 246, 0.3)", }} > <AvatarFallback className="text-white text-sm font-bold" style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", }} > {(project.author_name || "??").substring(0,2).toUpperCase()} </AvatarFallback> </Avatar> <span className="text-sm text-slate-300 font-medium">{project.author_name || "Autor Desconhecido"}</span> </div> <div className="flex items-center gap-2 text-sm text-slate-300"> <MessageCircle className="h-4 w-4" /> <span className="font-mono">{(project.comments || []).length}</span> </div> </div> </CardContent> </Card> </OptimizedCard> ))} </div> </div> </div> </div>
);

const CreateProjectView: React.FC<CreateProjectViewProps> = ({ currentUser, handleLogout, setCurrentView, uploadToCloudinary, uploadToSupabaseStorage, loadProjectsFromSupabase, setLoading, loading: parentLoading, odsOptions }) => {
  const [projectData, setProjectData] = useState({ title: "", category: "Educação", description: "", ods: [] as number[], images: [] as any[], videos: [] as any[], pdfs: [] as any[], });
  const [uploading, setUploading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (files: FileList | null, type: "images" | "videos" | "pdfs") => {
    if (!files || files.length === 0) return;
    setUploading(true);
    const uploadedFileObjects = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        if (type === "images") {
          if (projectData.images.length > 0) { alert("Você pode enviar apenas uma foto para o projeto."); setUploading(false); return; }
          const imageUrl = await uploadToCloudinary(file);
            console.log(`handleFileUpload: Cloudinary URL para ${file.name}:`, imageUrl); // Log URL Cloudinary
          if (imageUrl) uploadedFileObjects.push({ name: file.name, url: imageUrl, size: file.size, type: 'image' });
          else console.warn(`Falha no upload da imagem ${file.name} para Cloudinary.`);
        } else if (type === "videos" || type === "pdfs") {
          const mediaUrl = await uploadToSupabaseStorage(file, type);
            console.log(`handleFileUpload: Supabase Storage URL para ${file.name} (${type}):`, mediaUrl); // Log URL Supabase
          if (mediaUrl) uploadedFileObjects.push({ name: file.name, url: mediaUrl, size: file.size, type });
          else console.warn(`Falha no upload de ${type} ${file.name} para Supabase Storage.`);
        }
      } catch (error) { console.error("Upload failed for file:", file.name, error); alert(`Erro ao enviar o arquivo ${file.name}.`); }
    }
      console.log("handleFileUpload: uploadedFileObjects:", uploadedFileObjects); // Log dos arquivos processados
    if (uploadedFileObjects.length > 0) {
      setProjectData((prev) => ({ ...prev, [type]: type === "images" ? uploadedFileObjects : [...prev[type], ...uploadedFileObjects], }));
    }
    setUploading(false);
  };

  const removeFile = (type: "images" | "videos" | "pdfs", index: number) => {
    setProjectData((prev) => ({ ...prev, [type]: prev[type].filter((_: any, i: number) => i !== index), }));
  };

  const handleSubmit = async () => {
    if (!projectData.title || !projectData.description) { alert("Por favor, preencha todos os campos obrigatórios"); return; }
    if (!currentUser) { alert("Usuário não autenticado."); setCurrentView("login"); return; }

    setLoading(true);
    console.log("handleSubmit: currentUser UID:", currentUser.uid);

    const newProjectPayload = {
      title: projectData.title,
      description: projectData.description,
      category: projectData.category,
      ods: projectData.ods,
      author_id: currentUser.uid,
      author_name: currentUser.displayName || currentUser.email?.split('@')[0] || "Usuário Anônimo",
      created_at: new Date().toISOString(),
      image_url: projectData.images.length > 0 ? projectData.images[0].url : null,
      video_urls: projectData.videos.map((v: any) => v.url),
      pdf_urls: projectData.pdfs.map((p: any) => p.url),
    };

    console.log("handleSubmit: newProjectPayload:", newProjectPayload); // Log do payload

    try {
      const { data, error } = await supabase.from('Projetos').insert([newProjectPayload]).select();
      if (error) {
        console.error("Erro ao salvar projeto no Supabase:", error);
        throw error;
      }
      console.log("handleSubmit: Projeto salvo com sucesso:", data);
      alert("Projeto enviado com sucesso!");
      setCurrentView("projects");
      loadProjectsFromSupabase();
    } catch (error: any) {
      console.error("Erro ao salvar projeto (catch):", error);
      alert("Erro ao salvar projeto: " + error.message);
    } finally {
      setLoading(false);
    }

    setProjectData({ title: "", category: "Educação", description: "", ods: [], images: [], videos: [], pdfs: [], });
  };

  return ( <div className="min-h-screen relative z-10">
    <header className="sticky top-0 z-50 relative overflow-hidden" style={{ background: "rgba(15, 23, 42, 0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(59, 130, 246, 0.3)", boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)", minHeight: "80px", }} >
      <div className="absolute inset-0 opacity-10" style={{ background: `linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent)`}} />
      <div className="container mx-auto px-4 py-4 relative">
        <div className="flex flex-wrap items-center justify-between gap-y-2 min-h-[48px]">
          <div className="flex items-center gap-4">
            <div className="relative p-3 rounded-full" style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", boxShadow: "0 0 30px rgba(59, 130, 246, 0.5)", }} >
              <Planet className="h-8 w-8 text-white animate-spin" style={{ animationDuration: "10s" }} />
            </div>
            <h1 className="text-2xl font-bold text-white">Planeta Projeto 🌎</h1>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Button onClick={handleLogout} variant="outline" className="relative overflow-hidden bg-transparent h-11 px-5" style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.4)", color: "#fca5a5", boxShadow: "0 0 15px rgba(239, 68, 68, 0.2)", transition: "all 0.3s ease", minWidth: "130px", }} >
              <LogOut className="mr-2 h-4 w-4" /> Sair
            </Button>
            <Button onClick={() => setCurrentView("projects")} variant="outline" className="relative overflow-hidden group h-11 px-5" style={{ background: "rgba(71, 85, 105, 0.8)", border: "1px solid rgba(71, 85, 105, 0.8)", color: "#e2e8f0", boxShadow: "0 0 15px rgba(71, 85, 105, 0.3)", minWidth: "130px", }} >
              Voltar
            </Button>
          </div>
        </div>
      </div>
    </header>
    <div className="p-6 pt-12"> <div className="max-w-5xl mx-auto"> <OptimizedCard> <Card className="relative overflow-hidden" style={{ background: "rgba(51, 65, 85, 0.8)", border: "1px solid rgba(71, 85, 105, 0.8)", borderRadius: "20px", backdropFilter: "blur(20px)", boxShadow: "0 25px 50px rgba(0, 0, 0, 0.3), 0 0 30px rgba(59, 130, 246, 0.1)", }} > <CardHeader> <CardTitle className="text-3xl text-white flex items-center gap-3" style={{ textShadow: "0 0 20px rgba(59, 130, 246, 0.5)", }} > <div className="p-2 rounded-full" style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)", }} > <Plus className="h-6 w-6 text-white" /> </div> Postar Projeto </CardTitle> <CardDescription className="text-slate-300 text-lg"> Compartilhe sua inovação com a galáxia </CardDescription> </CardHeader> <CardContent className="space-y-8"> <div className="grid md:grid-cols-2 gap-6"> <div className="space-y-3"> <Label className="text-slate-200 text-lg font-medium">Título do Projeto *</Label> <Input placeholder="Nome do seu projeto" value={projectData.title} onChange={(e) => setProjectData((prev) => ({ ...prev, title: e.target.value }))} className="h-12 text-lg" style={{ background: "rgba(71, 85, 105, 0.8)", border: "1px solid rgba(71, 85, 105, 0.8)", borderRadius: "10px", color: "white", backdropFilter: "blur(10px)", }}/> </div> <div className="space-y-3"> <Label className="text-slate-200 text-lg font-medium">Categoria</Label> <select value={projectData.category} onChange={(e) => setProjectData((prev) => ({ ...prev, category: e.target.value }))} className="w-full px-4 py-3 text-lg rounded-lg" style={{ background: "rgba(71, 85, 105, 0.8)", border: "1px solid rgba(71, 85, 105, 0.8)", color: "white", backdropFilter: "blur(10px)", }} > <option>Educação</option> <option>Tecnologia</option> <option>Ciência</option> <option>Sustentabilidade</option> </select> </div> </div> <div className="space-y-3"> <Label className="text-slate-200 text-lg font-medium">Descrição *</Label> <Textarea placeholder="Descreva seu projeto..." value={projectData.description} onChange={(e) => setProjectData((prev) => ({ ...prev, description: e.target.value }))} className="min-h-[180px] text-lg" style={{ background: "rgba(71, 85, 105, 0.8)", border: "1px solid rgba(71, 85, 105, 0.8)", borderRadius: "10px", color: "white", backdropFilter: "blur(10px)", }} /> </div> <div className="space-y-8"> <h3 className="text-white font-semibold text-2xl flex items-center gap-2"> <Zap className="h-6 w-6 text-blue-400" /> Arquivos do Projeto </h3> <div className="grid md:grid-cols-3 gap-8"> <div className="p-6 rounded-xl border" style={{ background: "rgba(71, 85, 105, 0.4)", border: "1px solid rgba(71, 85, 105, 0.6)", backdropFilter: "blur(10px)", }} > <Label className="text-slate-200 flex items-center gap-3 mb-4 text-lg font-medium"> <ImageIcon className="h-6 w-6 text-blue-400" /> Imagens </Label> <input ref={imageInputRef} type="file" accept="image/*" onChange={(e) => handleFileUpload(e.target.files, "images")} className="hidden"/> <Button type="button" variant="outline" className="w-full h-12 relative overflow-hidden bg-transparent" onClick={() => imageInputRef.current?.click()} disabled={uploading || projectData.images.length > 0} style={{ background: "rgba(59, 130, 246, 0.1)", border: "1px solid rgba(59, 130, 246, 0.4)", color: "#93c5fd", boxShadow: "0 0 15px rgba(59, 130, 246, 0.2)", }} > <UploadIcon className="mr-2 h-5 w-5" /> {uploading && projectData.images.length === 0 ? "Enviando..." : projectData.images.length > 0 ? "Foto Selecionada" : "Selecionar Foto"} </Button> {projectData.images.map((file, idx) => ( <div key={idx} className="flex items-center justify-between p-3 rounded-lg text-sm mt-4" style={{ background: "rgba(51, 65, 85, 0.6)", border: "1px solid rgba(71, 85, 105, 0.4)", }} > <span className="text-slate-300 truncate">{file.name}</span> <Button size="sm" variant="ghost" onClick={() => removeFile("images", idx)} className="text-red-400 hover:text-red-300 h-8 w-8 p-0" > × </Button> </div> ))} </div> <div className="p-6 rounded-xl border" style={{ background: "rgba(71, 85, 105, 0.4)", border: "1px solid rgba(71, 85, 105, 0.6)", backdropFilter: "blur(10px)", }} > <Label className="text-slate-200 flex items-center gap-3 mb-4 text-lg font-medium"> <Video className="h-6 w-6 text-purple-400" /> Vídeos </Label> <input ref={videoInputRef} type="file" multiple accept="video/*" onChange={(e) => handleFileUpload(e.target.files, "videos")} className="hidden"/> <Button type="button" variant="outline" className="w-full h-12 relative overflow-hidden bg-transparent" onClick={() => videoInputRef.current?.click()} disabled={uploading} style={{ background: "rgba(139, 92, 246, 0.1)", border: "1px solid rgba(139, 92, 246, 0.4)", color: "#c4b5fd", boxShadow: "0 0 15px rgba(139, 92, 246, 0.2)", }} > <UploadIcon className="mr-2 h-5 w-5" /> {uploading ? "Enviando..." : "Selecionar Vídeos"} </Button> {projectData.videos.map((vid, idx) => ( <div key={idx} className="flex items-center justify-between p-3 rounded-lg text-sm mt-4" style={{ background: "rgba(51, 65, 85, 0.6)", border: "1px solid rgba(71, 85, 105, 0.4)", }} > <span className="text-slate-300 truncate">{vid.name}</span> <Button size="sm" variant="ghost" onClick={() => removeFile("videos", idx)} className="text-red-400 hover:text-red-300 h-8 w-8 p-0" > × </Button> </div> ))} </div> <div className="p-6 rounded-xl border" style={{ background: "rgba(71, 85, 105, 0.4)", border: "1px solid rgba(71, 85, 105, 0.6)", backdropFilter: "blur(10px)", }} > <Label className="text-slate-200 flex items-center gap-3 mb-4 text-lg font-medium"> <FileText className="h-6 w-6 text-green-400" /> Documentos PDF </Label> <input ref={pdfInputRef} type="file" multiple accept=".pdf" onChange={(e) => handleFileUpload(e.target.files, "pdfs")} className="hidden"/> <Button type="button" variant="outline" className="w-full h-12 relative overflow-hidden bg-transparent" onClick={() => pdfInputRef.current?.click()} disabled={uploading} style={{ background: "rgba(34, 197, 94, 0.1)", border: "1px solid rgba(34, 197, 94, 0.4)", color: "#86efac", boxShadow: "0 0 15px rgba(34, 197, 94, 0.2)", }} > <UploadIcon className="mr-2 h-5 w-5" /> {uploading ? "Enviando..." : "Selecionar PDFs"} </Button> {projectData.pdfs.map((pdf, idx) => ( <div key={idx} className="flex items-center justify-between p-3 rounded-lg text-sm mt-4" style={{ background: "rgba(51, 65, 85, 0.6)", border: "1px solid rgba(71, 85, 105, 0.4)", }} > <span className="text-slate-300 truncate">{pdf.name}</span> <Button size="sm" variant="ghost" onClick={() => removeFile("pdfs", idx)} className="text-red-400 hover:text-red-300 h-8 w-8 p-0" > × </Button> </div> ))} </div> </div> </div> <div className="space-y-4"> <Label className="text-slate-200 text-lg font-medium"> Objetivos de Desenvolvimento Sustentável (ODS) </Label> <div className="p-6 rounded-xl border max-h-60 overflow-y-auto" style={{ background: "rgba(71, 85, 105, 0.4)", border: "1px solid rgba(71, 85, 105, 0.6)", backdropFilter: "blur(10px)", }} > <div className="grid grid-cols-1 md:grid-cols-2 gap-3"> {odsOptions.map((ods) => ( <label key={ods.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-600/30 cursor-pointer transition-colors" > <input type="checkbox" checked={projectData.ods.includes(ods.id)} onChange={(e) => { if (e.target.checked) { setProjectData((prev) => ({ ...prev, ods: [...prev.ods, ods.id] })); } else { setProjectData((prev) => ({ ...prev, ods: prev.ods.filter((id) => id !== ods.id) })); } }} className="rounded border-slate-500 text-blue-600" /> <div className="w-5 h-5 rounded" style={{ backgroundColor: ods.color, boxShadow: `0 0 10px ${ods.color}40`, }}/> <span className="text-slate-300"> ODS {ods.id}: {ods.name} </span> </label> ))} </div> </div> </div> {uploading && ( <div className="text-center py-6"> <div className="inline-block w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" style={{ boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)", }} /> <p className="text-slate-400 mt-4 text-lg">Enviando arquivos para o cosmos...</p> </div> )} <div className="flex gap-6 pt-6"> <Button className="flex-1 h-14 text-lg font-semibold relative overflow-hidden group" onClick={handleSubmit} disabled={uploading || parentLoading } style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", border: "none", boxShadow: "0 0 30px rgba(59, 130, 246, 0.4)", }} > {(uploading || parentLoading) && ( <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)", animation: "shimmer 2s linear infinite", }}/> )} {parentLoading ? "Enviando..." : uploading ? "Processando..." : "Enviar Projeto"} </Button> <Button variant="outline" className="h-14 px-8 text-lg bg-transparent" onClick={() => setCurrentView("projects")} disabled={uploading || parentLoading} style={{ background: "rgba(71, 85, 105, 0.8)", border: "1px solid rgba(71, 85, 105, 0.8)", color: "#e2e8f0", boxShadow: "0 0 15px rgba(71, 85, 105, 0.3)", }} > Cancelar </Button> </div> </CardContent> </Card> </OptimizedCard> </div> </div> </div> );
