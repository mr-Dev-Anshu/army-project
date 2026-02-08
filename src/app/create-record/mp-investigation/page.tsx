// 'use client';

// import React from 'react'
// import MultiFormReport from '@/common/component/investigation-report/MultiFormReport'
// import { FormProvider } from '@/context/FormContext' // Assuming I need to wrap it in a provider
// import { useRouter } from 'next/navigation'

// const Page = () => {
//     const router = useRouter()
//     return (
//         <FormProvider>
//             <MultiFormReport onCancel={() => router.back()} />
//         </FormProvider>
//     )
// }

// export default Page



'use client';

import React from 'react';
import MultiFormReport from '@/common/component/investigation-report/MultiFormReport';
import { FormProvider } from '@/context/FormContext';
import { useRouter } from 'next/navigation';

const Page = () => {
  const router = useRouter();

  return (
    <FormProvider>
      <MultiFormReport
        onCancel={() => router.back()}
        existingReport={undefined} // ✅ important
      />
    </FormProvider>
  );
};

export default Page;
