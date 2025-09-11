
async function EditStudentPage({ params }) {
    const { stdId } = await params;
    return (
        <div>
            <h3>Student ID : {stdId}</h3>
        </div>
    )
}

export default EditStudentPage
