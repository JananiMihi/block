"use client";

import type { FC } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import * as Blockly from 'blockly/core';
import 'blockly/blocks';
import { pythonGenerator } from 'blockly/python';
import * as En from 'blockly/msg/en';

Blockly.setLocale(En as unknown as { [key: string]: string });

import { defaultToolbox } from '@/lib/blockly-toolbox';
import { cn } from '@/lib/utils';

interface BlocklyWorkspaceProps {
  initialXml: string;
  onWorkspaceChange: (xml: string, code: string) => void;
  className?: string;
}

const BlocklyWorkspace: FC<BlocklyWorkspaceProps> = ({ 
  initialXml, 
  onWorkspaceChange, 
  className 
}) => {
  const blocklyDivRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !blocklyDivRef.current) return;
    
    setIsLoading(true);
    setError(null);
    
    // Clean up previous workspace
    workspaceRef.current?.dispose();
    workspaceRef.current = null;
    blocklyDivRef.current.innerHTML = '';

    try {
      // Custom theme with refined colors
     const customTheme = Blockly.Theme.defineTheme('harmoniousTheme', {
  name: 'harmoniousTheme', // <-- Add this line
  base: Blockly.Themes.Classic,
  componentStyles: {
    workspaceBackgroundColour: '#f8fafc',
    toolboxBackgroundColour: '#ffffff',
    toolboxForegroundColour: '#1e293b',
    flyoutBackgroundColour: '#f1f5f9',
    flyoutForegroundColour: '#1e293b',
    flyoutOpacity: 0.95,
    scrollbarColour: '#cbd5e1',
    insertionMarkerColour: '#3b82f6',
    insertionMarkerOpacity: 0.6,
  },
  categoryStyles: {
    logic_category: { colour: '#3b82f6' },
    loop_category: { colour: '#eab308' },
    math_category: { colour: '#10b981' },
    text_category: { colour: '#6366f1' },
    variable_category: { colour: '#06b6d4' },
  },
  blockStyles: {
    logic_blocks: { colourPrimary: '#eab308' },
    loop_blocks: { colourPrimary: '#eab308' },
    math_blocks: { colourPrimary: '#10b981' },
    text_blocks: { colourPrimary: '#6366f1' },
    variable_blocks: { colourPrimary: '#06b6d4' },
  },
});


      const ws = Blockly.inject(blocklyDivRef.current, {
        toolbox: defaultToolbox,
        renderer: 'zelos',
        theme: customTheme,
        grid: { 
          spacing: 20, 
          length: 3, 
          colour: '#e2e8f0', 
          snap: true 
        },
        zoom: { 
          controls: true, 
          wheel: true, 
          startScale: 0.9, 
          maxScale: 3, 
          minScale: 0.3, 
          scaleSpeed: 1.1 
        },
        trashcan: true,
        move: { 
          scrollbars: {
            horizontal: true,
            vertical: true
          }, 
          drag: true, 
          wheel: true 
        },
        media: '/blockly-media/',
        sounds: true,
        oneBasedIndex: false,
      });
      
      workspaceRef.current = ws;

      // Load initial XML with error handling
      try {
        const xmlStr = initialXml || '<xml></xml>';
        const xmlDom = Blockly.utils.xml.textToDom(xmlStr);
        Blockly.Xml.clearWorkspaceAndLoadFromXml(xmlDom, ws);
      } catch (xmlError) {
        console.warn('Failed to load initial XML, starting with empty workspace:', xmlError);
      }

      const updateCode = () => {
        if (!workspaceRef.current) return;
        try {
          const code = pythonGenerator.workspaceToCode(workspaceRef.current);
          const domNow = Blockly.Xml.workspaceToDom(workspaceRef.current);
          const xmlNow = Blockly.utils.xml.domToText(domNow);
          onWorkspaceChange(xmlNow, code);
        } catch (codeError) {
          console.error('Error generating code:', codeError);
        }
      };

      // Add event listeners
      ws.addChangeListener(Blockly.Events.disableOrphans);
      ws.addChangeListener((e) => {
        if (e.isUiEvent || e.type === Blockly.Events.VIEWPORT_CHANGE) return;
        updateCode();
      });

      // Initial code generation
      updateCode();
      setIsInitialized(true);
      
    } catch (err) {
      console.error('Blockly initialization error:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize Blockly workspace');
    } finally {
      setIsLoading(false);
    }

    // Handle resize
    const handleResize = () => {
      if (workspaceRef.current) {
        Blockly.svgResize(workspaceRef.current);
      }
    };

    window.addEventListener('resize', handleResize);
    
    // Initial resize after a short delay to ensure proper rendering
    const resizeTimeout = setTimeout(() => {
      if (workspaceRef.current) {
        Blockly.svgResize(workspaceRef.current);
      }
    }, 100);

    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
      workspaceRef.current?.dispose();
      workspaceRef.current = null;
    };
  }, [initialXml, onWorkspaceChange]);

  if (error) {
    return (
      <div className={cn(
        "relative flex items-center justify-center min-h-[400px] rounded-lg border-2 border-dashed border-red-200 bg-red-50",
        className
      )}>
        <div className="text-center p-6">
          <div className="w-12 h-12 mx-auto mb-4 text-red-500">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-red-900 mb-2">Workspace Error</h3>
          <p className="text-red-700 text-sm mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "relative rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden",
      "transition-all duration-300 ease-in-out",
      isInitialized ? "shadow-md" : "",
      className
    )}>
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="relative">
              {/* Animated spinner */}
              <div className="w-12 h-12 mx-auto mb-4">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
              {/* Pulsing dots */}
              <div className="flex justify-center space-x-1 mb-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-lg font-semibold text-gray-900">Loading Blockly Workspace</p>
              <p className="text-sm text-gray-600">Setting up your visual programming environment...</p>
            </div>
          </div>
        </div>
      )}

      {/* Status Bar */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-amber-500 to-red-500 opacity-60"></div>

      {/* Main Workspace */}
      <div 
        ref={blocklyDivRef}
        className={cn(
          "w-full transition-opacity duration-500",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        style={{ 
          height: 'calc(100% - 4px)', // Account for status bar
          minHeight: '400px' 
        }}
      />

      {/* Corner Watermark */}
      {isInitialized && (
        <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/5 backdrop-blur-sm rounded text-xs text-gray-500 pointer-events-none">
          Visual Programming
        </div>
      )}
    </div>
  );
};

export default BlocklyWorkspace;