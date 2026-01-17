'use client';

import React from 'react'
import StaticSpeedForm from '@/common/component/staticSpeedForm/MainForm'
import { FormProvider } from '@/context/FormContext' // Assuming I need to wrap it in a provider
import { useRouter, useSearchParams } from 'next/navigation'

const Page = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const recordId = searchParams.get('id')

    return (
        <FormProvider>
            <StaticSpeedForm
                onCancel={() => router.back()}
                recordId={recordId || undefined}
            />
        </FormProvider>
    )
}

export default Page
