const fs = require('fs');
const path = require('path');
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
  console.log('📂 Reading faculty_portal.json...');

  const filePath = path.join(__dirname, 'faculty_portal.json');
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const facultyList = JSON.parse(fileContent);

  console.log(`Found ${facultyList.length} faculty records to seed.`);

  let importedCount = 0;

  for (const fac of facultyList) {
    await prisma.faculty.upsert({
      where: { email: fac.email },
      update: {
        name: fac.name,
        designation: fac.designation || null,
        departmentName: fac.department || null, // Updated to new schema field
        passwordHash: fac.passwordHash || 'defaultpassword123',
      },
      create: {
        id: fac.id,
        email: fac.email,
        name: fac.name,
        designation: fac.designation || null,
        departmentName: fac.department || null, // Updated to new schema field
        passwordHash: fac.passwordHash || 'defaultpassword123',
      },
    });

    console.log(`Imported Faculty: [${fac.id}] ${fac.name} (${fac.department})`);
    importedCount++;
  }

  console.log(`✅ Successfully seeded ${importedCount} faculty accounts!`);
}

main()
  .catch((e) => {
    console.error('Faculty Seeding Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });