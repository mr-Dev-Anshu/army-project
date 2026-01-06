'use client';

import React from 'react'
import StaticSpeedForm from '@/common/component/staticSpeedForm/MainForm'
import { FormProvider } from '@/context/FormContext' // Assuming I need to wrap it in a provider

const Page = () => {
    return (
        <FormProvider>
            <StaticSpeedForm onCancel={() => { }} />
        </FormProvider>
    )
}

export default Page
