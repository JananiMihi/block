
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import BlocklyWorkspace from '@/components/blockly-builder/blockly-workspace';
import CodePreview from '@/components/blockly-builder/code-preview';
import Toolbar from '@/components/blockly-builder/toolbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { pythonGenerator } from 'blockly/python';
import * as Blockly from 'blockly/core';
import 'blockly/blocks'; // Ensure all standard blocks are imported

const DEFAULT_BLOCKLY_XML = `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="text_print" id="startBlock" x="100" y="100">
    <value name="TEXT">
      <shadow type="text">
        <field name="TEXT">Hello from Blockly Builder!</field>
      </shadow>
    </value>
  </block>
</xml>`;

export default function BlocklyBuilderPage() {
  const [blocklyXml, setBlocklyXml] = useState<string>(DEFAULT_BLOCKLY_XML);
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      if (typeof window !== 'undefined' && Blockly && Blockly.utils && Blockly.utils.xml && pythonGenerator) {
          const tempWorkspace = new Blockly.Workspace();
          const xmlDom = Blockly.utils.xml.textToDom(DEFAULT_BLOCKLY_XML);
          Blockly.Xml.domToWorkspace(xmlDom, tempWorkspace);
          const initialCode = pythonGenerator.workspaceToCode(tempWorkspace);
          setGeneratedCode(initialCode);
          tempWorkspace.dispose();
      }
    } catch (e) {
        console.error("Error generating initial Python code from XML:", e);
        setGeneratedCode("# Error generating initial Python code. Please check console.");
    }
  }, []);

  const handleWorkspaceChange = useCallback((xml: string, code: string) => {
    setBlocklyXml(xml);
    setGeneratedCode(code);
  }, []);

  const loadProject = useCallback((xml: string) => {
    setBlocklyXml(xml);
    try {
      if (typeof window !== 'undefined' && Blockly && Blockly.utils && Blockly.utils.xml && pythonGenerator) {
        const tempWorkspace = new Blockly.Workspace();
        const xmlDom = Blockly.utils.xml.textToDom(xml);
        Blockly.Xml.domToWorkspace(xmlDom, tempWorkspace);
        const newCode = pythonGenerator.workspaceToCode(tempWorkspace);
        setGeneratedCode(newCode);
        tempWorkspace.dispose();
      }
    } catch (e) {
      console.error("Error generating Python code from loaded XML:", e);
      setGeneratedCode("# Error generating Python code from loaded project.");
    }
  }, []);

  if (!isClient) {
    return (
      <div className="flex flex-col h-screen bg-background p-4">
        <header className="flex items-center justify-between p-3 border-b bg-card shadow-sm rounded-t-xl">
          <h1 className="text-2xl font-headline font-bold text-primary">Blockly Builder</h1>
          <div className="text-foreground">Loading your awesome coding playground...</div>
        </header>
        <main className="flex-grow flex items-center justify-center bg-card rounded-b-xl mt-1">
          <p className="text-lg font-semibold text-primary">Initializing Blockly Builder...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background selection:bg-accent selection:text-accent-foreground overflow-hidden">
      <Toolbar
        currentXml={blocklyXml}
        currentPyCode={generatedCode} 
        onLoadProject={loadProject}
      />
      <main className="flex-1 flex flex-col min-h-0"> {/* Removed p-2 and gap-2 */}
        <Tabs defaultValue="playground" className="flex flex-col flex-1 min-h-0 w-full pt-2 px-2"> {/* Added pt-2 px-2 here if needed */}
          <TabsList className="shrink-0 grid w-full grid-cols-2 bg-muted/80 p-1 rounded-lg mb-2"> {/* Added mb-2 */}
            <TabsTrigger value="playground" className="rounded-md text-xs sm:text-sm">Blockly Playground</TabsTrigger>
            <TabsTrigger value="python" className="rounded-md text-xs sm:text-sm">Python Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="playground" className="flex-1 min-h-0 overflow-auto"> {/* overflow-auto here */}
            <BlocklyWorkspace
              key={blocklyXml} 
              initialXml={blocklyXml}
              onWorkspaceChange={handleWorkspaceChange}
              className="w-full h-full bg-card rounded-lg shadow-inner p-1"  // Added p-1 for padding around grid
            />
          </TabsContent>

          <TabsContent value="python" className="flex-1 overflow-hidden min-h-0 bg-card rounded-lg shadow-inner p-1">
            <CodePreview
              code={generatedCode}
              className="w-full h-full shadow-none" 
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
