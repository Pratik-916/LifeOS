import React, { useState } from 'react';
import {  motion, AnimatePresence  } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { PenTool, Search, Clock, ChevronRight, LayoutGrid, FileEdit } from 'lucide-react';
import { cn } from '../lib/utils';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { blogCategories, featuredArticle, publishedArticles, draftArticles } from '../data/blog';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Blog() {
  const [activeTab, setActiveTab] = useState<'overview' | 'editor'>('overview');
  const [activeCategory, setActiveCategory] = useState('All');
  const [editorTitle, setEditorTitle] = useState('');
  const [editorContent, setEditorContent] = useState('');

  return (
    <div className="pb-10 max-w-6xl mx-auto">
      
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Blog</h1>
          <p className="text-secondary">Share your thoughts with the world.</p>
        </div>
        
        <div className="flex bg-surface p-1 rounded-xl border border-border/20">
          <button
            onClick={() => setActiveTab('overview')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
              activeTab === 'overview' ? "bg-surfaceHighlight text-primary shadow-sm" : "text-secondary hover:text-primary"
            )}
          >
            <LayoutGrid className="w-4 h-4" /> Overview
          </button>
          <button
            onClick={() => setActiveTab('editor')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
              activeTab === 'editor' ? "bg-surfaceHighlight text-primary shadow-sm" : "text-secondary hover:text-primary"
            )}
          >
            <FileEdit className="w-4 h-4" /> Write
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
            className="space-y-12"
          >
            {/* Categories & Search */}
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex overflow-x-auto no-scrollbar gap-2 pb-2 md:pb-0">
                {blogCategories.map(category => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={cn(
                      "px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap border",
                      activeCategory === category 
                        ? "bg-primary text-background border-primary" 
                        : "bg-surfaceHighlight text-secondary border-border/20 hover:border-border/20 hover:text-primary"
                    )}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <div className="relative w-full md:w-64 flex-shrink-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/70" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="w-full bg-surfaceHighlight border border-border/20 rounded-full py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-accent transition-all text-primary placeholder:text-secondary/50"
                />
              </div>
            </motion.div>

            {/* Featured Article */}
            <motion.div variants={itemVariants}>
              <h2 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-4">Featured</h2>
              <div className="group relative rounded-3xl overflow-hidden border border-border/20 cursor-pointer">
                <div className="aspect-[21/9] md:aspect-[21/7] w-full overflow-hidden">
                  <img 
                    src={featuredArticle.image} 
                    alt={featuredArticle.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-90" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                  <div className="flex items-center gap-3 text-xs font-medium text-accent mb-3 uppercase tracking-wider">
                    <span>{featuredArticle.category}</span>
                    <span className="text-secondary/50">•</span>
                    <span className="text-secondary flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {featuredArticle.readTime}</span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-primary mb-3 group-hover:text-accent transition-colors">
                    {featuredArticle.title}
                  </h3>
                  <p className="text-secondary/90 text-base md:text-lg max-w-2xl line-clamp-2 md:line-clamp-none">
                    {featuredArticle.excerpt}
                  </p>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Published Articles */}
              <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
                <h2 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-4">Latest Published</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {publishedArticles.map(article => (
                    <Card key={article.id} className="p-0 overflow-hidden group cursor-pointer border-border/20 bg-surfaceHighlight hover:bg-surfaceHighlight transition-all flex flex-col">
                      <div className="aspect-video w-full overflow-hidden">
                        <img 
                          src={article.image} 
                          alt={article.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <div className="flex justify-between items-center mb-3">
                          <span className="px-2.5 py-1 rounded-md bg-accent/10 text-accent text-xs font-semibold uppercase tracking-wider">
                            {article.category}
                          </span>
                          <span className="text-xs text-secondary/70">{article.date}</span>
                        </div>
                        <h4 className="text-xl font-bold text-primary mb-2 group-hover:text-accent transition-colors line-clamp-2">
                          {article.title}
                        </h4>
                        <p className="text-secondary/80 text-sm line-clamp-3 mb-4 flex-1">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center text-xs font-medium text-secondary/60">
                          <Clock className="w-3.5 h-3.5 mr-1.5" /> {article.readTime}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </motion.div>

              {/* Drafts Sidebar */}
              <motion.div variants={itemVariants} className="space-y-6">
                <h2 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-4">Drafts</h2>
                <div className="space-y-3">
                  {draftArticles.map(draft => (
                    <div key={draft.id} className="p-4 rounded-2xl bg-surfaceHighlight border border-border/20 hover:bg-surfaceHighlight transition-colors cursor-pointer group">
                      <h4 className="font-semibold text-primary mb-1 group-hover:text-accent transition-colors flex justify-between items-center">
                        {draft.title}
                        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-secondary/60 font-medium">
                        <span>Last edited {draft.lastEdited}</span>
                        <span>•</span>
                        <span>{draft.wordCount} words</span>
                      </div>
                    </div>
                  ))}
                  
                  <button 
                    onClick={() => setActiveTab('editor')}
                    className="w-full p-4 rounded-2xl border border-dashed border-border/50 text-secondary hover:text-primary hover:border-border/20 hover:bg-surfaceHighlight transition-all flex flex-col items-center justify-center gap-2 mt-4"
                  >
                    <PenTool className="w-5 h-5" />
                    <span className="text-sm font-medium">Start a new draft</span>
                  </button>
                </div>
              </motion.div>

            </div>
          </motion.div>
        )}

        {activeTab === 'editor' && (
          <motion.div
            key="editor"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="max-w-3xl mx-auto"
          >
            <div className="bg-surfaceHighlight rounded-3xl border border-border/20 p-8 lg:p-12 min-h-[600px] flex flex-col">
              
              <div className="flex justify-between items-center mb-8 pb-4 border-b border-border/20">
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-surfaceHighlight rounded-md text-xs font-semibold text-secondary">Draft</span>
                  <span className="px-3 py-1 bg-surfaceHighlight rounded-md text-xs font-semibold text-secondary">
                    {editorContent.trim().split(/\s+/).filter(w => w.length > 0).length} words
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">Save Draft</Button>
                  <Button variant="primary" size="sm">Publish</Button>
                </div>
              </div>

              <input 
                type="text" 
                value={editorTitle}
                onChange={(e) => setEditorTitle(e.target.value)}
                placeholder="Article Title..."
                className="w-full bg-transparent text-4xl md:text-5xl font-bold tracking-tight text-primary placeholder:text-secondary/50 focus:outline-none mb-6"
              />
              
              <textarea
                value={editorContent}
                onChange={(e) => setEditorContent(e.target.value)}
                placeholder="Start writing your masterpiece..."
                className="w-full flex-1 bg-transparent resize-none focus:outline-none text-primary/90 placeholder:text-secondary/30 text-lg leading-relaxed font-serif"
              />
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
