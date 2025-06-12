"use client";

import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CodeUploaderProps {
  currentCode: string;
  triggerButton?: React.ReactNode;
}

const CodeUploader: React.FC<CodeUploaderProps> = ({ currentCode, triggerButton }) => {
  const { toast } = useToast();
  // Add a minimal SerialPort type for TypeScript
  type SerialPort = {
    readable: ReadableStream | null;
    writable: WritableStream & { locked: boolean } | null;
    open: (options: { baudRate: number }) => Promise<void>;
    close: () => Promise<void>;
  };
  
  const portRef = useRef<SerialPort | null>(null);

  const handleUploadCode = async () => {
    if (!currentCode) {
      toast({ title: 'No Code', description: 'There is no code to upload.', variant: 'default' });
      return;
    }

    if (!('serial' in navigator)) {
      toast({
        title: 'Unsupported',
        description: 'Web Serial API is not supported in this browser.',
        variant: 'destructive',
      });
      return;
    }

    let port = portRef.current;
    let writer = null;

    try {
      if (!port || !port.readable || !port.writable) {
        port = await (navigator as any).serial.requestPort();
        await port!.open({ baudRate: 115200 });
        portRef.current = port;
      }

      if (!port || !port.writable || port.writable.locked) {
        toast({ title: 'Busy', description: 'Port is currently busy or unavailable.', variant: 'destructive' });
        return;
      }
      
      const encoder = new TextEncoderStream();
      const outputDone = encoder.readable.pipeTo(port.writable);
      writer = encoder.writable.getWriter();


      await writer.write('\x03'); // Ctrl+C
      await new Promise(r => setTimeout(r, 500));

      await writer.write("f = open('main.py', 'w')\r\n");

      for (const line of currentCode.split('\n')) {
        await writer.write(`f.write(${JSON.stringify(line + '\n')})\r\n`);
        await new Promise(r => setTimeout(r, 20));
      }

      await writer.write("f.close()\r\n");
      await writer.write('\x04'); // Ctrl+D

      await writer.close();
      await outputDone;

      // await writableStreamClosed;
      // await port.close();
      // portRef.current = null;

      toast({
        title: 'Upload Successful',
        description: 'The code has been uploaded.',
      });
    } catch (err: any) {
      writer?.releaseLock();

      try {
        if (writer) writer.releaseLock();
        if (port?.writable) await port.close();
      } catch {}

      portRef.current = null;
      toast({
        title: 'Upload Failed',
        description: err?.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    }
  };

  const defaultTrigger = (
    <Button variant="outline" onClick={handleUploadCode}>
      <Download className="mr-2 h-4 w-4" />
      Upload
    </Button>
  );

  return triggerButton
    ? React.cloneElement(triggerButton as React.ReactElement, { onClick: handleUploadCode })
    : defaultTrigger;
};

export default CodeUploader;
