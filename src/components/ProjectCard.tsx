import { motion } from 'framer-motion';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface ProjectCardProps {
  title: string;
  description: string;
  url: string;
  tags: string[];
  icon: React.ElementType;
  status: string;
  index: number;
}

export const ProjectCard = ({ title, description, url, tags, icon: Icon, status, index }: ProjectCardProps) => {
  return (
    <motion.a
      href={url}
      target={url.startsWith('http') ? "_blank" : "_self"}
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 + 0.5, duration: 0.5 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all duration-300",
        "hover:border-white/20 hover:bg-white/10 hover:shadow-2xl hover:shadow-purple-500/10"
      )}
    >
      <div className="absolute top-0 right-0 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <ExternalLink className="h-5 w-5 text-white/50" />
      </div>

      <div className="mb-4">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-purple-300 ring-1 ring-white/20 group-hover:bg-purple-500/20 group-hover:text-purple-200 transition-colors">
          <Icon className="h-6 w-6" />
        </div>
        
        <h3 className="mb-2 text-xl font-bold text-white tracking-tight">{title}</h3>
        <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
      </div>

      <div className="mt-auto">
        <div className="mb-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="rounded-full bg-white/5 px-2 py-1 text-xs font-medium text-gray-300 ring-1 ring-white/10">
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex items-center justify-between border-t border-white/5 pt-4">
            <span className={cn(
                "text-xs font-medium uppercase tracking-wider",
                status === "Live" ? "text-green-400" : "text-amber-400"
            )}>
                {status}
            </span>
            <span className="flex items-center text-xs text-white/50 group-hover:text-white transition-colors">
                Visit Project <ArrowRight className="ml-1 h-3 w-3" />
            </span>
        </div>
      </div>
    </motion.a>
  );
};
