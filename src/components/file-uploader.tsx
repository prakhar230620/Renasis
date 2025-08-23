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
    },
    multiple: false,
    disabled: isProcessing,
  });

  return (
    <div className="flex h-full items-center justify-center py-12">
      <Card className="w-full max-w-3xl text-center shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold tracking-tight">Upload Your Reviews</CardTitle>
          <CardDescription className="text-md text-muted-foreground">
            Analyze customer feedback in seconds.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`cursor-pointer rounded-lg border-2 border-dashed p-12 transition-colors ${
              isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex h-48 flex-col items-center justify-center">
                <UploadCloud className="mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-lg font-semibold">
                  {isDragActive ? 'Drop the file here...' : 'Drag & drop a file or click below'}
                </p>
                <p className="mt-2 text-muted-foreground">
                  Supported formats: Excel, CSV, PDF, Word, TXT
                </p>
                <Button onClick={open} disabled={isProcessing} className="mt-6">
                  Select File
                </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
