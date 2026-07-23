import { AlertTriangle } from "lucide-react";
import Modal from "./Modal";

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  loading = false,
  danger = true,
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <div style={{ textAlign: "center", padding: "8px 4px" }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: danger ? "rgba(239,68,68,0.1)" : "rgba(59,130,246,0.1)",
            color: danger ? "var(--danger)" : "var(--info)",
            display: "grid",
            placeItems: "center",
            margin: "0 auto 16px",
          }}
        >
          <AlertTriangle size={26} />
        </div>
        <p style={{ color: "var(--charcoal)", marginBottom: 24 }}>{message}</p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button
            className="btn btn-secondary"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </button>
          <button
            className={`btn ${danger ? "btn-danger" : "btn-primary"}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? <div className="spinner"></div> : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}