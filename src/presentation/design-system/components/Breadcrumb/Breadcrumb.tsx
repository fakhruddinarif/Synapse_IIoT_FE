export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

/** Breadcrumb navigation trail. */
export const Breadcrumb = ({ items }: BreadcrumbProps) => (
  <nav className="flex items-center gap-2 text-xs text-muted">
    {items.map((item, index) => (
      <span key={`${item.label}-${index}`} className="flex items-center gap-2">
        {item.href ? (
          <a href={item.href} className="text-secondary hover:text-brand">
            {item.label}
          </a>
        ) : (
          <span className="text-primary">{item.label}</span>
        )}
        {index < items.length - 1 && <span>/</span>}
      </span>
    ))}
  </nav>
);
