import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import DocumentUpload from './DocumentUpload';

interface DocumentRequestListProps {
  caseId: string;
}

interface DocumentRequest {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  status: string;
  documents: {
    name: string;
    url: string;
    uploadedBy: string;
    uploadedAt: string;
    size: number;
    type: string;
  }[];
  requestedBy: {
    name: string;
  };
  requestedFrom: {
    firstName: string;
    lastName: string;
  };
}

export default function DocumentRequestList({ caseId }: DocumentRequestListProps) {
  const { data: session } = useSession();
  const [requests, setRequests] = useState<DocumentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRequests();
  }, [caseId]);

  const fetchRequests = async () => {
    try {
      const response = await fetch(`/api/documents?caseId=${caseId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch document requests');
      }
      const data = await response.json();
      setRequests(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {requests.map((request) => (
        <div
          key={request._id}
          className="border rounded-lg p-4 space-y-4"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">{request.title}</h3>
              <p className="text-gray-600">{request.description}</p>
              <p className="text-sm text-gray-500">
                Requested by: {request.requestedBy.name}
              </p>
              {request.dueDate && (
                <p className="text-sm text-gray-500">
                  Due: {new Date(request.dueDate).toLocaleDateString()}
                </p>
              )}
            </div>
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                request.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : request.status === 'submitted'
                  ? 'bg-blue-100 text-blue-800'
                  : request.status === 'approved'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {request.status}
            </span>
          </div>

          {request.documents.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Submitted Documents:
              </h4>
              <ul className="space-y-2">
                {request.documents.map((doc, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between bg-gray-50 p-2 rounded"
                  >
                    <span className="text-sm">{doc.name}</span>
                    <a
                      href={`/api/documents/download?file=${doc.url}`}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Download
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {request.status === 'pending' && (
            <div className="mt-4">
              <DocumentUpload
                requestId={request._id}
                onSuccess={fetchRequests}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
} 