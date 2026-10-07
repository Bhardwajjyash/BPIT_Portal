const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
require('dotenv').config();

const dbUrl = new URL(process.env.DATABASE_URL);
const adapter = new PrismaMariaDb({
  host: dbUrl.hostname,
  port: Number(dbUrl.port) || 3306,
  user: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.slice(1)
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🚀 Starting database seeding...');

  // Read files first to extract departments
  const facultyPath = path.join(__dirname, 'faculty_portal.json');
  const facultyContent = fs.readFileSync(facultyPath, 'utf8');
  const facultyList = JSON.parse(facultyContent);

  const studentPath = path.join(__dirname, 'students_portal_cleaned.csv');
  const studentContent = fs.readFileSync(studentPath, 'utf8');
  const records = parse(studentContent, { columns: true, skip_empty_lines: true, trim: true });

  // 0. SEED DEPARTMENTS FIRST
  console.log('🏗️ Extracting and Seeding Departments...');
  const departments = new Set();
  
  // Extract from Faculty
  for (const fac of facultyList) {
    if (fac.department) departments.add(fac.department);
  }
  
  // Extract from Students (and default logic)
  departments.add('Computer Science & Engineering');
  departments.add('Electrical & Electronics Engineering');
  for (const row of records) {
    if (row.department && row.department !== 'Unknown') {
      departments.add(row.department);
    }
  }

  // Insert Departments into Database
  for (const deptName of departments) {
    await prisma.department.upsert({
      where: { name: deptName },
      update: {},
      create: { name: deptName }
    });
  }
  console.log(`✅ Successfully seeded ${departments.size} departments!`);

  // 1. Seed Faculty Data
  console.log('📂 Seeding Faculty Data...');
  let facCount = 0;
  for (const fac of facultyList) {
    await prisma.faculty.upsert({
      where: { email: fac.email },
      update: {
        name: fac.name,
        designation: fac.designation || 'Assistant Professor',
        departmentName: fac.department || null,
        passwordHash: fac.passwordHash || 'pass123',
      },
      create: {
        email: fac.email,
        name: fac.name,
        designation: fac.designation || 'Assistant Professor',
        departmentName: fac.department || null,
        passwordHash: fac.passwordHash || 'pass123',
      },
    });
    facCount++;
  }
  console.log(`✅ Successfully seeded ${facCount} faculty accounts!`);

  // 2. Seed Student Data
  console.log('📂 Seeding Student Data...');
  let stdCount = 0;
  for (const row of records) {
    const name = row.name || 'Unknown Student';
    const enrollmentNo = String(row.enrollmentNo || '');
    const email = row.email || (enrollmentNo ? `${enrollmentNo.toLowerCase()}@bpitindia.edu.in` : `student_${stdCount}@bpitindia.edu.in`);
    const passwordHash = row.passwordHash || row.password || row.Password || 'password123';
    const batch = row.batch || '2023-2027';
    
    let section = row.section || 'A';
    let departmentName = row.department || 'Computer Science & Engineering';

    // 🔧 FIX: Catch EEE students marked as 'Unknown' and route them correctly
    if (departmentName === 'Unknown' || section.includes('EEE')) {
      departmentName = 'Electrical & Electronics Engineering';
      section = section.replace('EEE', '').replace('-', '').trim() || 'A';
    }

    await prisma.student.upsert({
      where: { email },
      update: { 
        name, 
        enrollmentNo, 
        section, 
        batch, 
        passwordHash: String(passwordHash),
        departmentName 
      },
      create: { 
        name, 
        email, 
        passwordHash: String(passwordHash), 
        enrollmentNo, 
        section, 
        batch,
        departmentName 
      }
    });
    stdCount++;
  }
  console.log(`✅ Successfully seeded ${stdCount} student accounts!`);
}

main()
  .catch((e) => {
    console.error('Seeding Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });