interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

export function StatsCard({ title, value, icon }: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl border border-(--color-border) p-6 flex items-center gap-4">
      <div className="w-12 h-12 rounded-lg bg-(--color-primary-light) flex items-center justify-center text-(--color-primary)">
        {icon}
      </div>
      <div>
        <p className="text-sm text-(--color-muted)">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}
