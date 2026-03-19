interface SparklineProps {
  data: number[];
  className?: string;
}

export function Sparkline({ data, className = "" }: SparklineProps) {
  const max = Math.max(...data);

  return (
    <div className={`flex items-end gap-px h-4 ${className}`}>
      {data.map((value, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm bg-primary/15 min-w-[2px] transition-all"
          style={{ height: `${(value / max) * 100}%` }}
        />
      ))}
    </div>
  );
}
