'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

interface ElevenLabsWidgetProps {
  agentId: string;
}

// Global flag to track if script is loaded
let isScriptLoaded = false;
let isScriptLoading = false;
const scriptCallbacks: (() => void)[] = [];

export const ElevenLabsWidget: React.FC<ElevenLabsWidgetProps> = ({ agentId }) => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(true);

  const loadScript = useCallback(async () => {
    if (isScriptLoaded) {
      return Promise.resolve();
    }

    if (isScriptLoading) {
      return new Promise<void>((resolve) => {
        scriptCallbacks.push(resolve);
      });
    }

    isScriptLoading = true;

    return new Promise<void>((resolve, reject) => {
      // Check if script is already loaded
      if (window.customElements?.get('elevenlabs-convai')) {
        isScriptLoaded = true;
        isScriptLoading = false;
        resolve();
        return;
      }

      // Wait for script to be available
      const checkScript = () => {
        if (window.customElements?.get('elevenlabs-convai')) {
          isScriptLoaded = true;
          isScriptLoading = false;
          resolve();
          scriptCallbacks.forEach(callback => callback());
          scriptCallbacks.length = 0;
        } else {
          setTimeout(checkScript, 100);
        }
      };

      checkScript();

      // Timeout after 10 seconds
      setTimeout(() => {
        if (!isScriptLoaded) {
          isScriptLoading = false;
          reject(new Error('Script loading timeout'));
        }
      }, 10000);
    });
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    const initializeWidget = async () => {
      try {
        setIsLoading(true);
        setError(null);

        await loadScript();

        if (!mountedRef.current) return;

        // Use a small delay to ensure DOM is ready
        await new Promise(resolve => setTimeout(resolve, 50));

        if (!mountedRef.current) return;

        setIsReady(true);
        setIsLoading(false);
      } catch (err) {
        console.error('Error initializing ElevenLabs widget:', err);
        if (mountedRef.current) {
          setError(err instanceof Error ? err.message : 'Failed to initialize widget');
          setIsLoading(false);
        }
      }
    };

    initializeWidget();

    return () => {
      mountedRef.current = false;
    };
  }, [agentId, loadScript]);

  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-50 rounded-lg">
        <p className="text-sm">Error loading voice assistant: {error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-sm text-gray-600">Loading voice assistant...</span>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="elevenlabs-widget-container">
      {isReady && (
        <div
          dangerouslySetInnerHTML={{
            __html: `<elevenlabs-convai agent-id="${agentId}"></elevenlabs-convai>`
          }}
        />
      )}
    </div>
  );
}; 