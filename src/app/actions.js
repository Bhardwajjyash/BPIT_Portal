'use server'

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { uploadToCloudinary } from "@/lib/cloudinary"; // Cloudinary utility
import nodemailer from 'nodemailer';

// ----------------------------------------
// 1. AUTHENTICATION ACTIONS (Student & Faculty)
// ----------------------------------------
export async function loginUser(prevState,formData) {
  const email = formData.get('email');
  const password = formData.get('password');

  const student = await prisma.student.findUnique({ where: { email } });

  if (!student || student.passwordHash !== password) {
    return { error: "Invalid email or password." };
  }

  const cookieStore = await cookies();
  cookieStore.set('userId', student.id, { httpOnly: true, path: '/' });

  revalidatePath('/', 'layout');
  redirect('/student/dashboard');
}

export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete('userId');
  redirect('/');
}

export async function loginFaculty(prevState,formData) {
  const email = formData.get('email');
  const password = formData.get('password');

  const faculty = await prisma.faculty.findUnique({ where: { email } });

  if (!faculty || faculty.passwordHash !== password) {
    return { error: "Invalid email or password." };
  }

  const cookieStore = await cookies();
  cookieStore.set('facultyId', faculty.id, { httpOnly: true, path: '/' });

  revalidatePath('/', 'layout');
  redirect('/faculty/dashboard');
}

export async function logoutFaculty() {
  const cookieStore = await cookies();
  cookieStore.delete('facultyId');
  redirect('/faculty/login');
}

// 2. PROJECT ACTIONS
// ----------------------------------------
export async function submitProject(formData) {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;
  
  if (!userId) return { success: false, error: "Not authenticated" };

  let isSuccessful = false;

  try {
    const proofFile = formData.get('proofDocument');
    const uploadedProofUrl = await uploadToCloudinary(proofFile, 'projects');

    await prisma.project.create({
      data: {
        studentId: userId,
        projectName: formData.get('projectName'),
        semester: parseInt(formData.get('semester')) || 1,
        type: formData.get('type'),
        projectStatus: formData.get('projectStatus'),
        githubLink: formData.get('githubLink') || null,
        supervisor: formData.get('supervisor') || null,
        techStack: formData.get('techStack'),
        description: formData.get('description'),
        learnings: formData.get('learnings'),
        dateFrom: new Date(formData.get('dateFrom')),
        dateTo: new Date(formData.get('dateTo')),
        teamMembers: formData.get('teamMembers') || null,
        proofUrl: uploadedProofUrl || 'https://example.com/no-proof-provided',
        photoUrl: null,
      }
    });

    revalidatePath('/student/projects');
    revalidatePath('/faculty/dashboard/requests');
    isSuccessful = true;
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, error: "Failed to submit project" };
  }

  if (isSuccessful) {
    redirect('/student/projects');
  }
}

// ----------------------------------------
// 3. EXTRA-CURRICULAR ACTION
// ----------------------------------------
export async function submitExtraCurricular(formData) {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;
  if (!userId) return { success: false, error: "Not authenticated" };

  let isSuccessful = false;

  try {
    const proofFile = formData.get('proofDocument');
    const uploadedProofUrl = await uploadToCloudinary(proofFile, 'extra_curricular');

    await prisma.extraCurricular.create({
      data: {
        studentId: userId,
        semester: parseInt(formData.get('semester')) || 1,
        type: formData.get('type'),
        mode: formData.get('mode'),
        title: formData.get('title'),
        organizedBy: formData.get('organizedBy'),
        place: formData.get('place'),
        level: formData.get('level'),
        dateFrom: new Date(formData.get('dateFrom')),
        dateTo: new Date(formData.get('dateTo')),
        duration: formData.get('duration'),
        teamMembers: formData.get('teamMembers') || null,
        role: formData.get('role'),
        position: formData.get('position') || null,
        prizeMoney: formData.get('prizeMoney') || null,
        learnings: formData.get('learnings'),
        sponsored: formData.get('sponsored') || null, // <-- Added this line to catch the new field
        proofUrl: uploadedProofUrl || 'https://example.com/no-proof-provided',
        photoUrl: null,
      }
    });
    
    revalidatePath('/student/extra-curricular');
    revalidatePath('/faculty/dashboard/requests');
    isSuccessful = true;
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, error: "Failed to submit activity" };
  }

  if (isSuccessful) {
    redirect('/student/extra-curricular');
  }
}

// ----------------------------------------
// 4. CO-CURRICULAR ACTION
// ----------------------------------------
export async function submitCoCurricular(formData) {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;
  if (!userId) return { success: false, error: "Not authenticated" };

  let isSuccessful = false;

  try {
    const proofFile = formData.get('proofDocument');
    const uploadedProofUrl = await uploadToCloudinary(proofFile, 'co_curricular');

    await prisma.coCurricular.create({
      data: {
        studentId: userId,
        semester: parseInt(formData.get('semester')) || 1,
        type: formData.get('type'),
        mode: formData.get('mode'),
        title: formData.get('title'),
        organizedBy: formData.get('organizedBy'),
        place: formData.get('place'),
        level: formData.get('level'),
        dateFrom: new Date(formData.get('dateFrom')),
        dateTo: new Date(formData.get('dateTo')),
        duration: formData.get('duration') || null,
        teamMembers: formData.get('teamMembers') || null,
        role: formData.get('role'),
        position: formData.get('position') || null,
        prizeMoney: formData.get('prizeMoney') || null,
        learnings: formData.get('learnings'),
        sponsored: formData.get('sponsored') || null,
        proofUrl: uploadedProofUrl || 'https://example.com/no-proof-provided',
        photoUrl: null,
      }
    });
    
    revalidatePath('/student/co-curricular');
    revalidatePath('/faculty/dashboard/requests');
    isSuccessful = true;
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, error: "Failed to submit co-curricular" };
  }

  if (isSuccessful) {
    redirect('/student/co-curricular');
  }
}

// ----------------------------------------
// 5. CERTIFICATIONS ACTION
// ----------------------------------------
export async function submitCertification(formData) {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;
  if (!userId) return { success: false, error: "Not authenticated" };

  let isSuccessful = false;

  try {
    const proofFile = formData.get('proofDocument');
    const uploadedProofUrl = await uploadToCloudinary(proofFile, 'certifications');

    await prisma.certification.create({
      data: {
        studentId: userId,
        semester: parseInt(formData.get('semester')) || 1,
        courseName: formData.get('courseName'),
        mode: formData.get('mode'),
        organizedBy: formData.get('organizedBy'),
        certifiedBy: formData.get('certifiedBy'),
        dateFrom: new Date(formData.get('dateFrom')),
        dateTo: new Date(formData.get('dateTo')),
        duration: formData.get('duration'),
        maxMarksGrade: formData.get('maxMarksGrade') || null,
        marksObtained: formData.get('marksObtained') || null,
        position: formData.get('position') || null,
        learnings: formData.get('learnings'),
        proofUrl: uploadedProofUrl || 'https://example.com/no-proof-provided',
        photoUrl: null,
      }
    });
    
    revalidatePath('/student/certifications');
    revalidatePath('/faculty/dashboard/requests');
    isSuccessful = true;
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, error: "Failed to submit certification" };
  }

  if (isSuccessful) {
    redirect('/student/certifications');
  }
}

// ----------------------------------------
// 6. RESEARCH PAPERS ACTION
// ----------------------------------------
export async function submitResearchPaper(formData) {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;
  if (!userId) return { success: false, error: "Not authenticated" };

  let isSuccessful = false;

  try {
    const proofFile = formData.get('proofDocument');
    const uploadedProofUrl = await uploadToCloudinary(proofFile, 'research');

    await prisma.researchPaper.create({
      data: {
        studentId: userId,
        semester: parseInt(formData.get('semester')) || 1,
        title: formData.get('title'),
        authors: formData.get('authors'),
        type: formData.get('type'),
        journalName: formData.get('journalName'),
        publishedBy: formData.get('publishedBy'),
        monthYear: formData.get('monthYear'),
        volumeIssue: formData.get('volumeIssue') || null,
        doiUrl: formData.get('doiUrl') || null,
        indexing: formData.get('indexing') || null,
        paperStatus: formData.get('paperStatus'),
        learnings: formData.get('learnings'),
        proofUrl: uploadedProofUrl || null,
        photoUrl: null,
      }
    });
    
    revalidatePath('/student/research');
    revalidatePath('/faculty/dashboard/requests');
    isSuccessful = true;
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, error: "Failed to submit research paper" };
  }

  if (isSuccessful) {
    redirect('/student/research');
  }
}



// ----------------------------------------
// 7. FACULTY MENTORING ACTIONS
// ----------------------------------------
export async function assignStudentToMentor(formData) {
  const cookieStore = await cookies();
  const facultyId = cookieStore.get('facultyId')?.value;
  
  if (!facultyId) return { success: false, error: "Not authorized" };

  const enrollmentNo = formData.get('enrollmentNo');

  try {
    const student = await prisma.student.findUnique({
      where: { enrollmentNo }
    });

    if (!student) return { success: false, error: "Student not found" };

    await prisma.student.update({
      where: { enrollmentNo },
      data: { mentorId: facultyId }
    });

    revalidatePath('/faculty/dashboard/students'); 
    return { success: true };
  } catch (error) {
    console.error("Failed to assign student:", error);
    return { success: false, error: "Database error" };
  }
}

export async function removeStudentFromMentor(formData) {
  const cookieStore = await cookies();
  const facultyId = cookieStore.get('facultyId')?.value;
  
  if (!facultyId) return { success: false, error: "Not authorized" };

  const studentId = formData.get('studentId');

  try {
    await prisma.student.update({
      where: { id: studentId },
      data: { mentorId: null } 
    });

    revalidatePath('/faculty/dashboard/students');
    revalidatePath('/faculty/dashboard/requests');
    return { success: true };
  } catch (error) {
    console.error("Failed to remove student:", error);
    return { success: false, error: "Database error" };
  }
}

// ----------------------------------------
// 8. UNIFIED ACHIEVEMENT STATUS UPDATE
// ----------------------------------------

// ----------------------------------------
// 9. STUDENT DELETE & RESUBMIT ACTIONS
// ----------------------------------------

export async function deleteCertification(formData) {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;
  if (!userId) return { success: false, error: "Not authenticated" };

  const id = formData.get('id');

  try {
    await prisma.certification.delete({
      where: { id, studentId: userId }
    });
    
    revalidatePath('/student/certifications');
    revalidatePath('/faculty/dashboard/requests');
    return { success: true };
  } catch (error) {
    console.error("Delete Error:", error);
    return { success: false, error: "Failed to delete" };
  }
}

export async function updateAndResubmitCertification(formData) {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;
  if (!userId) return { success: false, error: "Not authenticated" };

  const id = formData.get('id');

  try {
    const proofFile = formData.get('proofDocument');
    let uploadedProofUrl = null;
    if (proofFile && typeof proofFile !== 'string' && proofFile.size > 0) {
      uploadedProofUrl = await uploadToCloudinary(proofFile, 'certifications');
    }

    await prisma.certification.update({
      where: { id, studentId: userId },
      data: {
        semester: parseInt(formData.get('semester')) || 1,
        courseName: formData.get('courseName'),
        mode: formData.get('mode'),
        organizedBy: formData.get('organizedBy'),
        certifiedBy: formData.get('certifiedBy'),
        dateFrom: new Date(formData.get('dateFrom')),
        dateTo: new Date(formData.get('dateTo')),
        duration: formData.get('duration'),
        maxMarksGrade: formData.get('maxMarksGrade') || null,
        marksObtained: formData.get('marksObtained') || null,
        position: formData.get('position') || null,
        learnings: formData.get('learnings'),
        status: 'PENDING',
        ...(uploadedProofUrl && { proofUrl: uploadedProofUrl }), // Only updates if a new file was uploaded
      }
    });

    revalidatePath('/student/certifications');
    revalidatePath('/faculty/dashboard/requests');
    redirect('/student/certifications');
  } catch (error) {
    console.error("Update Error:", error);
    return { success: false, error: "Failed to update certification" };
  }
}

export async function deleteCoCurricular(formData) {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;
  if (!userId) return { success: false, error: "Not authenticated" };

  const id = formData.get('id');

  try {
    await prisma.coCurricular.delete({
      where: { id, studentId: userId }
    });
    
    revalidatePath('/student/co-curricular');
    revalidatePath('/faculty/dashboard/requests');
    return { success: true };
  } catch (error) {
    console.error("Delete Error:", error);
    return { success: false, error: "Failed to delete" };
  }
}

export async function updateAndResubmitCoCurricular(formData) {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;
  if (!userId) return { success: false, error: "Not authenticated" };

  const id = formData.get('id');

  try {
    const proofFile = formData.get('proofDocument');
    let uploadedProofUrl = null;
    if (proofFile && typeof proofFile !== 'string' && proofFile.size > 0) {
      uploadedProofUrl = await uploadToCloudinary(proofFile, 'co_curricular');
    }

    await prisma.coCurricular.update({
      where: { id, studentId: userId },
      data: {
        semester: parseInt(formData.get('semester')) || 1,
        type: formData.get('type'),
        mode: formData.get('mode'),
        title: formData.get('title'),
        organizedBy: formData.get('organizedBy'),
        place: formData.get('place'),
        level: formData.get('level'),
        dateFrom: new Date(formData.get('dateFrom')),
        dateTo: new Date(formData.get('dateTo')),
        duration: formData.get('duration') || null,
        teamMembers: formData.get('teamMembers') || null,
        role: formData.get('role'),
        position: formData.get('position') || null,
        prizeMoney: formData.get('prizeMoney') || null,
        learnings: formData.get('learnings'),
        status: 'PENDING',
        ...(uploadedProofUrl && { proofUrl: uploadedProofUrl }),
      }
    });

    revalidatePath('/student/co-curricular');
    revalidatePath('/faculty/dashboard/requests');
    redirect('/student/co-curricular');
  } catch (error) {
    console.error("Update Error:", error);
    return { success: false, error: "Failed to update activity" };
  }
}

export async function deleteExtraCurricular(formData) {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;
  if (!userId) return { success: false, error: "Not authenticated" };

  const id = formData.get('id');

  try {
    await prisma.extraCurricular.delete({
      where: { id, studentId: userId }
    });
    
    revalidatePath('/student/extra-curricular');
    revalidatePath('/faculty/dashboard/requests');
    return { success: true };
  } catch (error) {
    console.error("Delete Error:", error);
    return { success: false, error: "Failed to delete" };
  }
}

export async function updateAndResubmitExtraCurricular(formData) {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;
  if (!userId) return { success: false, error: "Not authenticated" };

  const id = formData.get('id');

  try {
    const proofFile = formData.get('proofDocument');
    let uploadedProofUrl = null;
    if (proofFile && typeof proofFile !== 'string' && proofFile.size > 0) {
      uploadedProofUrl = await uploadToCloudinary(proofFile, 'extra_curricular');
    }

    await prisma.extraCurricular.update({
      where: { id, studentId: userId },
      data: {
        semester: parseInt(formData.get('semester')) || 1,
        type: formData.get('type'),
        mode: formData.get('mode'),
        title: formData.get('title'),
        organizedBy: formData.get('organizedBy'),
        place: formData.get('place'),
        level: formData.get('level'),
        dateFrom: new Date(formData.get('dateFrom')),
        dateTo: new Date(formData.get('dateTo')),
        duration: formData.get('duration'),
        teamMembers: formData.get('teamMembers') || null,
        role: formData.get('role'),
        position: formData.get('position') || null,
        prizeMoney: formData.get('prizeMoney') || null,
        learnings: formData.get('learnings'),
        status: 'PENDING',
        ...(uploadedProofUrl && { proofUrl: uploadedProofUrl }),
      }
    });

    revalidatePath('/student/extra-curricular');
    revalidatePath('/faculty/dashboard/requests');
    redirect('/student/extra-curricular');
  } catch (error) {
    console.error("Update Error:", error);
    return { success: false, error: "Failed to update activity" };
  }
}

export async function deleteResearchPaper(formData) {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;
  if (!userId) return { success: false, error: "Not authenticated" };

  const id = formData.get('id');

  try {
    await prisma.researchPaper.delete({
      where: { id, studentId: userId }
    });
    
    revalidatePath('/student/research');
    revalidatePath('/faculty/dashboard/requests');
    return { success: true };
  } catch (error) {
    console.error("Delete Error:", error);
    return { success: false, error: "Failed to delete" };
  }
}

export async function updateAndResubmitResearchPaper(formData) {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;
  if (!userId) return { success: false, error: "Not authenticated" };

  const id = formData.get('id');

  try {
    const proofFile = formData.get('proofDocument');
    let uploadedProofUrl = null;
    if (proofFile && typeof proofFile !== 'string' && proofFile.size > 0) {
      uploadedProofUrl = await uploadToCloudinary(proofFile, 'research');
    }

    await prisma.researchPaper.update({
      where: { id, studentId: userId },
      data: {
        semester: parseInt(formData.get('semester')) || 1,
        title: formData.get('title'),
        authors: formData.get('authors'),
        type: formData.get('type'),
        journalName: formData.get('journalName'),
        publishedBy: formData.get('publishedBy'),
        monthYear: formData.get('monthYear'),
        volumeIssue: formData.get('volumeIssue') || null,
        doiUrl: formData.get('doiUrl') || null,
        indexing: formData.get('indexing') || null,
        paperStatus: formData.get('paperStatus'),
        learnings: formData.get('learnings'),
        status: 'PENDING',
        ...(uploadedProofUrl && { proofUrl: uploadedProofUrl }),
      }
    });

    revalidatePath('/student/research');
    revalidatePath('/faculty/dashboard/requests');
    redirect('/student/research');
  } catch (error) {
    console.error("Update Error:", error);
    return { success: false, error: "Failed to update research paper" };
  }
}

export async function deleteProject(formData) {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;
  if (!userId) return { success: false, error: "Not authenticated" };

  const id = formData.get('id');

  try {
    await prisma.project.delete({
      where: { id, studentId: userId }
    });
    
    revalidatePath('/student/projects');
    revalidatePath('/faculty/dashboard/requests');
    return { success: true };
  } catch (error) {
    console.error("Delete Error:", error);
    return { success: false, error: "Failed to delete" };
  }
}

export async function updateAndResubmitProject(formData) {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;
  if (!userId) return { success: false, error: "Not authenticated" };

  const id = formData.get('id');

  try {
    const proofFile = formData.get('proofDocument');
    let uploadedProofUrl = null;
    if (proofFile && typeof proofFile !== 'string' && proofFile.size > 0) {
      uploadedProofUrl = await uploadToCloudinary(proofFile, 'projects');
    }

    await prisma.project.update({
      where: { id, studentId: userId },
      data: {
        semester: parseInt(formData.get('semester')) || 1,
        projectName: formData.get('projectName'),
        type: formData.get('type'),
        projectStatus: formData.get('projectStatus'),
        dateFrom: new Date(formData.get('dateFrom')),
        dateTo: new Date(formData.get('dateTo')),
        githubLink: formData.get('githubLink') || null,
        supervisor: formData.get('supervisor') || null,
        teamMembers: formData.get('teamMembers') || null,
        techStack: formData.get('techStack'),
        description: formData.get('description'),
        learnings: formData.get('learnings'),
        status: 'PENDING',
        ...(uploadedProofUrl && { proofUrl: uploadedProofUrl }),
      }
    });

    revalidatePath('/student/projects');
    revalidatePath('/faculty/dashboard/requests');
    redirect('/student/projects');
  } catch (error) {
    console.error("Update Error:", error);
    return { success: false, error: "Failed to update project" };
  }
}
// Add these to src/app/actions.js
export async function loginAdmin(prevState,formData) {
  const email = formData.get('email');
  const password = formData.get('password');

  const admin = await prisma.admin.findUnique({ where: { email } });

  if (!admin || admin.passwordHash !== password) {
    return { error: "Invalid email or password." };
  }

  const cookieStore = await cookies();
  cookieStore.set('adminId', admin.id, { httpOnly: true, path: '/' });

  revalidatePath('/', 'layout');
  redirect('/admin/dashboard');
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete('adminId');
  redirect('/admin/login');
}
// Add this to src/app/actions.js
export async function adminAssignMentor(formData) {
  const cookieStore = await cookies();
  if (!cookieStore.get('adminId')?.value) return { success: false, error: "Unauthorized" };

  const studentId = formData.get('studentId');
  const mentorId = formData.get('mentorId'); // If empty, it removes the mentor

  try {
    await prisma.student.update({
      where: { id: studentId },
      data: { mentorId: mentorId || null }
    });
    revalidatePath('/admin/dashboard/students');
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to assign mentor" };
  }
}
// Add this to src/app/actions.js
export async function createMentor(formData) {
  const cookieStore = await cookies();
  if (!cookieStore.get('adminId')?.value) return { success: false, error: "Unauthorized" };

  try {
    await prisma.faculty.create({
      data: {
        name: formData.get('name'),
        email: formData.get('email'),
        passwordHash: formData.get('password'), // In production, hash this with bcrypt!
        designation: formData.get('designation'),
        department: formData.get('department'),
      }
    });

    revalidatePath('/admin/dashboard/faculty');
    redirect('/admin/dashboard/faculty');
  } catch (error) {
    console.error("Failed to create mentor:", error);
    return { success: false, error: "Database error or email already exists." };
  }
}
// ----------------------------------------
// 8. UNIFIED ACHIEVEMENT STATUS UPDATE
// ----------------------------------------
export async function updateAchievementStatus(formData) {
  const id = formData.get('id');
  const category = formData.get('category');
  const status = formData.get('status'); 
  const remarks = formData.get('remarks'); // Catch the new remarks field

  try {
    // If rejected, save the reason. If approved, clear any old reasons.
    const dataToUpdate = { 
      status,
      ...(status === 'REJECTED' && remarks ? { rejectionReason: remarks } : {}),
      ...(status === 'APPROVED' ? { rejectionReason: null } : {})
    };

    switch (category) {
      case 'project':
        await prisma.project.update({ where: { id }, data: dataToUpdate });
        break;
      case 'extraCurricular':
        await prisma.extraCurricular.update({ where: { id }, data: dataToUpdate });
        break;
      case 'coCurricular':
        await prisma.coCurricular.update({ where: { id }, data: dataToUpdate });
        break;
      case 'certification':
        await prisma.certification.update({ where: { id }, data: dataToUpdate });
        break;
      case 'researchPaper':
        await prisma.researchPaper.update({ where: { id }, data: dataToUpdate });
        break;
      default:
        return { success: false, error: "Invalid category" };
    }

    revalidatePath('/faculty/dashboard/requests');
    revalidatePath('/admin/dashboard/requests');
    
    return { success: true };
  } catch (error) {
    console.error("Failed to update status:", error);
    return { success: false, error: "Database error" };
  }
}

export async function updateProfilePicture(imageUrl) {
  const cookieStore = await cookies();
  const studentId = cookieStore.get('userId')?.value;

  if (!studentId) throw new Error("Not authenticated");

  // Update the student's profilePic field in the database
  await prisma.student.update({
    where: { id: studentId },
    data: { profilePic: imageUrl },
  });

  // Force the dashboard to refresh and show the new picture
  revalidatePath("/student/dashboard");
  
  return { success: true };
}
export async function updateFacultyProfilePicture(imageUrl) {
  const cookieStore = await cookies();
  const facultyId = cookieStore.get('facultyId')?.value;

  if (!facultyId) throw new Error("Not authenticated");

  // Update the faculty's profilePic field
  await prisma.faculty.update({
    where: { id: facultyId },
    data: { profilePic: imageUrl },
  });

  // Force the dashboard to refresh
  revalidatePath("/faculty/dashboard");
  
  return { success: true };
}
export async function updateAdminProfilePicture(imageUrl) {
  const cookieStore = await cookies();
  const adminId = cookieStore.get('adminId')?.value;

  if (!adminId) throw new Error("Not authenticated");

  // Update the admin's profilePic field
  await prisma.admin.update({
    where: { id: adminId },
    data: { profilePic: imageUrl },
  });

  // Force the dashboard to refresh
  revalidatePath("/admin/dashboard");
  
  return { success: true };
}
// --- ADD TO THE BOTTOM OF src/app/actions.js ---

// 10. EXCEL UPLOAD ACTIONS
export async function uploadStudentsExcel(prevState, formData) {
  const cookieStore = await cookies();
  if (!cookieStore.get('adminId')?.value) return { error: "Unauthorized" };

  const file = formData.get('file');
  if (!file || file.size === 0) return { error: "No file uploaded." };

  try {
    const buffer = await file.arrayBuffer();
    // Dynamic import to prevent Next.js build issues
    const ExcelJS = (await import("exceljs")).default;
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(Buffer.from(buffer));

    const worksheet = workbook.worksheets[0];
    const rows = [];
    
    // Skip header row (assuming row 1 is headers)
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        // Expected columns: Name(1), EnrollmentNo(2), FatherName(3), Email(4), Section(5), Batch(6), Department(7)
        rows.push({
          name: row.getCell(1).value?.toString().trim() || '',
          enrollmentNo: row.getCell(2).value?.toString().trim() || '',
          parentName: row.getCell(3).value?.toString().trim() || '',
          email: row.getCell(4).value?.toString().trim() || '',
          section: row.getCell(5).value?.toString().trim() || 'A',
          batch: row.getCell(6).value?.toString().trim() || '2023-2027',
          departmentName: row.getCell(7).value?.toString().trim() || 'Information Technology',
        });
      }
    });

    let importedCount = 0;
    for (const r of rows) {
      if (!r.name || !r.enrollmentNo) continue;

      // HOD Requirement: Password is Father's Name all caps (fallback to ENROLLMENT if empty)
// HOD Requirement: Password is Father's Name all caps with spaces (fallback to ENROLLMENT if empty)
const rawFatherName = r.parentName ? r.parentName : r.enrollmentNo;
const defaultPassword = rawFatherName.toUpperCase();
      
      const safeEmail = r.email || `${r.enrollmentNo.toLowerCase()}@bpitindia.edu.in`;

      await prisma.student.upsert({
        where: { email: safeEmail },
        update: { 
          name: r.name, 
          enrollmentNo: r.enrollmentNo, 
          parentName: r.parentName, 
          section: r.section, 
          batch: r.batch, 
          departmentName: r.departmentName 
        },
        create: { 
          name: r.name, 
          email: safeEmail, 
          enrollmentNo: r.enrollmentNo, 
          parentName: r.parentName, 
          passwordHash: defaultPassword, 
          section: r.section, 
          batch: r.batch, 
          departmentName: r.departmentName 
        }
      });
      importedCount++;
    }

    revalidatePath('/admin/dashboard/students');
    return { success: `Successfully imported ${importedCount} students.` };
  } catch (error) {
    console.error("Excel Parsing Error:", error);
    return { error: "Failed to parse Excel file. Ensure the format is correct." };
  }
}

export async function uploadFacultyExcel(prevState, formData) {
  const cookieStore = await cookies();
  if (!cookieStore.get('adminId')?.value) return { error: "Unauthorized" };

  const file = formData.get('file');
  if (!file || file.size === 0) return { error: "No file uploaded." };

  try {
    const buffer = await file.arrayBuffer();
    const ExcelJS = (await import("exceljs")).default;
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(Buffer.from(buffer));

    const worksheet = workbook.worksheets[0];
    const rows = [];
    
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        // Expected columns: Name(1), Email(2), Designation(3), Department(4)
        rows.push({
          name: row.getCell(1).value?.toString().trim() || '',
          email: row.getCell(2).value?.toString().trim() || '',
          designation: row.getCell(3).value?.toString().trim() || 'Assistant Professor',
          departmentName: row.getCell(4).value?.toString().trim() || 'Information Technology',
        });
      }
    });

    let importedCount = 0;
    for (const r of rows) {
      if (!r.name || !r.email) continue;

      // Default generic password for faculty until they change it
      const defaultPassword = "FACULTY" + new Date().getFullYear();

      await prisma.faculty.upsert({
        where: { email: r.email },
        update: { 
          name: r.name, 
          designation: r.designation, 
          departmentName: r.departmentName 
        },
        create: { 
          name: r.name, 
          email: r.email, 
          passwordHash: defaultPassword, 
          designation: r.designation, 
          departmentName: r.departmentName 
        }
      });
      importedCount++;
    }

    revalidatePath('/admin/dashboard/faculty');
    return { success: `Successfully imported ${importedCount} mentors.` };
  } catch (error) {
    return { error: "Failed to parse Excel file." };
  }
}

// 11. UNIVERSAL CHANGE PASSWORD ACTION
export async function changePassword(prevState, formData) {
  const cookieStore = await cookies();
  const studentId = cookieStore.get('userId')?.value;
  const facultyId = cookieStore.get('facultyId')?.value;
  const adminId = cookieStore.get('adminId')?.value;

  const oldPassword = formData.get('oldPassword');
  const newPassword = formData.get('newPassword');
  const confirmPassword = formData.get('confirmPassword');

  if (newPassword !== confirmPassword) return { error: "New passwords do not match." };

  try {
    if (studentId) {
      const user = await prisma.student.findUnique({ where: { id: studentId } });
      if (user.passwordHash !== oldPassword) return { error: "Incorrect current password." };
      await prisma.student.update({ where: { id: studentId }, data: { passwordHash: newPassword } });
    } else if (facultyId) {
      const user = await prisma.faculty.findUnique({ where: { id: facultyId } });
      if (user.passwordHash !== oldPassword) return { error: "Incorrect current password." };
      await prisma.faculty.update({ where: { id: facultyId }, data: { passwordHash: newPassword } });
    } else if (adminId) {
      const user = await prisma.admin.findUnique({ where: { id: adminId } });
      if (user.passwordHash !== oldPassword) return { error: "Incorrect current password." };
      await prisma.admin.update({ where: { id: adminId }, data: { passwordHash: newPassword } });
    } else {
      return { error: "Authentication required." };
    }
    
    return { success: "Password updated successfully!" };
  } catch (error) {
    return { error: "Failed to update password." };
  }
}
export async function processForgotPassword(prevState, formData) {
  const email = formData.get('email');
  const role = formData.get('role'); // 'student', 'faculty', or 'admin'

  try {
    let user = null;
    
    // 1. Verify the user exists based on their role
    if (role === 'student') {
      user = await prisma.student.findUnique({ where: { email } });
    } else if (role === 'faculty') {
      user = await prisma.faculty.findUnique({ where: { email } });
    } else if (role === 'admin') {
      user = await prisma.admin.findUnique({ where: { email } });
    }

    if (!user) {
      return { error: "No account found with this email." };
    }

    // 2. Generate a simple temporary password
    const tempPassword = Math.random().toString(36).slice(-8); // e.g., 'a7b8c9d0'

    // 3. Update the database with the temporary password
    if (role === 'student') {
      await prisma.student.update({ where: { email }, data: { passwordHash: tempPassword } });
    } else if (role === 'faculty') {
      await prisma.faculty.update({ where: { email }, data: { passwordHash: tempPassword } });
    } else if (role === 'admin') {
      await prisma.admin.update({ where: { email }, data: { passwordHash: tempPassword } });
    }

    // 4. Set up Nodemailer to send the email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your.college.project@gmail.com', // Replace with your Gmail
        pass: 'YOUR_GOOGLE_APP_PASSWORD'        // Replace with your 16-letter App Password
      }
    });

    const mailOptions = {
      from: '"BPIT S.A.M.S Support" <your.college.project@gmail.com>',
      to: email,
      subject: 'Password Reset Request',
      text: `Hello ${user.name},\n\Your password has been reset. Your temporary password is: ${tempPassword}\n\nPlease login and change it immediately using the Account Security section on your dashboard.`,
    };

    await transporter.sendMail(mailOptions);

    return { success: "A temporary password has been sent to your email!" };

  } catch (error) {
    console.error("Forgot Password Error:", error);
    return { error: "Failed to process request. Please try again." };
  }
}
// Add this at the bottom of src/app/actions.js
export async function deleteMentor(formData) {
  const cookieStore = await cookies();
  if (!cookieStore.get('adminId')?.value) return { success: false, error: "Unauthorized" };

  const mentorId = formData.get('id');

  try {
    // 1. Clear any verification logs tied to this faculty to prevent foreign key errors
    await prisma.verifiedLog.deleteMany({
      where: { facultyId: mentorId }
    });

    // 2. Unassign all students from this mentor (sets their mentorId back to null)
    await prisma.student.updateMany({
      where: { mentorId: mentorId },
      data: { mentorId: null }
    });

    // 3. Delete the faculty member
    await prisma.faculty.delete({
      where: { id: mentorId }
    });

    // Refresh the pages to reflect the changes immediately
    revalidatePath('/admin/dashboard/faculty');
    revalidatePath('/admin/dashboard/students');
    
  } catch (error) {
    console.error("Failed to delete mentor:", error);
  }
}