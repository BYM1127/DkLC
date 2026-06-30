import { useEffect, useState } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { QuoteModal } from '../../components/QuoteModal';

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
}

export const AdminContacts = () => {
  const { fetchWithAuth } = useAdminAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyTarget, setReplyTarget] = useState<Contact | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const res = await fetchWithAuth('/api/admin/contacts');
      if (res.ok) setContacts(await res.json());
    } catch (err) {
      console.error('Failed to load contacts:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner" />
        <p>Loading contacts...</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Contact Messages</h1>
        <p className="admin-page-subtitle">View and reply to customer messages.</p>
      </div>

      {contacts.length === 0 ? (
        <div className="admin-empty">No contact messages yet.</div>
      ) : (
        <div className="admin-contacts-list">
          {contacts.map(contact => (
            <div key={contact.id} className={`admin-contact-card ${expandedId === contact.id ? 'expanded' : ''}`}>
              <div className="admin-contact-header" onClick={() => setExpandedId(expandedId === contact.id ? null : contact.id)}>
                <div className="admin-contact-avatar">
                  {contact.name.charAt(0).toUpperCase()}
                </div>
                <div className="admin-contact-summary">
                  <div className="admin-contact-name">{contact.name}</div>
                  <div className="admin-contact-preview">
                    {contact.message.length > 80 ? contact.message.slice(0, 80) + '...' : contact.message}
                  </div>
                </div>
                <div className="admin-contact-meta">
                  <div className="admin-contact-date">
                    {new Date(contact.createdAt).toLocaleDateString('en-ZA')}
                  </div>
                  <div className="admin-contact-time">
                    {new Date(contact.createdAt).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <span className="admin-contact-toggle">{expandedId === contact.id ? '▾' : '▸'}</span>
              </div>

              {expandedId === contact.id && (
                <div className="admin-contact-body">
                  <div className="admin-contact-info-grid">
                    <div>
                      <span className="admin-contact-label">Phone:</span>
                      <span>{contact.phone || '—'}</span>
                    </div>
                    <div>
                      <span className="admin-contact-label">Email:</span>
                      <span>{contact.email || '—'}</span>
                    </div>
                  </div>

                  <div className="admin-contact-message">
                    <span className="admin-contact-label">Message:</span>
                    <p>{contact.message}</p>
                  </div>

                  <div className="admin-contact-actions">
                    <button
                      className="btn-admin-small btn-admin-primary"
                      onClick={() => setReplyTarget(contact)}
                    >
                      📧 Reply
                    </button>
                    {contact.phone && (
                      <a
                        href={`https://wa.me/${contact.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${contact.name}, thank you for reaching out to Dimpho ke Lesego Catering. `)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-admin-small btn-admin-whatsapp"
                      >
                        💬 Quick WhatsApp
                      </a>
                    )}
                    {contact.phone && (
                      <a href={`tel:${contact.phone}`} className="btn-admin-small btn-admin-outline">
                        📞 Call
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Reply Modal */}
      {replyTarget && (
        <QuoteModal
          isOpen={!!replyTarget}
          onClose={() => setReplyTarget(null)}
          customerName={replyTarget.name}
          customerPhone={replyTarget.phone || ''}
          customerEmail={replyTarget.email || ''}
          entityType="contact"
          entityId={replyTarget.id}
          fetchWithAuth={fetchWithAuth}
        />
      )}
    </div>
  );
};
