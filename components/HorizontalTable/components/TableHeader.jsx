import React from 'react';

export default function TableHeader({ title }) {
  return (
    <div className={"horizontal-table__header"}>
      {title instanceof Function ? title() : title}
    </div>
  );
}
