'use client';

import React from 'react'
import StaticSpeedForm from '@/common/component/staticSpeedForm/MainForm'
import { FormProvider } from '@/context/FormContext' // Assuming I need to wrap it in a provider
import { useRouter } from 'next/navigation'

const Page = () => {
    const router = useRouter()
    return (
        <FormProvider>
            <StaticSpeedForm onCancel={() => router.back()} />
        </FormProvider>
    )
}

export default Page
