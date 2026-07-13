/** Overlay de modale — clic sur le fond ou touche Échap (géré globalement) pour fermer */
export default function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div
      className="modal-overlay show"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal">{children}</div>
    </div>
  );
}
