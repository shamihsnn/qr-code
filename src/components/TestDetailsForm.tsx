import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel,
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Card, 
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { 
  PlusCircle, 
  Trash2, 
  Save, 
  ArrowRight, 
  ArrowLeft,
  Pencil,
  Paperclip,
  X,
  FileText,
  Image
} from 'lucide-react';
import { TestAttachment, TestDetails } from '@/utils/storageUtils';

const testDetailsSchema = z.object({
  testName: z.string().min(2, 'Test name is required'),
  testType: z.string().min(2, 'Test type is required'),
  testDate: z.string().min(1, 'Test date is required'),
  testResult: z.string().min(1, 'Test result is required'),
  normalRange: z.string().optional(),
  notes: z.string().optional(),
});

export type TestDetailsInputs = z.infer<typeof testDetailsSchema>;

interface TestDetailsFormProps {
  onSubmit: (data: TestDetails[]) => void;
  onBack: () => void;
}

const TestDetailsForm: React.FC<TestDetailsFormProps> = ({ onSubmit, onBack }) => {
  const [tests, setTests] = useState<TestDetails[]>([]);
  const [currentTest, setCurrentTest] = useState<TestDetails | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingIndex, setEditingIndex] = useState<number>(-1);
  const [currentAttachments, setCurrentAttachments] = useState<TestAttachment[]>([]);

  const form = useForm<TestDetailsInputs>({
    resolver: zodResolver(testDetailsSchema),
    defaultValues: {
      testName: '',
      testType: '',
      testDate: new Date().toISOString().split('T')[0],
      testResult: '',
      normalRange: '',
      notes: ''
    },
  });

  const resetForm = () => {
    form.reset({
      testName: '',
      testType: '',
      testDate: new Date().toISOString().split('T')[0],
      testResult: '',
      normalRange: '',
      notes: ''
    });
    setIsEditing(false);
    setEditingIndex(-1);
    setCurrentAttachments([]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          const newAttachment: TestAttachment = {
            name: file.name,
            type: file.type,
            dataUrl: event.target.result.toString()
          };
          
          setCurrentAttachments(prev => [...prev, newAttachment]);
        }
      };
      
      reader.readAsDataURL(file);
      e.target.value = '';
    }
  };

  const removeAttachment = (index: number) => {
    setCurrentAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const addTest = (data: TestDetailsInputs) => {
    const newTest: TestDetails = {
      testName: data.testName,
      testType: data.testType,
      testDate: data.testDate,
      testResult: data.testResult,
      normalRange: data.normalRange,
      notes: data.notes,
      attachments: currentAttachments.length > 0 ? [...currentAttachments] : undefined
    };
    setTests(prev => [...prev, newTest]);
    resetForm();
  };

  const updateTest = (data: TestDetailsInputs) => {
    if (editingIndex >= 0) {
      setTests(prev => {
        const newTests = [...prev];
        newTests[editingIndex] = {
          testName: data.testName,
          testType: data.testType,
          testDate: data.testDate,
          testResult: data.testResult,
          normalRange: data.normalRange,
          notes: data.notes,
          attachments: currentAttachments.length > 0 ? [...currentAttachments] : undefined
        };
        return newTests;
      });
      resetForm();
    }
  };

  const editTest = (index: number) => {
    const test = tests[index];
    form.reset(test);
    setIsEditing(true);
    setEditingIndex(index);
    setCurrentAttachments(test.attachments || []);
  };

  const removeTest = (index: number) => {
    setTests(prev => prev.filter((_, i) => i !== index));
  };

  const handleFormSubmit = (data: TestDetailsInputs) => {
    if (isEditing) {
      updateTest(data);
    } else {
      addTest(data);
    }
  };

  const handleSubmitAll = () => {
    if (tests.length > 0) {
      onSubmit(tests);
    }
  };

  return (
    <div className="space-y-8 animate-slide-in">
      <Card className="overflow-hidden glass-panel">
        <CardHeader>
          <CardTitle className="text-xl font-medium">Test Details</CardTitle>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="testName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Test Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Complete Blood Count (CBC)"
                          {...field}
                          className="input-field"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="testType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Test Type</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="input-field">
                            <SelectValue placeholder="Select test type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Blood Test">Blood Test</SelectItem>
                          <SelectItem value="Urine Test">Urine Test</SelectItem>
                          <SelectItem value="Imaging">Imaging</SelectItem>
                          <SelectItem value="Biopsy">Biopsy</SelectItem>
                          <SelectItem value="Genetic Test">Genetic Test</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="testDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Test Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          className="input-field"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="testResult"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Test Result</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="140 mg/dL"
                          {...field}
                          className="input-field"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="normalRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Normal Range (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="70-100 mg/dL"
                          {...field}
                          className="input-field"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Additional notes about the test"
                          {...field}
                          className="input-field min-h-[80px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Attachments section */}
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <FormLabel>Attachments (Optional)</FormLabel>
                  <div className="flex gap-2">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Button variant="outline" size="sm" className="flex items-center gap-1" type="button" asChild>
                        <div>
                          <Paperclip className="h-4 w-4" />
                          <span>File</span>
                        </div>
                      </Button>
                    </label>
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Button size="sm" className="flex items-center gap-1" type="button" asChild>
                        <div>
                          <Image className="h-4 w-4" />
                          <span>Image</span>
                        </div>
                      </Button>
                    </label>
                  </div>
                </div>
                
                <input 
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
                
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                
                {currentAttachments.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                    {currentAttachments.map((attachment, index) => (
                      <div key={index} className="relative rounded-md border border-gray-200 p-2 flex items-center gap-2">
                        {attachment.type.startsWith('image/') ? (
                          <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                            <img 
                              src={attachment.dataUrl} 
                              alt={attachment.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-md flex items-center justify-center bg-blue-50 flex-shrink-0">
                            <FileText className="h-6 w-6 text-blue-500" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{attachment.name}</p>
                          <p className="text-xs text-gray-500">
                            {attachment.type.split('/')[1]?.toUpperCase() || 'FILE'}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 absolute top-1 right-1 text-gray-500 hover:text-red-500"
                          onClick={() => removeAttachment(index)}
                          type="button"
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  variant={isEditing ? "outline" : "default"}
                  className="flex items-center gap-2"
                >
                  {isEditing ? (
                    <>
                      <Save size={16} />
                      <span>Update Test</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle size={16} />
                      <span>Add Test</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {tests.length > 0 && (
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Added Tests ({tests.length})</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {tests.map((test, index) => (
              <div 
                key={index} 
                className="p-4 rounded-lg border border-gray-100 hover:border-gray-200 bg-white/50 transition-all"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{test.testName}</h3>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => editTest(index)}
                      className="h-8 w-8 p-0"
                    >
                      <span className="sr-only">Edit</span>
                      <Pencil size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeTest(index)}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <span className="sr-only">Remove</span>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                  <div className="text-gray-500">Type:</div>
                  <div>{test.testType}</div>
                  
                  <div className="text-gray-500">Date:</div>
                  <div>{new Date(test.testDate).toLocaleDateString()}</div>
                  
                  <div className="text-gray-500">Result:</div>
                  <div>{test.testResult}</div>
                  
                  {test.normalRange && (
                    <>
                      <div className="text-gray-500">Normal Range:</div>
                      <div>{test.normalRange}</div>
                    </>
                  )}
                  
                  {test.attachments && test.attachments.length > 0 && (
                    <>
                      <div className="text-gray-500">Attachments:</div>
                      <div className="flex gap-2 flex-wrap">
                        {test.attachments.map((attachment, idx) => (
                          <div 
                            key={idx}
                            className="inline-flex items-center text-xs bg-gray-100 px-2 py-1 rounded"
                          >
                            {attachment.type.startsWith('image/') ? (
                              <Image className="h-3 w-3 mr-1" />
                            ) : (
                              <FileText className="h-3 w-3 mr-1" />
                            )}
                            {attachment.name.length > 15 
                              ? attachment.name.substring(0, 12) + '...' 
                              : attachment.name}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
      
      <div className="flex justify-between pt-4">
        <Button 
          type="button" 
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          <span>Back to Patient Info</span>
        </Button>
        
        <Button 
          type="button" 
          onClick={handleSubmitAll}
          disabled={tests.length === 0}
          className="flex items-center gap-2"
        >
          <span>Generate Report</span>
          <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
};

export default TestDetailsForm;
