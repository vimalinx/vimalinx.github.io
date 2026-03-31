import { useEffect, useRef, useState } from 'react';

interface MermaidDiagramProps {
  chart: string;
}

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const mermaid = (await import('mermaid')).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: 'dark',
          themeVariables: {
            background: '#000000',
            primaryColor: '#7c3aed',
            primaryTextColor: '#e2e8f0',
            lineColor: '#475569',
            textColor: '#94a3b8',
          },
        });
        const id = `mermaid-${Math.random().toString(36).slice(2, 10)}`;
        const { svg } = await mermaid.render(id, chart);
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (e) {
        if (!cancelled) setError(String(e));
      }
    })();
    return () => { cancelled = true; };
  }, [chart]);

  if (error) {
    return (
      <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-sm text-red-400">
        <p className="font-medium mb-1">Mermaid Error</p>
        <pre className="text-xs text-red-400/70 overflow-auto">{error}</pre>
      </div>
    );
  }

  return <div ref={containerRef} className="mb-6 overflow-x-auto [&>svg]:mx-auto [&>svg]:max-w-full" />;
}
