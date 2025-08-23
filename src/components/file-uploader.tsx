
'use client';

import { UploadCloud, Loader2 } from 'lucide-react';
import React, { useCallback } from 'react';
import { useDropzone, type FileWithPath } from 'react-dropzone';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useToast } from '@/hooks/use-toast';
import { parseFile } from '@/app/actions';

interface FileUploaderProps {
  onFileText: (fileName: string, fileText: string) => void;
  isProcessing: boolean;
}

export function FileUploader({ onFileText, isProcessing }: FileUploaderProps) {
  const { toast } = useToast();

  const handleFile = async (file: File) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      const buffer = e.target?.result as ArrayBuffer;
      if (!buffer) {
        toast({
          title: 'File Read Error',
          description: 'Could not read file buffer.',
          variant: 'destructive',
        });
        return;
      }

      try {
        const fileContent = Buffer.from(buffer).toString('base64');
        const text = await parseFile(file.name, file.type, fileContent);
        
        if (text) {
          onFileText(file.name, text);
        } else {
           toast({
            title: 'File Read Error',
            description: `Could not extract text from ${file.name}. It might be empty or corrupted.`,
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error("Error parsing file", error);
        const errorMessage = error instanceof Error ? error.message : `Could not parse ${file.name}.`;
        toast({
          title: 'File Parse Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    };
    
    reader.onerror = () => {
      toast({
        title: 'File Read Error',
        description: 'An error occurred while reading the file.',
        variant: 'destructive',
      });
    };

    reader.readAsArrayBuffer(file);
  }

  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    if (acceptedFiles.length > 0) {
      handleFile(acceptedFiles[0]);
    }
  }, [onFileText]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    noKeyboard: true,
    accept: {
      'text/csv': ['.csv'],
      'text/plain': ['.txt'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    multiple: false,
    disabled: isProcessing,
  });

  return (
    <div className="flex h-full items-center justify-center py-12">
      <Card 
        className="w-full max-w-3xl text-center shadow-xl transition-all hover:shadow-2xl border-border/30 bg-card/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
      >
        <CardHeader className="p-8">
          <CardTitle className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-primary/80 to-foreground text-transparent bg-clip-text">Upload Your Customer Reviews</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            Turn raw feedback into actionable business intelligence with AI.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <div
            {...getRootProps()}
            className={`group cursor-pointer rounded-lg border-2 border-dashed p-12 transition-colors ${
              isDragActive ? 'border-primary bg-primary/10' : 'border-border/50 bg-background/50 hover:border-primary/50'
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex h-48 flex-col items-center justify-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary transition-colors group-hover:bg-primary/10">
                    <UploadCloud className="h-8 w-8 text-muted-foreground transition-colors group-hover:text-primary" />
                </div>
                <div className="text-center">
                    <p className="text-lg font-semibold">
                      {isDragActive ? 'Drop the file here...' : 'Drag & drop a file or click to select'}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Supported formats: TXT, CSV, XLSX, DOCX
                    </p>
                </div>
                <Button onClick={open} disabled={isProcessing} size="lg" className="mt-6" type="button">
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
