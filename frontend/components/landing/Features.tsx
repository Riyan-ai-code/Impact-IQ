import { Code, GitFork, ShieldAlert, Target, Brain } from "lucide-react"

export default function Features() {
  const features = [
    {
      title: "Code Change Analysis",
      description: "Detect breaking changes in code diffs and pull requests.",
      icon: <Code className="w-5 h-5 text-indigo-400" />,
      borderHover: "group-hover:border-indigo-500/30"
    },
    {
      title: "Dependency Intelligence",
      description: "Map dependencies and understand upstream and downstream impact.",
      icon: <GitFork className="w-5 h-5 text-teal-400" />,
      borderHover: "group-hover:border-teal-500/30"
    },
    {
      title: "Blast Radius Prediction",
      description: "Visualize impact across services, APIs, and environments.",
      icon: <Target className="w-5 h-5 text-rose-400" />,
      borderHover: "group-hover:border-rose-500/30"
    },
    {
      title: "Security Insights",
      description: "Identify vulnerabilities and risky changes before deployment.",
      icon: <ShieldAlert className="w-5 h-5 text-amber-400" />,
      borderHover: "group-hover:border-amber-500/30"
    },
    {
      title: "AI-Powered Explanations",
      description: "Get clear, natural language explanations and recommendations.",
      icon: <Brain className="w-5 h-5 text-purple-400" />,
      borderHover: "group-hover:border-purple-500/30"
    }
  ]

  return (
    <section id="features" className="w-full bg-[#fafafa] border-t border-gray-100 py-20 px-6 md:px-12 flex flex-col items-center">
      <div className="w-full max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need for safe deployments
          </h2>
          <p className="mt-4 text-gray-500 max-w-xl mx-auto text-sm">
            ImpactIQ couples deterministic static code analysis with generative AI insights to protect production pipelines from unintended breakage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {features.map((feature, idx) => (
            <div 
              key={idx} 
              className="group bg-white border border-gray-200/80 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between items-start min-h-[220px]"
            >
              <div className="space-y-4 w-full">
                <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shadow-inner">
                  {feature.icon}
                </div>
                <h3 className="text-base font-semibold text-gray-900 leading-tight">
                  {feature.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
              <div className="w-full h-1 bg-gray-50 rounded-full mt-6 overflow-hidden">
                <div className="w-0 group-hover:w-full h-full bg-brand transition-all duration-500" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
