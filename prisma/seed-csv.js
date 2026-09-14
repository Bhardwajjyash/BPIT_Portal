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
  console.log('📂 Reading students_portal_cleaned.csv...');

  const filePath = path.join(__dirname, 'students_portal_cleaned.csv');
  const fileContent = fs.readFileSync(filePath, 'utf8');

  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  });

  console.log(`Found ${records.length} student records to seed.`);

  let importedCount = 0;

  for (const row of records) {
    const name = row.name || 'Unknown Student';
    const enrollmentNo = String(row.enrollmentNo || '');
    const email = row.email || (enrollmentNo ? `${enrollmentNo.toLowerCase()}@bpitindia.edu.in` : `student_${importedCount}@bpitindia.edu.in`);
    
    // Safely look for password or fallback
    const passwordHash = row.passwordHash || row.password || row.Password || 'password123';
    const batch = row.batch || '2023-2027';
    
    // Map the newly cleaned columns
    const section = row.section || 'A';
    const departmentName = row.department || 'Computer Science & Engineering';

    await prisma.student.upsert({
      where: { email },
      update: { 
        name, 
        enrollmentNo, 
        section, 
        batch, 
        passwordHash: String(passwordHash),
        departmentName // Maps perfectly to the new Department Hub
      },
      create: { 
        name, 
        email, 
        passwordHash: String(passwordHash), 
        enrollmentNo, 
        section, 
        batch,
        departmentName // Maps perfectly to the new Department Hub
      }
    });

    console.log(`Imported Student: ${name} | Dept: ${departmentName} | Sec: ${section}`);
    importedCount++;
  }

  console.log(`✅ Successfully seeded ${importedCount} student accounts from cleaned CSV!`);
}

main()
  .catch((e) => {
    console.error('CSV Seeding Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });