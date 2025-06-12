
"use client";

import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import Image from 'next/image';
import { Rocket } from 'lucide-react';

interface StagePreviewProps {
  className?: string;
}

const StagePreview: FC<StagePreviewProps> = ({ className }) => {
  return (
    <Card className={className}>
      <CardHeader className="p-3">
        <CardTitle className="flex items-center text-md sm:text-lg font-semibold">
          <Rocket className="mr-2 h-5 w-5 text-accent" />
          Stage Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 h-[calc(100%-4rem)]">
        <AspectRatio ratio={16 / 9} className="bg-muted/50 rounded-md flex items-center justify-center overflow-hidden">
          {/* Placeholder for actual stage content */}
          <div className="text-center p-4">
            <Image 
              src="https://placehold.co/300x200.png" // Placeholder image
              alt="Stage Preview Placeholder" 
              width={300} 
              height={200} 
              className="opacity-30 rounded-md"
              data-ai-hint="empty stage"
            />
            <p className="mt-2 text-sm text-foreground/60 font-medium">
              Your creation will appear here!
            </p>
          </div>
        </AspectRatio>
      </CardContent>
    </Card>
  );
};

export default StagePreview;
