
"use client";

import type { FC } from 'react';
import ProjectManager from './project-manager';
import AICodeGenerator from './ai-code-generator';
import CodeExporter from './code-exporter';
import { Blocks, Save, FolderOpen, Download, User, Bot, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import CodeUploader from './code-uploader';

interface ToolbarProps {
  currentXml: string;
  currentPyCode: string; 
  onLoadProject: (xml: string) => void;
}

const Toolbar: FC<ToolbarProps> = ({ currentXml, currentPyCode, onLoadProject }) => {
  return (
    <header className="flex items-center justify-between p-3 border-b bg-card shadow-md rounded-b-xl shrink-0">
      <div className="flex items-center">
        <Blocks className="h-9 w-9 text-primary mr-3" />
        <h1 className="text-2xl font-headline font-bold text-primary">Blockly Builder</h1>
      </div>
      <div className="flex items-center space-x-3">
        <ProjectManager
          currentXml={currentXml}
          onLoadProject={onLoadProject}
          saveTrigger={
            <Button variant="outline" size="sm" className="rounded-lg shadow-sm">
              <Save className="mr-2 h-4 w-4 " /> Save
            </Button>
          }
          loadTrigger={
            <Button variant="outline" size="sm" className="rounded-lg shadow-sm">
              <FolderOpen className="mr-2 h-4 w-4" /> Load
            </Button>
          }
        />
        <AICodeGenerator
          triggerButton={
            <Button variant="outline" size="sm" className="rounded-lg shadow-sm">
              <Bot className="mr-2 h-4 w-4" /> Smart Blocks
            </Button>
          }
        />
        <CodeExporter
          currentCode={currentPyCode}
          fileName="my_blockly_code.py"
          triggerButton={
            <Button variant="outline" size="sm" className="rounded-lg shadow-sm">
              <Download className="mr-2 h-4 w-4" /> Export Python
            </Button>
          }
        />
        <CodeUploader currentCode={currentPyCode} triggerButton={
            <Button variant="outline" size="sm" className="rounded-lg shadow-sm">
              <Upload className="mr-2 h-4 w-4" /> Upload
            </Button>
          } />


        <div className="flex items-center space-x-2 pl-4">
          <Label htmlFor="mode-toggle" className="text-sm font-medium">Mode:</Label>
          <Switch id="mode-toggle" className="data-[state=checked]:bg-accent data-[state=unchecked]:bg-muted" />
        </div>
        <Avatar className="h-9 w-9 shadow-sm">
          <AvatarImage src="https://placehold.co/40x40.png" alt="User Avatar" data-ai-hint="avatar person" />
          <AvatarFallback>
            <User className="h-6 w-6" />
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

export default Toolbar;
