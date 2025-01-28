'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const EmailGenerator = () => {
  const [formData, setFormData] = useState({
    recipientName: '',
    recipientEmail: '',
    emailPurpose: '',
    keyPoints: '',
  });
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/generateEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientName: formData.recipientName,
          emailPurpose: formData.emailPurpose,
          keyPoints: formData.keyPoints,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setGeneratedEmail(data.email);
      }
    } catch (error) {
      console.error('Error generating email:', error);
      setGeneratedEmail('Error generating email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Email Generator</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="recipientName">Recipient Name</Label>
              <Input
                id="recipientName"
                value={formData.recipientName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    recipientName: e.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="recipientEmail">Recipient Email</Label>
              <Input
                id="recipientEmail"
                type="email"
                value={formData.recipientEmail}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    recipientEmail: e.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="emailPurpose">Email Purpose</Label>
              <Select
                value={formData.emailPurpose}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    emailPurpose: value,
                  }))
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select purpose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Meeting Request">
                    Meeting Request
                  </SelectItem>
                  <SelectItem value="Follow Up">Follow Up</SelectItem>
                  <SelectItem value="Thank You">Thank You</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="keyPoints">Key Points</Label>
              <Textarea
                id="keyPoints"
                value={formData.keyPoints}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    keyPoints: e.target.value,
                  }))
                }
                required
                className="min-h-32"
              />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Email'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {generatedEmail && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Email</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap bg-muted p-4 rounded-md">
              {generatedEmail}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EmailGenerator;
