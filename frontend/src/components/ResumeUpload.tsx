import React, { useState } from 'react';
import { uploadResumeToSupabase } from '../utils/storageService';

interface Props {
  candidateId: number;
  authToken: string;
}

export const ResumeUpload: React.FC<Props> = ({ candidateId, authToken }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;

    try {
      setLoading(true);

      // 1. Upload to Supabase Storage
      const resumeUrl = await uploadResumeToSupabase(file, candidateId);

      // 2. Call your .NET backend endpoint
      const response = await fetch(`http://localhost:5000/api/candidates/${candidateId}/resume`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ resumeUrl })
      });

      if (!response.ok) throw new Error('Failed to update backend');

      alert('Resume updated successfully!');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <button onClick={handleUpload} disabled={loading || !file}>
        {loading ? 'Uploading...' : 'Update Resume'}
      </button>
    </div>
  );
};