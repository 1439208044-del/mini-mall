interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger";
  className?: string;
}

const variants = {
  default: "bg-(--color-primary-light) text-(--color-primary)",
  success: "bg-green-100 text-(--color-success)",
  warning: "bg-yellow-100 text-(--color-accent-dark)",
  danger: "bg-red-100 text-(--color-danger)",
};

export function Badge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
