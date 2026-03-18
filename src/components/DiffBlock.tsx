import type { DiffBlock as DiffBlockType } from "@/lib/mock-data";

interface DiffBlockProps {
  diff: DiffBlockType;
}

export function DiffBlock({ diff }: DiffBlockProps) {
  return (
    <div className="rounded-md border border-border overflow-hidden my-2">
      <div className="bg-subtle px-3 py-1.5 text-xs font-mono text-muted-foreground border-b border-border">
        {diff.filename}
      </div>
      <div className="font-mono text-xs leading-relaxed">
        {diff.lines.map((line, i) => (
          <div
            key={i}
            className={`px-3 py-0.5 ${
              line.type === "add"
                ? "bg-diff-add-bg text-diff-add-text"
                : line.type === "remove"
                ? "bg-diff-remove-bg text-diff-remove-text"
                : "text-muted-foreground"
            }`}
          >
            <span className="select-none mr-2 opacity-50">
              {line.type === "add" ? "+" : line.type === "remove" ? "-" : " "}
            </span>
            {line.content}
          </div>
        ))}
      </div>
    </div>
  );
}
