'use client';

import React from 'react';
import {
  Code,
  Atom,
  Terminal,
  Coffee,
  Database,
  Cpu,
  Server,
  Network,
  Workflow,
  Brain,
  ArrowUpRight
} from 'lucide-react';
import { InterviewCategory } from '@/lib/types';
import { playClickSound } from '@/lib/sound';

interface CategoryGridProps {
  onSelectCategory: (category: InterviewCategory) => void;
}

export function CategoryGrid({ onSelectCategory }: CategoryGridProps) {
  const categories: {
    name: InterviewCategory;
    icon: React.ElementType;
    description: string;
    topics: string[];
    tag: string;
    gradient: string;
  }[] = [
    {
      name: 'DSA',
      icon: Code,
      description: 'Arrays, HashMaps, Trees, Graphs, Dynamic Programming & complexity analysis.',
      topics: ['Hash Collisions', 'Graph Cycles', 'Two Pointers', 'O(N) vs O(1)'],
      tag: 'Core Algorithmic',
      gradient: 'from-blue-600 to-indigo-600',
    },
    {
      name: 'JavaScript',
      icon: Terminal,
      description: 'Event loop, closures, prototypes, microtasks vs macrotasks, and engine internals.',
      topics: ['Event Loop', 'Closures', 'V8 Shapes', 'Promises'],
      tag: 'Language Core',
      gradient: 'from-amber-500 to-yellow-600',
    },
    {
      name: 'React',
      icon: Atom,
      description: 'Virtual DOM reconciliation, Fiber architecture, hooks pitfalls, and Concurrent React.',
      topics: ['Fiber Tree', 'Reconciliation', 'Memoization', 'Concurrent Mode'],
      tag: 'Frontend Engine',
      gradient: 'from-cyan-500 to-blue-600',
    },
    {
      name: 'Python',
      icon: Terminal,
      description: 'CPython GIL, generators, memory management, decorators, and asyncio concurrency.',
      topics: ['GIL Mutex', 'Generators & Yield', 'Coroutines', 'Frame State'],
      tag: 'Language Core',
      gradient: 'from-emerald-500 to-teal-600',
    },
    {
      name: 'Java',
      icon: Coffee,
      description: 'JVM memory model (Heap/Stack), Generational GC, volatile semantics, and concurrency.',
      topics: ['JVM Heap/Stack', 'Generational GC', 'JMM Volatile', 'ConcurrentHashMap'],
      tag: 'Enterprise Core',
      gradient: 'from-orange-500 to-red-600',
    },
    {
      name: 'SQL',
      icon: Database,
      description: 'Normalization (1NF-3NF), B-Tree vs Hash indexing, window functions, and query optimization.',
      topics: ['B-Tree Indexing', '3NF Normalization', 'Window Functions', 'JOIN Strategies'],
      tag: 'Data Querying',
      gradient: 'from-indigo-600 to-purple-600',
    },
    {
      name: 'Operating Systems',
      icon: Cpu,
      description: 'Processes vs threads, context switching overhead, virtual memory, paging, and deadlock.',
      topics: ['Context Switch', 'Coffman Deadlock', 'Virtual Memory', 'TLB & Page Faults'],
      tag: 'Foundations',
      gradient: 'from-rose-500 to-pink-600',
    },
    {
      name: 'DBMS',
      icon: Server,
      description: 'ACID guarantees, isolation levels (Dirty/Phantom reads), WAL logging, and ARIES recovery.',
      topics: ['ACID & WAL', 'Isolation Levels', 'MVCC', 'ARIES Crash Recovery'],
      tag: 'Data Storage',
      gradient: 'from-purple-600 to-indigo-700',
    },
    {
      name: 'Computer Networks',
      icon: Network,
      description: 'TCP 3-way handshake, TIME_WAIT, HTTP/1.1 to HTTP/3 QUIC, TLS 1.3, and DNS flows.',
      topics: ['TCP Handshake', 'HTTP/3 QUIC', 'TLS 1.3 Handshake', 'Head-of-Line Blocking'],
      tag: 'Protocols',
      gradient: 'from-teal-500 to-cyan-600',
    },
    {
      name: 'System Design',
      icon: Workflow,
      description: 'Rate limiters, URL shorteners, CAP theorem, caching strategies, and distributed scaling.',
      topics: ['Token Bucket', 'Base62 & KGS', 'CAP & PACELC', 'Redis Cluster'],
      tag: 'Architecture',
      gradient: 'from-violet-600 to-purple-700',
    },
    {
      name: 'AI/ML',
      icon: Brain,
      description: 'Transformer self-attention, loss curves, RAG vs Fine-tuning (LoRA), and bias-variance.',
      topics: ['Self-Attention QKV', 'Overfitting/Underfitting', 'RAG vs LoRA', 'Scaled Dot-Product'],
      tag: 'Machine Learning',
      gradient: 'from-pink-500 to-rose-600',
    },
  ];

  return (
    <section id="categories" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
              Complete Curriculum
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-4 tracking-tight">
              11 Interview Categories
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-xl">
              Select any technical domain to immediately launch an interactive mock interview session tailored to that exact skill.
            </p>
          </div>
          <div className="mt-4 md:mt-0 text-xs text-slate-400 font-mono">
            Click any category to practice →
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.name}
                onClick={() => {
                  playClickSound();
                  onSelectCategory(cat.name);
                }}
                className="cursor-pointer rounded-2xl bg-slate-900/60 border border-slate-800 p-5 hover:border-indigo-500/50 hover:bg-slate-900/90 transition-all duration-300 group flex flex-col justify-between hover:shadow-xl hover:shadow-indigo-950/40 hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${cat.gradient} flex items-center justify-center text-white shadow-md`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-medium text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/80">
                      {cat.tag}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {cat.name}
                    </h3>
                    <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-800/60">
                  {cat.topics.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
