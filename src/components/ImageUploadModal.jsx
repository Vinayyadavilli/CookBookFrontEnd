import React, { useState } from 'react';
import api from '../api/axios';
import { Upload } from 'lucide-react';

const ImageUploadModal = ({ recipeId, onClose, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please select a file');
    
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      await api.post(`/admin/recipes/${recipeId}/image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onSuccess();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h2 className="page-title" style={{ fontSize: '1.5rem' }}>Upload Image</h2>
          <button onClick={onClose} style={{ color: 'var(--text-secondary)' }}>Close</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ textAlign: 'center', padding: '2rem', border: '2px dashed var(--border-color)', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
            <Upload size={32} color="var(--text-secondary)" style={{ margin: '0 auto 1rem auto' }} />
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} style={{ color: 'var(--text-primary)' }} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload Image'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ImageUploadModal;
