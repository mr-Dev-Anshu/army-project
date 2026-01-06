import React from 'react'
import MultiStepForm from '@/common/component/multi-step-form/MulitstepForm'
import { FormProvider } from '@/context/FormContext' // Assuming I need to wrap it in a provider

const Page = () => {
    return (
        <FormProvider>
            <MultiStepForm />
        </FormProvider>
    )
}

export default Page
