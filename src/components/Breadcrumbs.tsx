import { Link } from 'react-router-dom';
import React from 'react';

interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  extra?: React.ReactNode;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, extra }) => {
  return (
    <nav className="flex items-center justify-between gap-2 text-sm font-bold mb-8">
      <div className="flex items-center gap-2">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && <span className="text-slate-300">/</span>}
            {item.to ? (
              <Link 
                to={item.to} 
                className="text-blue-600 hover:text-blue-700 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-slate-500 px-1">{item.label}</span>
            )}
          </React.Fragment>
        ))}
      </div>

      {extra && (
        <div className="flex items-center">
          {extra}
        </div>
      )}
    </nav>
  );
};
