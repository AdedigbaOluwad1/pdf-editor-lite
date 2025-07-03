import React from 'react';
import { DocumentProvider } from './document-context';
import { ToolbarProvider } from './toolbar-context';
import { SidebarProvider } from './sidebar-context';
import { UIProvider } from './ui-context';

interface Props {
  children: React.ReactNode;
}

export default function ContextWrapper({ children }: Props) {
  return (
    <DocumentProvider>
      <ToolbarProvider>
        <SidebarProvider>
          <UIProvider>{children}</UIProvider>
        </SidebarProvider>
      </ToolbarProvider>
    </DocumentProvider>
  );
}
