"use client"

import { upload } from "@vercel/blob/client"
import { useState, useRef, useCallback, useEffect } from "react"
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

// Componente de fundo espacial OTIMIZADO para performance
const OptimizedSpaceBackground = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    let ticking = false

    const handleMouseMove = (e) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setMousePosition({
            x: (e.clientX / window.innerWidth) * 100,
            y: (e.clientY / window.innerHeight) * 100,
          })
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Gradiente base espacial - estático para performance */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 20% 20%, rgba(30, 41, 59, 0.9) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, rgba(67, 56, 202, 0.8) 0%, transparent 50%),
            linear-gradient(135deg, #0f172a 0%, #1e1b4b 25%, #312e81 50%, #1e1b4b 75%, #0f172a 100%)
          `,
        }}
      />

      {/* Buraco Negro Simplificado */}
      <div
        className="absolute opacity-80"
        style={{
          top: "15%",
          right: "10%",
          width: "200px",
          height: "200px",
          background: `
            radial-gradient(circle at center,
              transparent 30%,
              rgba(139, 92, 246, 0.2) 40%,
              rgba(59, 130, 246, 0.3) 50%,
              rgba(30, 41, 59, 0.8) 70%,
              transparent 90%
            )
          `,
          borderRadius: "50%",
          willChange: "transform",
          animation: "simpleRotate 20s linear infinite",
        }}
      >
        {/* Centro do buraco negro */}
        <div
          className="absolute top-1/2 left-1/2"
          style={{
            width: "40px",
            height: "40px",
            background: "radial-gradient(circle, #000000 0%, rgba(0,0,0,0.8) 80%, transparent 100%)",
            borderRadius: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>

      {/* Nebulosa Otimizada */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: `
            radial-gradient(ellipse 600px 300px at 30% 70%, rgba(139, 92, 246, 0.3) 0%, transparent 60%),
            radial-gradient(ellipse 400px 200px at 70% 30%, rgba(59, 130, 246, 0.25) 0%, transparent 60%)
          `,
          willChange: "transform",
          animation: "gentleFloat 30s ease-in-out infinite alternate",
          transform: `translate3d(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px, 0)`,
        }}
      />

      {/* Campo de Estrelas Reduzido - 50 estrelas em vez de 200 */}
      {[...Array(50)].map((_, i) => {
        const size = Math.random() * 2 + 1
        const brightness = Math.random() * 0.8 + 0.2
        const delay = Math.random() * 5

        return (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${size}px`,
              height: `${size}px`,
              backgroundColor: "#ffffff",
              opacity: brightness,
              willChange: "opacity",
              animation: `gentleTwinkle ${3 + Math.random() * 2}s ease-in-out infinite`,
              animationDelay: `${delay}s`,
            }}
          />
        )
      })}

      {/* Constelações Simplificadas */}
      <svg className="absolute inset-0 w-full h-full opacity-30" style={{ pointerEvents: "none" }}>
        {/* Constelação simples */}
        <g opacity="0.6">
          <line x1="15%" y1="25%" x2="20%" y2="30%" stroke="rgba(59, 130, 246, 0.5)" strokeWidth="1" />
          <line x1="20%" y1="30%" x2="25%" y2="25%" stroke="rgba(59, 130, 246, 0.5)" strokeWidth="1" />
          <line x1="25%" y1="25%" x2="30%" y2="35%" stroke="rgba(59, 130, 246, 0.5)" strokeWidth="1" />

          <circle cx="15%" cy="25%" r="2" fill="rgba(255, 255, 255, 0.8)" />
          <circle cx="20%" cy="30%" r="3" fill="rgba(59, 130, 246, 0.8)" />
          <circle cx="25%" cy="25%" r="2" fill="rgba(255, 255, 255, 0.8)" />
          <circle cx="30%" cy="35%" r="2" fill="rgba(147, 51, 234, 0.8)" />
        </g>

        <g opacity="0.5">
          <line x1="70%" y1="20%" x2="75%" y2="15%" stroke="rgba(147, 51, 234, 0.5)" strokeWidth="1" />
          <line x1="75%" y1="15%" x2="80%" y2="25%" stroke="rgba(147, 51, 234, 0.5)" strokeWidth="1" />

          <circle cx="70%" cy="20%" r="2" fill="rgba(255, 255, 255, 0.7)" />
          <circle cx="75%" cy="15%" r="2" fill="rgba(147, 51, 234, 0.8)" />
          <circle cx="80%" cy="25%" r="2" fill="rgba(255, 255, 255, 0.7)" />
        </g>
      </svg>

      {/* Meteoro Único e Simples */}
      <div
        className="absolute opacity-60"
        style={{
          left: "10%",
          top: "20%",
          willChange: "transform",
          animation: "simpleMeteor 12s linear infinite",
        }}
      >
        <div
          className="w-1 h-20 bg-gradient-to-b from-white via-blue-300 to-transparent"
          style={{
            transform: "rotate(45deg)",
            filter: "blur(0.5px)",
          }}
        />
      </div>

      {/* Planetas Simplificados */}
      <div className="absolute inset-0">
        {/* Planeta Principal */}
        <div
          className="absolute top-32 left-16 w-32 h-32 rounded-full opacity-70"
          style={{
            background: `
              radial-gradient(circle at 30% 30%,
                #60a5fa 0%,
                #3b82f6 50%,
                #1e40af 100%
              )
            `,
            willChange: "transform",
            animation: "slowRotate 40s linear infinite",
          }}
        >
          {/* Anel simples */}
          <div
            className="absolute rounded-full border opacity-40"
            style={{
              width: "160%",
              height: "160%",
              top: "-30%",
              left: "-30%",
              borderColor: "rgba(59, 130, 246, 0.3)",
              borderWidth: "1px",
              transform: "rotateX(75deg)",
            }}
          />
        </div>

        {/* Planeta Menor */}
        <div
          className="absolute bottom-40 right-32 w-20 h-20 rounded-full opacity-60"
          style={{
            background: `
              radial-gradient(circle at 40% 40%,
                #f472b6 0%,
                #ec4899 50%,
                #be185d 100%
              )
            `,
            willChange: "transform",
            animation: "slowRotate 50s linear infinite reverse",
          }}
        />
      </div>

      {/* Partículas Cósmicas Reduzidas - 10 em vez de 30 */}
      {[...Array(10)].map((_, i) => (
        <div
          key={`cosmic-${i}`}
          className="absolute rounded-full opacity-40"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 2 + 1}px`,
            height: `${Math.random() * 2 + 1}px`,
            backgroundColor: ["#60a5fa", "#a78bfa", "#f472b6"][Math.floor(Math.random() * 3)],
            willChange: "transform",
            animation: `gentleFloat ${20 + Math.random() * 10}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}

      {/* Efeito de Paralaxe Otimizado */}
      <div
        className="absolute inset-0 opacity-10 transition-opacity duration-500"
        style={{
          background: `
            radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%,
              rgba(59, 130, 246, 0.2) 0%,
              transparent 50%
            )
          `,
        }}
      />

      {/* CSS Animations Otimizadas */}
      <style jsx>{`
        @keyframes simpleRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes slowRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes gentleFloat {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(10px, -10px, 0) scale(1.05);
          }
        }

        @keyframes gentleTwinkle {
          0%, 100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.2);
          }
        }

        @keyframes simpleMeteor {
          0% {
            transform: translate3d(-50px, -50px, 0) rotate(45deg);
            opacity: 0;
          }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% {
            transform: translate3d(100vw, 100vh, 0) rotate(45deg);
            opacity: 0;
          }
        }

        /* Otimizações de performance */
        * {
          backface-visibility: hidden;
          perspective: 1000px;
        }
      `}</style>
    </div>
  )
}

// Componente de Card Otimizado
const OptimizedCard = ({ children, className = "", onClick }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={`relative ${className} cursor-pointer transition-all duration-300 transform hover:scale-105 hover:-translate-y-2`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      style={{
        willChange: "transform",
      }}
    >
      {/* Efeito de borda simples */}
      {isHovered && (
        <div className="absolute inset-0 rounded-lg pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-60" />
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-60" />
          <div className="absolute left-0 top-0 w-0.5 h-full bg-gradient-to-b from-transparent via-blue-400 to-transparent opacity-60" />
          <div className="absolute right-0 top-0 w-0.5 h-full bg-gradient-to-b from-transparent via-purple-400 to-transparent opacity-60" />
        </div>
      )}

      {children}
    </div>
  )
}

export default function PlanetaProjeto() {
  const [currentView, setCurrentView] = useState("login")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [selectedProject, setSelectedProject] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [loading, setLoading] = useState(false)

  // Usar useRef para evitar re-renderizações
  const loginEmailRef = useRef("")
  const loginPasswordRef = useRef("")
  const registerEmailRef = useRef("")
  const registerPasswordRef = useRef("")
  const [newComment, setNewComment] = useState("")

  // Dados mockados dos usuários e projetos
  const [users, setUsers] = useState([
    { id: 1, email: "admin@planeta.com", password: "123456", isAdmin: true },
    { id: 2, email: "user@planeta.com", password: "123456", isAdmin: false },
  ])

  const [projects, setProjects] = useState([
    {
      id: 1,
      title: "Sistema Solar Interativo",
      description: "Projeto educacional sobre o sistema solar com realidade aumentada para estudantes do ensino médio",
      category: "Educação",
      author: "João Silva",
      authorId: 2,
      date: "2024-12-15",
      views: 245,
      ods: [4, 9],
      comments: [
        { id: 1, author: "Maria Santos", content: "Projeto incrível! Muito bem elaborado.", date: "2024-12-16" },
        {
          id: 2,
          author: "Pedro Costa",
          content: "Gostaria de saber mais sobre a implementação da RA.",
          date: "2024-12-16",
        },
      ],
      images: ["/placeholder.svg?height=300&width=400"],
      videos: [],
      pdfs: [],
      content:
        "Este projeto visa criar uma experiência imersiva de aprendizado sobre o sistema solar usando tecnologia de realidade aumentada. Os estudantes podem visualizar planetas em 3D e interagir com eles de forma educativa.",
    },
    {
      id: 2,
      title: "Robô Explorador Espacial",
      description: "Desenvolvimento de um robô autônomo para exploração de terrenos simulando Marte",
      category: "Tecnologia",
      author: "Maria Santos",
      authorId: 3,
      date: "2024-12-10",
      views: 189,
      ods: [9, 11],
      comments: [{ id: 3, author: "Ana Lima", content: "Que tecnologia impressionante!", date: "2024-12-11" }],
      images: ["/placeholder.svg?height=300&width=400"],
      videos: [],
      pdfs: [],
      content:
        "O objetivo deste projeto é desenvolver um robô autônomo capaz de navegar em terrenos rochosos e coletar amostras, simulando missões espaciais reais em Marte.",
    },
    {
      id: 3,
      title: "Estação Meteorológica Espacial",
      description: "Monitoramento climático usando sensores avançados e comunicação via satélite",
      category: "Ciência",
      author: "Pedro Costa",
      authorId: 4,
      date: "2024-12-05",
      views: 156,
      ods: [13, 14],
      comments: [],
      images: ["/placeholder.svg?height=300&width=400"],
      videos: [],
      pdfs: [],
      content:
        "Esta estação meteorológica utiliza tecnologia espacial para coletar dados climáticos em tempo real e transmiti-los via satélite para análise científica.",
    },
  ])

  const odsOptions = [
    { id: 1, name: "Erradicação da Pobreza", color: "#E5243B" },
    { id: 2, name: "Fome Zero", color: "#DDA63A" },
    { id: 3, name: "Saúde e Bem-Estar", color: "#4C9F38" },
    { id: 4, name: "Educação de Qualidade", color: "#C5192D" },
    { id: 5, name: "Igualdade de Gênero", color: "#FF3A21" },
    { id: 6, name: "Água Potável e Saneamento", color: "#26BDE2" },
    { id: 7, name: "Energia Limpa e Acessível", color: "#FCC30B" },
    { id: 8, name: "Trabalho Decente", color: "#A21942" },
    { id: 9, name: "Inovação e Infraestrutura", color: "#FD6925" },
    { id: 10, name: "Redução das Desigualdades", color: "#DD1367" },
    { id: 11, name: "Cidades Sustentáveis", color: "#FD9D24" },
    { id: 12, name: "Consumo Responsável", color: "#BF8B2E" },
    { id: 13, name: "Ação Contra Mudança Climática", color: "#3F7E44" },
    { id: 14, name: "Vida na Água", color: "#0A97D9" },
    { id: 15, name: "Vida Terrestre", color: "#56C02B" },
    { id: 16, name: "Paz e Justiça", color: "#00689D" },
    { id: 17, name: "Parcerias", color: "#19486A" },
  ]

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || project.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const categories = ["all", "Educação", "Tecnologia", "Ciência", "Sustentabilidade"]

  // Função para verificar se o usuário pode editar/deletar um projeto
  const canEditProject = (project) => {
    if (!currentUser) return false
    return currentUser.isAdmin || currentUser.id === project.authorId
  }

  // Funções de autenticação usando useCallback para evitar re-criação
  const handleLogin = useCallback(async () => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const user = users.find((u) => u.email === loginEmailRef.current && u.password === loginPasswordRef.current)
    if (user) {
      setCurrentUser(user)
      setIsLoggedIn(true)
      setCurrentView("projects")
      loginEmailRef.current = ""
      loginPasswordRef.current = ""
    } else {
      alert("Email ou senha incorretos!")
    }
    setLoading(false)
  }, [users])

  const handleRegister = useCallback(async () => {
    if (!registerEmailRef.current || !registerPasswordRef.current) {
      alert("Preencha todos os campos!")
      return
    }

    if (users.find((u) => u.email === registerEmailRef.current)) {
      alert("Este email já está cadastrado!")
      return
    }

    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newUser = {
      id: Date.now(),
      email: registerEmailRef.current,
      password: registerPasswordRef.current,
      isAdmin: false,
    }

    setUsers([...users, newUser])
    alert("Conta criada com sucesso!")
    setCurrentView("login")
    registerEmailRef.current = ""
    registerPasswordRef.current = ""
    setLoading(false)
  }, [users])

  const handleLogout = useCallback(() => {
    setCurrentUser(null)
    setIsLoggedIn(false)
    setCurrentView("login")
  }, [])

  // Componente de Login ULTRA SIMPLES
  const LoginView = () => (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "rgba(15, 23, 42, 0.95)",
          padding: "30px",
          borderRadius: "15px",
          border: "1px solid rgba(59, 130, 246, 0.3)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5), 0 0 50px rgba(59, 130, 246, 0.1)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div
            style={{
              width: "80px",
              height: "80px",
              background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
              borderRadius: "50%",
              margin: "0 auto 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "30px",
              boxShadow: "0 0 30px rgba(59, 130, 246, 0.5)",
            }}
          >
            🌎
          </div>
          <h1 style={{ color: "white", fontSize: "28px", margin: "0 0 10px 0", fontWeight: "bold" }}>
            Planeta Projeto
          </h1>
          <p style={{ color: "#94a3b8", margin: 0 }}>Entre na sua conta para explorar o cosmos</p>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              color: "#e2e8f0",
              marginBottom: "8px",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            Email
          </label>
          <input
            type="email"
            placeholder="seu@email.com"
            defaultValue=""
            onChange={(e) => {
              loginEmailRef.current = e.target.value
            }}
            style={{
              width: "100%",
              padding: "14px",
              backgroundColor: "rgba(51, 65, 85, 0.8)",
              border: "1px solid rgba(71, 85, 105, 0.8)",
              borderRadius: "8px",
              color: "white",
              fontSize: "16px",
              outline: "none",
              boxSizing: "border-box",
              transition: "all 0.3s ease",
            }}
          />
        </div>

        <div style={{ marginBottom: "30px" }}>
          <label
            style={{
              display: "block",
              color: "#e2e8f0",
              marginBottom: "8px",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            Senha
          </label>
          <input
            type="password"
            placeholder="••••••••"
            defaultValue=""
            onChange={(e) => {
              loginPasswordRef.current = e.target.value
            }}
            style={{
              width: "100%",
              padding: "14px",
              backgroundColor: "rgba(51, 65, 85, 0.8)",
              border: "1px solid rgba(71, 85, 105, 0.8)",
              borderRadius: "8px",
              color: "white",
              fontSize: "16px",
              outline: "none",
              boxSizing: "border-box",
              transition: "all 0.3s ease",
            }}
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            background: loading ? "#6b7280" : "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: loading ? "not-allowed" : "pointer",
            marginBottom: "20px",
            transition: "all 0.3s ease",
            boxShadow: loading ? "none" : "0 0 20px rgba(59, 130, 246, 0.3)",
          }}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>

        <div style={{ textAlign: "center" }}>
          <button
            onClick={() => setCurrentView("register")}
            style={{
              background: "none",
              border: "none",
              color: "#60a5fa",
              fontSize: "14px",
              cursor: "pointer",
              textDecoration: "underline",
              transition: "color 0.3s ease",
            }}
          >
            Não tem conta? Criar conta
          </button>
        </div>
      </div>
    </div>
  )

  // Componente de Registro ULTRA SIMPLES
  const RegisterView = () => (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "rgba(15, 23, 42, 0.95)",
          padding: "30px",
          borderRadius: "15px",
          border: "1px solid rgba(139, 92, 246, 0.3)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5), 0 0 50px rgba(139, 92, 246, 0.1)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div
            style={{
              width: "80px",
              height: "80px",
              background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
              borderRadius: "50%",
              margin: "0 auto 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "30px",
              boxShadow: "0 0 30px rgba(139, 92, 246, 0.5)",
            }}
          >
            👤
          </div>
          <h1 style={{ color: "white", fontSize: "28px", margin: "0 0 10px 0", fontWeight: "bold" }}>Criar Conta</h1>
          <p style={{ color: "#94a3b8", margin: 0 }}>Junte-se à nossa comunidade espacial</p>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              color: "#e2e8f0",
              marginBottom: "8px",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            Email
          </label>
          <input
            type="email"
            placeholder="seu@email.com"
            defaultValue=""
            onChange={(e) => {
              registerEmailRef.current = e.target.value
            }}
            style={{
              width: "100%",
              padding: "14px",
              backgroundColor: "rgba(51, 65, 85, 0.8)",
              border: "1px solid rgba(71, 85, 105, 0.8)",
              borderRadius: "8px",
              color: "white",
              fontSize: "16px",
              outline: "none",
              boxSizing: "border-box",
              transition: "all 0.3s ease",
            }}
          />
        </div>

        <div style={{ marginBottom: "30px" }}>
          <label
            style={{
              display: "block",
              color: "#e2e8f0",
              marginBottom: "8px",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            Senha
          </label>
          <input
            type="password"
            placeholder="••••••••"
            defaultValue=""
            onChange={(e) => {
              registerPasswordRef.current = e.target.value
            }}
            style={{
              width: "100%",
              padding: "14px",
              backgroundColor: "rgba(51, 65, 85, 0.8)",
              border: "1px solid rgba(71, 85, 105, 0.8)",
              borderRadius: "8px",
              color: "white",
              fontSize: "16px",
              outline: "none",
              boxSizing: "border-box",
              transition: "all 0.3s ease",
            }}
          />
        </div>

        <button
          onClick={handleRegister}
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            background: loading ? "#6b7280" : "linear-gradient(135deg, #8b5cf6, #ec4899)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: loading ? "not-allowed" : "pointer",
            marginBottom: "20px",
            transition: "all 0.3s ease",
            boxShadow: loading ? "none" : "0 0 20px rgba(139, 92, 246, 0.3)",
          }}
        >
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button>

        <div style={{ textAlign: "center" }}>
          <button
            onClick={() => setCurrentView("login")}
            style={{
              background: "none",
              border: "none",
              color: "#a78bfa",
              fontSize: "14px",
              cursor: "pointer",
              textDecoration: "underline",
              transition: "color 0.3s ease",
            }}
          >
            Já tem conta? Entrar
          </button>
        </div>
      </div>
    </div>
  )

  // Componente de Projetos com design futurístico
  const ProjectsView = () => (
    <div className="min-h-screen relative z-10">
      {/* Header Futurístico */}
      <header
        className="sticky top-0 z-50 relative overflow-hidden"
        style={{
          background: "rgba(15, 23, 42, 0.95)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(59, 130, 246, 0.3)",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
          minHeight: "80px", // Garantir altura mínima
        }}
      >
        {/* Efeito de energia no header */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background: `
              linear-gradient(90deg,
                transparent,
                rgba(59, 130, 246, 0.1),
                transparent
              )
            `,
          }}
        />

        <div className="container mx-auto px-4 py-4 relative">
          <div className="flex items-center justify-between min-h-[48px]">
            <div className="flex items-center gap-4">
              <div
                className="relative p-3 rounded-full"
                style={{
                  background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                  boxShadow: "0 0 30px rgba(59, 130, 246, 0.5)",
                }}
              >
                <Planet className="h-8 w-8 text-white animate-spin" style={{ animationDuration: "10s" }} />

                {/* Partículas orbitais */}
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-blue-300 rounded-full"
                    style={{
                      top: `${Math.sin((i * Math.PI) / 3) * 25 + 50}%`,
                      left: `${Math.cos((i * Math.PI) / 3) * 25 + 50}%`,
                      animation: `orbit ${3 + i * 0.3}s linear infinite`,
                      transformOrigin: "50% 50%",
                    }}
                  />
                ))}
              </div>

              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-white">
                  Planeta Projeto{" "}
                  <span className="inline-block animate-pulse" style={{ animationDelay: "1s" }}>
                    🌎
                  </span>
                </h1>
                {currentUser?.isAdmin && (
                  <Badge
                    className="flex items-center gap-2 px-3 py-1"
                    style={{
                      background: "linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.3))",
                      border: "1px solid rgba(239, 68, 68, 0.4)",
                      color: "#fca5a5",
                      boxShadow: "0 0 15px rgba(239, 68, 68, 0.3)",
                    }}
                  >
                    <Shield className="h-4 w-4" />
                    Admin
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={() => setCurrentView("create")}
                className="relative overflow-hidden group h-12 px-6"
                style={{
                  background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                  border: "none",
                  boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)",
                  transition: "all 0.3s ease",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <Plus className="mr-2 h-5 w-5" />
                Postar Projeto
              </Button>

              <Button
                onClick={handleLogout}
                variant="outline"
                className="relative overflow-hidden group bg-transparent h-12 px-6"
                style={{
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.4)",
                  color: "#fca5a5",
                  boxShadow: "0 0 15px rgba(239, 68, 68, 0.2)",
                  transition: "all 0.3s ease",
                  minWidth: "100px", // Garantir largura mínima
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6 pt-12">
        <div className="max-w-7xl mx-auto">
          {/* Título com efeitos */}
          <div className="text-center mb-16">
            <h2
              className="text-5xl font-bold text-white mb-6 relative"
              style={{
                textShadow: "0 0 30px rgba(59, 130, 246, 0.5)",
              }}
            >
              Projetos Espaciais
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-300/20 to-transparent"
                style={{
                  animation: "titleShine 3s ease-in-out infinite",
                  backgroundSize: "200% 100%",
                }}
              />
            </h2>
            <p className="text-slate-300 text-xl">Explore as inovações da nossa galáxia</p>
          </div>

          {/* Filtros e Busca futurísticos */}
          <div className="flex flex-col md:flex-row gap-6 mb-12">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-4 h-5 w-5 text-slate-400 group-focus-within:text-blue-400 transition-colors z-10" />
              <Input
                placeholder="Buscar projetos no cosmos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-14 text-lg relative"
                style={{
                  background: "rgba(51, 65, 85, 0.8)",
                  border: "1px solid rgba(71, 85, 105, 0.8)",
                  borderRadius: "12px",
                  color: "white",
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 0 20px rgba(59, 130, 246, 0.1)",
                  transition: "all 0.3s ease",
                }}
              />
            </div>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-6 py-4 text-lg rounded-xl"
              style={{
                background: "rgba(51, 65, 85, 0.8)",
                border: "1px solid rgba(71, 85, 105, 0.8)",
                color: "white",
                backdropFilter: "blur(10px)",
                boxShadow: "0 0 20px rgba(59, 130, 246, 0.1)",
                transition: "all 0.3s ease",
              }}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat} style={{ background: "#334155" }}>
                  {cat === "all" ? "Todas as Categorias" : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Grid de Projetos com efeitos futurísticos */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <OptimizedCard
                key={project.id}
                className="relative"
                onClick={() => {
                  setSelectedProject(project)
                  setCurrentView("project-detail")
                }}
              >
                <Card
                  className="relative overflow-hidden"
                  style={{
                    background: "rgba(51, 65, 85, 0.8)",
                    border: "1px solid rgba(71, 85, 105, 0.8)",
                    borderRadius: "16px",
                    backdropFilter: "blur(20px)",
                    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.3), 0 0 30px rgba(59, 130, 246, 0.1)",
                    transition: "all 0.5s ease",
                    animationDelay: `${index * 0.1}s`,
                    animation: "fadeInUp 0.8s ease-out forwards",
                  }}
                >
                  {/* Efeito de scan line */}
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      background: `
                        linear-gradient(90deg,
                          transparent,
                          rgba(59, 130, 246, 0.4),
                          transparent
                        )
                      `,
                      backgroundSize: "200% 100%",
                      animation: `scanLine ${6 + index * 0.5}s linear infinite`,
                    }}
                  />

                  <CardHeader className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex flex-col gap-3">
                        <Badge
                          className="w-fit relative overflow-hidden"
                          style={{
                            background: "linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.3))",
                            border: "1px solid rgba(59, 130, 246, 0.4)",
                            color: "#93c5fd",
                            boxShadow: "0 0 15px rgba(59, 130, 246, 0.3)",
                          }}
                        >
                          <Sparkles className="mr-1 h-3 w-3" />
                          {project.category}
                        </Badge>

                        {project.ods && project.ods.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {project.ods.slice(0, 3).map((odsId) => {
                              const ods = odsOptions.find((o) => o.id === odsId)
                              return ods ? (
                                <div
                                  key={odsId}
                                  className="text-xs px-3 py-1 rounded-full text-white font-medium"
                                  style={{
                                    backgroundColor: ods.color,
                                    boxShadow: `0 0 10px ${ods.color}40`,
                                  }}
                                  title={ods.name}
                                >
                                  ODS {odsId}
                                </div>
                              ) : null
                            })}
                            {project.ods.length > 3 && (
                              <div
                                className="text-xs px-3 py-1 rounded-full text-white font-medium"
                                style={{
                                  background: "rgba(71, 85, 105, 0.8)",
                                  boxShadow: "0 0 10px rgba(71, 85, 105, 0.4)",
                                }}
                              >
                                +{project.ods.length - 3}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-3">
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <Eye className="h-4 w-4" />
                          <span className="font-mono">{project.views}</span>
                        </div>
                        {canEditProject(project) && (
                          <Badge
                            className="text-xs"
                            style={{
                              background: "linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(22, 163, 74, 0.3))",
                              border: "1px solid rgba(34, 197, 94, 0.4)",
                              color: "#86efac",
                              boxShadow: "0 0 15px rgba(34, 197, 94, 0.3)",
                            }}
                          >
                            {currentUser?.isAdmin ? "Admin" : "Seu"}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <CardTitle
                      className="text-white text-xl mb-3 group-hover:text-blue-300 transition-colors duration-300"
                      style={{
                        textShadow: "0 0 10px rgba(255, 255, 255, 0.3)",
                      }}
                    >
                      {project.title}
                    </CardTitle>
                    <CardDescription className="text-slate-300 leading-relaxed">{project.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar
                          className="h-8 w-8"
                          style={{
                            border: "2px solid rgba(59, 130, 246, 0.4)",
                            boxShadow: "0 0 15px rgba(59, 130, 246, 0.3)",
                          }}
                        >
                          <AvatarFallback
                            className="text-white text-sm font-bold"
                            style={{
                              background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                            }}
                          >
                            {project.author
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-slate-300 font-medium">{project.author}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <MessageCircle className="h-4 w-4" />
                        <span className="font-mono">{project.comments.length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </OptimizedCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  // Outros componentes mantidos iguais mas com melhorias visuais...
  const CreateProjectView = () => {
    const [projectData, setProjectData] = useState({
      title: "",
      category: "Educação",
      description: "",
      ods: [],
      images: [],
      videos: [],
      pdfs: [],
    })
    const [uploading, setUploading] = useState(false)

    const imageInputRef = useRef(null)
    const videoInputRef = useRef(null)
    const pdfInputRef = useRef(null)

    const handleFileUpload = async (files, type) => {
      if (!files || files.length === 0) return

      setUploading(true)
      const uploadedFiles = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        try {
          const blob = await upload(file.name, file, {
            access: "public",
            handleUploadUrl: "/api/upload",
          })

          uploadedFiles.push({
            name: file.name,
            url: blob.url,
            size: file.size,
          })
        } catch (error) {
          console.error("Upload failed:", error)
        }
      }

      setProjectData((prev) => ({
        ...prev,
        [type]: [...prev[type], ...uploadedFiles],
      }))

      setUploading(false)
    }

    const removeFile = (type, index) => {
      setProjectData((prev) => ({
        ...prev,
        [type]: prev[type].filter((_, i) => i !== index),
      }))
    }

    const handleSubmit = async () => {
      if (!projectData.title || !projectData.description) {
        alert("Por favor, preencha todos os campos obrigatórios")
        return
      }

      setLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const newProject = {
        id: Date.now(),
        title: projectData.title,
        description: projectData.description,
        category: projectData.category,
        ods: projectData.ods,
        author: currentUser.email.split("@")[0],
        authorId: currentUser.id,
        date: new Date().toISOString().split("T")[0],
        views: 0,
        comments: [],
        images: projectData.images.map((img) => img.url),
        videos: projectData.videos.map((vid) => vid.url),
        pdfs: projectData.pdfs.map((pdf) => pdf.url),
        content: projectData.description,
      }

      setProjects((prev) => [newProject, ...prev])
      alert("Projeto enviado com sucesso!")
      setCurrentView("projects")

      setProjectData({
        title: "",
        category: "Educação",
        description: "",
        ods: [],
        images: [],
        videos: [],
        pdfs: [],
      })
      setLoading(false)
    }

    return (
      <div className="min-h-screen relative z-10">
        {/* Header igual ao ProjectsView */}
        <header
          className="sticky top-0 z-50 relative overflow-hidden"
          style={{
            background: "rgba(15, 23, 42, 0.95)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(59, 130, 246, 0.3)",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
            minHeight: "80px",
          }}
        >
          <div
            className="absolute inset-0 opacity-10"
            style={{
              background: `
                linear-gradient(90deg,
                  transparent,
                  rgba(59, 130, 246, 0.1),
                  transparent
                )
              `,
            }}
          />

          <div className="container mx-auto px-4 py-4 relative">
            <div className="flex items-center justify-between min-h-[48px]">
              <div className="flex items-center gap-4">
                <div
                  className="relative p-3 rounded-full"
                  style={{
                    background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                    boxShadow: "0 0 30px rgba(59, 130, 246, 0.5)",
                  }}
                >
                  <Planet className="h-8 w-8 text-white animate-spin" style={{ animationDuration: "10s" }} />
                </div>
                <h1 className="text-2xl font-bold text-white">Planeta Projeto 🌎</h1>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  onClick={() => setCurrentView("projects")}
                  variant="outline"
                  className="relative overflow-hidden h-12 px-6"
                  style={{
                    background: "rgba(71, 85, 105, 0.8)",
                    border: "1px solid rgba(71, 85, 105, 0.8)",
                    color: "#e2e8f0",
                    boxShadow: "0 0 15px rgba(71, 85, 105, 0.3)",
                  }}
                >
                  Voltar
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="relative overflow-hidden bg-transparent h-12 px-6"
                  style={{
                    background: "rgba(239, 68, 68, 0.1)",
                    border: "1px solid rgba(239, 68, 68, 0.4)",
                    color: "#fca5a5",
                    boxShadow: "0 0 15px rgba(239, 68, 68, 0.2)",
                    minWidth: "100px",
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 pt-12">
          <div className="max-w-5xl mx-auto">
            <OptimizedCard>
              <Card
                className="relative overflow-hidden"
                style={{
                  background: "rgba(51, 65, 85, 0.8)",
                  border: "1px solid rgba(71, 85, 105, 0.8)",
                  borderRadius: "20px",
                  backdropFilter: "blur(20px)",
                  boxShadow: "0 25px 50px rgba(0, 0, 0, 0.3), 0 0 30px rgba(59, 130, 246, 0.1)",
                }}
              >
                <CardHeader>
                  <CardTitle
                    className="text-3xl text-white flex items-center gap-3"
                    style={{
                      textShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
                    }}
                  >
                    <div
                      className="p-2 rounded-full"
                      style={{
                        background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                        boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
                      }}
                    >
                      <Plus className="h-6 w-6 text-white" />
                    </div>
                    Postar Projeto
                  </CardTitle>
                  <CardDescription className="text-slate-300 text-lg">
                    Compartilhe sua inovação com a galáxia
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-slate-200 text-lg font-medium">Título do Projeto *</Label>
                      <Input
                        placeholder="Nome do seu projeto"
                        value={projectData.title}
                        onChange={(e) => setProjectData((prev) => ({ ...prev, title: e.target.value }))}
                        className="h-12 text-lg"
                        style={{
                          background: "rgba(71, 85, 105, 0.8)",
                          border: "1px solid rgba(71, 85, 105, 0.8)",
                          borderRadius: "10px",
                          color: "white",
                          backdropFilter: "blur(10px)",
                        }}
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-slate-200 text-lg font-medium">Categoria</Label>
                      <select
                        value={projectData.category}
                        onChange={(e) => setProjectData((prev) => ({ ...prev, category: e.target.value }))}
                        className="w-full px-4 py-3 text-lg rounded-lg"
                        style={{
                          background: "rgba(71, 85, 105, 0.8)",
                          border: "1px solid rgba(71, 85, 105, 0.8)",
                          color: "white",
                          backdropFilter: "blur(10px)",
                        }}
                      >
                        <option>Educação</option>
                        <option>Tecnologia</option>
                        <option>Ciência</option>
                        <option>Sustentabilidade</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-slate-200 text-lg font-medium">Descrição *</Label>
                    <Textarea
                      placeholder="Descreva seu projeto..."
                      value={projectData.description}
                      onChange={(e) => setProjectData((prev) => ({ ...prev, description: e.target.value }))}
                      className="min-h-[180px] text-lg"
                      style={{
                        background: "rgba(71, 85, 105, 0.8)",
                        border: "1px solid rgba(71, 85, 105, 0.8)",
                        borderRadius: "10px",
                        color: "white",
                        backdropFilter: "blur(10px)",
                      }}
                    />
                  </div>

                  {/* Upload de Arquivos */}
                  <div className="space-y-8">
                    <h3 className="text-white font-semibold text-2xl flex items-center gap-2">
                      <Zap className="h-6 w-6 text-blue-400" />
                      Arquivos do Projeto
                    </h3>

                    <div className="grid md:grid-cols-3 gap-8">
                      {/* Upload de Imagens */}
                      <div
                        className="p-6 rounded-xl border"
                        style={{
                          background: "rgba(71, 85, 105, 0.4)",
                          border: "1px solid rgba(71, 85, 105, 0.6)",
                          backdropFilter: "blur(10px)",
                        }}
                      >
                        <Label className="text-slate-200 flex items-center gap-3 mb-4 text-lg font-medium">
                          <ImageIcon className="h-6 w-6 text-blue-400" />
                          Imagens
                        </Label>
                        <input
                          ref={imageInputRef}
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e.target.files, "images")}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full h-12 relative overflow-hidden bg-transparent"
                          onClick={() => imageInputRef.current?.click()}
                          disabled={uploading}
                          style={{
                            background: "rgba(59, 130, 246, 0.1)",
                            border: "1px solid rgba(59, 130, 246, 0.4)",
                            color: "#93c5fd",
                            boxShadow: "0 0 15px rgba(59, 130, 246, 0.2)",
                          }}
                        >
                          <UploadIcon className="mr-2 h-5 w-5" />
                          {uploading ? "Enviando..." : "Selecionar Imagens"}
                        </Button>

                        {projectData.images.length > 0 && (
                          <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
                            {projectData.images.map((file, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between p-3 rounded-lg text-sm"
                                style={{
                                  background: "rgba(51, 65, 85, 0.6)",
                                  border: "1px solid rgba(71, 85, 105, 0.4)",
                                }}
                              >
                                <span className="text-slate-300 truncate">{file.name}</span>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => removeFile("images", idx)}
                                  className="text-red-400 hover:text-red-300 h-8 w-8 p-0"
                                >
                                  ×
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Upload de Vídeos */}
                      <div
                        className="p-6 rounded-xl border"
                        style={{
                          background: "rgba(71, 85, 105, 0.4)",
                          border: "1px solid rgba(71, 85, 105, 0.6)",
                          backdropFilter: "blur(10px)",
                        }}
                      >
                        <Label className="text-slate-200 flex items-center gap-3 mb-4 text-lg font-medium">
                          <Video className="h-6 w-6 text-purple-400" />
                          Vídeos
                        </Label>
                        <input
                          ref={videoInputRef}
                          type="file"
                          accept="video/*"
                          capture="camcorder"
                          onChange={(e) => handleFileUpload(e.target.files, "videos")}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full h-12 relative overflow-hidden bg-transparent"
                          onClick={() => videoInputRef.current?.click()}
                          disabled={uploading}
                          style={{
                            background: "rgba(139, 92, 246, 0.1)",
                            border: "1px solid rgba(139, 92, 246, 0.4)",
                            color: "#c4b5fd",
                            boxShadow: "0 0 15px rgba(139, 92, 246, 0.2)",
                          }}
                        >
                          <UploadIcon className="mr-2 h-5 w-5" />
                          {uploading ? "Enviando..." : "Selecionar Vídeo"}
                        </Button>

                        {projectData.videos.length > 0 && (
                          <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
                            {projectData.videos.map((vid, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between p-3 rounded-lg text-sm"
                                style={{
                                  background: "rgba(51, 65, 85, 0.6)",
                                  border: "1px solid rgba(71, 85, 105, 0.4)",
                                }}
                              >
                                <span className="text-slate-300 truncate">{vid.name}</span>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => removeFile("videos", idx)}
                                  className="text-red-400 hover:text-red-300 h-8 w-8 p-0"
                                >
                                  ×
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Upload de PDFs */}
                      <div
                        className="p-6 rounded-xl border"
                        style={{
                          background: "rgba(71, 85, 105, 0.4)",
                          border: "1px solid rgba(71, 85, 105, 0.6)",
                          backdropFilter: "blur(10px)",
                        }}
                      >
                        <Label className="text-slate-200 flex items-center gap-3 mb-4 text-lg font-medium">
                          <FileText className="h-6 w-6 text-green-400" />
                          Documentos PDF
                        </Label>
                        <input
                          ref={pdfInputRef}
                          type="file"
                          multiple
                          accept=".pdf"
                          onChange={(e) => handleFileUpload(e.target.files, "pdfs")}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full h-12 relative overflow-hidden bg-transparent"
                          onClick={() => pdfInputRef.current?.click()}
                          disabled={uploading}
                          style={{
                            background: "rgba(34, 197, 94, 0.1)",
                            border: "1px solid rgba(34, 197, 94, 0.4)",
                            color: "#86efac",
                            boxShadow: "0 0 15px rgba(34, 197, 94, 0.2)",
                          }}
                        >
                          <UploadIcon className="mr-2 h-5 w-5" />
                          {uploading ? "Enviando..." : "Selecionar PDFs"}
                        </Button>

                        {projectData.pdfs.length > 0 && (
                          <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
                            {projectData.pdfs.map((pdf, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between p-3 rounded-lg text-sm"
                                style={{
                                  background: "rgba(51, 65, 85, 0.6)",
                                  border: "1px solid rgba(71, 85, 105, 0.4)",
                                }}
                              >
                                <span className="text-slate-300 truncate">{pdf.name}</span>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => removeFile("pdfs", idx)}
                                  className="text-red-400 hover:text-red-300 h-8 w-8 p-0"
                                >
                                  ×
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Seleção de ODS */}
                  <div className="space-y-4">
                    <Label className="text-slate-200 text-lg font-medium">
                      Objetivos de Desenvolvimento Sustentável (ODS)
                    </Label>
                    <div
                      className="p-6 rounded-xl border max-h-60 overflow-y-auto"
                      style={{
                        background: "rgba(71, 85, 105, 0.4)",
                        border: "1px solid rgba(71, 85, 105, 0.6)",
                        backdropFilter: "blur(10px)",
                      }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {odsOptions.map((ods) => (
                          <label
                            key={ods.id}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-600/30 cursor-pointer transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={projectData.ods.includes(ods.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setProjectData((prev) => ({ ...prev, ods: [...prev.ods, ods.id] }))
                                } else {
                                  setProjectData((prev) => ({ ...prev, ods: prev.ods.filter((id) => id !== ods.id) }))
                                }
                              }}
                              className="rounded border-slate-500 text-blue-600"
                            />
                            <div
                              className="w-5 h-5 rounded"
                              style={{
                                backgroundColor: ods.color,
                                boxShadow: `0 0 10px ${ods.color}40`,
                              }}
                            />
                            <span className="text-slate-300">
                              ODS {ods.id}: {ods.name}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {uploading && (
                    <div className="text-center py-6">
                      <div
                        className="inline-block w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"
                        style={{
                          boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
                        }}
                      />
                      <p className="text-slate-400 mt-4 text-lg">Enviando arquivos para o cosmos...</p>
                    </div>
                  )}

                  <div className="flex gap-6 pt-6">
                    <Button
                      className="flex-1 h-14 text-lg font-semibold relative overflow-hidden group"
                      onClick={handleSubmit}
                      disabled={uploading || loading}
                      style={{
                        background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                        border: "none",
                        boxShadow: "0 0 30px rgba(59, 130, 246, 0.4)",
                      }}
                    >
                      {(uploading || loading) && (
                        <div
                          className="absolute inset-0"
                          style={{
                            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                            animation: "shimmer 2s linear infinite",
                          }}
                        />
                      )}
                      {loading ? "Enviando..." : uploading ? "Processando..." : "Enviar Projeto"}
                    </Button>
                    <Button
                      variant="outline"
                      className="h-14 px-8 text-lg bg-transparent"
                      onClick={() => setCurrentView("projects")}
                      disabled={uploading || loading}
                      style={{
                        background: "rgba(71, 85, 105, 0.8)",
                        border: "1px solid rgba(71, 85, 105, 0.8)",
                        color: "#e2e8f0",
                        boxShadow: "0 0 15px rgba(71, 85, 105, 0.3)",
                      }}
                    >
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </OptimizedCard>
          </div>
        </div>
      </div>
    )
  }

  // Componente de Detalhes do Projeto com botões de editar/apagar
  const ProjectDetailView = () => {
    if (!selectedProject) return null

    const canEdit = canEditProject(selectedProject)

    const handleAddComment = () => {
      if (!newComment.trim()) return

      const comment = {
        id: Date.now(),
        author: currentUser.email.split("@")[0],
        content: newComment,
        date: new Date().toISOString().split("T")[0],
      }

      setProjects((prev) =>
        prev.map((p) => (p.id === selectedProject.id ? { ...p, comments: [...p.comments, comment] } : p)),
      )

      setSelectedProject((prev) => ({ ...prev, comments: [...prev.comments, comment] }))
      setNewComment("")
    }

    const handleEdit = () => {
      const newTitle = prompt("Novo título:", selectedProject.title)
      const newDesc = prompt("Nova descrição:", selectedProject.description)

      if (newTitle && newDesc) {
        setProjects((prev) =>
          prev.map((p) => (p.id === selectedProject.id ? { ...p, title: newTitle, description: newDesc } : p)),
        )
        setSelectedProject((prev) => ({ ...prev, title: newTitle, description: newDesc }))
        alert("Projeto atualizado!")
      }
    }

    const handleDelete = () => {
      if (confirm("Tem certeza que deseja apagar este projeto?")) {
        setProjects((prev) => prev.filter((p) => p.id !== selectedProject.id))
        setCurrentView("projects")
        alert("Projeto apagado!")
      }
    }

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{
          background: "rgba(0, 0, 0, 0.8)",
          backdropFilter: "blur(10px)",
          paddingTop: "80px", // Espaço para o header fixo
        }}
      >
        <div
          className="max-w-5xl max-h-[calc(90vh-80px)] overflow-y-auto w-full relative"
          style={{
            background: "rgba(15, 23, 42, 0.95)",
            border: "1px solid rgba(59, 130, 246, 0.3)",
            borderRadius: "20px",
            backdropFilter: "blur(20px)",
            boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5), 0 0 50px rgba(59, 130, 246, 0.2)",
            marginTop: "0", // Remove margem superior
          }}
        >
          {/* Header do Modal FIXO - não atrapalha visualização */}
          <div
            className="sticky top-0 left-0 right-0 z-[60] p-4 flex flex-wrap items-center justify-between gap-2 bg-slate-900/80 backdrop-blur-md border-b border-slate-700"
          >
            {/* Efeito de energia no header */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                background: `
                  linear-gradient(90deg,
                    transparent,
                    rgba(59, 130, 246, 0.3),
                    transparent
                  )
                `,
                backgroundSize: "200% 100%",
                animation: "scanLine 6s linear infinite",
              }}
            />

            <div className="flex items-center gap-2">
              <Button
                onClick={() => setCurrentView("projects")}
                variant="outline"
                className="h-11 px-4 text-sm"
                style={{
                  background: "rgba(71, 85, 105, 0.8)",
                  border: "1px solid rgba(71, 85, 105, 0.8)",
                  color: "#e2e8f0",
                  boxShadow: "0 0 15px rgba(71, 85, 105, 0.3)",
                }}
              >
                Voltar
              </Button>

              {/* Badge indicando permissão */}
              {canEdit && (
                <Badge
                  className="hidden sm:flex items-center gap-2 px-3 py-2"
                  style={{
                    background: currentUser?.isAdmin
                      ? "linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.3))"
                      : "linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(22, 163, 74, 0.3))",
                    border: currentUser?.isAdmin
                      ? "1px solid rgba(239, 68, 68, 0.4)"
                      : "1px solid rgba(34, 197, 94, 0.4)",
                    color: currentUser?.isAdmin ? "#fca5a5" : "#86efac",
                    boxShadow: currentUser?.isAdmin
                      ? "0 0 15px rgba(239, 68, 68, 0.3)"
                      : "0 0 15px rgba(34, 197, 94, 0.3)",
                  }}
                >
                  {currentUser?.isAdmin ? (
                    <>
                      <Shield className="h-4 w-4" />
                      Admin
                    </>
                  ) : (
                    "Seu Projeto"
                  )}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Botões de Editar/Apagar - APENAS para dono do projeto ou admin */}
              {canEdit && (
                <div className="flex gap-2">
                  <Button
                    onClick={handleEdit}
                    size="sm"
                    variant="outline"
                    className="h-11 px-3 text-sm"
                    style={{
                      background: "rgba(59, 130, 246, 0.1)",
                      border: "1px solid rgba(59, 130, 246, 0.4)",
                      color: "#93c5fd",
                      boxShadow: "0 0 15px rgba(59, 130, 246, 0.3)",
                    }}
                  >
                    <Edit className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Editar</span>
                  </Button>

                  <Button
                    onClick={handleDelete}
                    size="sm"
                    variant="outline"
                    className="h-11 px-3 text-sm"
                    style={{
                      background: "rgba(239, 68, 68, 0.1)",
                      border: "1px solid rgba(239, 68, 68, 0.4)",
                      color: "#fca5a5",
                      boxShadow: "0 0 15px rgba(239, 68, 68, 0.3)",
                    }}
                  >
                    <Trash2 className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Apagar</span>
                  </Button>
                </div>
              )}

              <Button
                onClick={() => setCurrentView("projects")}
                variant="ghost"
                size="icon"
                className="text-slate-400 hover:text-white h-11 w-11"
                style={{
                  transition: "all 0.3s ease",
                }}
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
          </div>

          {/* Conteúdo do Modal */}
          <div className="p-8 space-y-8">
            {/* Cabeçalho do Projeto */}
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <Badge
                  className="relative overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.3))",
                    border: "1px solid rgba(59, 130, 246, 0.4)",
                    color: "#93c5fd",
                    boxShadow: "0 0 15px rgba(59, 130, 246, 0.3)",
                  }}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  {selectedProject.category}
                </Badge>

                {canEdit && (
                  <Badge
                    className="relative overflow-hidden"
                    style={{
                      background: "linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(22, 163, 74, 0.3))",
                      border: "1px solid rgba(34, 197, 94, 0.4)",
                      color: "#86efac",
                      boxShadow: "0 0 15px rgba(34, 197, 94, 0.3)",
                    }}
                  >
                    {currentUser?.isAdmin ? "Controle Admin" : "Seu Projeto"}
                  </Badge>
                )}
              </div>

              <h1
                className="text-4xl font-bold text-white mb-4 relative"
                style={{
                  textShadow: "0 0 30px rgba(59, 130, 246, 0.5)",
                }}
              >
                {selectedProject.title}
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-300/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"
                  style={{
                    backgroundSize: "200% 100%",
                    animation: "titleShine 3s ease-in-out infinite",
                  }}
                />
              </h1>

              {selectedProject.ods && selectedProject.ods.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-slate-300 text-lg mb-3 font-medium">Objetivos de Desenvolvimento Sustentável:</h4>
                  <div className="flex flex-wrap gap-3">
                    {selectedProject.ods.map((odsId) => {
                      const ods = odsOptions.find((o) => o.id === odsId)
                      return ods ? (
                        <div
                          key={odsId}
                          className="flex items-center gap-3 px-4 py-2 rounded-full text-white font-medium"
                          style={{
                            backgroundColor: ods.color,
                            boxShadow: `0 0 20px ${ods.color}40`,
                          }}
                        >
                          <span className="font-bold">ODS {odsId}</span>
                          <span className="text-sm opacity-90">{ods.name}</span>
                        </div>
                      ) : null
                    })}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-6 text-slate-400">
                <div className="flex items-center gap-3">
                  <Avatar
                    className="h-8 w-8"
                    style={{
                      border: "2px solid rgba(59, 130, 246, 0.4)",
                      boxShadow: "0 0 15px rgba(59, 130, 246, 0.3)",
                    }}
                  >
                    <AvatarFallback
                      className="text-white font-bold"
                      style={{
                        background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                      }}
                    >
                      {selectedProject.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{selectedProject.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span className="font-mono">{selectedProject.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  <span className="font-mono">{selectedProject.views}</span>
                </div>
              </div>
            </div>

            {/* Mídia do Projeto */}
            {selectedProject.images.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-white font-semibold text-2xl flex items-center gap-3">
                  <Star className="h-6 w-6 text-blue-400" />
                  Imagens
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {selectedProject.images.map((img, idx) => (
                    <div key={idx} className="relative group overflow-hidden rounded-xl">
                      <img
                        src={img || "/placeholder.svg"}
                        alt={`Projeto ${idx + 1}`}
                        className="w-full h-64 object-cover border border-slate-700 group-hover:scale-110 transition-transform duration-500"
                        style={{
                          borderRadius: "12px",
                          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button
                          size="sm"
                          variant="outline"
                          className="backdrop-blur-sm bg-transparent"
                          onClick={() => window.open(img, "_blank")}
                          style={{
                            background: "rgba(59, 130, 246, 0.2)",
                            border: "1px solid rgba(59, 130, 246, 0.4)",
                            color: "white",
                            boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)",
                          }}
                        >
                          <Zap className="mr-2 h-4 w-4" />
                          Ver Completa
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedProject.videos.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-white font-semibold text-2xl flex items-center gap-3">
                  <Video className="h-6 w-6 text-purple-400" />
                  Vídeos
                </h3>
                <div className="grid gap-6">
                  {selectedProject.videos.map((video, idx) => (
                    <div
                      key={idx}
                      className="relative group overflow-hidden rounded-xl"
                      style={{
                        border: "1px solid rgba(71, 85, 105, 0.6)",
                        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
                      }}
                    >
                      <video
                        controls
                        preload="metadata"
                        className="w-full h-80 object-cover"
                        style={{ borderRadius: "12px" }}
                      >
                        <source src={video} type="video/mp4" />
                        Seu navegador não suporta vídeos.
                      </video>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedProject.pdfs && selectedProject.pdfs.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-white font-semibold text-2xl flex items-center gap-3">
                  <FileText className="h-6 w-6 text-green-400" />
                  Documentos PDF
                </h3>
                <div className="grid gap-4">
                  {selectedProject.pdfs.map((pdf, idx) => (
                    <div
                      key={idx}
                      className="p-6 rounded-xl"
                      style={{
                        background: "rgba(71, 85, 105, 0.4)",
                        border: "1px solid rgba(34, 197, 94, 0.4)",
                        backdropFilter: "blur(10px)",
                        boxShadow: "0 0 20px rgba(34, 197, 94, 0.2)",
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <FileText className="h-10 w-10 text-green-400" />
                          <span className="text-slate-300 text-lg font-medium">Documento {idx + 1}</span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(pdf, "_blank")}
                          style={{
                            background: "rgba(34, 197, 94, 0.1)",
                            border: "1px solid rgba(34, 197, 94, 0.4)",
                            color: "#86efac",
                            boxShadow: "0 0 15px rgba(34, 197, 94, 0.3)",
                          }}
                        >
                          Abrir PDF
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Descrição */}
            <div className="relative">
              <h3 className="text-white font-semibold text-2xl mb-4">Descrição</h3>
              <div
                className="p-6 rounded-xl relative overflow-hidden"
                style={{
                  background: "rgba(71, 85, 105, 0.4)",
                  border: "1px solid rgba(71, 85, 105, 0.6)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <div
                  className="absolute inset-0 opacity-5"
                  style={{
                    background: `
                      linear-gradient(45deg,
                        transparent,
                        rgba(59, 130, 246, 0.1),
                        transparent
                      )
                    `,
                    backgroundSize: "200% 200%",
                    animation: "gradientShift 10s ease infinite",
                  }}
                />
                <p className="text-slate-300 leading-relaxed text-lg relative">{selectedProject.content}</p>
              </div>
            </div>

            {/* Comentários */}
            <div
              className="pt-8"
              style={{
                borderTop: "1px solid rgba(71, 85, 105, 0.3)",
              }}
            >
              <h3 className="text-white font-semibold text-2xl mb-6 flex items-center gap-3">
                <MessageCircle className="h-6 w-6 text-green-400" />
                Comentários ({selectedProject.comments.length})
              </h3>

              {/* Adicionar Comentário */}
              <div className="space-y-4 mb-8">
                <Textarea
                  placeholder="Adicione um comentário..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[120px] text-lg"
                  style={{
                    background: "rgba(71, 85, 105, 0.8)",
                    border: "1px solid rgba(71, 85, 105, 0.8)",
                    borderRadius: "12px",
                    color: "white",
                    backdropFilter: "blur(10px)",
                  }}
                />
                <Button
                  onClick={handleAddComment}
                  className="h-12 px-8 text-lg font-semibold relative overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                    border: "none",
                    boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)",
                  }}
                >
                  <Send className="mr-2 h-5 w-5" />
                  Enviar
                </Button>
              </div>

              {/* Lista de Comentários */}
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {selectedProject.comments.map((comment, index) => (
                  <div
                    key={comment.id}
                    className="p-6 rounded-xl relative overflow-hidden"
                    style={{
                      background: "rgba(71, 85, 105, 0.4)",
                      border: "1px solid rgba(71, 85, 105, 0.6)",
                      backdropFilter: "blur(10px)",
                      animationDelay: `${index * 0.1}s`,
                      animation: "fadeInUp 0.6s ease-out forwards",
                    }}
                  >
                    <div
                      className="absolute inset-0 opacity-5"
                      style={{
                        background: `
                          linear-gradient(90deg,
                            transparent,
                            rgba(59, 130, 246, 0.1),
                            transparent
                          )
                        `,
                        backgroundSize: "200% 100%",
                        animation: `scanLine ${8 + index}s linear infinite`,
                      }}
                    />
                    <div className="flex items-center gap-3 mb-3 relative">
                      <Avatar
                        className="h-8 w-8"
                        style={{
                          border: "2px solid rgba(59, 130, 246, 0.4)",
                          boxShadow: "0 0 15px rgba(59, 130, 246, 0.3)",
                        }}
                      >
                        <AvatarFallback
                          className="text-white font-bold"
                          style={{
                            background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                          }}
                        >
                          {comment.author
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-white font-medium text-lg">{comment.author}</span>
                      <span className="text-slate-400 font-mono">{comment.date}</span>
                    </div>
                    <p className="text-slate-300 relative text-lg leading-relaxed">{comment.content}</p>
                  </div>
                ))}
                {selectedProject.comments.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🌌</div>
                    <p className="text-slate-400 text-xl">Nenhum comentário ainda. Seja o primeiro a explorar!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      <OptimizedSpaceBackground />

      {/* Conteúdo Principal */}
      {currentView === "login" && <LoginView />}
      {currentView === "register" && <RegisterView />}
      {currentView === "projects" && <ProjectsView />}
      {currentView === "create" && <CreateProjectView />}
      {currentView === "project-detail" && <ProjectDetailView />}

      {/* Footer Futurístico */}
      {(currentView === "projects" || currentView === "create") && (
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

      {/* CSS Global para Animações */}
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

        @keyframes scanLine {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        @keyframes titleShine {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        @keyframes energyFlow {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        @keyframes orbit {
          0% {
            transform: rotate(0deg) translateX(30px) rotate(0deg);
          }
          100% {
            transform: rotate(360deg) translateX(30px) rotate(-360deg);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes gradientShift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </div>
  )
}
