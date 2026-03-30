import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';

const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const BlogList = lazy(() => import('./pages/BlogList').then(m => ({ default: m.BlogList })));
const BlogPost = lazy(() => import('./pages/BlogPost').then(m => ({ default: m.BlogPost })));
const ArchivePage = lazy(() => import('./pages/ArchivePage').then(m => ({ default: m.ArchivePage })));
const TagPage = lazy(() => import('./pages/TagPage').then(m => ({ default: m.TagPage })));
const SeriesPage = lazy(() => import('./pages/SeriesPage').then(m => ({ default: m.SeriesPage })));
const NotFound = lazy(() => import('./pages/NotFound').then(m => ({ default: m.NotFound })));

function PageLoader() {
  return (
    <div className="relative min-h-screen w-full bg-black flex items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-purple-500" />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/archive" element={<ArchivePage />} />
            <Route path="/blog/tag/:tag" element={<TagPage />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/blog/series/:name" element={<SeriesPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
