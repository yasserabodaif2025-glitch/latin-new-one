'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Role, rolesService } from '@/lib/api/roles.service';
import { toast } from '@/components/ui/use-toast';

const roleFormSchema = z.object({
  name: z.string().min(2, {
    message: 'يجب أن يحتوي الاسم على الأقل على حرفين',
  }),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

type RoleFormValues = z.infer<typeof roleFormSchema>;

interface RoleFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  role?: Role | null;
}

export function RoleForm({ open, onOpenChange, onSuccess, role }: RoleFormProps) {
  const t = useTranslations('roles');
  const [loading, setLoading] = useState(false);

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: '',
      description: '',
      isActive: true,
    },
  });

  useEffect(() => {
    if (role) {
      form.reset({
        name: role.name,
        description: role.description || '',
        isActive: role.isActive,
      });
    } else {
      form.reset({
        name: '',
        description: '',
        isActive: true,
      });
    }
  }, [role, open]);

  const onSubmit = async (data: RoleFormValues) => {
    try {
      setLoading(true);
      
      if (role) {
        // Update existing role
        await rolesService.updateRole(role.id, data);
      } else {
        // Create new role
        await rolesService.createRole(data);
      }
      
      onSuccess();
      onOpenChange(false);
      
      // Show success message
      toast({
        title: t('success'),
        description: role ? t('roleUpdated') : t('roleCreated'),
      });
      
    } catch (error: any) {
      console.error('Error saving role:', error);
      
      // Show error message
      toast({
        variant: 'destructive',
        title: t('error'),
        description: error.response?.data?.message || t('saveError'),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {role ? t('editRole') : t('addRole')}
          </DialogTitle>
          <DialogDescription>
            {role 
              ? t('editRoleDescription')
              : t('addRoleDescription')}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('name')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('namePlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('description')}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('descriptionPlaceholder')}
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      {t('status')}
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      {field.value ? t('active') : t('inactive')}
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-label="Toggle status"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                {t('cancel')}
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? t('saving') : t('save')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
