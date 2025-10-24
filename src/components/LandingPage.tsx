import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/Button';
import { Card, CardContent } from './ui/Card';

// Declare VANTA global type
declare global {
  interface Window {
    VANTA: any;
  }
}

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const vantaRef = useRef<HTMLDivElement>(null);

  const handleGetStarted = () => {
    navigate('/login');
  };

  const handleLitepaper = () => {
    // Here you can add logic to open the litepaper
    console.log('Opening litepaper...');
  };

  const handleDocs = () => {
    // Here you can add logic to open the documentation
    console.log('Opening docs...');
  };

  useEffect(() => {
    if (vantaRef.current && window.VANTA) {
      const vantaEffect = window.VANTA.NET({
        el: vantaRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: true,
        minHeight: 100.00,
        minWidth: 100.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0x000000,
        backgroundColor: 0xffffff,
        backgroundAlpha: 0.4,
        points: 12,
        maxDistance: 26,
        spacing: 15,
        showDots: true
      });

      return () => {
        if (vantaEffect && vantaEffect.destroy) {
          vantaEffect.destroy();
        }
      };
    }
  }, []);

  return (
    <div ref={vantaRef} className="min-h-screen text-white font-sans relative">
      {/* Header */}
      <header className="flex justify-between items-center p-6">
        {/* Logo */}
        <div className="flex items-center">
          <div 
            className="w-8 h-8 border-4 border-white rounded-full"
            style={{ borderColor: '#ffffff' }}
          />
        </div>
        
        {/* Navigation Links */}
        <nav className="flex space-x-12">
          <a 
            href="#" 
            className="text-black hover:text-blue-600 transition-colors duration-200"
            style={{ color: '#000000' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#0000FF'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#000000'}
          >
            git
          </a>
          <a 
            href="#" 
            className="text-black hover:text-blue-600 transition-colors duration-200"
            style={{ color: '#000000' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#0000FF'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#000000'}
          >
            x
          </a>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center flex-1 px-6 py-20 relative z-10">
        <Card variant="default" padding="lg" className="max-w-5xl w-full text-center bg-black/35 backdrop-blur-sm border-white/30">
          <CardContent>
            {/* Title */}
            <h1 
              className="text-5xl font-bold text-center mb-12 max-w-4xl leading-tight mx-auto"
              style={{ 
                color: '#ffffff',
                fontSize: '48px',
                fontWeight: 'bold',
                textAlign: 'center'
              }}
            >
              first EdTech platform on Base: universal content generation system with intelligent material creation algorithms
            </h1>

            {/* Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                onClick={handleLitepaper}
                variant="primary"
                size="lg"
                className="bg-white/20 hover:bg-white/30 text-white font-medium border border-white/30"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
                  padding: '10px 20px',
                  margin: '10px',
                  borderRadius: '5px',
                  backdropFilter: 'blur(10px)'
                }}
              >
                LITEPAPER
              </Button>
              
              <Button
                onClick={handleGetStarted}
                variant="primary"
                size="lg"
                className="bg-white/20 hover:bg-white/30 text-white font-medium border border-white/30"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
                  padding: '10px 20px',
                  margin: '10px',
                  borderRadius: '5px',
                  backdropFilter: 'blur(10px)'
                }}
              >
                GET STARTED
              </Button>
              
              <Button
                onClick={handleDocs}
                variant="primary"
                size="lg"
                className="bg-white/20 hover:bg-white/30 text-white font-medium border border-white/30"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
                  padding: '10px 20px',
                  margin: '10px',
                  borderRadius: '5px',
                  backdropFilter: 'blur(10px)'
                }}
              >
                DOCS
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 relative z-10">
        <p 
          className="text-sm"
          style={{
            color: '#ffffff',
            fontSize: '12px',
            textAlign: 'center'
          }}
        >
          © 2025 Base Library ED
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
