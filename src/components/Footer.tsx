import Link from "next/link";
import { Brain, Github, Twitter, BookOpen } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary-600 text-white mt-16">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-heading text-xl">Sentiment Analytics Lab</div>
                <div className="font-ui text-sm text-white/70">University NLP Practical Course</div>
              </div>
            </div>
            <p className="font-body text-white/80 text-sm leading-relaxed max-w-sm">
              Master sentiment analysis from rule-based VADER to transformer-based BERT. 
              Interactive lessons, live Python playground, and real-world projects.
            </p>
          </div>

          <div>
            <h3 className="font-ui font-semibold text-sm uppercase tracking-wider text-white/60 mb-4">Course</h3>
            <ul className="space-y-2">
              {["Curriculum", "Playground", "Visualizer", "Quiz", "Dashboard"].map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase()}`} className="font-ui text-sm text-white/80 hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-ui font-semibold text-sm uppercase tracking-wider text-white/60 mb-4">Resources</h3>
            <ul className="space-y-2">
              {["Datasets", "Code Notebooks", "Research Papers", "Cheat Sheets"].map((item) => (
                <li key={item}>
                  <Link href="/resources" className="font-ui text-sm text-white/80 hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-ui text-sm text-white/60">
            © 2026 Sentiment Analytics Lab. Designed for academic use only. Powered by <a href="https://www.linkedin.com/in/profanjitraja/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors underline underline-offset-2">Prof. Anjit Raja R</a>
          </p>
          <div className="flex items-center gap-4">
            <a href="#" aria-label="GitHub" className="text-white/60 hover:text-white transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="#" aria-label="Twitter" className="text-white/60 hover:text-white transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" aria-label="Course Documentation" className="text-white/60 hover:text-white transition-colors">
              <BookOpen className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
