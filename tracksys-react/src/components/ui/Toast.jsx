import Icon from '../icons/Icon.jsx';
import { useApp } from '../../context/AppContext.jsx';

export default function Toast() {
  const { toast } = useApp();
  return (
    <div className={`toast${toast.visible ? ' show' : ''}`} role="status" aria-live="polite">
      <Icon name="check" />
      <span>{toast.msg}</span>
    </div>
  );
}
