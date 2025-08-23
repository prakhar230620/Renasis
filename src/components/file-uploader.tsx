'use client';

import { UploadCloud, Loader2 } from 'lucide-react';
import React, { useCallback } from 'react';
import { useDropzone, type FileWithPath } from 'react-dropzone';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface FileUploaderProps {
  onFileUpload: (file: File) => void;
  isProcessing: boolean;
}

export function FileUploader({ onFileUpload, isProcessing }: FileUploaderProps) {
  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
    accept: {
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/csv': ['.csv'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'application/json': ['.json'],
    },
    multiple: false,
    disabled: isProcessing,
  });

  return (
    <div className="flex h-full items-center justify-center py-12">
      <Card 
        className="w-full max-w-3xl text-center shadow-xl transition-all hover:shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
      >
        <CardHeader className="p-8">
          <CardTitle className="text-4xl font-extrabold tracking-tight">Upload Your Customer Reviews</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            Turn raw feedback into actionable business intelligence with AI.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <div
            {...getRootProps()}
            className={`group cursor-pointer rounded-lg border-2 border-dashed p-12 transition-colors ${
              isDragActive ? 'border-primary bg-primary/10' : 'border-border/50 bg-background hover:border-primary/50'
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex h-48 flex-col items-center justify-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary transition-colors group-hover:bg-primary/10">
                    <UploadCloud className="h-8 w-8 text-muted-foreground transition-colors group-hover:text-primary" />
                </div>
                <div className="text-center">
                    <p className="text-lg font-semibold">
                      {isDragActive ? 'Drop the file here...' : 'Drag and drop a file or click to select'}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Supported formats: Excel, CSV, PDF, Word, TXT, JSON
                    </p>
                </div>
                <Button onClick={open} disabled={isProcessing} size="lg" className="mt-6">
                    {isProcessing ? (
                        <>
                            <Loader2 className="mr-2 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        'Select File'
                    )}
                </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
