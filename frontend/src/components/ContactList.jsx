import { useState } from 'react';
import API_URL from '../config/api';

const ContactList = ({ contacts, onContactDeleted }) => {
  const [sortBy, setSortBy] = useState('newest');
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) {
      return;
    }

    setDeletingId(id);

    try {
      const response = await fetch(`${API_URL}/contacts/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        onContactDeleted(id, 'Contact deleted successfully! 🗑️');
      } else {
        onContactDeleted(null, data.message || 'Failed to delete contact', 'error');
      }
    } catch (error) {
      onContactDeleted(null, 'Network error. Please try again.', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const sortedContacts = [...contacts].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="neo-card p-5 sm:p-8 lg:p-10 transition-transform duration-300" style={{transform: 'rotate(-1deg)'}} onMouseEnter={(e) => e.currentTarget.style.transform = 'rotate(0deg)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'rotate(-1deg)'}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
        <h2 className="neo-heading text-2xl sm:text-3xl lg:text-4xl flex items-center gap-2 sm:gap-3">
          <span className="text-3xl sm:text-4xl lg:text-5xl">📋</span>
          <span>Contacts ({contacts.length})</span>
        </h2>
        
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <label htmlFor="sort" className="font-bold text-sm sm:text-base whitespace-nowrap" style={{color: '#FFFFFF'}}>
            Sort:
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="neo-input py-2 px-3 cursor-pointer text-sm sm:text-base flex-1 sm:flex-initial"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
              color: '#FFFFFF',
              border: '2px solid #FFFFFF',
              fontWeight: 'bold',
              appearance: 'none',
              backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'white\' stroke-width=\'3\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 0.5rem center',
              backgroundSize: '1.2em 1.2em',
              paddingRight: '2rem'
            }}
          >
            <option value="newest" style={{backgroundColor: '#000000', color: '#FFFFFF'}}>Newest First</option>
            <option value="oldest" style={{backgroundColor: '#000000', color: '#FFFFFF'}}>Oldest First</option>
            <option value="name" style={{backgroundColor: '#000000', color: '#FFFFFF'}}>Name (A-Z)</option>
          </select>
        </div>
      </div>

      {contacts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-6xl mb-4">🤷</p>
          <p className="text-2xl font-bold" style={{color: '#FFFFFF', textShadow: '0 0 15px rgba(255, 255, 255, 0.5)'}}>No contacts yet!</p>
          <p className="text-lg mt-2" style={{color: 'rgba(255, 255, 255, 0.6)'}}>Add your first contact to get started.</p>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6 max-h-[500px] sm:max-h-[600px] overflow-y-auto pr-1 sm:pr-2 custom-scrollbar">
          {sortedContacts.map((contact, index) => (
            <div
              key={contact._id}
              className="p-4 sm:p-6 transition-all duration-200 hover:-translate-y-1"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '3px solid #FFFFFF',
                boxShadow: '0 0 25px rgba(255, 255, 255, 0.5), 4px 4px 0px 0px rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(10px)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px) scale(1.01)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0) scale(1)'}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4">
                <div className="flex-1 w-full">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <h3 className="text-xl sm:text-2xl font-black break-words" style={{
                      color: '#FFFFFF',
                      textShadow: '0 0 15px rgba(255, 255, 255, 0.9)'
                    }}>{contact.name}</h3>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="flex items-center gap-2 font-bold text-sm sm:text-base break-all" style={{color: '#FFFFFF'}}>
                      <span className="text-lg sm:text-xl">📧</span>
                      <span className="break-all">{contact.email}</span>
                    </p>
                    <p className="flex items-center gap-2 font-bold text-sm sm:text-base" style={{color: '#FFFFFF'}}>
                      <span className="text-lg sm:text-xl">📱</span>
                      {contact.phone}
                    </p>
                    {contact.message && (
                      <p className="flex items-start gap-2 font-semibold mt-3 pt-3" style={{color: 'rgba(255, 255, 255, 0.9)', borderTop: '2px solid rgba(255, 255, 255, 0.2)'}}>
                        <span className="text-xl">💬</span>
                        <span className="flex-1">{contact.message}</span>
                      </p>
                    )}
                  </div>

                  <p className="text-xs font-bold mt-4" style={{color: 'rgba(255, 255, 255, 0.5)'}}>
                    Added: {formatDate(contact.createdAt)}
                  </p>
                </div>

                <button
                  onClick={() => handleDelete(contact._id)}
                  disabled={deletingId === contact._id}
                  className="neo-btn neo-btn-danger shrink-0 w-full sm:w-auto text-sm sm:text-base py-2 sm:py-3"
                >
                  {deletingId === contact._id ? '⚡' : '✖️ REMOVE'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactList;
