import { TrainingManagement } from '@/components/training';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'إدارة التدريب - الأكاديمية اللاتينية',
  description: 'ملخص المجموعات التدريبية مع إمكانية الفلترة حسب الحالة والمحاضر والفترة الزمنية'
};

export default function TrainingPage() {
  return (
    <div className="container mx-auto">
      <TrainingManagement />
    </div>
  );
}