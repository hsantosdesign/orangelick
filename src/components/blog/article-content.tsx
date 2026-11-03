import { Fragment, type ReactNode } from "react";

/**
 * Renders article text written in the admin editor.
 * Supports a friendly subset of formatting: blank-line paragraphs, "## " / "### " headings,
 * "- " and "1. " lists, "> " quotes, **bold**, *italic* and [links](https://...).
 * Raw HTML is never rendered.
 */

type Block =
  | { type: "h2" | "h3" | "p" | "quote"; text: string }
  | { type: "ul" | "ol"; items: string[] };

function parseBlocks(source: string): Block[] {
  const blocks: Block[] = [];
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  let paragraph: string[] = [];
  let list: { type: "ul" | "ol"; items: string[] } | null = null;
  let quote: string[] = [];

  const flush = () => {
    if (paragraph.length) blocks.push({ type: "p", text: paragraph.join(" ") });
    if (list) blocks.push(list);
    if (quote.length) blocks.push({ type: "quote", text: quote.join(" ") });
    paragraph = [];
    list = null;
    quote = [];
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flush();
      continue;
    }

    const heading = /^(#{2,3})\s+(.*)$/.exec(line);
    if (heading) {
      flush();
      blocks.push({ type: heading[1] === "##" ? "h2" : "h3", text: heading[2] ?? "" });
      continue;
    }

    const bullet = /^[-*]\s+(.*)$/.exec(line);
    const numbered = /^\d+[.)]\s+(.*)$/.exec(line);
    if (bullet || numbered) {
      const type = bullet ? "ul" : "ol";
      if (paragraph.length || quote.length || (list && list.type !== type)) flush();
      list ??= { type, items: [] };
      list.items.push((bullet ?? numbered)![1] ?? "");
      continue;
    }

    const quoted = /^>\s?(.*)$/.exec(line);
    if (quoted) {
      if (paragraph.length || list) flush();
      quote.push(quoted[1] ?? "");
      continue;
    }

    if (list || quote.length) flush();
    // A single "# " heading is treated as a section heading too.
    const h1 = /^#\s+(.*)$/.exec(line);
    if (h1) {
      flush();
      blocks.push({ type: "h2", text: h1[1] ?? "" });
      continue;
    }
    paragraph.push(line);
  }
  flush();
  return blocks;
}

const INLINE = /(\*\*[^*]+\*\*|\*[^*\s][^*]*\*|\[[^\]]+\]\([^)\s]+\))/g;

function safeHref(href: string): string | null {
  if (href.startsWith("/") || href.startsWith("#")) return href;
  if (/^https?:\/\//i.test(href) || /^mailto:/i.test(href)) return href;
  return null;
}

function renderInline(text: string): ReactNode[] {
  return text.split(INLINE).map((part, i) => {
    if (!part) return null;
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) return <em key={i}>{part.slice(1, -1)}</em>;
    const link = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(part);
    if (link) {
      const href = safeHref(link[2] ?? "");
      if (!href) return <Fragment key={i}>{link[1]}</Fragment>;
      const external = /^https?:\/\//i.test(href);
      return (
        <a key={i} href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {link[1]}
        </a>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

export function ArticleContent({ content }: { content: string }) {
  const blocks = parseBlocks(content);

  return (
    <div className="article-body">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "h2":
            return <h2 key={i}>{renderInline(block.text)}</h2>;
          case "h3":
            return <h3 key={i}>{renderInline(block.text)}</h3>;
          case "quote":
            return <blockquote key={i}>{renderInline(block.text)}</blockquote>;
          case "ul":
          case "ol": {
            const List = block.type;
            return (
              <List key={i}>
                {block.items.map((item, j) => (
                  <li key={j}>{renderInline(item)}</li>
                ))}
              </List>
            );
          }
          default:
            return <p key={i}>{renderInline(block.text)}</p>;
        }
      })}
    </div>
  );
}
