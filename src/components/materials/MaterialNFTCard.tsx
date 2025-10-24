import React, { useState } from 'react';
import { useMaterialNFT } from '../../hooks/useMaterialNFT';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface MaterialNFTCardProps {
  tokenId: number;
  material: {
    subject: string;
    grade: string;
    topic: string;
    title: string;
    author: string;
    createdAt: number;
    isPublished: boolean;
    ipfsCid: string;
    contentHash: string;
  };
  onView?: (tokenId: number) => void;
  onEdit?: (tokenId: number) => void;
}

export const MaterialNFTCard: React.FC<MaterialNFTCardProps> = ({
  tokenId,
  material,
  onView,
  onEdit
}) => {
  const { getMaterialContent, isAuthor } = useMaterialNFT();
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [content, setContent] = useState<string | null>(null);
  const [showContent, setShowContent] = useState(false);

  const handleViewContent = async () => {
    if (content) {
      setShowContent(!showContent);
      return;
    }

    setIsLoadingContent(true);
    try {
      const materialContent = await getMaterialContent(material.ipfsCid);
      setContent(materialContent);
      setShowContent(true);
    } catch (error) {
      console.error('Error loading content:', error);
      alert('Failed to load material content');
    } finally {
      setIsLoadingContent(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getSubjectEmoji = (subject: string) => {
    const emojiMap: { [key: string]: string } = {
      'Mathematics': '📐',
      'Physics': '⚛️',
      'Chemistry': '🧪',
      'Biology': '🧬',
      'Computer Science': '💻',
      'Web3': '🌐',
      'Blockchain': '⛓️',
      'Economics': '💰',
      'History': '📚',
      'Language Arts': '📝',
      'Engineering': '⚙️',
      'Data Science': '📊',
      'Machine Learning': '🤖'
    };
    return emojiMap[subject] || '📄';
  };

  const isOwner = isAuthor(material.author);

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{getSubjectEmoji(material.subject)}</span>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {material.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              #{tokenId} • {material.subject}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {material.isPublished && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Published
            </span>
          )}
          {isOwner && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Your material
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-muted-foreground">
          <span className="font-medium">Level:</span>
          <span className="ml-2">{material.grade}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <span className="font-medium">Topic:</span>
          <span className="ml-2">{material.topic}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <span className="font-medium">Author:</span>
          <span className="ml-2 font-mono text-xs">
            {material.author.substring(0, 6)}...{material.author.substring(material.author.length - 4)}
          </span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <span className="font-medium">Created:</span>
          <span className="ml-2">{formatDate(material.createdAt)}</span>
        </div>
      </div>

      {/* Blockchain metadata */}
      <div className="bg-muted p-3 rounded-lg mb-4">
        <div className="text-xs text-muted-foreground space-y-1">
          <div className="flex items-center">
            <span className="font-medium">IPFS CID:</span>
            <span className="ml-2 font-mono text-xs break-all">
              {material.ipfsCid}
            </span>
          </div>
          <div className="flex items-center">
            <span className="font-medium">Content Hash:</span>
            <span className="ml-2 font-mono text-xs">
              {material.contentHash.substring(0, 20)}...
            </span>
          </div>
        </div>
      </div>

      {/* Content (if loaded) */}
      {showContent && content && (
        <div className="mb-4">
          <div className="bg-white border rounded-lg p-4 max-h-64 overflow-y-auto">
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap text-sm text-foreground">
                {content}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewContent}
            disabled={isLoadingContent}
          >
            {isLoadingContent ? 'Loading...' : showContent ? 'Hide content' : 'Show content'}
          </Button>
          
          {onView && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(tokenId)}
            >
              Details
            </Button>
          )}
        </div>

        {isOwner && onEdit && (
          <Button
            size="sm"
            onClick={() => onEdit(tokenId)}
          >
            Edit
          </Button>
        )}
      </div>

      {/* Blockchain and IPFS links */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex justify-between text-xs text-muted-foreground">
          <a
            href={`https://gateway.pinata.cloud/ipfs/${material.ipfsCid}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600"
          >
            Open in Pinata
          </a>
          <a
            href={`https://ipfs.io/ipfs/${material.ipfsCid}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600"
          >
            Open in IPFS
          </a>
          <a
            href={`https://etherscan.io/tx/${tokenId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600"
          >
            Blockchain
          </a>
        </div>
      </div>
    </Card>
  );
};
