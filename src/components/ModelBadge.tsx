interface ModelBadgeProps {
  model: string;
}

export function ModelBadge({ model }: ModelBadgeProps) {
  return (
    <span className="inline-flex items-center rounded-md bg-secondary px-1.5 py-0.5 text-2xs font-mono text-secondary-foreground border border-border">
      {model}
    </span>
  );
}
