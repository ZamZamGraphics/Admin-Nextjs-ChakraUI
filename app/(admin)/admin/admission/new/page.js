import { Suspense } from 'react'
import NewAdmission from './new-admission'

function page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <NewAdmission />
        </Suspense>
    )
}

export default page
