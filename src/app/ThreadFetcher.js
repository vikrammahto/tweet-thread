'use client';
import { useState, useCallback } from 'react';

const ThreadFetcher = () => {
  const [topic, setTopic] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState(null);
  const [result, setResult] = useState(null);

  async function callEndpoint(topic) {
    const url = `https://bqom70.buildship.run/aiTwitterXThreadGenerator-ae97b6c6c577?reset=true&topic=${encodeURIComponent(
      topic
    )}`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const result = await response.json();
      //   console.log('Success:', result); // Debug log
      setResult(result);
      return result;
    } catch (error) {
      console.error('Error:', error);
      throw new Error(`Failed to fetch thread: ${error.message}`);
    }
  }

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError('');
      setOutput(null);

      if (!topic.trim()) {
        setError('Please enter a topic.');
        return;
      }

      setLoading(true);
      console.log('Submitted Topic:', topic); // Debug log
      try {
        const result = await callEndpoint(topic);
        setOutput(Array.isArray(result) ? result : null); // Handle array response
      } catch (err) {
        setError(err.message || 'Failed to fetch thread.');
      } finally {
        setLoading(false);
      }
    },
    [topic]
  );

  return (
    <div
      style={{
        maxWidth: 600,
        margin: '2rem auto',
        padding: 24,
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0 2px 12px #0001',
      }}
    >
      <h2 style={{ marginBottom: 16 }}>Twitter/X Thread Generator</h2>
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
        aria-describedby={error ? 'error-message' : undefined}
      >
        <label htmlFor="topic" style={{ fontWeight: 500 }}>
          Topic <span style={{ color: 'red' }}>*</span>
        </label>
        <input
          id="topic"
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter a topic..."
          style={{
            padding: 8,
            fontSize: 16,
            borderRadius: 6,
            border: '1px solid #ccc',
          }}
          required
          aria-required="true"
          aria-invalid={!!error}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 0',
            fontSize: 16,
            borderRadius: 6,
            background: '#0070f3',
            color: '#fff',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginTop: 8,
          }}
        >
          {loading ? 'Generating...' : 'Generate Thread'}
        </button>
        {error && (
          <div
            id="error-message"
            style={{ color: 'red', marginTop: 8 }}
            role="alert"
          >
            {error}
          </div>
        )}
      </form>
      <div style={{ marginTop: 24 }}>
        <h3>Generated Thread</h3>
        {loading && <div style={{ color: '#666' }}>Loading thread...</div>}
        {result && Array.isArray(result.tweets) && (
          <div style={{ display: 'grid', gap: 16 }}>
            {result.tweets.map((tweet, idx) => (
              <div
                key={idx}
                style={{
                  background: '#f4f4f4',
                  borderRadius: 8,
                  padding: 18,
                  fontSize: 17,
                  boxShadow: '0 1px 4px #0001',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                }}
              >
                <span
                  style={{ fontWeight: 600, color: '#0070f3', minWidth: 28 }}
                >
                  {idx + 1}.
                </span>
                <span style={{ whiteSpace: 'pre-line' }}>{tweet}</span>
              </div>
            ))}
          </div>
        )}
        {result && !Array.isArray(result.tweets) && (
          <pre style={{ background: '#f4f4f4', padding: 12, borderRadius: 6 }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};

export default ThreadFetcher;
