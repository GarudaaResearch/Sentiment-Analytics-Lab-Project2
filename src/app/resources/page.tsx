"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BookOpen, Download, ExternalLink, FileText, Database, Code, Library } from "lucide-react";

const RESOURCES = [
  {
    category: "Essential Datasets",
    items: [
      { name: "IMDb Movie Reviews", desc: "50k highly polar reviews for binary sentiment classification.", size: "84 MB", type: "Dataset", link: "https://ai.stanford.edu/~amaas/data/sentiment/" },
      { name: "Amazon Product Data", desc: "Millions of reviews across 24 categories with star ratings.", size: "2.4 GB", type: "Dataset", link: "https://nijianmo.github.io/amazon/index.html" },
      { name: "Twitter Sentiment140", desc: "1.6 million tweets with 0=negative, 4=positive labels.", size: "77 MB", type: "Dataset", link: "http://help.sentiment140.com/for-students" },
    ]
  },
  {
    category: "Foundational Papers",
    items: [
      { name: "VADER: A Parsimonious Rule-based Model", desc: "The original Hutto & Gilbert (2014) Lexicon paper.", type: "PDF", link: "https://ojs.aaai.org/index.php/ICWSM/article/view/14550" },
      { name: "BERT: Pre-training of Deep Bidirectional Transformers", desc: "Devlin et al. (2018) - The paper that changed NLP.", type: "PDF", link: "https://arxiv.org/abs/1810.04805" },
      { name: "Attention Is All You Need", desc: "Vaswani et al. (2017) - Introducing the Transformer architecture.", type: "PDF", link: "https://arxiv.org/abs/1706.03762" },
    ]
  },
  {
    category: "Software & Libraries",
    items: [
      { name: "NLTK Documentation", desc: "Comprehensive guide to the Natural Language Toolkit.", type: "Docs", link: "https://www.nltk.org/" },
      { name: "Hugging Face Course", desc: "Modern NLP with Transformers and the HF ecosystem.", type: "Course", link: "https://huggingface.co/learn/nlp-course/" },
      { name: "spaCy Industrial NLP", desc: "Lightning fast processing with industrial-strength features.", type: "Docs", link: "https://spacy.io/" },
    ]
  }
];

export default function ResourcesPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pb-20">
        <div className="bg-teal-gradient text-white py-14">
          <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 mb-3">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h1 className="font-heading text-4xl text-white">Academic Resources</h1>
            </div>
            <p className="font-body text-white/80 max-w-2xl text-lg">
              Curated collection of datasets, research papers, and technical documentation to deepen your understanding of Sentiment Analysis.
            </p>
          </div>
        </div>

        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
          <div className="space-y-12">
            {RESOURCES.map((cat, idx) => (
              <div key={idx} className="animate-fade-in" style={{ animationDelay: `${idx * 150}ms` }}>
                <h2 className="font-ui font-black text-xs text-primary-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                  <span className="w-12 h-[2px] bg-primary-100" />
                  {cat.category}
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cat.items.map((item, i) => (
                    <a 
                      key={i} 
                      href={item.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="card hover:shadow-2xl transition-all duration-500 group border-primary-50 hover:border-accent/30 bg-white/80 backdrop-blur"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-primary-50 rounded-lg group-hover:bg-accent/10 transition-colors">
                          {cat.category.includes("Dataset") ? <Database className="w-5 h-5 text-primary-600 group-hover:text-accent" /> : 
                           cat.category.includes("Paper") ? <FileText className="w-5 h-5 text-primary-600 group-hover:text-accent" /> :
                           <Library className="w-5 h-5 text-primary-600 group-hover:text-accent" />}
                        </div>
                        <span className="font-ui text-[10px] font-bold px-2 py-1 bg-gray-100 rounded text-gray-500 uppercase tracking-tighter">
                          {item.type}
                        </span>
                      </div>
                      <h3 className="font-heading text-xl text-primary-800 mb-2 group-hover:text-primary-600 transition-colors">{item.name}</h3>
                      <p className="font-body text-sm text-gray-600 mb-6 line-clamp-2">{item.desc}</p>
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                        <span className="font-code text-[10px] text-gray-400">{'size' in item ? item.size : 'External Link'}</span>
                        <div className="flex items-center gap-1 text-accent font-ui text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                          Access <ExternalLink className="w-3 h-3" />
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 card bg-primary-900 text-white overflow-hidden relative">
            <div className="relative z-10 p-8 text-center max-w-xl mx-auto">
              <Download className="w-12 h-12 mx-auto mb-4 text-accent" />
              <h2 className="font-heading text-3xl mb-4">Course Offline Materials</h2>
              <p className="font-body text-white/70 mb-8">
                Download the complete lecture slides, Python notebooks, and localized datasets for offline study.
              </p>
              <button className="bg-accent hover:bg-accent-light text-white font-ui font-bold px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-accent/40 flex items-center gap-3 mx-auto">
                Download Bundle (1.2 GB) <Download className="w-5 h-5" />
              </button>
            </div>
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute top-10 left-10 w-40 h-40 bg-accent rounded-full blur-3xl" />
              <div className="absolute bottom-10 right-10 w-60 h-60 bg-primary-400 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
