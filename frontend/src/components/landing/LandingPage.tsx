import { Braces, Zap, Users, Shield, ArrowRight } from 'lucide-react'
import { LoginForm } from './LoginForm'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'

const features = [
  {
    icon: Braces,
    title: 'Real-time Collaboration',
    description: 'Edit code simultaneously with multiple users. See changes instantly as they happen.',
  },
  {
    icon: Zap,
    title: 'Instant Code Execution',
    description: 'Run your code in 8+ languages with Judge0 integration. Get results in seconds.',
  },
  {
    icon: Users,
    title: 'Team Presence',
    description: 'See who is online, typing indicators, and cursor positions in real-time.',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Room-based access with unique IDs. No accounts required, just share and code.',
  },
]

export function LandingPage() {
  const navigate = useNavigate()

  const createNewRoom = () => {
    const id = uuidv4().substring(0, 8)
    const currentUser = { roomId: id, name: 'Anonymous' }
    localStorage.setItem('codesync_user', JSON.stringify(currentUser))
    navigate(`/editor/${id}`)
  }

  const scrollToLogin = () => {
    document.getElementById('join-room')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,theme(colors.border)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.border)_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Braces className="h-4 w-4" />
              CodeSync
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Real-time Collaborative
              <br />
              <span className="text-primary">Code Editor</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Write, run, and review code together in real-time. Built for teams who code together.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={scrollToLogin}
                className="w-full sm:w-auto px-8 py-3 text-base font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                Start Coding
                <ArrowRight className="h-5 w-5" />
              </button>
              <button
                onClick={createNewRoom}
                className="w-full sm:w-auto px-8 py-3 text-base font-medium text-foreground bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
              >
                Create a Room
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Everything you need to code together</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Powerful features designed for seamless collaborative development
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-6 bg-card border border-border rounded-xl hover:border-primary/50 hover:shadow-lg transition-all duration-300"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Login/CTA Section */}
      <section id="join-room" className="py-20">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-card border border-border rounded-xl p-8">
            <div className="flex items-center gap-2 justify-center mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Braces className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold">CodeSync</span>
            </div>
            <LoginForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
          <p>Built with Spring Boot, React, CodeMirror 6, and WebSockets</p>
        </div>
      </footer>
    </div>
  )
}