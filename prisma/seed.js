const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seeding for Admin, Faculty, and Students...');

  // 1. Clean up existing tables in correct order (due to foreign key constraints)
  await prisma.verifiedLog.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.extraCurricular.deleteMany({});
  await prisma.coCurricular.deleteMany({});
  await prisma.certification.deleteMany({});
  await prisma.researchPaper.deleteMany({});
  await prisma.student.deleteMany({});
  await prisma.faculty.deleteMany({});
  
  // Clean up Admin table
  await prisma.admin.deleteMany({});

  // 2. Seed Global Admin (Head of Department)
  const admin = await prisma.admin.create({
    data: {
      email: 'admin@bpit.edu.in',
      passwordHash: 'admin_secure_pass', // You can change this to your preferred password
      name: 'Yash Bhardwaj',
      role: 'HOD',
      department: 'Information Technology'
    }
  });
  console.log('Created admin:', admin.email);

  // 3. Seed Faculty Member (Mentor)
  const faculty = await prisma.faculty.create({
    data: {
      email: 'faculty@bpit.edu.in',
      passwordHash: 'sharma_ji', 
      name: 'Dr. C M Sharma',
      department: 'Information Technology',
      designation: 'Assistant Professor',
    },
  });
  console.log('Created faculty:', faculty.email);

  // 4. Seed Student Member 1 assigned to Dr. C M Sharma
  const student1 = await prisma.student.create({
    data: {
      email: 'yash@bpit.edu.in',
      passwordHash: 'Rajpal_bhardwaj', 
      name: 'Yash Bhardwaj',
      enrollmentNo: '08220803123',
      batch: '2023-2027',
      section: 'A',
      mentorId: faculty.id, // Linked to faculty
    },
  });
  console.log('Created student:', student1.email);

  // 5. Seed Student Member 2 assigned to Dr. C M Sharma
  const student2 = await prisma.student.create({
    data: {
      email: 'janit@bpit.edu.in',
      passwordHash: 'surender_berwal', 
      name: 'Janit Berwal',
      enrollmentNo: '02620803124',
      batch: '2023-2027',
      section: 'A',
      mentorId: faculty.id, // Linked to faculty
    },
  });
  console.log('Created student:', student2.email);

  console.log('✅ Database seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });