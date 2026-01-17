"use client";
import React from 'react'
import MultiStepForm from '@/common/component/multi-step-form/MulitstepForm'
import { FormProvider } from '@/context/FormContext'
import { useRouter, useSearchParams } from 'next/navigation'

const Page = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const recordId = searchParams.get('id')

    return (
        <FormProvider>
            <MultiStepForm
                onCancel={() => router.back()}
                recordId={recordId || undefined}
            />
        </FormProvider>
    )
}

export default Page
