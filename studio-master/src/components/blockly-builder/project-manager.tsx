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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Save, FolderOpen, Trash2 } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

interface ProjectManagerProps {
  currentXml: string;
  onLoadProject: (xml: string) => void;
  saveTrigger?: React.ReactNode;
  loadTrigger?: React.ReactNode;
}

const LOCAL_STORAGE_PREFIX = 'blocklyProject_';

const ProjectManager: FC<ProjectManagerProps> = ({ currentXml, onLoadProject, saveTrigger, loadTrigger }) => {
  const [isSaveOpen, setIsSaveOpen] = useState(false);
  const [isLoadOpen, setIsLoadOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [savedProjects, setSavedProjects] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (isLoadOpen) {
      loadSavedProjects();
    }
  }, [isLoadOpen]);

  const loadSavedProjects = () => {
    const projects: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(LOCAL_STORAGE_PREFIX)) {
        projects.push(key.substring(LOCAL_STORAGE_PREFIX.length));
      }
    }
    setSavedProjects(projects.sort());
  };

  const handleSaveProject = () => {
    if (!projectName.trim()) {
      toast({ title: 'Error', description: 'Project name cannot be empty.', variant: 'destructive' });
      return;
    }
    try {
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}${projectName}`, currentXml);
      toast({ title: 'Success', description: `Project "${projectName}" saved!` });
      setProjectName('');
      setIsSaveOpen(false);
    } catch (error) {
      console.error('Failed to save project:', error);
      toast({ title: 'Error', description: 'Failed to save project. Local storage might be full.', variant: 'destructive' });
    }
  };

  const handleLoadProject = (name: string) => {
    const xml = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}${name}`);
    if (xml) {
      onLoadProject(xml);
      toast({ title: 'Success', description: `Project "${name}" loaded!` });
      setIsLoadOpen(false);
    } else {
      toast({ title: 'Error', description: `Failed to load project "${name}".`, variant: 'destructive' });
    }
  };

  const handleDeleteProject = (name: string) => {
    localStorage.removeItem(`${LOCAL_STORAGE_PREFIX}${name}`);
    toast({ title: 'Success', description: `Project "${name}" deleted.` });
    loadSavedProjects(); // Refresh the list
  };

  const defaultSaveTrigger = (
    <Button variant="outline" onClick={() => setIsSaveOpen(true)}>
      <Save className="mr-2 h-4 w-4" />
      Save Project
    </Button>
  );

  const defaultLoadTrigger = (
    <Button variant="outline" onClick={() => setIsLoadOpen(true)}>
      <FolderOpen className="mr-2 h-4 w-4" />
      Load Project
    </Button>
  );

  return (
    <>
      {saveTrigger ? React.cloneElement(saveTrigger as React.ReactElement, { onClick: () => setIsSaveOpen(true) }) : defaultSaveTrigger}
      {loadTrigger ? React.cloneElement(loadTrigger as React.ReactElement, { onClick: () => setIsLoadOpen(true) }) : defaultLoadTrigger}

      {/* Save Dialog */}
      <Dialog open={isSaveOpen} onOpenChange={setIsSaveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Project</DialogTitle>
            <DialogDescription>Enter a name for your project.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="projectName">Project Name</Label>
              <Input
                id="projectName"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="My Awesome Code"
                className="font-body"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSaveOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveProject}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Load Dialog */}
      <Dialog open={isLoadOpen} onOpenChange={setIsLoadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Load Project</DialogTitle>
            <DialogDescription>Select a project to load.</DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-60 my-4">
            {savedProjects.length > 0 ? (
              <ul className="space-y-2">
                {savedProjects.map((name) => (
                  <li key={name} className="flex items-center justify-between p-2 rounded-md hover:bg-accent/50">
                    <span className="font-body cursor-pointer" onClick={() => handleLoadProject(name)}>{name}</span>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteProject(name)} title={`Delete ${name}`}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-center py-4">No saved projects found.</p>
            )}
          </ScrollArea>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProjectManager;
