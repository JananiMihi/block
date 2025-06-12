
"use client";

import type { FC } from 'react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Download } from 'lucide-react';

interface CodeExporterProps {
  currentCode: string;
  fileName?: string;
  triggerButton?: React.ReactNode;
}

const CodeExporter: FC<CodeExporterProps> = ({ currentCode, fileName = 'blockly_code.py', triggerButton }) => {
  const { toast } = useToast();

  const handleExportCode = () => {
    if (!currentCode) {
      toast({ title: 'Info', description: 'There is no code to export.', variant: 'default' });
      return;
    }
    try {
      // Using text/plain as a safe default, text/x-python might also work
      const blob = new Blob([currentCode], { type: 'text/plain;charset=utf-8;' }); 
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast({ title: 'Success', description: 'Code exported successfully!' });
    } catch (error) {
      console.error('Failed to export code:', error);
      toast({ title: 'Error', description: 'Failed to export code.', variant: 'destructive' });
    }
  };
  
  const defaultTrigger = (
     <Button variant="outline" onClick={handleExportCode}>
        <Download className="mr-2 h-4 w-4" />
        Export Code
      </Button>
  );

  return triggerButton ? React.cloneElement(triggerButton as React.ReactElement, { onClick: handleExportCode }) : defaultTrigger;
};

export default CodeExporter;
