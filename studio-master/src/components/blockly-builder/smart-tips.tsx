
"use client";

import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

interface SmartTipsProps {
  className?: string;
}

const SmartTips: FC<SmartTipsProps> = ({ className }) => {
  return (
    <Card className={className}>
      <CardHeader className="p-3">
        <CardTitle className="flex items-center text-md sm:text-lg font-semibold">
          <Lightbulb className="mr-2 h-5 w-5 text-secondary" />
          Smart Tips
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <div className="space-y-3">
          <div className="bg-primary/10 p-3 rounded-lg">
            <h4 className="font-semibold text-primary text-sm">Tip #1</h4>
            <p className="text-xs text-foreground/80">
              Try using a 'repeat' loop to make your character dance!
            </p>
          </div>
          <div className="bg-accent/10 p-3 rounded-lg">
            <h4 className="font-semibold text-accent text-sm">Did you know?</h4>
            <p className="text-xs text-foreground/80">
              You can create your own blocks called 'functions' for reusable code.
            </p>
          </div>
           <div className="bg-secondary/10 p-3 rounded-lg">
            <h4 className="font-semibold text-secondary text-sm">Challenge!</h4>
            <p className="text-xs text-foreground/80">
              Can you make a block sequence that draws a square?
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartTips;
