# مكون إدارة التدريب (Training Management)

## الوصف
مكون شامل لإدارة التدريب يوفر ملخص المجموعات التدريبية مع إمكانيات فلترة متقدمة وإحصائيات تفصيلية.

## المميزات

### 1. ملخص المجموعات
- عرض جميع المجموعات التدريبية مع معلوماتها الأساسية
- إظهار تقدم كل مجموعة بصرياً
- عرض حالة المجموعة (نشطة، مكتملة، متوقفة، ملغية)
- معلومات المحاضر والدورة لكل مجموعة

### 2. الفلاتر المتقدمة
- **فلترة بالفترة الزمنية**: اختيار فترة زمنية محددة (من - إلى)
- **فلترة بحالة المجموعة**: تصفية المجموعات حسب الحالة
- **فلترة بالمحاضر**: عرض مجموعات محاضر معين
- **البحث النصي**: البحث في أسماء المجموعات والدورات والمحاضرين

### 3. الإحصائيات
#### الإحصائيات الأساسية:
- إجمالي المجموعات
- المجموعات النشطة
- المجموعات المكتملة
- إجمالي الطلاب
- متوسط التقدم

#### الإحصائيات المتقدمة:
- معدل الإكمال العام
- الجلسات القادمة
- متوسط الطلاب لكل مجموعة
- معدل النجاح
- أفضل المحاضرين
- أكثر الدورات طلباً
- توزيع التقدم

### 4. تفاصيل المجموعة
- عرض تفاصيل شاملة لكل مجموعة
- قائمة الطلاب المسجلين
- جدول الجلسات مع حالة كل جلسة
- إحصائيات الحضور

## الملفات

### المكونات الرئيسية
- `TrainingManagement.tsx` - المكون الرئيسي
- `GroupDetailsModal.tsx` - نافذة تفاصيل المجموعة
- `TrainingStatistics.tsx` - مكون الإحصائيات المتقدمة

### الخدمات والـ Hooks
- `groups.service.ts` - خدمة API للتعامل مع بيانات المجموعات
- `useTrainingManagement.ts` - Hook مخصص لإدارة حالة المكون

### الصفحات
- `app/[locale]/training/page.tsx` - صفحة إدارة التدريب

## الاستخدام

### استيراد المكون
```tsx
import { TrainingManagement } from '@/components/training';

export default function TrainingPage() {
  return <TrainingManagement />;
}
```

### استخدام الخدمات
```tsx
import { groupsService } from '@/lib/api/groups.service';

// جلب ملخص المجموعات
const groups = await groupsService.getGroupsSummary({
  limit: 100,
  statusId: 1,
  instructorId: 2
});

// جلب الإحصائيات
const stats = await groupsService.getGroupStatistics();
```

### استخدام الـ Hook
```tsx
import { useTrainingManagement } from '@/lib/hooks/useTrainingManagement';

function MyComponent() {
  const {
    filteredGroups,
    statistics,
    loading,
    setSelectedStatus,
    refreshData
  } = useTrainingManagement();

  // استخدام البيانات والوظائف
}
```

## API Endpoints المستخدمة

- `GET /api/Groups/pagination` - جلب المجموعات مع التصفح
- `GET /api/HelpTables/GroupStatus` - جلب حالات المجموعات
- `GET /api/Instructors/pagination` - جلب قائمة المحاضرين
- `GET /api/Groups/{id}` - جلب تفاصيل مجموعة محددة
- `GET /api/Groups/enrollments/{groupId}` - جلب تسجيلات المجموعة

## التخصيص

### إضافة فلاتر جديدة
1. إضافة الحقل في `useTrainingManagement.ts`
2. تحديث دالة `applyFilters`
3. إضافة عنصر UI في `TrainingManagement.tsx`

### إضافة إحصائيات جديدة
1. تحديث `TrainingStatistics.tsx`
2. إضافة الحسابات المطلوبة
3. إضافة عناصر UI لعرض الإحصائيات

### تخصيص المظهر
- استخدام Tailwind CSS classes
- تعديل ألوان الحالات في `getStatusBadgeColor`
- تخصيص تخطيط البطاقات والجداول

## المتطلبات

### المكتبات المطلوبة
- React 18+
- Next.js 14+
- Tailwind CSS
- Lucide React (للأيقونات)
- React Day Picker (لاختيار التواريخ)

### مكونات UI المطلوبة
- Card, Button, Input, Select
- Badge, Tabs, Dialog
- DatePickerWithRange, Progress

## الملاحظات

- المكون يدعم اللغة العربية بالكامل
- يستخدم التخطيط المتجاوب (Responsive)
- يتضمن معالجة الأخطاء وحالات التحميل
- يدعم التحديث التلقائي للبيانات
- يحفظ حالة الفلاتر أثناء التنقل