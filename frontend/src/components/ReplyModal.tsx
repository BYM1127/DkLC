import { useState } from 'react';

interface ReplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  entityId: number;
  fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>;
}

export const ReplyModal = ({
  isOpen,
  onClose,
  customerName,
  customerPhone,
  customerEmail,
  entityId,
  fetchWithAuth,
}: ReplyModalProps) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ success?: boolean; whatsappLink?: string; error?: string } | null>(null);

  if (!isOpen) return null;

  const handleSend = async (channel: 'email' | 'whatsapp') => {
    setSending(true);
    setResult(null);

    const endpoint = `/api/admin/contacts/${entityId}/reply`;

    try {
      const res = await fetchWithAuth(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, channel }),
      });

      const data = await res.json();

      if (res.ok) {
        if (channel === 'whatsapp' && data.whatsappLink) {
          window.open(data.whatsappLink, '_blank', 'noopener');
        }
        setResult({ success: true, whatsappLink: data.whatsappLink });
      } else {
        setResult({ error: data.message || 'Failed to send' });
      }
    } catch (err) {
      setResult({ error: 'Network error. Please try again.' });
    } finally {
      setSending(false);
    }
  };

  const handleClose = () => {
    setMessage('');
    setResult(null);
    onClose();
  };

  return (
    <div className="admin-modal-overlay" onClick={handleClose}>
      <div className="admin-modal" onClick={e => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h3>Reply to Customer</h3>
          <button className="admin-modal-close" onClick={handleClose}>×</button>
        </div>

        <div className="admin-modal-body">
          <div className="quote-customer-info">
            <div className="quote-info-row">
              <span className="quote-label">Customer:</span>
              <span>{customerName}</span>
            </div>
            <div className="quote-info-row">
              <span className="quote-label">Phone:</span>
              <span>{customerPhone || 'N/A'}</span>
            </div>
            {customerEmail && (
              <div className="quote-info-row">
                <span className="quote-label">Email:</span>
                <span>{customerEmail}</span>
              </div>
            )}
          </div>

          <div className="field" style={{ marginTop: '16px' }}>
            <label>Message</label>
            <textarea
              rows={4}
              placeholder="Type your reply..."
              value={message}
              onChange={e => setMessage(e.target.value)}
            />
          </div>

          {result && (
            <div className={`quote-result ${result.success ? 'success' : 'error'}`}>
              {result.success ? '✅ Sent successfully!' : `❌ ${result.error}`}
            </div>
          )}
        </div>

        <div className="admin-modal-footer">
          <button
            className="btn-admin btn-admin-primary"
            onClick={() => handleSend('email')}
            disabled={sending || (!message.trim())}
          >
            {sending ? 'Sending...' : '📧 Send via Email'}
          </button>
          <button
            className="btn-admin btn-admin-whatsapp"
            onClick={() => handleSend('whatsapp')}
            disabled={sending || (!message.trim()) || !customerPhone}
          >
            {sending ? 'Sending...' : '💬 Send via WhatsApp'}
          </button>
          <button className="btn-admin btn-admin-ghost" onClick={handleClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
