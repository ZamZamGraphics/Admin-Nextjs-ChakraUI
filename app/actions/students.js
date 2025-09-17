"use server"
import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

export async function getAllStudents({ limit, page, search }) {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    try {
        const response = await fetch(`${process.env.API_URL}/v2/students?limit=${limit}&page=${page}&search=${search}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            next: {
                tags: ['students'],
            },
        })

        const data = await response.json();
        return {
            data: data[0]?.students,
            total: data[0]?.total[0]?.totalRecords
        }
    } catch (error) {
        throw new Error('Internal Server Error');
    }
}

export async function getStudent(id) {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    try {
        const response = await fetch(`${process.env.API_URL}/v2/students/${id}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            next: {
                tags: ['student'],
            },
        })

        const data = await response.json();
        return data
    } catch (error) {
        throw new Error('Internal Server Error');
    }
}

export async function getStudentByStudentId(studentId) {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    try {
        const response = await fetch(`${process.env.API_URL}/v2/students/verify/${studentId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            },
        })

        const data = await response.json();
        return data
    } catch (error) {
        throw new Error('Internal Server Error');
    }
}

export async function addStudent(formData) {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    try {
        const response = await fetch(`${process.env.API_URL}/v2/students/register`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        })

        const data = await response.json();
        if (data?.student) {
            revalidateTag('students')
            return {
                success: true,
                ...data.student
            }
        }
        return data;
    } catch (error) {
        throw new Error('Internal Server Error');
    }
}

export async function updateStudent(id, formData) {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    try {
        const response = await fetch(`${process.env.API_URL}/v2/students/${id}`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        })

        const data = await response.json();
        if (data?.student) {
            revalidateTag(['students', 'student'])
            return {
                success: true,
                ...data
            }
        }
        return data;
    } catch (error) {
        throw new Error('Internal Server Error');
    }
}

export async function deleteStudent(id) {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    try {
        const response = await fetch(`${process.env.API_URL}/v2/students/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })

        const data = await response.json();
        revalidateTag(['students', 'student', 'admissions'])
        return data;
    } catch (error) {
        throw new Error('Internal Server Error');
    }
}
