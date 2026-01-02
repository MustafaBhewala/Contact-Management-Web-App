import { useState, useEffect } from 'react';
import ContactForm from './components/ContactForm';
import ContactList from './components/ContactList';
import Toast from './components/Toast';

function App() {
  const [contacts, setContacts] = useState([]);
  const [toast, setToast] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch contacts on component mount
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/contacts');
      const data = await response.json();
      
      if (response.ok) {
        setContacts(data.data);
      }
    } catch (error) {
      showToast('Failed to load contacts', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleContactAdded = (newContact, message, type = 'success') => {
    if (newContact) {
      setContacts(prev => [newContact, ...prev]);
    }
    showToast(message, type);
  };

  const handleContactDeleted = (id, message, type = 'success') => {
    if (id) {
      setContacts(prev => prev.filter(contact => contact._id !== id));
    }
    showToast(message, type);
  };

  return (
    <div className="min-h-screen px-6 flex flex-col items-center justify-center pt-8">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: -1,
          opacity: 1
        }}
      >
        <source src="/background-video.mp4" type="video/mp4" />
        {/* Fallback to GIF if video doesn't load */}
      </video>
      
      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Main Content Container */}
      <div className="w-full max-w-7xl flex flex-col items-center">
        {/* Header */}
        <div className="w-full mb-24 text-center">
          <div className="inline-block px-8 py-4" style={{
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            border: '4px solid #FFFFFF',
            boxShadow: '0 0 40px rgba(255, 255, 255, 0.8), 8px 8px 0px 0px rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(10px)',
            transform: 'rotate(2deg)',
            transition: 'all 0.3s'
          }} onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'rotate(0deg)';
            e.currentTarget.style.boxShadow = '0 0 50px rgba(255, 255, 255, 1), 12px 12px 0px 0px rgba(255, 255, 255, 0.5)';
          }} 
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'rotate(2deg)';
              e.currentTarget.style.boxShadow = '0 0 40px rgba(255, 255, 255, 0.8), 8px 8px 0px 0px rgba(255, 255, 255, 0.3)';
            }}>
            <h1 className="neo-heading text-6xl" style={{ color: '#FFFFFF', textShadow: '0 0 20px rgba(255, 255, 255, 0.9)' }}>
              📇 Contact Manager
            </h1>
            <p className="font-bold text-xl mt-2" style={{ color: '#FFFFFF', textShadow: '0 0 15px rgba(255, 255, 255, 0.8)' }}>
              Neo-Brutalist Edition
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16" style={{ marginTop: '3cm' }}>
          {/* Contact Form */}
          <div>
            <ContactForm onContactAdded={handleContactAdded} />
          </div>

          {/* Contact List */}
          <div>
            {isLoading ? (
              <div className="neo-card p-8 text-center">
                <div className="text-6xl mb-4 animate-bounce">⏳</div>
                <p className="text-2xl font-bold" style={{ color: '#FFFFFF' }}>Loading contacts...</p>
              </div>
            ) : (
              <ContactList 
                contacts={contacts} 
                onContactDeleted={handleContactDeleted}
              />
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full py-8 mb-16 flex flex-col items-center gap-6" style={{ marginTop: '3cm' }}>
        {/* Social Links */}
        <div className="flex flex-wrap gap-4 justify-center">
          <a 
            href="https://linkedin.com/in/mustafabhewala/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-4 py-3 transition-all duration-200"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '8px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px) scale(1.15)';
              e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 255, 255, 0.8)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            title="LinkedIn"
          >
            <img src="/icons/linkedin.png" alt="LinkedIn" style={{ width: '40px', height: '40px', display: 'block' }} />
          </a>
          
          <a 
            href="https://github.com/MustafaBhewala/Contact-Management-Web-App.git" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-4 py-3 transition-all duration-200"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: '8px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px) scale(1.15)';
              e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 255, 255, 0.8)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            title="GitHub"
          >
            <img src="/icons/github-sign.png" alt="GitHub" style={{ width: '40px', height: '40px', display: 'block' }} />
          </a>
          
          <a 
            href="https://wa.me/918401380079" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-4 py-3 transition-all duration-200"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '8px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px) scale(1.15)';
              e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 255, 255, 0.8)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            title="WhatsApp"
          >
            <img src="/icons/whatsapp.png" alt="WhatsApp" style={{ width: '40px', height: '40px', display: 'block' }} />
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;

