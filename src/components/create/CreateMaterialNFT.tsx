import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { useMaterialNFT } from '../../hooks/useMaterialNFT';
import { api } from '../../services/api';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { Card } from '../ui/Card';

interface CreateMaterialNFTProps {
  onSuccess?: (material: any) => void;
  onCancel?: () => void;
}

const SUBJECTS = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'Web3',
  'Blockchain',
  'Economics',
  'History',
  'Language Arts',
  'Engineering',
  'Data Science',
  'Machine Learning'
];

const GRADES = [
  'Beginner',
  'Intermediate',
  'Advanced'
];

export const CreateMaterialNFT: React.FC<CreateMaterialNFTProps> = ({
  onSuccess,
  onCancel
}) => {
  const { address, isConnected } = useAccount();
  const { createMaterial, isLoading, error } = useMaterialNFT();
  
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    grade: '',
    topic: '',
    content: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'form' | 'uploading' | 'minting' | 'success'>('form');
  const [result, setResult] = useState<any>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected || !address) {
      alert('Please connect your wallet');
      return;
    }

    if (!formData.title || !formData.subject || !formData.grade || !formData.topic || !formData.content) {
      alert('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    setStep('uploading');

    try {
      // 1. Create NFT in blockchain
      const nftResult = await createMaterial({
        subject: formData.subject,
        grade: formData.grade,
        topic: formData.topic,
        content: formData.content,
        title: formData.title
      });

      setStep('minting');
      setResult(nftResult);

      // 2. sync with back 
      const material = await api.createMaterialWithNFT({
        question: formData.topic,
        settings: {
          difficulty: formData.grade.toLowerCase() as 'beginner' | 'intermediate' | 'advanced',
          subject: formData.subject,
          volume: 'standard' as const,
          enableHITL: false,
          enableEditing: false,
          enableGapQuestions: false
        },
        ipfsCid: nftResult.ipfsCid,
        contentHash: nftResult.contentHash,
        txHash: nftResult.txHash,
        tokenId: nftResult.tokenId
      });

      setStep('success');
      onSuccess?.(material);

    } catch (err) {
      console.error('Error creating NFT material:', err);
      alert('Error creating material: ' + (err instanceof Error ? err.message : 'Unknown error'));
      setStep('form');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 'form':
        return (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Material title *
              </label>
              <Input
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter the material title"
                required
                className="placeholder:text-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Subject *
              </label>
              <Select
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e)}
                required
                options={[
                  { value: '', label: 'Select subject' },
                  ...SUBJECTS.map(subject => ({ value: subject, label: subject }))
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Difficulty level *
              </label>
              <Select
                value={formData.grade}
                onChange={(e) => handleInputChange('grade', e)}
                required
                options={[
                  { value: '', label: 'Select difficulty level' },
                  ...GRADES.map(grade => ({ value: grade, label: grade }))
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Specific topic *
              </label>
              <Input
                value={formData.topic}
                onChange={(e) => handleInputChange('topic', e.target.value)}
                placeholder="For example: Linear Equations, Blockchain Fundamentals"
                required
                className="placeholder:text-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Material content *
              </label>
              <Textarea
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                placeholder="Enter the material content..."
                rows={10}
                required
                className="placeholder:text-gray-400"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || isLoading}
              >
                {isSubmitting ? 'Creating...' : 'Create NFT material'}
              </Button>
            </div>
          </form>
        );

      case 'uploading':
        return (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-medium text-foreground mb-2">
             Loading to IPFS
            </h3>
            <p className="text-muted-foreground">
              Loading your material to decentralized storage...
            </p>
          </div>
        );

      case 'minting':
        return (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              Creating NFT
            </h3>
            <p className="text-muted-foreground">
              Creating NFT in blockchain...
            </p>
            {result?.txHash && (
              <p className="text-sm text-blue-600 mt-2">
                TX: {result.txHash.substring(0, 20)}...
              </p>
            )}
          </div>
        );

      case 'success':
        return (
          <div className="text-center py-8">
            <div className="text-green-600 text-6xl mb-4">✓</div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              Material successfully created!
            </h3>
            <p className="text-muted-foreground mb-4">
              Your material is now stored in the blockchain as an NFT
            </p>
            {result && (
              <div className="bg-muted p-4 rounded-lg text-left">
                <p><strong>IPFS CID:</strong> {result.ipfsCid}</p>
                <p><strong>Content Hash:</strong> {result.contentHash.substring(0, 20)}...</p>
                <p><strong>Transaction:</strong> {result.txHash.substring(0, 20)}...</p>
              </div>
            )}
            <Button onClick={() => setStep('form')} className="mt-4">
              Create another material
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isConnected) {
    return (
      <Card className="p-6 text-center">
        <h3 className="text-lg font-medium text-foreground mb-2">
          Connect your wallet
        </h3>
        <p className="text-muted-foreground mb-4">
          To create NFT materials, you need to connect your Web3 wallet
        </p>
        <Button onClick={onCancel}>
          Close
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Create NFT material
        </h2>
        <p className="text-muted-foreground">
          Create an educational material and get an NFT as proof of authorship
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {renderStep()}
    </Card>
  );
};
