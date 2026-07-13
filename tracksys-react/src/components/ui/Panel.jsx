export default function Panel({ title, tag, children, style, bodyStyle, className = '' }) {
  return (
    <div className={`panel ${className}`} style={style}>
      {(title || tag) && (
        <div className="panel-head">
          {title && <h3>{title}</h3>}
          {tag && <span className="tag">{tag}</span>}
        </div>
      )}
      <div style={bodyStyle}>{children}</div>
    </div>
  );
}
