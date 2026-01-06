'use client';

import React from 'react'
import MultiFormReport from '@/common/component/investigation-report/MultiFormReport'
import { FormProvider } from '@/context/FormContext' // Assuming I need to wrap it in a provider

const Page = () => {
    return (
        <FormProvider>
            <MultiFormReport onCancel={() => { }} />
        </FormProvider>
    )
}

export default Page
