import React from 'react';

export default function PageHeader({ eyebrow, title, subtitle, actions }) {
  return (
    <div className="cp-page-head">
      <div>
        {eyebrow && <p className="cp-eyebrow">{eyebrow}</p>}
        <h1 className="cp-page-title">{title}</h1>
        {subtitle && <p className="cp-page-sub">{subtitle}</p>}
      </div>
      {actions && <div>{actions}</div>}
    </div>
  );
}
