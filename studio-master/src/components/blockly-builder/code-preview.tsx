
"use client";

import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileCode, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from "@/lib/utils";

interface CodePreviewProps {
  code: string;
  className?: string;
}

const CodePreview: FC<CodePreviewProps> = ({ code, className }) => {
  const { toast } = useToast();

  const handleCopyToClipboard = () => {
    if (!code) return;
    navigator.clipboard.writeText(code)
      .then(() => toast({ title: 'Copied!', description: 'Python code copied to clipboard!', variant: 'default' }))
      .catch(() => toast({ title: 'Oops!', description: 'Could not copy code.', variant: 'destructive' }));
  };

  return (
    <Card className={cn("flex flex-col h-full w-full", className)}>
      <CardHeader className="p-3 flex flex-row items-center justify-between shrink-0">
        <CardTitle className="flex items-center text-md sm:text-lg font-semibold">
          <FileCode className="mr-2 h-5 w-5 text-primary" />
          Python Code
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={handleCopyToClipboard} className="h-7 w-7">
          <Copy className="h-4 w-4" />
          <span className="sr-only">Copy code</span>
        </Button>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden min-h-0">
        <ScrollArea className="h-full w-full rounded-b-lg border border-border bg-muted/30">
          <pre className="text-xs sm:text-sm font-code whitespace-pre-wrap break-all p-3">
            <code>{code || "# Your Python code will appear here"}</code>
          </pre>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default CodePreview;
