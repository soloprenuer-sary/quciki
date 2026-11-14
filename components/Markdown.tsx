import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Renders admin-written markdown. Raw HTML is NOT allowed (react-markdown ignores it by default)
 * and dangerous URL schemes such as javascript: are stripped, so a compromised or careless editor
 * cannot inject scripts into public pages.
 */
export function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        a({ href, children: kids }) {
          if (!href) return <span>{kids}</span>;
          if (href.startsWith("/") && !href.startsWith("//")) return <Link href={href}>{kids}</Link>;
          return (
            <a href={href} target="_blank" rel="noopener noreferrer">
              {kids}
            </a>
          );
        },
        img({ src, alt }) {
          // eslint-disable-next-line @next/next/no-img-element
          return <img src={typeof src === "string" ? src : undefined} alt={alt ?? ""} loading="lazy" className="my-4 h-auto max-w-full rounded-xl" />;
        },
        table({ children: kids }) {
          return (
            <div className="my-4 overflow-x-auto">
              <table>{kids}</table>
            </div>
          );
        },
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
