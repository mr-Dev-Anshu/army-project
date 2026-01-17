'use client';

import React from 'react'
import MultiFormReport from '@/common/component/investigation-report/MultiFormReport'
import { FormProvider } from '@/context/FormContext' // Assuming I need to wrap it in a provider
import { useRouter, useSearchParams } from 'next/navigation'

const Page = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const recordId = searchParams.get('id') // Get 'id' parameter

    return (
        <FormProvider>
            <MultiFormReport
                onCancel={() => router.back()}
                recordId={recordId || undefined}
            />
        </FormProvider>
    )
}

export default Page
