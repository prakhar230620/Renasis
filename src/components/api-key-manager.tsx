'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { ApiKeyManager } from '@/lib/api-key-manager';
import { ApiKey } from '@/types/api-keys';
import { Plus, Trash2, Key, CheckCircle, XCircle, Clock, Settings } from 'lucide-react';

interface ApiKeyManagerProps {
  onKeyChange?: (hasKeys: boolean) => void;
}

export function ApiKeyManagerComponent({ onKeyChange }: ApiKeyManagerProps) {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [currentKeyId, setCurrentKeyId] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyValue, setNewKeyValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const keyManager = ApiKeyManager.getInstance();

  useEffect(() => {
    loadKeys();
  }, []);

  const loadKeys = () => {
    const allKeys = keyManager.getAllKeys();
    const current = keyManager.getCurrentKey();
    setKeys(allKeys);
    setCurrentKeyId(current?.id || null);
    onKeyChange?.(allKeys.length > 0);
  };

  const handleAddKey = async () => {
    console.log('handleAddKey called', { newKeyName, newKeyValue });
    
    if (!newKeyName.trim() || !newKeyValue.trim()) {
      toast({
        title: 'Invalid Input',
        description: 'Please provide both name and API key.',
        variant: 'destructive',
      });
      return;
    }

    // Validate API key format (basic check for Google AI keys)
    if (!newKeyValue.startsWith('AIza')) {
      toast({
        title: 'Invalid API Key Format',
        description: 'Google AI API keys should start with "AIza".',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      keyManager.addApiKey(newKeyName.trim(), newKeyValue.trim());
      
      toast({
        title: 'API Key Added',
        description: `Successfully added "${newKeyName.trim()}".`,
      });

      setNewKeyName('');
      setNewKeyValue('');
      setIsAddDialogOpen(false);
      loadKeys();
    } catch (error) {
      console.error('Error adding key:', error);
      toast({
        title: 'Error',
        description: 'Failed to add API key. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveKey = (keyId: string) => {
    keyManager.removeApiKey(keyId);
    loadKeys();
    toast({
      title: 'API Key Removed',
      description: 'The API key has been removed successfully.',
    });
  };

  const handleSetCurrentKey = (keyId: string) => {
    if (keyManager.setCurrentKey(keyId)) {
      loadKeys();
      toast({
        title: 'Active Key Changed',
        description: 'The active API key has been updated.',
      });
    } else {
      toast({
        title: 'Error',
        description: 'Cannot activate this key. It may be rate limited.',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (key: ApiKey) => {
    switch (key.status) {
      case 'active':
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>;
      case 'rate_limited':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rate Limited</Badge>;
      case 'inactive':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Inactive</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const maskApiKey = (key: string) => {
    if (key.length <= 8) return key;
    return key.substring(0, 4) + '...' + key.substring(key.length - 4);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              API Key Management
            </CardTitle>
            <CardDescription>
              Manage your Google AI API keys for review analysis
            </CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={() => {
                console.log('Add Key dialog trigger clicked');
                setIsAddDialogOpen(true);
              }}>
                <Plus className="w-4 h-4 mr-2" />
                Add Key
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New API Key</DialogTitle>
                <DialogDescription>
                  Add a new Google AI API key to use for review analysis.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="keyName">Key Name</Label>
                  <Input
                    id="keyName"
                    placeholder="e.g., My Primary Key"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="keyValue">API Key</Label>
                  <Input
                    id="keyValue"
                    type="password"
                    placeholder="AIza..."
                    value={newKeyValue}
                    onChange={(e) => setNewKeyValue(e.target.value)}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddKey} disabled={isLoading}>
                    {isLoading ? 'Adding...' : 'Add Key'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {keys.length === 0 ? (
          <div className="text-center py-8">
            <Key className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No API Keys</h3>
            <p className="text-muted-foreground mb-4">
              Add your first Google AI API key to start analyzing reviews.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {keys.map((key) => (
              <div
                key={key.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold">{key.name}</h4>
                    {getStatusBadge(key)}
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Key: {maskApiKey(key.key)}</p>
                    <p>Usage: {key.usageCount} requests</p>
                    {key.lastUsed && (
                      <p>Last used: {new Date(key.lastUsed).toLocaleString()}</p>
                    )}
                    {key.rateLimitResetTime && (
                      <p>Rate limit resets: {new Date(key.rateLimitResetTime).toLocaleString()}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {key.status !== 'active' && key.status !== 'rate_limited' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSetCurrentKey(key.id)}
                    >
                      Activate
                    </Button>
                  )}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remove API Key</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to remove "{key.name}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleRemoveKey(key.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Remove
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
