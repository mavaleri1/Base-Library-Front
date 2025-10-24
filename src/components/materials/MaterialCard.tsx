import React from 'react';
import { Card, CardContent } from '../ui';
import type { Material } from '../../types';
import { BookOpen, ArrowRight, Clock } from 'lucide-react';

interface MaterialCardProps {
  material: Material;
  onClick?: () => void;
  viewMode?: 'grid' | 'list';
}

export const MaterialCard: React.FC<MaterialCardProps> = ({ 
  material, 
  onClick,
  viewMode = 'grid'
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  // Determine duration based on word count
  const getDuration = (wordCount: number): string => {
    if (wordCount < 500) return '15 min';
    if (wordCount < 1000) return '30 min';
    if (wordCount < 1500) return '45 min';
    return '1 hour';
  };

  const duration = getDuration(material.word_count || 0);

  return (
    <Card 
      variant="bordered" 
      className={`hover:border-primary transition-all duration-300 cursor-pointer group hover:shadow-lg ${
        viewMode === 'list' 
          ? 'h-auto' 
          : 'h-full flex flex-col'
      }`}
      onClick={handleClick}
      style={viewMode === 'grid' ? {
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        width: '250px',
        height: '300px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      } : {
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}
    >
      <CardContent className={`p-4 ${viewMode === 'grid' ? 'h-full flex flex-col' : ''}`}>
        {viewMode === 'grid' ? (
          // Grid mode - square cards
          <>
            {/* Top section with badge */}
            <div className="flex justify-start items-start mb-3">
              <div 
                className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: '#F5E8C7',
                  color: '#333333'
                }}
              >
                <BookOpen size={12} />
                <span>{material.subject}</span>
              </div>
            </div>

            {/* Title */}
            <h3 
              className="font-bold text-lg leading-tight mb-3 line-clamp-3"
              style={{ color: '#000000' }}
            >
              {material.title}
            </h3>

            {/* Description */}
            <p 
              className="text-sm leading-relaxed mb-4 flex-1 line-clamp-4"
              style={{ color: '#666666' }}
            >
              {material.topic && `Topic: ${material.topic}`}
              {material.grade && ` • Level: ${material.grade}`}
              {material.word_count && ` • ${material.word_count} words`}
            </p>

            {/* Bottom section with duration and button */}
            <div className="flex justify-between items-center mt-auto">
              <div 
                className="flex items-center gap-2 text-sm font-medium"
                style={{ color: '#666666' }}
              >
                <Clock size={14} />
                <span>{duration}</span>
              </div>
              
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                style={{ backgroundColor: '#E6F0FA' }}
              >
                <ArrowRight 
                  size={16} 
                  style={{ color: '#000000' }}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </div>
            </div>
          </>
        ) : (
          // List mode - horizontally stretched cards
          <div className="flex items-center gap-4 w-full">
            {/* Subject badge */}
            <div className="flex-shrink-0">
              <div 
                className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: '#F5E8C7',
                  color: '#333333'
                }}
              >
                <BookOpen size={12} />
                <span>{material.subject}</span>
              </div>
            </div>
            
            {/* Title and description */}
            <div className="flex-1 min-w-0 w-96 text-left">
              <h3 className="font-bold text-lg leading-tight mb-1 line-clamp-1 text-left">
                {material.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-1 text-left">
                {material.topic && `Topic: ${material.topic}`}
                {material.grade && ` • Level: ${material.grade}`}
                {material.word_count && ` • ${material.word_count} words`}
              </p>
            </div>
            
            {/* Duration */}
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground flex-shrink-0">
              <Clock size={14} />
              <span>{duration}</span>
            </div>
            
            {/* Arrow button */}
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 flex-shrink-0"
              style={{ backgroundColor: '#E6F0FA' }}
            >
              <ArrowRight 
                size={16} 
                style={{ color: '#000000' }}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
