
async function EditUserPage({ params }) {
    const { userId } = await params;
    return (
        <div>
            <h3>User ID : {userId}</h3>
        </div>
    )
}

export default EditUserPage
