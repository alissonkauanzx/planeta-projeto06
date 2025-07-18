"use client"

import React, { useState, useRef, useCallback, useEffect, ChangeEvent, FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Circle, // Usando o ícone de círculo
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
  userId: string;
  author_name?: string;
  createdAt: string;
  category?: string;
  imageUrl?: string | null;
  videoUrl?: string | null;
  pdfUrl?: string | null;
  ods?: number | null;
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
  uploadToSupabaseStorage: (file: File, type: 'video' | 'pdf') => Promise<string | null>;
  loadProjectsFromSupabase: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  loading: boolean;
  odsOptions: any[];
}

interface EditProjectViewProps {
  project: Project;
  currentUser: CurrentUserType | null;
  handleLogout: () => Promise<void>;
  setCurrentView: (view: string) => void;
  loadProjectsFromSupabase: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  loading: boolean;
  odsOptions: any[];
  setSelectedProject: (project: Project | null) => void;
}


interface ProjectDetailViewProps {
  selectedProject: Project | null;
  setSelectedProject: (projectOrFunction: ((prev: Project | null) => Project | null) | Project | null) => void;
  currentUser: CurrentUserType | null;
  newComment: string;
  setNewComment: (value: string) => void;
  setCurrentView: (view: string) => void;
  canEditProject: (project: Project) => boolean;
  handleDeleteProject: (project: Project) => Promise<void>;
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
        <div style={{ width: "80px", height: "80px", background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", borderRadius: "50%", margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px", boxShadow: "0 0 30px rgba(59, 130, 246, 0.5)", }} > </div>
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
          <div className="flex flex-wrap items-center justify-between gap-y-3 min-h-[48px] w-full">
            <div className="flex items-center gap-3">
              <div className="relative p-2 sm:p-3 rounded-full flex items-center justify-center text-2xl" style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", boxShadow: "0 0 30px rgba(59, 130, 246, 0.5)", width: '48px', height: '48px' }} >
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white"> Planeta Projeto </h1>
            </div>
            <div className="flex flex-col items-end gap-2 ml-auto">
              <Button onClick={handleLogout} variant="outline" className="relative overflow-hidden group bg-transparent h-10 px-3 sm:h-11 sm:px-5 text-xs sm:text-sm" style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.4)", color: "#fca5a5", boxShadow: "0 0 15px rgba(239, 68, 68, 0.2)", transition: "all 0.3s ease", minWidth: "120px", }} >
                <LogOut className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Sair
              </Button>
              <Button onClick={() => setCurrentView("create")} className="relative overflow-hidden group h-10 px-3 sm:h-11 sm:px-5 text-xs sm:text-sm" style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", border: "none", boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)", transition: "all 0.3s ease", minWidth: "120px", }} >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <Plus className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Postar Projeto
              </Button>
            </div>
          </div>
        </div>
      </header>
      <div className="p-6 pt-12"> <div className="max-w-7xl mx-auto"> <div className="text-center mb-16"> <h2 className="text-5xl font-bold text-white mb-6 relative" style={{ textShadow: "0 0 30px rgba(59, 130, 246, 0.5)", }} > Projetos Espaciais <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-300/20 to-transparent" style={{ animation: "titleShine 3s ease-in-out infinite", backgroundSize: "200% 100%", }} /> </h2> <p className="text-slate-300 text-xl">Explore as inovações da nossa galáxia</p> </div> <div className="flex flex-col md:flex-row gap-6 mb-12"> <div className="relative flex-1 group"> <Search className="absolute left-4 top-4 h-5 w-5 text-slate-400 group-focus-within:text-blue-400 transition-colors z-10" /> <Input placeholder="Buscar projetos no cosmos..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-12 h-14 text-lg relative" style={{ background: "rgba(51, 65, 85, 0.8)", border: "1px solid rgba(71, 85, 105, 0.8)", borderRadius: "12px", color: "white", backdropFilter: "blur(10px)", boxShadow: "0 0 20px rgba(59, 130, 246, 0.1)", transition: "all 0.3s ease", }} /> </div> <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="px-6 py-4 text-lg rounded-xl" style={{ background: "rgba(51, 65, 85, 0.8)", border: "1px solid rgba(71, 85, 105, 0.8)", color: "white", backdropFilter: "blur(10px)", boxShadow: "0 0 20px rgba(59, 130, 246, 0.1)", transition: "all 0.3s ease", }} > {categories.map((cat) => ( <option key={cat} value={cat} style={{ background: "#334155" }}> {cat === "all" ? "Todas as Categorias" : cat} </option> ))} </select> </div> <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"> {filteredProjects.map((project, index) => ( <OptimizedCard key={project.id} className="relative" onClick={() => { setSelectedProject(project); setCurrentView("project-detail"); }} > <Card className="relative overflow-hidden" style={{ background: "rgba(51, 65, 85, 0.8)", border: "1px solid rgba(71, 85, 105, 0.8)", borderRadius: "16px", backdropFilter: "blur(20px)", boxShadow: "0 25px 50px rgba(0, 0, 0, 0.3), 0 0 30px rgba(59, 130, 246, 0.1)", transition: "all 0.5s ease", animationDelay: `${index * 0.1}s`, animation: "fadeInUp 0.8s ease-out forwards", }} > <div className="absolute inset-0 opacity-20" style={{ background: `linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.4), transparent)`, backgroundSize: "200% 100%", animation: `scanLine ${6 + index * 0.5}s linear infinite`, }} /> <CardHeader className="relative z-10"> <div className="flex items-start justify-between mb-4"> <div className="flex flex-col gap-3"> {project.category && <Badge className="w-fit relative overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.3))", border: "1px solid rgba(59, 130, 246, 0.4)", color: "#93c5fd", boxShadow: "0 0 15px rgba(59, 130, 246, 0.3)", }} > <Sparkles className="mr-1 h-3 w-3" /> {project.category} </Badge>} {project.ods && ( <div className="flex flex-wrap gap-2"> {(() => { const ods = odsOptions.find((o) => o.id === project.ods); return ods ? ( <div key={project.ods} className="text-xs px-3 py-1 rounded-full text-white font-medium" style={{ backgroundColor: ods.color, boxShadow: `0 0 10px ${ods.color}40`,}} title={ods.name} > ODS {project.ods} </div> ) : null; })()} </div> )} </div> <div className="flex flex-col items-end gap-3"> <div className="flex items-center gap-2 text-sm text-slate-300"> <Eye className="h-4 w-4" /> <span className="font-mono">{project.views || 0}</span> </div> {canEditProject(project) && ( <Badge className="text-xs" style={{ background: "linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(22, 163, 74, 0.3))", border: "1px solid rgba(34, 197, 94, 0.4)", color: "#86efac", boxShadow: "0 0 15px rgba(34, 197, 94, 0.3)", }} > Seu Projeto </Badge> )} </div> </div> <CardTitle className="text-white text-xl mb-3 group-hover:text-blue-300 transition-colors duration-300" style={{ textShadow: "0 0 10px rgba(255, 255, 255, 0.3)", }} > {project.title} </CardTitle> <CardDescription className="text-slate-300 leading-relaxed">{project.description}</CardDescription> </CardHeader> <CardContent className="relative z-10"> <div className="flex items-center justify-between"> <div className="flex items-center gap-3"> <Avatar className="h-8 w-8" style={{ border: "2px solid rgba(59, 130, 246, 0.4)", boxShadow: "0 0 15px rgba(59, 130, 246, 0.3)", }} > <AvatarFallback className="text-white text-sm font-bold" style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", }} > {(project.author_name || "??").substring(0,2).toUpperCase()} </AvatarFallback> </Avatar> <span className="text-sm text-slate-300 font-medium">{project.author_name || "Autor Desconhecido"}</span> </div> <div className="flex items-center gap-2 text-sm text-slate-300"> <MessageCircle className="h-4 w-4" /> <span className="font-mono">{(project.comments || []).length}</span> </div> </div> </CardContent> </Card> </OptimizedCard> ))} </div> </div> </div> </div>
);

const CreateProjectView: React.FC<CreateProjectViewProps> = ({ currentUser, handleLogout, setCurrentView, uploadToCloudinary, uploadToSupabaseStorage, loadProjectsFromSupabase, setLoading, loading: parentLoading, odsOptions }) => {
  const [projectData, setProjectData] = useState<{ title: string; category: string; description: string; ods: number | null; image: File | null; video: File | null; pdf: File | null; }>({ title: "", category: "Educação", description: "", ods: null, image: null, video: null, pdf: null, });
  const [uploading, setUploading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null, type: 'image' | 'video' | 'pdf') => {
    if (!files || files.length === 0) return;
    setProjectData(prev => ({...prev, [type]: files[0]}));
  };

  const removeFile = (type: 'image' | 'video' | 'pdf') => {
    setProjectData(prev => ({...prev, [type]: null}));
  };

  const handleSubmit = async () => {
    if (!projectData.title || !projectData.description) { alert("Por favor, preencha todos os campos obrigatórios"); return; }
    if (!currentUser) { alert("Usuário não autenticado."); setCurrentView("login"); return; }

    setLoading(true);
    setUploading(true);

    try {
      let imageUrl: string | null = null;
      if (projectData.image) {
        imageUrl = await uploadToCloudinary(projectData.image);
        if (!imageUrl) throw new Error("Falha no upload da imagem para Cloudinary.");
      }

      let videoUrl: string | null = null;
      if (projectData.video) {
        videoUrl = await uploadToSupabaseStorage(projectData.video, 'video');
        if (!videoUrl) throw new Error("Falha no upload do vídeo para Supabase.");
      }

      let pdfUrl: string | null = null;
      if (projectData.pdf) {
        pdfUrl = await uploadToSupabaseStorage(projectData.pdf, 'pdf');
        if (!pdfUrl) throw new Error("Falha no upload do PDF para Supabase.");
      }

      const newProjectPayload = {
        id: crypto.randomUUID(),
        title: projectData.title,
        description: projectData.description,
        category: projectData.category,
        ods: projectData.ods,
        userId: currentUser.uid,
        author_name: currentUser.displayName || currentUser.email?.split('@')[0] || "Usuário Anônimo",
        createdAt: new Date().toISOString(),
        imageUrl: imageUrl,
        videoUrl: videoUrl,
        pdfUrl: pdfUrl,
      };

      const { error: insertError } = await supabase.from('projects').insert([newProjectPayload]);
      if (insertError) {
        throw insertError;
      }

      alert("Projeto enviado com sucesso!");
      setCurrentView("projects");
      loadProjectsFromSupabase();
      setProjectData({ title: "", category: "Educação", description: "", ods: null, image: null, video: null, pdf: null, });

    } catch (error: any) {
      console.error("Erro no processo de envio do projeto:", error);
      alert("Erro ao salvar projeto: " + (error.message || error));
    } finally {
      setUploading(false);
      setLoading(false);
    }
  };

  return ( <div className="min-h-screen relative z-10">
    <header className="sticky top-0 z-50 relative overflow-hidden" style={{ background: "rgba(15, 23, 42, 0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(59, 130, 246, 0.3)", boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)", minHeight: "80px", }} >
      <div className="absolute inset-0 opacity-10" style={{ background: `linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent)`}} />
      <div className="container mx-auto px-4 py-4 relative">
        <div className="flex flex-wrap items-center justify-between gap-y-3 min-h-[48px] w-full">
          <div className="flex items-center gap-3">
            <div className="relative p-2 sm:p-3 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", boxShadow: "0 0 30px rgba(59, 130, 246, 0.5)", width: '48px', height: '48px' }} >
              <div className="w-full h-full rounded-full border-2 border-white/50 animate-spin" style={{animationDuration: '10s'}}></div>
              {[...Array(6)].map((_, i) => ( <div key={i} className="absolute w-2 h-2 bg-blue-300 rounded-full" style={{ top: `${Math.sin((i * Math.PI) / 3) * 25 + 50}%`, left: `${Math.cos((i * Math.PI) / 3) * 25 + 50}%`, animation: `orbit ${3 + i * 0.3}s linear infinite`, transformOrigin: "50% 50%", }} /> ))}
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">Planeta Projeto</h1>
          </div>
          <div className="flex flex-col items-end gap-2 ml-auto">
            <Button onClick={handleLogout} variant="outline" className="relative overflow-hidden bg-transparent h-10 px-3 sm:h-11 sm:px-5 text-xs sm:text-sm" style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.4)", color: "#fca5a5", boxShadow: "0 0 15px rgba(239, 68, 68, 0.2)", transition: "all 0.3s ease", minWidth: "110px", }} >
              <LogOut className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Sair
            </Button>
            <Button onClick={() => setCurrentView("projects")} variant="outline" className="relative overflow-hidden group h-10 px-3 sm:h-11 sm:px-5 text-xs sm:text-sm" style={{ background: "rgba(71, 85, 105, 0.8)", border: "1px solid rgba(71, 85, 105, 0.8)", color: "#e2e8f0", boxShadow: "0 0 15px rgba(71, 85, 105, 0.3)", minWidth: "110px", }} >
              Voltar
            </Button>
          </div>
        </div>
      </div>
    </header>
    <div className="p-6 pt-12"> <div className="max-w-5xl mx-auto"> <OptimizedCard> <Card className="relative overflow-hidden" style={{ background: "rgba(51, 65, 85, 0.8)", border: "1px solid rgba(71, 85, 105, 0.8)", borderRadius: "20px", backdropFilter: "blur(20px)", boxShadow: "0 25px 50px rgba(0, 0, 0, 0.3), 0 0 30px rgba(59, 130, 246, 0.1)", }} > <CardHeader> <CardTitle className="text-3xl text-white flex items-center gap-3" style={{ textShadow: "0 0 20px rgba(59, 130, 246, 0.5)", }} > <div className="p-2 rounded-full" style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)", }} > <Plus className="h-6 w-6 text-white" /> </div> Postar Projeto </CardTitle> <CardDescription className="text-slate-300 text-lg"> Compartilhe sua inovação com a galáxia </CardDescription> </CardHeader> <CardContent className="space-y-8"> <div className="grid md:grid-cols-2 gap-6"> <div className="space-y-3"> <Label className="text-slate-200 text-lg font-medium">Título do Projeto *</Label> <Input placeholder="Nome do seu projeto" value={projectData.title} onChange={(e) => setProjectData((prev) => ({ ...prev, title: e.target.value }))} className="h-12 text-lg" style={{ background: "rgba(71, 85, 105, 0.8)", border: "1px solid rgba(71, 85, 105, 0.8)", borderRadius: "10px", color: "white", backdropFilter: "blur(10px)", }}/> </div> <div className="space-y-3"> <Label className="text-slate-200 text-lg font-medium">Categoria</Label> <select value={projectData.category} onChange={(e) => setProjectData((prev) => ({ ...prev, category: e.target.value }))} className="w-full px-4 py-3 text-lg rounded-lg" style={{ background: "rgba(71, 85, 105, 0.8)", border: "1px solid rgba(71, 85, 105, 0.8)", color: "white", backdropFilter: "blur(10px)", }} > <option>Educação</option> <option>Tecnologia</option> <option>Ciência</option> <option>Sustentabilidade</option> </select> </div> </div> <div className="space-y-3"> <Label className="text-slate-200 text-lg font-medium">Descrição *</Label> <Textarea placeholder="Descreva seu projeto..." value={projectData.description} onChange={(e) => setProjectData((prev) => ({ ...prev, description: e.target.value }))} className="min-h-[180px] text-lg" style={{ background: "rgba(71, 85, 105, 0.8)", border: "1px solid rgba(71, 85, 105, 0.8)", borderRadius: "10px", color: "white", backdropFilter: "blur(10px)", }} /> </div> <div className="space-y-8"> <h3 className="text-white font-semibold text-2xl flex items-center gap-2"> <Zap className="h-6 w-6 text-blue-400" /> Arquivos do Projeto </h3> <div className="grid md:grid-cols-3 gap-8"> <div className="p-6 rounded-xl border" style={{ background: "rgba(71, 85, 105, 0.4)", border: "1px solid rgba(71, 85, 105, 0.6)", backdropFilter: "blur(10px)", }} > <Label className="text-slate-200 flex items-center gap-3 mb-4 text-lg font-medium"> <ImageIcon className="h-6 w-6 text-blue-400" /> Imagem </Label> <input ref={imageInputRef} type="file" accept="image/*" onChange={(e) => handleFileSelect(e.target.files, "image")} className="hidden"/> {projectData.image ? <div className="flex items-center justify-between p-3 rounded-lg text-sm mt-4" style={{ background: "rgba(51, 65, 85, 0.6)"}}><span className="text-slate-300 truncate">{projectData.image.name}</span><Button size="sm" variant="ghost" onClick={() => removeFile("image")} className="text-red-400 hover:text-red-300 h-8 w-8 p-0">×</Button></div> : <Button type="button" variant="outline" className="w-full h-12" onClick={() => imageInputRef.current?.click()} disabled={uploading}> <UploadIcon className="mr-2 h-5 w-5" /> Selecionar Foto </Button>}</div> <div className="p-6 rounded-xl border" style={{ background: "rgba(71, 85, 105, 0.4)", border: "1px solid rgba(71, 85, 105, 0.6)", backdropFilter: "blur(10px)", }} > <Label className="text-slate-200 flex items-center gap-3 mb-4 text-lg font-medium"> <Video className="h-6 w-6 text-purple-400" /> Vídeo </Label> <input ref={videoInputRef} type="file" accept="video/*" onChange={(e) => handleFileSelect(e.target.files, "video")} className="hidden"/> {projectData.video ? <div className="flex items-center justify-between p-3 rounded-lg text-sm mt-4" style={{ background: "rgba(51, 65, 85, 0.6)"}}><span className="text-slate-300 truncate">{projectData.video.name}</span><Button size="sm" variant="ghost" onClick={() => removeFile("video")} className="text-red-400 hover:text-red-300 h-8 w-8 p-0">×</Button></div> : <Button type="button" variant="outline" className="w-full h-12" onClick={() => videoInputRef.current?.click()} disabled={uploading}> <UploadIcon className="mr-2 h-5 w-5" /> Selecionar Vídeo </Button>}</div> <div className="p-6 rounded-xl border" style={{ background: "rgba(71, 85, 105, 0.4)", border: "1px solid rgba(71, 85, 105, 0.6)", backdropFilter: "blur(10px)", }} > <Label className="text-slate-200 flex items-center gap-3 mb-4 text-lg font-medium"> <FileText className="h-6 w-6 text-green-400" /> Documento PDF </Label> <input ref={pdfInputRef} type="file" accept=".pdf" onChange={(e) => handleFileSelect(e.target.files, "pdf")} className="hidden"/> {projectData.pdf ? <div className="flex items-center justify-between p-3 rounded-lg text-sm mt-4" style={{ background: "rgba(51, 65, 85, 0.6)"}}><span className="text-slate-300 truncate">{projectData.pdf.name}</span><Button size="sm" variant="ghost" onClick={() => removeFile("pdf")} className="text-red-400 hover:text-red-300 h-8 w-8 p-0">×</Button></div> : <Button type="button" variant="outline" className="w-full h-12" onClick={() => pdfInputRef.current?.click()} disabled={uploading}> <UploadIcon className="mr-2 h-5 w-5" /> Selecionar PDF </Button>}</div> </div> </div> <div className="space-y-4"> <Label className="text-slate-200 text-lg font-medium"> Objetivo de Desenvolvimento Sustentável (ODS) </Label> <div className="p-6 rounded-xl border max-h-60 overflow-y-auto" style={{ background: "rgba(71, 85, 105, 0.4)", border: "1px solid rgba(71, 85, 105, 0.6)", backdropFilter: "blur(10px)", }} > <div className="grid grid-cols-1 md:grid-cols-2 gap-3"> {odsOptions.map((ods) => ( <label key={ods.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-600/30 cursor-pointer transition-colors" > <input type="radio" name="ods" value={ods.id} checked={projectData.ods === ods.id} onChange={(e) => setProjectData(prev => ({...prev, ods: parseInt(e.target.value)}))} className="form-radio text-blue-600"/> <div className="w-5 h-5 rounded" style={{ backgroundColor: ods.color, boxShadow: `0 0 10px ${ods.color}40`, }}/> <span className="text-slate-300"> ODS {ods.id}: {ods.name} </span> </label> ))} </div> </div> </div> {uploading && ( <div className="text-center py-6"> <div className="inline-block w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" style={{ boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)", }} /> <p className="text-slate-400 mt-4 text-lg">Enviando arquivos para o cosmos...</p> </div> )} <div className="flex gap-6 pt-6"> <Button className="flex-1 h-14 text-lg font-semibold relative overflow-hidden group" onClick={handleSubmit} disabled={uploading || parentLoading } style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", border: "none", boxShadow: "0 0 30px rgba(59, 130, 246, 0.4)", }} > {(uploading || parentLoading) && ( <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)", animation: "shimmer 2s linear infinite", }}/> )} {parentLoading ? "Enviando..." : uploading ? "Processando..." : "Enviar Projeto"} </Button> <Button variant="outline" className="h-14 px-8 text-lg bg-transparent" onClick={() => setCurrentView("projects")} disabled={uploading || parentLoading} style={{ background: "rgba(71, 85, 105, 0.8)", border: "1px solid rgba(71, 85, 105, 0.8)", color: "#e2e8f0", boxShadow: "0 0 15px rgba(71, 85, 105, 0.3)", }} > Cancelar </Button> </div> </CardContent> </Card> </OptimizedCard> </div> </div> </div> );
};

// NOVO COMPONENTE DE EDIÇÃO
const EditProjectView: React.FC<EditProjectViewProps> = ({ project, currentUser, handleLogout, setCurrentView, loadProjectsFromSupabase, setLoading, loading: parentLoading, odsOptions, setSelectedProject }) => {
  const [projectData, setProjectData] = useState({ title: "", category: "Educação", description: "", ods: null as number | null });

  useEffect(() => {
    if(project) {
      setProjectData({
        title: project.title,
        description: project.description,
        category: project.category || 'Educação',
        ods: project.ods || null
      });
    }
  }, [project]);

  const handleUpdateProject = async () => {
    if (!projectData.title || !projectData.description) { alert("Título e descrição são obrigatórios."); return; }
    if (!currentUser) { alert("Usuário não autenticado."); return; }

    setLoading(true);

    const updatedProjectPayload = {
      title: projectData.title,
      description: projectData.description,
      category: projectData.category,
      ods: projectData.ods,
    };

    try {
      let query = supabase
        .from('projects')
        .update(updatedProjectPayload)
        .eq('id', project.id);

      // @ts-ignore
      if (!currentUser.isAdmin) {
        query = query.eq('userId', currentUser.uid);
      }

      const { data, error } = await query.select().single();

      if (error) throw error;

      alert("Projeto atualizado com sucesso!");
      setSelectedProject(data);
      setCurrentView("project-detail");
      loadProjectsFromSupabase();
    } catch (error: any) {
      console.error("Erro ao atualizar projeto:", error);
      alert("Erro ao atualizar projeto: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative z-10">
      <header className="sticky top-0 z-50 relative overflow-hidden" style={{ background: "rgba(15, 23, 42, 0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(59, 130, 246, 0.3)", boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)", minHeight: "80px", }} >
        <div className="absolute inset-0 opacity-10" style={{ background: `linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent)`}} />
        <div className="container mx-auto px-4 py-4 relative">
          <div className="flex flex-wrap items-center justify-between gap-y-3 min-h-[48px] w-full">
            <div className="flex items-center gap-3">
              <div className="relative p-2 sm:p-3 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", boxShadow: "0 0 30px rgba(59, 130, 246, 0.5)", width: '48px', height: '48px' }} >
                <div className="w-full h-full rounded-full border-2 border-white/50 animate-spin" style={{animationDuration: '10s'}}></div>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">Editar Projeto</h1>
            </div>
            <div className="flex flex-col items-end gap-2 ml-auto">
              <Button onClick={() => setCurrentView("project-detail")} variant="outline" className="relative overflow-hidden group h-10 px-3 sm:h-11 sm:px-5 text-xs sm:text-sm" style={{ background: "rgba(71, 85, 105, 0.8)", border: "1px solid rgba(71, 85, 105, 0.8)", color: "#e2e8f0", boxShadow: "0 0 15px rgba(71, 85, 105, 0.3)", minWidth: "110px", }} >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      </header>
      <div className="p-6 pt-12"> <div className="max-w-5xl mx-auto"> <OptimizedCard> <Card className="relative overflow-hidden" style={{ background: "rgba(51, 65, 85, 0.8)", border: "1px solid rgba(71, 85, 105, 0.8)", borderRadius: "20px", backdropFilter: "blur(20px)", boxShadow: "0 25px 50px rgba(0, 0, 0, 0.3), 0 0 30px rgba(59, 130, 246, 0.1)", }} > <CardHeader> <CardTitle className="text-3xl text-white flex items-center gap-3" style={{ textShadow: "0 0 20px rgba(59, 130, 246, 0.5)", }} > <Edit className="h-6 w-6 text-white" /> Editando: {project.title} </CardTitle> <CardDescription className="text-slate-300 text-lg"> Modifique as informações do seu projeto. Arquivos de mídia não podem ser alterados aqui. </CardDescription> </CardHeader> <CardContent className="space-y-8"> <div className="grid md:grid-cols-2 gap-6"> <div className="space-y-3"> <Label className="text-slate-200 text-lg font-medium">Título do Projeto *</Label> <Input placeholder="Nome do seu projeto" value={projectData.title} onChange={(e) => setProjectData((prev) => ({ ...prev, title: e.target.value }))} className="h-12 text-lg" style={{ background: "rgba(71, 85, 105, 0.8)", border: "1px solid rgba(71, 85, 105, 0.8)", borderRadius: "10px", color: "white", backdropFilter: "blur(10px)", }}/> </div> <div className="space-y-3"> <Label className="text-slate-200 text-lg font-medium">Categoria</Label> <select value={projectData.category} onChange={(e) => setProjectData((prev) => ({ ...prev, category: e.target.value }))} className="w-full px-4 py-3 text-lg rounded-lg" style={{ background: "rgba(71, 85, 105, 0.8)", border: "1px solid rgba(71, 85, 105, 0.8)", color: "white", backdropFilter: "blur(10px)", }} > <option>Educação</option> <option>Tecnologia</option> <option>Ciência</option> <option>Sustentabilidade</option> </select> </div> </div> <div className="space-y-3"> <Label className="text-slate-200 text-lg font-medium">Descrição *</Label> <Textarea placeholder="Descreva seu projeto..." value={projectData.description} onChange={(e) => setProjectData((prev) => ({ ...prev, description: e.target.value }))} className="min-h-[180px] text-lg" style={{ background: "rgba(71, 85, 105, 0.8)", border: "1px solid rgba(71, 85, 105, 0.8)", borderRadius: "10px", color: "white", backdropFilter: "blur(10px)", }} /> </div> <div className="space-y-4"> <Label className="text-slate-200 text-lg font-medium"> Objetivo de Desenvolvimento Sustentável (ODS) </Label> <div className="p-6 rounded-xl border max-h-60 overflow-y-auto" style={{ background: "rgba(71, 85, 105, 0.4)", border: "1px solid rgba(71, 85, 105, 0.6)", backdropFilter: "blur(10px)", }} > <div className="grid grid-cols-1 md:grid-cols-2 gap-3"> {odsOptions.map((ods) => ( <label key={ods.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-600/30 cursor-pointer transition-colors" > <input type="radio" name="ods" value={ods.id} checked={projectData.ods === ods.id} onChange={(e) => setProjectData(prev => ({...prev, ods: parseInt(e.target.value)}))} className="form-radio text-blue-600"/> <div className="w-5 h-5 rounded" style={{ backgroundColor: ods.color, boxShadow: `0 0 10px ${ods.color}40`, }}/> <span className="text-slate-300"> ODS {ods.id}: {ods.name} </span> </label> ))} </div> </div> </div> <div className="flex gap-6 pt-6"> <Button className="flex-1 h-14 text-lg font-semibold" onClick={handleUpdateProject} disabled={parentLoading}> {parentLoading ? "Salvando..." : "Salvar Alterações"} </Button> </div> </CardContent> </Card> </OptimizedCard> </div> </div> </div>
  );
};


const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({ selectedProject, setSelectedProject, currentUser, newComment, setNewComment, setCurrentView, canEditProject, handleDeleteProject, odsOptions }) => {
  if (!selectedProject) return null;
  const canUserEdit = canEditProject(selectedProject);

  const handleAddComment = useCallback(async () => {
    if (!newComment.trim() || !currentUser || !selectedProject) { alert("Login e comentário são necessários."); return; }
    const payload = { project_id: selectedProject.id, user_id: currentUser.uid, author_name: currentUser.displayName || currentUser.email?.split('@')[0] || "Anônimo", content: newComment, created_at: new Date().toISOString() };
    try {
      const { data: savedComment, error } = await supabase.from('Comentarios').insert([payload]).select().single();
      if (error) throw error;
      if (typeof setSelectedProject === 'function') {
        setSelectedProject(prev => prev ? ({ ...prev, comments: [...(prev.comments || []), savedComment] }) : null);
      }
      setNewComment("");
    } catch (e: any) { console.error("Erro ao adicionar comentário:", e); alert("Erro: " + e.message); }
  }, [newComment, currentUser, selectedProject, setSelectedProject, setNewComment]);

  const handleDeleteComment = async (commentId: string | number) => {
    if (!currentUser) { alert("Você precisa estar logado para apagar comentários."); return; }
    // @ts-ignore
    const commentToDelete = selectedProject.comments.find(c => c.id === commentId);
    if (!commentToDelete) return;

    // @ts-ignore
    if (currentUser.uid !== commentToDelete.user_id && !currentUser.isAdmin) {
      alert("Você só pode apagar seus próprios comentários.");
      return;
    }

    if (!confirm("Tem certeza que quer apagar este comentário?")) return;

    try {
      const { error } = await supabase.from('Comentarios').delete().eq('id', commentId);

      if (error) throw error;

      alert("Comentário apagado com sucesso!");
      if (typeof setSelectedProject === 'function') {
        setSelectedProject(prev => prev ? ({ ...prev, comments: prev.comments?.filter(c => c.id !== commentId) }) : null);
      }
    } catch(e: any) {
      console.error("Erro ao apagar comentário:", e);
      alert("Erro ao apagar comentário: " + e.message);
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      if (selectedProject?.id) {
        try {
          const { data: commentsData, error } = await supabase.from('Comentarios').select('*').eq('project_id', selectedProject.id).order('created_at', { ascending: true });
          if (error) throw error;
          if (typeof setSelectedProject === 'function') {
            setSelectedProject((prev: Project | null) => prev ? ({ ...prev, comments: commentsData || [] }) : null );
          }
        } catch (error: any) { alert("Erro ao carregar comentários: " + error.message);
        }
      } else {
         if (typeof setSelectedProject === 'function') {
            setSelectedProject((prev: Project | null) => prev ? ({ ...prev, comments: [] }) : null);
         }
      }
    };
    fetchComments();
  }, [selectedProject?.id, setSelectedProject]);

  return ( <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0, 0, 0, 0.8)", backdropFilter: "blur(10px)", paddingTop: "80px", }} > <div className="max-w-5xl max-h-[calc(90vh-80px)] overflow-y-auto w-full relative" style={{ background: "rgba(15, 23, 42, 0.95)", border: "1px solid rgba(59, 130, 246, 0.3)", borderRadius: "20px", backdropFilter: "blur(20px)", boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5), 0 0 50px rgba(59, 130, 246, 0.2)", marginTop: "0", }} > <div className="sticky top-0 left-0 right-0 z-[60] p-4 flex items-center justify-between bg-slate-900/80 backdrop-blur-md border-b border-slate-700" > <div className="flex items-center gap-4"> <Button onClick={() => {setSelectedProject(null); setCurrentView("projects");}} variant="outline" className="h-11 px-5"> Voltar </Button> {canUserEdit && ( <Badge className="flex items-center gap-2 px-3 py-2" style={{ background: "linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(22, 163, 74, 0.3))", border: "1px solid rgba(34, 197, 94, 0.4)", color: "#86efac", boxShadow: "0 0 15px rgba(34, 197, 94, 0.3)", }} > Seu Projeto </Badge> )} </div> <div className="flex flex-wrap items-center justify-end gap-2"> {canUserEdit && ( <div className="flex items-center gap-3"> <Button onClick={() => setCurrentView("edit-project")} size="sm" variant="outline" className="h-11 px-4"> <Edit className="h-4 w-4 mr-2" /> Editar </Button> <Button onClick={() => handleDeleteProject(selectedProject)} size="sm" variant="destructive" className="h-11 px-4"> <Trash2 className="h-4 w-4 mr-2" /> Apagar </Button> </div> )} <Button onClick={() => {setSelectedProject(null); setCurrentView("projects");}} variant="ghost" size="icon" className="text-slate-400 hover:text-white h-11 w-11" > <X className="h-6 w-6" /> </Button> </div> </div> <div className="p-8 space-y-8"> <div className="relative"> <div className="flex items-center gap-3 mb-4"> {selectedProject.category && <Badge style={{ background: "linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.3))", border: "1px solid rgba(59, 130, 246, 0.4)", color: "#93c5fd", boxShadow: "0 0 15px rgba(59, 130, 246, 0.3)", }} > <Sparkles className="mr-2 h-4 w-4" /> {selectedProject.category} </Badge>} </div> <h1 className="text-4xl font-bold text-white mb-4 relative" style={{textShadow: "0 0 30px rgba(59, 130, 246, 0.5)"}} > {selectedProject.title} </h1> {selectedProject.ods && ( <div className="mb-6"> <h4 className="text-slate-300 text-lg mb-3 font-medium">Objetivo de Desenvolvimento Sustentável:</h4> <div className="flex flex-wrap gap-3"> {(() => { const ods = odsOptions.find((o) => o.id === selectedProject.ods); return ods ? ( <div key={selectedProject.ods} className="flex items-center gap-3 px-4 py-2 rounded-full text-white font-medium" style={{ backgroundColor: ods.color, boxShadow: `0 0 20px ${ods.color}40`, }} > <span className="font-bold">ODS {selectedProject.ods}</span> <span className="text-sm opacity-90">{ods.name}</span> </div> ) : null; })()} </div> </div> )} <div className="flex items-center gap-6 text-slate-400"> <div className="flex items-center gap-3"> <Avatar className="h-8 w-8" style={{ border: "2px solid rgba(59, 130, 246, 0.4)", boxShadow: "0 0 15px rgba(59, 130, 246, 0.3)", }} > <AvatarFallback className="text-white font-bold" style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", }} > {(selectedProject.author_name || "??").substring(0,2).toUpperCase()} </AvatarFallback> </Avatar> <span className="font-medium">{selectedProject.author_name || "Autor Desconhecido"}</span> </div> <div className="flex items-center gap-2"> <Calendar className="h-5 w-5" /> <span className="font-mono">{selectedProject.createdAt ? new Date(selectedProject.createdAt).toLocaleDateString() : "Data Indisponível"}</span> </div> <div className="flex items-center gap-2"> <Eye className="h-5 w-5" /> <span className="font-mono">{selectedProject.views || 0}</span> </div> </div> </div> {selectedProject.imageUrl && ( <div className="space-y-6"> <h3 className="text-white font-semibold text-2xl flex items-center gap-3"> <Star className="h-6 w-6 text-blue-400" /> Foto </h3> <div className="relative group overflow-hidden rounded-xl"> <img src={selectedProject.imageUrl} alt={`Foto do Projeto ${selectedProject.title}`} className="w-full h-auto max-h-[500px] object-contain border border-slate-700" style={{ borderRadius: "12px", boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)", }} /> </div> </div> )} {selectedProject.videoUrl && ( <div className="space-y-6"> <h3 className="text-white font-semibold text-2xl flex items-center gap-3"> <Video className="h-6 w-6 text-purple-400" /> Vídeo </h3> <div className="grid gap-6"> <div className="relative group overflow-hidden rounded-xl" style={{ border: "1px solid rgba(71, 85, 105, 0.6)", boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)", }} > <video controls preload="metadata" className="w-full h-80 object-cover" style={{ borderRadius: "12px" }} > <source src={selectedProject.videoUrl} type="video/mp4" /> Seu navegador não suporta vídeos. </video> </div> </div> </div> )} {selectedProject.pdfUrl && ( <div className="space-y-6"> <h3 className="text-white font-semibold text-2xl flex items-center gap-3"> <FileText className="h-6 w-6 text-green-400" /> Documento PDF </h3> <div className="grid gap-4"> <div className="p-6 rounded-xl" style={{ background: "rgba(71, 85, 105, 0.4)", border: "1px solid rgba(34, 197, 94, 0.4)", backdropFilter: "blur(10px)", boxShadow: "0 0 20px rgba(34, 197, 94, 0.2)", }} > <div className="flex items-center justify-between"> <div className="flex items-center gap-4"> <FileText className="h-10 w-10 text-green-400" /> <span className="text-slate-300 text-lg font-medium">Documento PDF</span> </div> <Button size="sm" variant="outline" onClick={() => window.open(selectedProject.pdfUrl!, "_blank")} style={{ background: "rgba(34, 197, 94, 0.1)", border: "1px solid rgba(34, 197, 94, 0.4)", color: "#86efac", boxShadow: "0 0 15px rgba(34, 197, 94, 0.3)", }} > Abrir PDF </Button> </div> </div> </div> </div> )} <div className="relative"> <h3 className="text-white font-semibold text-2xl mb-4">Descrição</h3> <div className="p-6 rounded-xl relative overflow-hidden" style={{ background: "rgba(71, 85, 105, 0.4)", border: "1px solid rgba(71, 85, 105, 0.6)", backdropFilter: "blur(10px)", }} > <div className="absolute inset-0 opacity-5" style={{ background: `linear-gradient(45deg, transparent, rgba(59, 130, 246, 0.1), transparent)`, backgroundSize: "200% 200%", animation: "gradientShift 10s ease infinite", }} /> <p className="text-slate-300 leading-relaxed text-lg relative">{selectedProject.description}</p> </div> </div> <div className="pt-8" style={{ borderTop: "1px solid rgba(71, 85, 105, 0.3)", }} > <h3 className="text-white font-semibold text-2xl mb-6 flex items-center gap-3"> <MessageCircle className="h-6 w-6 text-green-400" /> Comentários ({(selectedProject.comments || []).length}) </h3> {currentUser && ( <div className="space-y-4 mb-8"> <Textarea placeholder="Adicione um comentário..." value={newComment} onChange={(e) => setNewComment(e.target.value)} className="min-h-[120px] text-lg" style={{ background: "rgba(71, 85, 105, 0.8)", border: "1px solid rgba(71, 85, 105, 0.8)", borderRadius: "12px", color: "white", backdropFilter: "blur(10px)", }} /> <Button onClick={handleAddComment} disabled={!newComment.trim()} className="h-12 px-8 text-lg font-semibold relative overflow-hidden" style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", border: "none", boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)", }} > <Send className="mr-2 h-5 w-5" /> Enviar </Button> </div> )} <div className="space-y-4 max-h-80 overflow-y-auto"> {(selectedProject.comments || []).map((comment: Comment, index: number) => ( <div key={comment.id || index} className="p-6 rounded-xl relative overflow-hidden" style={{ background: "rgba(71, 85, 105, 0.4)", border: "1px solid rgba(71, 85, 105, 0.6)", backdropFilter: "blur(10px)", animationDelay: `${index * 0.1}s`, animation: "fadeInUp 0.6s ease-out forwards", }} > <div className="absolute inset-0 opacity-5" style={{ background: `linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent)`, backgroundSize: "200% 100%", animation: `scanLine ${8 + index}s linear infinite`, }} /> <div className="flex items-start justify-between gap-3 mb-3 relative"> <div className="flex items-center gap-3"> <Avatar className="h-8 w-8" style={{ border: "2px solid rgba(59, 130, 246, 0.4)", boxShadow: "0 0 15px rgba(59, 130, 246, 0.3)", }} > <AvatarFallback className="text-white font-bold" style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", }} > {comment.author_name?.substring(0,2).toUpperCase() || '??'} </AvatarFallback> </Avatar> <div className="flex flex-col"> <span className="text-white font-medium text-lg">{comment.author_name || "Usuário"}</span> <span className="text-slate-400 font-mono text-xs"> {comment.created_at ? new Date(comment.created_at).toLocaleString() : ""} </span> </div> </div> {currentUser && (currentUser.uid === comment.user_id || currentUser.isAdmin) && ( <Button onClick={() => handleDeleteComment(comment.id)} size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:bg-red-500/20 hover:text-red-400"> <Trash2 className="h-4 w-4" /> </Button> )} </div> <p className="text-slate-300 relative text-lg whitespace-pre-wrap">{comment.content}</p> </div> ))} {(selectedProject.comments || []).length === 0 && ( <div className="text-center py-12"> <div className="text-6xl mb-4">🌌</div> <p className="text-slate-400 text-xl">Nenhum comentário ainda. Seja o primeiro a explorar!</p> </div> )} </div> </div> </div> </div> </div> );
};


export default function PlanetaProjeto() {
  const [currentView, setCurrentView] = useState("login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUserType | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [newComment, setNewComment] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);

  const odsOptions = [ { id: 1, name: "Erradicação da Pobreza", color: "#E5243B" }, { id: 2, name: "Fome Zero", color: "#DDA63A" }, { id: 3, name: "Saúde e Bem-Estar", color: "#4C9F38" }, { id: 4, name: "Educação de Qualidade", color: "#C5192D" }, { id: 5, name: "Igualdade de Gênero", color: "#FF3A21" }, { id: 6, name: "Água Potável e Saneamento", color: "#26BDE2" }, { id: 7, name: "Energia Limpa e Acessível", color: "#FCC30B" }, { id: 8, name: "Trabalho Decente", color: "#A21942" }, { id: 9, name: "Inovação e Infraestrutura", color: "#FD6925" }, { id: 10, name: "Redução das Desigualdades", color: "#DD1367" }, { id: 11, name: "Cidades Sustentáveis", color: "#FD9D24" }, { id: 12, name: "Consumo Responsável", color: "#BF8B2E" }, { id: 13, name: "Ação Contra Mudança Climática", color: "#3F7E44" }, { id: 14, name: "Vida na Água", color: "#0A97D9" }, { id: 15, name: "Vida Terrestre", color: "#56C02B" }, { id: 16, name: "Paz e Justiça", color: "#00689D" }, { id: 17, name: "Parcerias", color: "#19486A" }, ];

  const loadProjectsFromSupabase = useCallback(async () => {
    setLoading(true);
    try {
      const { data: projectData, error: projectError } = await supabase.from('projects').select('*').order('createdAt', { ascending: false });
      if (projectError) {
        throw projectError;
      }
      setProjects(projectData || []);
    } catch (error: any) {
      console.error("Erro ao buscar projetos:", error);
      alert("Erro ao carregar projetos: " + (error.message || error));
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const adminUID = 'khhron4qibzdyajfvkn6zisapgr2';
        const userData: CurrentUserType = {
          ...user,
          // @ts-ignore
          isAdmin: user.uid.toLowerCase() === adminUID.toLowerCase()
        };
        setCurrentUser(userData);
        setIsLoggedIn(true);
        if (currentView === "login" || currentView === "register") {
            setCurrentView("projects");
        }
        loadProjectsFromSupabase();
      } else {
        setCurrentUser(null);
        setIsLoggedIn(false);
        setCurrentView("login");
        setProjects([]);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [loadProjectsFromSupabase, currentView]);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = project.category ? project.category.toLowerCase() === filterCategory.toLowerCase() : filterCategory === "all";
    return matchesSearch && (filterCategory === "all" || matchesCategory);
  });

  const categories = ["all", "Educação", "Tecnologia", "Ciência", "Sustentabilidade"];

  const canEditProject = useCallback((project: Project) => {
    if (!currentUser || !project) return false;
    // @ts-ignore
    return currentUser.uid === project.userId || currentUser.isAdmin;
  }, [currentUser]);

  const handleLogin = useCallback(async () => {
    if (!loginEmail || !loginPassword) { alert("Preencha e-mail e senha."); return; }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      setLoginEmail(""); setLoginPassword("");
    } catch (e: any) { alert("Erro no login: " + e.message); }
    finally { setLoading(false); }
  }, [loginEmail, loginPassword]);

  const handleRegister = useCallback(async () => {
    if (!registerEmail || !registerPassword) { alert("Preencha e-mail e senha."); return; }
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, registerEmail, registerPassword);
      alert("Conta criada com sucesso! Você será logado automaticamente.");
      setRegisterEmail(""); setRegisterPassword("");
    } catch (e: any) { alert("Erro no registro: " + e.message); }
    finally { setLoading(false); }
  }, [registerEmail, registerPassword]);

  const handleLogout = useCallback(async () => {
    setLoading(true);
    try { await signOut(auth); setSelectedProject(null); }
    catch (e: any) { alert("Erro ao sair: " + e.message); }
    finally { setLoading(false); }
  }, []);

  const uploadToCloudinary = async (file: File): Promise<string | null> => {
    if (!file || !CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) { console.error("Cloudinary config is missing or file not provided."); alert("Erro na configuração do upload de imagem."); return null; }
    const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`;
    const formData = new FormData(); formData.append("file", file); formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    try {
      const response = await fetch(url, { method: "POST", body: formData });
      if (response.ok) { const res = await response.json(); return res.secure_url; }
      else { const errorData = await response.json().catch(() => ({})); console.error("Cloudinary upload error:", errorData); alert(`Erro no upload da imagem: ${errorData.error?.message || response.statusText}`); return null; }
    } catch (e: any) { console.error("Network error during Cloudinary upload:", e); alert("Erro de rede ao enviar imagem: " + e.message); return null; }
  };

  const uploadToSupabaseStorage = async (file: File, type: 'video' | 'pdf'): Promise<string | null> => {
    if (!file || !supabase) { console.error("Supabase client/file not available."); alert("Erro no sistema de arquivos."); return null; }
    const fileExt = file.name.split('.').pop();
    const fileName = `${currentUser?.uid || 'unknown_user'}/${type}/${Date.now()}.${fileExt}`;
    try {
      const { error: uploadError } = await supabase.storage.from('project.midia').upload(fileName, file, { cacheControl: '3600', upsert: false });
      if (uploadError) {
        console.error(`Supabase storage upload error (${type}):`, uploadError);
        alert(`Erro ao enviar ${type}: ${uploadError.message}`);
        return null;
      }
      const { data: publicUrlData } = supabase.storage.from('project.midia').getPublicUrl(fileName);
      if (publicUrlData?.publicUrl) return publicUrlData.publicUrl;
      else { console.error("Failed to get public URL from Supabase."); alert("Upload bem-sucedido, mas falha ao obter URL."); return null;}
    } catch (e: any) { console.error(`Supabase storage upload error (catch) (${type}):`, e); alert(`Erro ao enviar ${type}: ${e.message}`); return null; }
  };

  const handleDeleteProjectDetail = useCallback(async (project: Project) => {
    if (!currentUser || !canEditProject(project)) { alert("Não autorizado."); return; }
    if (confirm(`Apagar "${project.title}"?`)) {
      setLoading(true);
      try {
        let query = supabase.from('projects').delete().eq('id', project.id);
        // @ts-ignore
        if (!currentUser.isAdmin) {
          query = query.eq('userId', currentUser.uid);
        }
        const { error } = await query;

        if (error) throw error;
        alert("Projeto apagado!");
        setCurrentView("projects");
        loadProjectsFromSupabase();
        setSelectedProject(null);
      } catch (e: any) { console.error("Erro ao apagar projeto:", e); alert("Erro: " + e.message); }
      finally { setLoading(false); }
    }
  },[currentUser, loadProjectsFromSupabase, setCurrentView, setLoading, setSelectedProject, canEditProject]);

  if (loading && currentUser === null && (currentView === "login" || currentView === "register" )) {
    return ( <div className="min-h-screen flex items-center justify-center bg-slate-900"> <div className="text-white text-2xl">Carregando Universo... ✨</div> </div> );
  }

  return (
    <div className="min-h-screen relative">
      <OptimizedSpaceBackground />

      {currentView === "login" &&
        <LoginView
          loginEmail={loginEmail} setLoginEmail={setLoginEmail}
          loginPassword={loginPassword} setLoginPassword={setLoginPassword}
          handleLogin={handleLogin} setCurrentView={setCurrentView} loading={loading}
        />}
      {currentView === "register" &&
        <RegisterView
          registerEmail={registerEmail} setRegisterEmail={setRegisterEmail}
          registerPassword={registerPassword} setRegisterPassword={setRegisterPassword}
          handleRegister={handleRegister} setCurrentView={setCurrentView} loading={loading}
        />}

      {isLoggedIn && currentUser && currentView === "projects" &&
        <ProjectsView
          currentUser={currentUser} projects={projects} filteredProjects={filteredProjects}
          searchTerm={searchTerm} setSearchTerm={setSearchTerm}
          filterCategory={filterCategory} setFilterCategory={setFilterCategory}
          categories={categories} handleLogout={handleLogout}
          setCurrentView={setCurrentView} setSelectedProject={setSelectedProject}
          canEditProject={canEditProject} odsOptions={odsOptions}
        />}
      {isLoggedIn && currentUser && currentView === "create" &&
        <CreateProjectView
          currentUser={currentUser} handleLogout={handleLogout}
          setCurrentView={setCurrentView}
          uploadToCloudinary={uploadToCloudinary}
          uploadToSupabaseStorage={uploadToSupabaseStorage}
          loadProjectsFromSupabase={loadProjectsFromSupabase}
          setLoading={setLoading} loading={loading} odsOptions={odsOptions}
        />}
      {isLoggedIn && currentUser && currentView === "project-detail" && selectedProject &&
        <ProjectDetailView
          selectedProject={selectedProject} setSelectedProject={setSelectedProject}
          currentUser={currentUser}
          newComment={newComment} setNewComment={setNewComment}
          setCurrentView={setCurrentView} canEditProject={canEditProject}
          handleDeleteProject={handleDeleteProjectDetail}
          odsOptions={odsOptions}
        />}

      {isLoggedIn && currentUser && currentView === "edit-project" && selectedProject &&
        <EditProjectView
          project={selectedProject}
          currentUser={currentUser}
          handleLogout={handleLogout}
          setCurrentView={setCurrentView}
          loadProjectsFromSupabase={loadProjectsFromSupabase}
          setLoading={setLoading}
          loading={loading}
          odsOptions={odsOptions}
          setSelectedProject={setSelectedProject}
        />}

      {!isLoggedIn && !["login", "register"].includes(currentView) &&
        <LoginView
            loginEmail={loginEmail} setLoginEmail={setLoginEmail}
            loginPassword={loginPassword} setLoginPassword={setLoginPassword}
            handleLogin={handleLogin} setCurrentView={setCurrentView} loading={loading}
        />}

      {(isLoggedIn && (currentView === "projects" || currentView === "create" || currentView === "edit-project")) && (
        <footer
          className="relative z-10 py-8 overflow-hidden"
          style={{
            background: "rgba(15, 23, 42, 0.95)",
            backdropFilter: "blur(20px)",
            borderTop: "1px solid rgba(59, 130, 246, 0.3)",
          }}
        >
          <div
            className="absolute inset-0 opacity-10"
            style={{
              background: `
                linear-gradient(90deg,
                  transparent,
                  rgba(59, 130, 246, 0.2),
                  transparent,
                  rgba(147, 51, 234, 0.2),
                  transparent
                )
              `,
              backgroundSize: "400% 100%",
              animation: "energyFlow 12s linear infinite",
            }}
          />
          <div className="container mx-auto px-4 text-center text-slate-400 relative">
            <p className="text-lg">&copy; 2025 Planeta Projeto – Explorando o infinito juntos.</p>
          </div>
        </footer>
      )}

      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scanLine { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes titleShine { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes energyFlow { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes orbit { 0% { transform: rotate(0deg) translateX(30px) rotate(0deg); } 100% { transform: rotate(360deg) translateX(30px) rotate(-360deg); } }
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        @keyframes gradientShift { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
      `}</style>
    </div>
  )
}
