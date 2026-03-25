import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Breadcrumbs = ({ items }) => {
  return (
    <nav className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-widest text-slate-400">
      <Link to="/" className="hover:text-accent transition-colors">Home</Link>
      {items.map((item, i) => (
        <React.Fragment key={i}>
          <ChevronRight className="w-3 h-3" />
          {item.link ? (
            <Link to={item.link} className="hover:text-accent transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-900">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
