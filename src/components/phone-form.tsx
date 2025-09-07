import { useFieldArray, useFormContext } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Minus, Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'

export const PhoneForm = () => {
  const t = useTranslations('lecturer')
  const { control } = useFormContext()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'phones',
  })
  return (
    <>
      <h3 className="text-zinc-500">الهواتف</h3>

      {fields.map((field, index) => (
        <FormField
          key={field.id}
          control={control}
          name={`phones.${index}.phone`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('phone')}</FormLabel>
              <div className="flex items-center gap-2">
                <FormControl>
                  <Input placeholder={t('phone')} {...field} />
                </FormControl>
                <Button variant={'destructive'} type="button" onClick={() => remove(index)}>
                  حذف <Minus />
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}

      <Button
        type="button"
        variant={'secondary'}
        size={'sm'}
        className="px-20"
        onClick={() => append({ phone: '' })}
      >
        اضافه هاتف <Plus />
      </Button>
    </>
  )
}
