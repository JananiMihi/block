"use client";

import type { FC } from 'react';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { generatePythonFromDescription } from '@/ai/flows/generate-python-from-description';
import { 
  Sparkles, 
  ClipboardCopy, 
  Loader2, 
  Wand2, 
  Check, 
  Code2, 
  MessageSquare,
  Download,
  RefreshCw,
  Zap
} from 'lucide-react';

interface AICodeGeneratorProps {
  triggerButton?: React.ReactNode;
}

const AICodeGenerator: FC<AICodeGeneratorProps> = ({ triggerButton }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const { toast } = useToast();

  const maxChars = 500;

  useEffect(() => {
    setCharCount(description.length);
  }, [description]);

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => setIsCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  const handleGenerateCode = async () => {
    if (!description.trim()) {
      toast({ 
        title: '✨ Need Your Input!', 
        description: 'Please describe what Python magic you want to create!', 
        variant: 'destructive' 
      });
      return;
    }
    
    setIsLoading(true);
    setGeneratedCode('');
    
    try {
      const result = await generatePythonFromDescription({ description });
      setGeneratedCode(result.pythonCode);
      toast({ 
        title: '🎉 Code Generated!', 
        description: 'Your Python spell is ready to cast!', 
        variant: 'default' 
      });
    } catch (error) {
      console.error('AI code generation failed:', error);
      toast({ 
        title: '🔧 Oops!', 
        description: 'The Smart Blocks assistant needs a moment. Please try again.', 
        variant: 'destructive' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = async () => {
    if (!generatedCode) return;
    
    try {
      await navigator.clipboard.writeText(generatedCode);
      setIsCopied(true);
      toast({ 
        title: '📋 Copied!', 
        description: 'Python code is now in your clipboard!' 
      });
    } catch (error) {
      toast({ 
        title: '❌ Copy Failed', 
        description: 'Please select and copy the code manually.', 
        variant: 'destructive' 
      });
    }
  };

  const handleDownloadCode = () => {
    if (!generatedCode) return;
    
    const blob = new Blob([generatedCode], { type: 'text/python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'smart_blocks_generated.py';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({ 
      title: '💾 Downloaded!', 
      description: 'Python file saved to your downloads!' 
    });
  };

  const handleRegenerateCode = () => {
    if (description.trim()) {
      handleGenerateCode();
    }
  };

  const suggestions = [
    "Create a function that generates random passwords",
    "Build a simple calculator with basic operations",
    "Make a script that converts temperatures",
    "Write a function to check if a number is prime"
  ];

  const handleSuggestionClick = (suggestion: string) => {
    setDescription(suggestion);
  };

  const defaultTrigger = (
    <Button 
      variant="default" 
      onClick={() => setIsOpen(true)} 
      className="group relative overflow-hidden bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-6 py-3 font-semibold"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <Zap className="mr-2 h-5 w-5 group-hover:animate-pulse" />
      Ask Smart Blocks
    </Button>
  );

  return (
    <>
      {triggerButton ? 
        React.cloneElement(triggerButton as React.ReactElement, { onClick: () => setIsOpen(true) }) : 
        defaultTrigger
      }
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl border-0 bg-gradient-to-br from-card via-card to-muted/30">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-secondary" />
          
          <DialogHeader className="space-y-4 pb-2">
            <DialogTitle className="flex items-center text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              <div className="relative mr-3">
                <Sparkles className="h-7 w-7 text-primary animate-pulse" />
                <div className="absolute inset-0 h-7 w-7 bg-primary/20 rounded-full animate-ping" />
              </div>
              Smart Blocks Assistant
            </DialogTitle>
            <DialogDescription className="text-base text-muted-foreground leading-relaxed">
              Describe your Python vision and watch the magic happen! ✨ Our AI assistant will craft custom code just for you.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-6 overflow-y-auto max-h-[60vh]">
            {/* Input Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="description" className="text-lg font-semibold flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5 text-accent" />
                  What Python magic do you need?
                </Label>
                <span className={`text-sm font-medium ${charCount > maxChars * 0.9 ? 'text-destructive' : 'text-muted-foreground'}`}>
                  {charCount}/{maxChars}
                </span>
              </div>
              
              <Textarea
                id="description"
                placeholder="Describe your Python dreams... 🐍✨"
                value={description}
                onChange={(e) => setDescription(e.target.value.slice(0, maxChars))}
                rows={4}
                className="resize-none font-body text-base rounded-xl border-2 border-border focus:border-accent transition-colors duration-200 bg-background/50 backdrop-blur-sm"
              />

              {/* Suggestions */}
              {!description && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground font-medium">💡 Need inspiration? Try these:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {suggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="justify-start h-auto p-3 text-left text-sm hover:bg-accent/10 hover:border-accent/20 border border-transparent rounded-lg transition-all duration-200"
                      >
                        <Code2 className="mr-2 h-4 w-4 text-accent flex-shrink-0" />
                        <span className="truncate">{suggestion}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Generate Button */}
            <Button 
              onClick={handleGenerateCode} 
              disabled={isLoading || !description.trim()} 
              className="relative group w-full py-4 text-lg font-semibold rounded-xl bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
              {isLoading ? (
                <>
                  <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                  Crafting Your Code...
                </>
              ) : (
                <>
                  <Wand2 className="mr-3 h-6 w-6 group-hover:animate-bounce" />
                  Generate My Python Magic!
                </>
              )}
            </Button>

            {/* Generated Code Section */}
            {generatedCode && (
              <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between">
                  <Label className="text-lg font-semibold flex items-center">
                    <Code2 className="mr-2 h-5 w-5 text-accent" />
                    Your Python Masterpiece
                  </Label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRegenerateCode}
                      disabled={isLoading}
                      className="hover:bg-accent/10 hover:border-accent transition-colors duration-200"
                      title="Regenerate Code"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownloadCode}
                      className="hover:bg-accent/10 hover:border-accent transition-colors duration-200"
                      title="Download as .py file"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyToClipboard}
                      className="hover:bg-accent/10 hover:border-accent transition-colors duration-200"
                      title="Copy to Clipboard"
                    >
                      {isCopied ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <ClipboardCopy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="relative group">
                  <div className="bg-gradient-to-br from-muted/30 to-muted/60 backdrop-blur-sm rounded-xl border border-border/50 overflow-hidden">
                    <div className="bg-muted/20 px-4 py-2 border-b border-border/30 flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Python</span>
                      <div className="flex space-x-1">
                        <div className="w-3 h-3 rounded-full bg-red-400/60"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-400/60"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400/60"></div>
                      </div>
                    </div>
                    <pre className="p-6 max-h-80 overflow-auto font-mono text-sm leading-relaxed custom-scrollbar">
                      <code className="text-foreground">{generatedCode}</code>
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="border-t border-border/30 pt-4">
            <DialogClose asChild>
              <Button 
                variant="outline" 
                className="rounded-xl hover:bg-muted/50 transition-colors duration-200"
              >
                Close Assistant
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AICodeGenerator;