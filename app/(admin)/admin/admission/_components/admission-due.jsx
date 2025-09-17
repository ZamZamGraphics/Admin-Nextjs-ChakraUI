import { totalPayment } from '@/lib/utils'

function AdmissionDue({ paymentHistory, payableAmount, due }) {
    if (paymentHistory?.length > 0) {
        return payableAmount - totalPayment(paymentHistory)
    } else {
        return due
    }
}

export default AdmissionDue
