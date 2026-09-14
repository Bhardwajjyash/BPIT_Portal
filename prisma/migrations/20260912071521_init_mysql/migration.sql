-- CreateTable
CREATE TABLE `Faculty` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `designation` VARCHAR(191) NULL,
    `department` VARCHAR(191) NULL,
    `profilePic` VARCHAR(191) NULL,

    UNIQUE INDEX `Faculty_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Student` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `enrollmentNo` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,
    `batch` VARCHAR(191) NULL,
    `section` VARCHAR(191) NULL,
    `semester` INTEGER NULL,
    `parentName` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `profilePic` VARCHAR(191) NULL,
    `mentorId` VARCHAR(191) NULL,

    UNIQUE INDEX `Student_email_key`(`email`),
    UNIQUE INDEX `Student_enrollmentNo_key`(`enrollmentNo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ExtraCurricular` (
    `id` VARCHAR(191) NOT NULL,
    `studentId` VARCHAR(191) NOT NULL,
    `semester` INTEGER NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `mode` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `organizedBy` VARCHAR(191) NOT NULL,
    `place` VARCHAR(191) NOT NULL,
    `level` VARCHAR(191) NOT NULL,
    `dateFrom` DATETIME(3) NOT NULL,
    `dateTo` DATETIME(3) NOT NULL,
    `duration` VARCHAR(191) NOT NULL,
    `teamMembers` VARCHAR(191) NULL,
    `role` VARCHAR(191) NOT NULL,
    `position` VARCHAR(191) NULL,
    `prizeMoney` VARCHAR(191) NULL,
    `learnings` VARCHAR(191) NOT NULL,
    `sponsored` VARCHAR(191) NULL,
    `rejectionReason` VARCHAR(191) NULL,
    `proofUrl` VARCHAR(191) NOT NULL,
    `photoUrl` VARCHAR(191) NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CoCurricular` (
    `id` VARCHAR(191) NOT NULL,
    `studentId` VARCHAR(191) NOT NULL,
    `semester` INTEGER NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `mode` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `organizedBy` VARCHAR(191) NOT NULL,
    `place` VARCHAR(191) NOT NULL,
    `level` VARCHAR(191) NOT NULL,
    `dateFrom` DATETIME(3) NOT NULL,
    `dateTo` DATETIME(3) NOT NULL,
    `duration` VARCHAR(191) NULL,
    `teamMembers` VARCHAR(191) NULL,
    `role` VARCHAR(191) NOT NULL,
    `position` VARCHAR(191) NULL,
    `prizeMoney` VARCHAR(191) NULL,
    `learnings` VARCHAR(191) NOT NULL,
    `sponsored` VARCHAR(191) NULL,
    `rejectionReason` VARCHAR(191) NULL,
    `proofUrl` VARCHAR(191) NOT NULL,
    `photoUrl` VARCHAR(191) NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Certification` (
    `id` VARCHAR(191) NOT NULL,
    `studentId` VARCHAR(191) NOT NULL,
    `semester` INTEGER NOT NULL,
    `courseName` VARCHAR(191) NOT NULL,
    `mode` VARCHAR(191) NOT NULL,
    `organizedBy` VARCHAR(191) NOT NULL,
    `certifiedBy` VARCHAR(191) NOT NULL,
    `dateFrom` DATETIME(3) NOT NULL,
    `dateTo` DATETIME(3) NOT NULL,
    `duration` VARCHAR(191) NOT NULL,
    `maxMarksGrade` VARCHAR(191) NULL,
    `marksObtained` VARCHAR(191) NULL,
    `position` VARCHAR(191) NULL,
    `learnings` VARCHAR(191) NOT NULL,
    `sponsored` VARCHAR(191) NULL,
    `rejectionReason` VARCHAR(191) NULL,
    `proofUrl` VARCHAR(191) NOT NULL,
    `photoUrl` VARCHAR(191) NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Project` (
    `id` VARCHAR(191) NOT NULL,
    `studentId` VARCHAR(191) NOT NULL,
    `semester` INTEGER NOT NULL,
    `projectName` VARCHAR(191) NOT NULL,
    `supervisor` VARCHAR(191) NULL,
    `type` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `techStack` VARCHAR(191) NOT NULL,
    `githubLink` VARCHAR(191) NULL,
    `dateFrom` DATETIME(3) NOT NULL,
    `dateTo` DATETIME(3) NOT NULL,
    `teamMembers` VARCHAR(191) NULL,
    `projectStatus` VARCHAR(191) NOT NULL,
    `achievements` VARCHAR(191) NULL,
    `learnings` VARCHAR(191) NOT NULL,
    `rejectionReason` VARCHAR(191) NULL,
    `proofUrl` VARCHAR(191) NOT NULL,
    `photoUrl` VARCHAR(191) NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ResearchPaper` (
    `id` VARCHAR(191) NOT NULL,
    `studentId` VARCHAR(191) NOT NULL,
    `semester` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `authors` VARCHAR(191) NOT NULL,
    `supervisor` VARCHAR(191) NULL,
    `type` VARCHAR(191) NOT NULL,
    `journalName` VARCHAR(191) NOT NULL,
    `publishedBy` VARCHAR(191) NOT NULL,
    `monthYear` VARCHAR(191) NOT NULL,
    `volumeIssue` VARCHAR(191) NULL,
    `doiUrl` VARCHAR(191) NULL,
    `indexing` VARCHAR(191) NULL,
    `paperStatus` VARCHAR(191) NOT NULL,
    `learnings` VARCHAR(191) NOT NULL,
    `organization` VARCHAR(191) NULL,
    `achievements` VARCHAR(191) NULL,
    `rejectionReason` VARCHAR(191) NULL,
    `proofUrl` VARCHAR(191) NULL,
    `photoUrl` VARCHAR(191) NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VerifiedLog` (
    `id` VARCHAR(191) NOT NULL,
    `facultyId` VARCHAR(191) NOT NULL,
    `statusGiven` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL,
    `remarks` VARCHAR(191) NULL,
    `verifiedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `extraCurricularId` VARCHAR(191) NULL,
    `coCurricularId` VARCHAR(191) NULL,
    `certificationId` VARCHAR(191) NULL,
    `projectId` VARCHAR(191) NULL,
    `researchPaperId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Admin` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL DEFAULT 'HOD',
    `department` VARCHAR(191) NULL,
    `profilePic` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Admin_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_mentorId_fkey` FOREIGN KEY (`mentorId`) REFERENCES `Faculty`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExtraCurricular` ADD CONSTRAINT `ExtraCurricular_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CoCurricular` ADD CONSTRAINT `CoCurricular_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Certification` ADD CONSTRAINT `Certification_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ResearchPaper` ADD CONSTRAINT `ResearchPaper_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VerifiedLog` ADD CONSTRAINT `VerifiedLog_facultyId_fkey` FOREIGN KEY (`facultyId`) REFERENCES `Faculty`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VerifiedLog` ADD CONSTRAINT `VerifiedLog_extraCurricularId_fkey` FOREIGN KEY (`extraCurricularId`) REFERENCES `ExtraCurricular`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VerifiedLog` ADD CONSTRAINT `VerifiedLog_coCurricularId_fkey` FOREIGN KEY (`coCurricularId`) REFERENCES `CoCurricular`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VerifiedLog` ADD CONSTRAINT `VerifiedLog_certificationId_fkey` FOREIGN KEY (`certificationId`) REFERENCES `Certification`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VerifiedLog` ADD CONSTRAINT `VerifiedLog_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VerifiedLog` ADD CONSTRAINT `VerifiedLog_researchPaperId_fkey` FOREIGN KEY (`researchPaperId`) REFERENCES `ResearchPaper`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
