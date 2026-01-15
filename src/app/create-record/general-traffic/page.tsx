"use client";
import React from 'react'
import MultiStepForm from '@/common/component/multi-step-form/MulitstepForm'
import { FormProvider } from '@/context/FormContext'
import { useRouter } from 'next/navigation'

const Page = () => {
    const router = useRouter()
    return (
        <FormProvider>
            <MultiStepForm onCancel={() => router.back()} />
        </FormProvider>
    )
}

export default Page
