'use client';

import { useEffect, useState } from 'react';

export default function TestBucketsPage() {
  const [buckets, setBuckets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creatingBucket, setCreatingBucket] = useState(false);
  const [bucketMessage, setBucketMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBuckets() {
      try {
        const response = await fetch('/api/list-buckets');
        const data = await response.json();

        if (data.success) {
          setBuckets(data.buckets);
        } else {
          setError(data.error);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchBuckets();
  }, []);

  async function createBucket() {
    setCreatingBucket(true);
    setBucketMessage(null);

    try {
      const response = await fetch('/api/create-bucket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bucketName: 'payment' }),
      });

      const data = await response.json();

      if (data.success) {
        setBucketMessage('Bucket "payment" created successfully!');
        // Refresh the buckets list
        const bucketsResponse = await fetch('/api/list-buckets');
        const bucketsData = await bucketsResponse.json();
        if (bucketsData.success) {
          setBuckets(bucketsData.buckets);
        }
      } else {
        setBucketMessage(`Error: ${data.error}`);
      }
    } catch (err: any) {
      setBucketMessage(`Error: ${err.message}`);
    } finally {
      setCreatingBucket(false);
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Supabase Storage Buckets</h1>

      <div className="mb-6">
        <button
          onClick={createBucket}
          disabled={creatingBucket}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded disabled:bg-blue-300"
        >
          {creatingBucket ? 'Creating...' : 'Create "payment" Bucket'}
        </button>

        {bucketMessage && (
          <div
            className={`mt-2 p-2 rounded ${bucketMessage.includes('Error') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}
          >
            {bucketMessage}
          </div>
        )}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <div className="bg-red-100 text-red-800 p-4 rounded">Error: {error}</div>
      ) : (
        <div>
          <h2 className="text-xl font-semibold mb-2">Available Buckets:</h2>
          {buckets.length === 0 ? (
            <p>No buckets found.</p>
          ) : (
            <ul className="list-disc pl-6">
              {buckets.map(bucket => (
                <li key={bucket.id}>
                  <strong>{bucket.id}</strong> - {bucket.name}
                  <p>Public: {bucket.public ? 'Yes' : 'No'}</p>
                  <p>Created: {new Date(bucket.created_at).toLocaleString()}</p>
                  <br />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
